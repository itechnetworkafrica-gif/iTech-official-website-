/**
 * AI-powered payment fraud detection for billing submissions.
 * Analyses transaction ID format, amount plausibility, duplicate detection,
 * and suspicious patterns — returns a risk score + flagged issues.
 */
import OpenAI from "openai";
import { query } from "./db.js";
import { logger } from "./logger.js";

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY ?? "",
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

export interface AIReviewResult {
  riskLevel: "low" | "medium" | "high";
  riskScore: number;           // 0 (no risk) – 100 (definite fraud)
  flags: string[];             // specific issues found
  summary: string;             // plain-English note for admin
  recommendation: "verify" | "investigate" | "reject";
}

interface Submission {
  id: string;
  name: string;
  email: string;
  phone: string;
  plan: string;
  amount: string;
  currency: string;
  method: string;
  transaction_id: string;
  payment_date: string;
  notes: string;
}

const SYSTEM_PROMPT = `You are a payment fraud analyst for iTech Network Africa, a tech services company based in Liberia, West Africa.
Your job is to review client-submitted payment receipts and flag suspicious ones before an admin manually verifies them.

Payment methods accepted:
1. Bank Transfer via UBA Liberia Limited (SINKOR Branch).
   - Transaction IDs from UBA typically begin with "IR" followed by 4–8 digits, e.g. IR1666, IR20453.
2. Mobile Money (Lonestar MTN / Orange Money).
   - Transaction IDs are typically long numeric strings (10–20 digits) or short alphanumeric references.

Service plan price ranges (USD):
- Starter Website: ~$350  |  Business Website: ~$750  |  Professional Website: ~$1,500  |  Enterprise Website: $3,000+
- Basic Hosting: $5/mo  |  Standard: $10/mo  |  Business: $20/mo  |  Enterprise: $50/mo
- Digital Marketing Starter: ~$200/mo  |  Growth: ~$500/mo  |  Professional: ~$1,000/mo  |  Enterprise: ~$1,500/mo
- IT Consultancy Basic: ~$150  |  Standard: ~$400  |  Professional: ~$800  |  Enterprise: custom
- Graphic Design Basic: ~$50  |  Standard: ~$150  |  Professional: ~$300  |  Enterprise: ~$500
In LRD (Liberian Dollar), multiply USD by approximately 190.

Red flags to look for:
- Transaction ID format does not match the stated payment method (e.g. UBA ID that doesn't start with "IR", or mobile money ID that looks like a UBA ID)
- Amount is far outside the normal range for the selected plan (over 3× or under 10%)
- Duplicate transaction ID (already recorded in the database)
- Placeholder or test-like data (e.g. name "Test User", email "test@test.com", transaction ID "123456", amount "1")
- Obviously fake or inconsistent fields
- Payment date far in the past (over 30 days) or future

Respond ONLY with a valid JSON object — no markdown, no explanation, nothing else:
{
  "riskLevel": "low" | "medium" | "high",
  "riskScore": <integer 0-100>,
  "flags": [<list of specific issue strings, empty array if none>],
  "summary": "<one concise sentence summarising the overall assessment for the admin>",
  "recommendation": "verify" | "investigate" | "reject"
}`;

export async function runAIPaymentReview(sub: Submission): Promise<void> {
  try {
    // ── 1. Check for duplicate transaction ID ──────────────────────────────
    const dupRes = await query(
      `SELECT COUNT(*)::int AS cnt FROM billing_submissions
       WHERE transaction_id = $1 AND id != $2`,
      [sub.transaction_id, sub.id]
    );
    const isDuplicate = (dupRes.rows[0]?.cnt ?? 0) > 0;

    // ── 2. Build analysis prompt ───────────────────────────────────────────
    const userContent = [
      `Submission to analyse:`,
      `Name: ${sub.name}`,
      `Email: ${sub.email}`,
      `Phone: ${sub.phone || "not provided"}`,
      `Plan selected: ${sub.plan}`,
      `Amount claimed: ${sub.amount} ${sub.currency}`,
      `Payment method: ${sub.method === "bank_transfer" ? "Bank Transfer (UBA Liberia)" : "Mobile Money (Lonestar/Orange)"}`,
      `Transaction ID: ${sub.transaction_id}`,
      `Payment date: ${sub.payment_date || "not provided"}`,
      `Client notes: ${sub.notes || "none"}`,
      isDuplicate
        ? "⚠️ CRITICAL: This transaction ID already exists in the database for a different submission."
        : "Transaction ID is unique in our records.",
    ].join("\n");

    // ── 3. Call OpenAI ─────────────────────────────────────────────────────
    const response = await openai.chat.completions.create({
      model: "gpt-5.6-luna",           // cost-effective for high-volume analysis
      max_completion_tokens: 512,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userContent   },
      ],
    });

    const rawText = response.choices[0]?.message?.content ?? "{}";

    // ── 4. Parse result ────────────────────────────────────────────────────
    let result: AIReviewResult;
    try {
      const jsonMatch = rawText.match(/\{[\s\S]*\}/);
      result = JSON.parse(jsonMatch?.[0] ?? rawText) as AIReviewResult;
    } catch {
      result = {
        riskLevel: "medium",
        riskScore: 50,
        flags: ["AI response could not be parsed — manual review required."],
        summary: "AI review ran but returned an unexpected format. Please check manually.",
        recommendation: "investigate",
      };
    }

    // Sanitise
    if (!["low", "medium", "high"].includes(result.riskLevel))               result.riskLevel = "medium";
    if (typeof result.riskScore !== "number" || result.riskScore < 0 || result.riskScore > 100) result.riskScore = 50;
    if (!Array.isArray(result.flags))                                          result.flags = [];
    if (typeof result.summary !== "string")                                    result.summary = "";
    if (!["verify", "investigate", "reject"].includes(result.recommendation)) result.recommendation = "investigate";

    // Force high risk if duplicate (AI might miss it)
    if (isDuplicate && result.riskLevel !== "high") {
      result.riskLevel = "high";
      result.riskScore = Math.max(result.riskScore, 85);
      if (!result.flags.some(f => f.toLowerCase().includes("duplicate"))) {
        result.flags.unshift("Duplicate transaction ID — already used in another submission.");
      }
    }

    // ── 5. Persist ─────────────────────────────────────────────────────────
    await query(
      `UPDATE billing_submissions
       SET ai_risk_level      = $1,
           ai_risk_score      = $2,
           ai_flags           = $3,
           ai_summary         = $4,
           ai_recommendation  = $5,
           ai_reviewed_at     = NOW()
       WHERE id = $6`,
      [
        result.riskLevel,
        result.riskScore,
        JSON.stringify(result.flags),
        result.summary,
        result.recommendation,
        sub.id,
      ]
    );

    logger.info(`AI payment review complete id=${sub.id} risk=${result.riskLevel} score=${result.riskScore} flags=${result.flags.length}`);
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err);
    logger.error(`AI payment review failed id=${sub.id} err=${msg}`);
    await query(
      `UPDATE billing_submissions
       SET ai_risk_level  = 'error',
           ai_summary     = $1,
           ai_reviewed_at = NOW()
       WHERE id = $2`,
      [`AI review failed: ${msg.slice(0, 200)}`, sub.id]
    );
  }
}
