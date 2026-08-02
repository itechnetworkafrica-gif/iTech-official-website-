import { Router } from "express";
import nodemailer from "nodemailer";

const router = Router();

const RECIPIENT = "itechnetworkafrica@gmail.com";

router.post("/consultation", async (req, res) => {
  const {
    fullName, email, phone, company, jobTitle,
    serviceInterest, projectDescription, budget, timeline,
    preferredDate, preferredTime, hearAboutUs,
  } = req.body as Record<string, string>;

  // Basic validation
  if (!fullName || !email || !phone || !serviceInterest || !projectDescription || !budget || !timeline) {
    res.status(400).json({ message: "Missing required fields." });
    return;
  }

  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  if (!emailUser || !emailPass) {
    // Fallback: log the submission and return success so form UX still works
    console.warn("[consultation] EMAIL_USER / EMAIL_PASS not set — logging submission only.");
    console.info("[consultation] New request:", { fullName, email, phone, serviceInterest, budget, timeline });
    res.status(200).json({ message: "Received (email not configured)." });
    return;
  }

  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: emailUser, pass: emailPass },
  });

  const slot = preferredDate
    ? `${preferredDate}${preferredTime ? ` at ${preferredTime} WAT` : ""}`
    : "Not specified";

  const html = `
    <div style="font-family:sans-serif;max-width:620px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <div style="background:#060E18;padding:28px 32px;">
        <h1 style="color:#fff;margin:0;font-size:22px;">New Consultation Request</h1>
        <p style="color:#9ca3af;margin:6px 0 0;font-size:14px;">Submitted via itechnetworkafrica.com</p>
      </div>
      <div style="padding:32px;">
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          ${row("Full Name", fullName)}
          ${row("Email", `<a href="mailto:${email}" style="color:#3CB52A;">${email}</a>`)}
          ${row("Phone", phone)}
          ${row("Company", company || "—")}
          ${row("Job Title", jobTitle || "—")}
          ${row("Service Interest", serviceInterest)}
          ${row("Budget Range", budget)}
          ${row("Project Timeline", timeline)}
          ${row("Preferred Slot", slot)}
          ${row("How They Found Us", hearAboutUs || "—")}
        </table>
        <div style="margin-top:24px;background:#f8f9fa;border-radius:8px;padding:16px;">
          <p style="margin:0 0 8px;font-weight:700;color:#111827;font-size:14px;">Project Description</p>
          <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;">${projectDescription.replace(/\n/g, "<br/>")}</p>
        </div>
      </div>
      <div style="background:#f8f9fa;padding:18px 32px;border-top:1px solid #e5e7eb;">
        <p style="margin:0;color:#9ca3af;font-size:12px;">Reply directly to this email to reach the prospect at <strong>${email}</strong></p>
      </div>
    </div>
  `;

  function row(label: string, value: string) {
    return `
      <tr>
        <td style="padding:8px 0;color:#6b7280;width:38%;vertical-align:top;border-bottom:1px solid #f3f4f6;">${label}</td>
        <td style="padding:8px 0;color:#111827;font-weight:600;border-bottom:1px solid #f3f4f6;">${value}</td>
      </tr>`;
  }

  try {
    await transporter.sendMail({
      from: `"iTech Network Africa Website" <${emailUser}>`,
      to: RECIPIENT,
      replyTo: email,
      subject: `[Consultation] ${serviceInterest} – ${fullName}`,
      html,
      text: [
        `New Consultation Request`,
        `---`,
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone}`,
        `Company: ${company || "N/A"}`,
        `Job Title: ${jobTitle || "N/A"}`,
        `Service: ${serviceInterest}`,
        `Budget: ${budget}`,
        `Timeline: ${timeline}`,
        `Preferred Slot: ${slot}`,
        `How found: ${hearAboutUs || "N/A"}`,
        ``,
        `Project Description:`,
        projectDescription,
      ].join("\n"),
    });

    res.status(200).json({ message: "Consultation request sent successfully." });
  } catch (err) {
    console.error("[consultation] Failed to send email:", err);
    res.status(500).json({ message: "Failed to send email. Please try again." });
  }
});

export default router;
