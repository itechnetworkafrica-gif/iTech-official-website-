import React from 'react';
import { motion } from 'framer-motion';
import { Link, useRoute } from 'wouter';
import {
  ArrowLeft, Clock, Calendar, Zap, Code2, Shield, Cloud, Brain, Building2,
  CheckCircle2, AlertCircle, Info, ChevronRight, BookOpen,
} from 'lucide-react';

const EASE = [0.22, 1, 0.36, 1] as [number, number, number, number];

/* ─── Callout components ─── */
function Note({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-[#f0fdf4] border border-[#bbf7d0] rounded-xl p-4 my-6">
      <Info size={18} className="text-[#3CB52A] shrink-0 mt-0.5" />
      <div className="text-sm text-[#166534] leading-relaxed">{children}</div>
    </div>
  );
}
function Warning({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4 my-6">
      <AlertCircle size={18} className="text-amber-500 shrink-0 mt-0.5" />
      <div className="text-sm text-amber-800 leading-relaxed">{children}</div>
    </div>
  );
}
function Step({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 mb-8">
      <div className="flex-shrink-0 w-9 h-9 rounded-full bg-[#3CB52A] text-white flex items-center justify-center font-black text-sm">
        {n}
      </div>
      <div className="flex-grow pt-1">
        <h4 className="font-bold text-[#0A0A0A] text-base mb-2">{title}</h4>
        <div className="text-[#4B5563] text-sm leading-relaxed">{children}</div>
      </div>
    </div>
  );
}
function CheckList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 my-4">
      {items.map((item, i) => (
        <li key={i} className="flex items-start gap-2 text-sm text-[#374151]">
          <CheckCircle2 size={16} className="text-[#3CB52A] shrink-0 mt-0.5" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
function CodeBlock({ code, lang = 'bash' }: { code: string; lang?: string }) {
  return (
    <div className="my-5 rounded-xl overflow-hidden border border-[#E5E7EB]">
      <div className="bg-[#1E293B] px-4 py-2 flex items-center justify-between">
        <span className="text-[#94A3B8] text-xs font-mono">{lang}</span>
      </div>
      <pre className="bg-[#0F172A] p-5 overflow-x-auto text-sm text-[#E2E8F0] font-mono leading-relaxed">
        <code>{code}</code>
      </pre>
    </div>
  );
}

/* ─── Guide content ─── */
type Section = {
  heading: string;
  body: React.ReactNode;
};
type Guide = {
  slug: string;
  icon: React.ElementType;
  title: string;
  desc: string;
  time: string;
  date: string;
  category: string;
  sections: Section[];
};

const GUIDES: Guide[] = [
  {
    slug: 'quick-start',
    icon: Zap,
    title: 'iTech Platform Quick Start Guide',
    desc: 'Get your first iTech integration live in under 30 minutes. Covers environment setup, authentication, and your first API call.',
    time: '30 min read',
    date: 'June 2025',
    category: 'Getting Started',
    sections: [
      {
        heading: 'Prerequisites',
        body: (
          <>
            <p>Before you begin, make sure you have the following ready:</p>
            <CheckList items={[
              'An active iTech Network Africa account (request one at itechnetworkafrica.com/contact)',
              'Node.js 18+ or Python 3.10+ installed on your machine',
              'Your API key from the iTech Client Portal under Settings → API Keys',
              'A terminal / command-line interface',
            ]} />
            <Note>If you don't have an account yet, contact the iTech sales team. Sandbox credentials can be issued within 24 hours for evaluation purposes.</Note>
          </>
        ),
      },
      {
        heading: 'Step 1 — Install the iTech SDK',
        body: (
          <>
            <p>The quickest way to get started is with the official SDK, available for JavaScript/TypeScript and Python.</p>
            <Step n={1} title="Install via npm or pip">
              <CodeBlock lang="bash" code={`# JavaScript / TypeScript
npm install @itech-network/sdk

# Python
pip install itech-network-sdk`} />
            </Step>
            <Step n={2} title="Initialise the client">
              <CodeBlock lang="typescript" code={`import { iTechClient } from '@itech-network/sdk';

const client = new iTechClient({
  apiKey: process.env.ITECH_API_KEY,
  environment: 'sandbox', // switch to 'production' when ready
});`} />
            </Step>
          </>
        ),
      },
      {
        heading: 'Step 2 — Authenticate',
        body: (
          <>
            <p>iTech uses bearer-token authentication. Your API key is long-lived, but for production workloads we recommend exchanging it for a short-lived JWT.</p>
            <CodeBlock lang="typescript" code={`const { token, expiresAt } = await client.auth.getToken();
console.log('Authenticated until', expiresAt);`} />
            <Warning>Never commit API keys to source control. Use environment variables or a secrets manager like AWS Secrets Manager or HashiCorp Vault.</Warning>
          </>
        ),
      },
      {
        heading: 'Step 3 — Make Your First API Call',
        body: (
          <>
            <p>Verify connectivity by fetching your account profile:</p>
            <CodeBlock lang="typescript" code={`const profile = await client.account.getProfile();
console.log('Welcome,', profile.organisationName);
// Welcome, Acme Corp`} />
            <p>You should see your organisation name printed to the console. If you see a <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs font-mono">401 Unauthorized</code> error, double-check your API key in the portal.</p>
          </>
        ),
      },
      {
        heading: 'Step 4 — Explore the Core Modules',
        body: (
          <>
            <p>iTech exposes several core modules you can start integrating immediately:</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Module</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Description</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">SDK Namespace</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['CRM', 'Contacts, leads, and pipelines', 'client.crm'],
                    ['POS', 'Point-of-sale transactions', 'client.pos'],
                    ['ERP', 'Finance, inventory, HR modules', 'client.erp'],
                    ['Analytics', 'Reporting and dashboards', 'client.analytics'],
                    ['Webhooks', 'Real-time event subscriptions', 'client.webhooks'],
                  ].map(([mod, desc, ns]) => (
                    <tr key={mod} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 font-semibold text-[#0A0A0A]">{mod}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{desc}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#3CB52A]">{ns}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        heading: 'Next Steps',
        body: (
          <>
            <p>You're set up and authenticated. Here's where to go next:</p>
            <CheckList items={[
              'Read the REST API Integration Quickstart to explore endpoints directly',
              'Configure webhooks so your system receives real-time events',
              'Review the Enterprise Security Best Practices before going to production',
              'Book a free onboarding call with your iTech account manager',
            ]} />
          </>
        ),
      },
    ],
  },

  {
    slug: 'rest-api-quickstart',
    icon: Code2,
    title: 'REST API Integration Quickstart',
    desc: 'Authenticate and make your first API call with code samples in JavaScript, Python, and PHP — ready to copy and run.',
    time: '15 min read',
    date: 'May 2025',
    category: 'Developer',
    sections: [
      {
        heading: 'Base URL & Versioning',
        body: (
          <>
            <p>All iTech API endpoints are versioned and available over HTTPS:</p>
            <CodeBlock lang="bash" code={`# Production
https://api.itechnetworkafrica.com/v2

# Sandbox
https://sandbox-api.itechnetworkafrica.com/v2`} />
            <Note>Always target a specific version (e.g. <code className="font-mono text-xs">/v2</code>). Unversioned endpoints are deprecated and will be removed in a future release.</Note>
          </>
        ),
      },
      {
        heading: 'Authentication',
        body: (
          <>
            <p>Pass your API key in the <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs font-mono">Authorization</code> header as a Bearer token:</p>
            <CodeBlock lang="bash" code={`curl -X GET https://api.itechnetworkafrica.com/v2/account/profile \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json"`} />
          </>
        ),
      },
      {
        heading: 'Code Samples',
        body: (
          <>
            <p>Here are working examples in three languages. Replace <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs font-mono">YOUR_API_KEY</code> with your actual key.</p>
            <p className="font-semibold text-[#0A0A0A] mt-5 mb-2">JavaScript (fetch)</p>
            <CodeBlock lang="javascript" code={`const response = await fetch(
  'https://api.itechnetworkafrica.com/v2/crm/contacts',
  {
    headers: {
      Authorization: \`Bearer \${process.env.ITECH_API_KEY}\`,
      'Content-Type': 'application/json',
    },
  }
);
const { data, pagination } = await response.json();
console.log(\`Loaded \${data.length} contacts\`);`} />
            <p className="font-semibold text-[#0A0A0A] mt-5 mb-2">Python (requests)</p>
            <CodeBlock lang="python" code={`import os, requests

headers = {"Authorization": f"Bearer {os.environ['ITECH_API_KEY']}"}
r = requests.get(
    "https://api.itechnetworkafrica.com/v2/crm/contacts",
    headers=headers
)
r.raise_for_status()
contacts = r.json()["data"]
print(f"Loaded {len(contacts)} contacts")`} />
            <p className="font-semibold text-[#0A0A0A] mt-5 mb-2">PHP (cURL)</p>
            <CodeBlock lang="php" code={`<?php
$ch = curl_init("https://api.itechnetworkafrica.com/v2/crm/contacts");
curl_setopt_array($ch, [
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_HTTPHEADER => [
    "Authorization: Bearer " . getenv("ITECH_API_KEY"),
    "Content-Type: application/json",
  ],
]);
$body = json_decode(curl_exec($ch), true);
echo "Loaded " . count($body["data"]) . " contacts\n";`} />
          </>
        ),
      },
      {
        heading: 'Pagination',
        body: (
          <>
            <p>List endpoints return paginated results. Use <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs font-mono">page</code> and <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs font-mono">limit</code> query parameters:</p>
            <CodeBlock lang="bash" code={`GET /v2/crm/contacts?page=2&limit=50`} />
            <p>The response always includes a <code className="bg-[#F3F4F6] px-1.5 py-0.5 rounded text-xs font-mono">pagination</code> object:</p>
            <CodeBlock lang="json" code={`{
  "data": [...],
  "pagination": {
    "page": 2,
    "limit": 50,
    "total": 347,
    "totalPages": 7
  }
}`} />
          </>
        ),
      },
      {
        heading: 'Error Handling',
        body: (
          <>
            <p>iTech uses standard HTTP status codes. All errors return a JSON body:</p>
            <CodeBlock lang="json" code={`{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "The field 'email' is required.",
    "field": "email"
  }
}`} />
            <CheckList items={[
              '200 OK — Request succeeded',
              '201 Created — Resource created',
              '400 Bad Request — Validation error, check the error body',
              '401 Unauthorized — Invalid or expired API key',
              '403 Forbidden — Insufficient permissions for this resource',
              '429 Too Many Requests — Rate limit exceeded, retry after the Retry-After header',
              '500 Internal Server Error — Contact support if this persists',
            ]} />
          </>
        ),
      },
      {
        heading: 'Rate Limits',
        body: (
          <>
            <p>API calls are rate-limited per API key. Limits are returned in response headers:</p>
            <CodeBlock lang="bash" code={`X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 947
X-RateLimit-Reset: 1720000000`} />
            <Warning>If you exceed the rate limit you'll receive a <code className="font-mono text-xs">429</code> response. Implement exponential back-off in your retry logic to avoid bans.</Warning>
          </>
        ),
      },
    ],
  },

  {
    slug: 'security-best-practices',
    icon: Shield,
    title: 'Enterprise Security Best Practices',
    desc: 'Essential security guidelines: MFA setup, API key management, role-based access, and data encryption for your deployment.',
    time: '20 min read',
    date: 'July 2025',
    category: 'Security',
    sections: [
      {
        heading: 'Authentication & MFA',
        body: (
          <>
            <p>Multi-factor authentication (MFA) should be mandatory for all user accounts that access the iTech portal or admin dashboard.</p>
            <CheckList items={[
              'Enable MFA for every admin and manager-level account',
              'Use a TOTP app (Google Authenticator, Authy) — avoid SMS-based MFA where possible',
              'Enforce a minimum password length of 16 characters with complexity requirements',
              'Set session expiry to 8 hours maximum for all portal users',
            ]} />
            <Note>iTech supports SSO via SAML 2.0 and OpenID Connect. Using your existing identity provider (Okta, Azure AD, Google Workspace) is the most secure option for enterprise deployments.</Note>
          </>
        ),
      },
      {
        heading: 'API Key Management',
        body: (
          <>
            <p>API keys are the primary way your systems authenticate to iTech. Poor key hygiene is the most common cause of security incidents.</p>
            <Step n={1} title="Use one key per service">
              <p>Issue a unique API key for each integrated application or service. This makes it easy to revoke a single key without impacting others.</p>
            </Step>
            <Step n={2} title="Store keys in a secrets manager">
              <p>Never hardcode keys in source code or commit them to a repository. Use AWS Secrets Manager, Azure Key Vault, HashiCorp Vault, or environment variables injected at runtime.</p>
            </Step>
            <Step n={3} title="Rotate keys regularly">
              <p>Set a key rotation schedule of every 90 days. The iTech portal allows you to generate a replacement key and deprecate the old one with a 24-hour grace period.</p>
            </Step>
            <Step n={4} title="Monitor key usage">
              <p>Use the iTech Audit Logs (Settings → Security → Audit Logs) to review which keys are being used, from where, and how often. Unusual spikes or unfamiliar IP addresses are red flags.</p>
            </Step>
          </>
        ),
      },
      {
        heading: 'Role-Based Access Control (RBAC)',
        body: (
          <>
            <p>Apply the principle of least privilege — every user and service account should have only the permissions they need.</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Built-in Role</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Typical Use</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">API Write Access</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Super Admin', 'IT director / primary owner', 'Full'],
                    ['Admin', 'Department heads', 'Full within department'],
                    ['Manager', 'Team leads', 'Read + limited write'],
                    ['Operator', 'Day-to-day staff', 'Read + operational writes'],
                    ['Read Only', 'Auditors / analysts', 'None'],
                    ['Service Account', 'API integrations', 'Scoped by key permissions'],
                  ].map(([role, use, access]) => (
                    <tr key={role} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 font-semibold text-[#0A0A0A]">{role}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{use}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{access}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        heading: 'Data Encryption',
        body: (
          <>
            <p>iTech encrypts all data in transit and at rest by default. There are additional steps to harden your deployment:</p>
            <CheckList items={[
              'All API traffic uses TLS 1.2 or higher — older protocols are rejected',
              'Database fields containing PII are encrypted at the column level with AES-256',
              'Enable customer-managed encryption keys (CMEK) for maximum control over your data',
              'Backups are encrypted with a separate key and stored in a different region',
              'File uploads are scanned for malware before storage',
            ]} />
          </>
        ),
      },
      {
        heading: 'Incident Response Checklist',
        body: (
          <>
            <p>If you suspect a security incident, follow these steps immediately:</p>
            <Step n={1} title="Revoke the compromised credential">
              <p>Go to Settings → API Keys → Revoke. For user accounts, go to Users → Disable Account.</p>
            </Step>
            <Step n={2} title="Review audit logs">
              <p>Check Settings → Security → Audit Logs for actions taken with the compromised credential. Export logs for forensics.</p>
            </Step>
            <Step n={3} title="Notify iTech support">
              <p>Email security@itechnetworkafrica.com with the timeline and any exported logs. We have a 4-hour SLA for security incidents on enterprise plans.</p>
            </Step>
            <Step n={4} title="Issue new credentials">
              <p>Generate new API keys and update all systems. Re-enable affected user accounts once the investigation is complete.</p>
            </Step>
          </>
        ),
      },
    ],
  },

  {
    slug: 'cloud-deployment',
    icon: Cloud,
    title: 'Cloud Deployment Checklist for Africa',
    desc: 'A pre-launch checklist for deploying iTech solutions on AWS, Azure, or Google Cloud with African data-residency requirements.',
    time: '25 min read',
    date: 'April 2025',
    category: 'Infrastructure',
    sections: [
      {
        heading: 'African Data Residency Overview',
        body: (
          <>
            <p>Many African countries have enacted or are enacting data localisation laws requiring that certain categories of data be stored and processed within the country or region. Before deploying, verify the requirements for each country your users are in.</p>
            <CheckList items={[
              'Nigeria — NDPR requires personal data of Nigerian citizens to remain in Nigeria or an "adequately protected" jurisdiction',
              'Kenya — Data Protection Act 2019 restricts cross-border transfers without sufficient safeguards',
              'South Africa — POPIA prohibits transfers to countries without comparable protection',
              'Ghana — Data Protection Act 2012 requires registration with the DPC',
              'Egypt — PDPL (2020) mandates local storage for sensitive categories',
            ]} />
            <Note>Always consult a local legal counsel for the latest regulatory position. This guide reflects the state as of Q2 2025.</Note>
          </>
        ),
      },
      {
        heading: 'Cloud Region Selection',
        body: (
          <>
            <p>Choosing the right region is the most important infrastructure decision for an African deployment:</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Provider</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">African Region(s)</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Location</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['AWS', 'af-south-1', 'Cape Town, South Africa'],
                    ['Azure', 'southafricanorth', 'Johannesburg, South Africa'],
                    ['Azure', 'southafricawest', 'Cape Town, South Africa'],
                    ['Google Cloud', 'africa-south1', 'Johannesburg, South Africa'],
                  ].map(([provider, region, location], i) => (
                    <tr key={i} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 font-semibold text-[#0A0A0A]">{provider}</td>
                      <td className="px-4 py-3 font-mono text-xs text-[#3CB52A]">{region}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{location}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <Warning>If your target countries are in West or East Africa, data stored in South African regions may still not satisfy strict localisation requirements. Evaluate edge/CDN deployments and consider multi-region architecture for broader coverage.</Warning>
          </>
        ),
      },
      {
        heading: 'Pre-Launch Infrastructure Checklist',
        body: (
          <>
            <p className="font-semibold text-[#0A0A0A] mb-2">Networking</p>
            <CheckList items={[
              'VPC / VNet configured with private subnets for database and application tiers',
              'Security groups / NSGs allow only required ports (443, 80 inbound; restrict all others)',
              'NAT Gateway or Egress-only gateway for outbound traffic from private subnets',
              'CDN (CloudFront / Azure CDN / Cloud CDN) configured for static asset delivery',
            ]} />
            <p className="font-semibold text-[#0A0A0A] mb-2 mt-4">Compute</p>
            <CheckList items={[
              'Auto-scaling group configured with minimum 2 instances across availability zones',
              'Health checks configured and tested — unhealthy instances replaced within 5 minutes',
              'Container registry (ECR / ACR / GCR) set up with image scanning enabled',
            ]} />
            <p className="font-semibold text-[#0A0A0A] mb-2 mt-4">Database</p>
            <CheckList items={[
              'Multi-AZ enabled for RDS / Azure SQL / Cloud SQL',
              'Automated backups retained for at least 30 days',
              'Point-in-time recovery (PITR) tested — can you restore to a known good state?',
              'Encryption at rest enabled using customer-managed keys',
            ]} />
            <p className="font-semibold text-[#0A0A0A] mb-2 mt-4">Monitoring & Observability</p>
            <CheckList items={[
              'CloudWatch / Azure Monitor / Cloud Operations alerts configured for CPU, memory, and error rate',
              'Centralised logging with 90-day retention',
              'Distributed tracing enabled for API services',
              'Uptime / synthetic monitoring from an African PoP (e.g. Johannesburg)',
            ]} />
          </>
        ),
      },
      {
        heading: 'Connectivity Considerations',
        body: (
          <>
            <p>African internet connectivity can be inconsistent. Design for resilience:</p>
            <CheckList items={[
              'Implement offline-first patterns or local caching for mobile/field users',
              'Use progressive enhancement — core functionality should work on slow connections',
              'Compress API responses with gzip/brotli — bandwidth is expensive in many markets',
              'Consider SMS fallback for critical notifications (email delivery is unreliable in some regions)',
              'Test your app on 3G throttling — many African users are on mobile broadband, not fibre',
            ]} />
          </>
        ),
      },
    ],
  },

  {
    slug: 'ai-automation',
    icon: Brain,
    title: 'Configuring AI & Automation Modules',
    desc: 'Configure and fine-tune iTech AI modules for your specific business context, data pipeline, and automation workflows.',
    time: '40 min read',
    date: 'June 2025',
    category: 'AI & Automation',
    sections: [
      {
        heading: 'Overview of iTech AI Modules',
        body: (
          <>
            <p>iTech AI is a suite of pre-built, configurable machine learning modules that integrate directly with your CRM, ERP, and POS data. No data science team required.</p>
            <div className="overflow-x-auto my-4">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Module</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">What it does</th>
                    <th className="text-left px-4 py-3 font-bold text-[#374151]">Data Required</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ['Demand Forecasting', 'Predicts inventory needs 30/60/90 days out', 'Min. 12 months of sales history'],
                    ['Lead Scoring', 'Ranks CRM leads by conversion probability', 'Min. 500 closed deals'],
                    ['Churn Prediction', 'Flags at-risk accounts before they leave', 'Min. 6 months account activity'],
                    ['Document Processing', 'Extracts data from invoices, receipts, contracts', 'Sample documents for training'],
                    ['Anomaly Detection', 'Flags unusual transactions or system events', 'Baseline activity data (30 days)'],
                    ['Natural Language Search', 'Plain-English search across all your data', 'Active CRM/ERP data'],
                  ].map(([mod, desc, data]) => (
                    <tr key={mod} className="border-b border-[#F3F4F6] hover:bg-[#F9FAFB]">
                      <td className="px-4 py-3 font-semibold text-[#0A0A0A]">{mod}</td>
                      <td className="px-4 py-3 text-[#6B7280]">{desc}</td>
                      <td className="px-4 py-3 text-[#6B7280] text-xs">{data}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        ),
      },
      {
        heading: 'Enabling a Module',
        body: (
          <>
            <Step n={1} title="Navigate to AI Settings">
              <p>In your iTech portal, go to Settings → AI & Automation. You'll see all available modules with their status (enabled/disabled/insufficient data).</p>
            </Step>
            <Step n={2} title="Check data readiness">
              <p>Each module shows a data readiness score (0–100%). Modules below 60% will produce unreliable results. Address data gaps before enabling.</p>
            </Step>
            <Step n={3} title="Run a baseline evaluation">
              <p>Click "Run Evaluation" to let the system analyse your historical data and set initial model parameters. This typically takes 10–30 minutes depending on data volume.</p>
            </Step>
            <Step n={4} title="Enable in shadow mode first">
              <p>Shadow mode runs the AI module and logs its predictions without acting on them. Monitor for 2–4 weeks before switching to active mode.</p>
            </Step>
            <Note>Shadow mode is strongly recommended for Demand Forecasting and Churn Prediction. These modules affect purchasing and retention workflows — validating accuracy before acting prevents costly mistakes.</Note>
          </>
        ),
      },
      {
        heading: 'Configuring Automation Workflows',
        body: (
          <>
            <p>iTech Automation connects AI module outputs to actions using a trigger → condition → action model:</p>
            <CodeBlock lang="yaml" code={`# Example: auto-create a retention task when churn risk > 70%
name: High Churn Risk Alert
trigger:
  module: churn_prediction
  event: score_updated

condition:
  field: churn_probability
  operator: greater_than
  value: 0.70

actions:
  - type: create_crm_task
    assignee: account_manager
    priority: high
    title: "Retention call needed: {{account.name}}"
  - type: send_slack_notification
    channel: "#retention-team"
    message: "⚠️ {{account.name}} has a {{churn_probability | percent}} churn risk"`} />
          </>
        ),
      },
      {
        heading: 'Fine-Tuning & Feedback Loops',
        body: (
          <>
            <p>AI module accuracy improves over time through feedback loops. You can accelerate this:</p>
            <CheckList items={[
              'Mark predictions as correct or incorrect in the portal to provide labelled training data',
              'Upload historical outcome data (e.g. which leads actually converted) via the Data Import tool',
              'Schedule a model retraining every 30 days — automated in the AI Settings under "Retraining Schedule"',
              'Review the Accuracy Dashboard monthly and flag modules where precision drops below 80%',
            ]} />
          </>
        ),
      },
      {
        heading: 'Responsible AI Guidelines',
        body: (
          <>
            <p>iTech AI modules are tools to assist decision-making, not replace it. Follow these principles:</p>
            <CheckList items={[
              'Always have a human review high-stakes AI decisions (e.g. credit decisions, staff actions)',
              'Document which decisions are AI-assisted in your audit trail',
              'Review model outputs for demographic bias at least quarterly',
              'Provide users with a clear way to flag AI decisions they believe are incorrect',
              'Do not use AI-generated scores as the sole basis for employment or financial decisions',
            ]} />
          </>
        ),
      },
    ],
  },

  {
    slug: 'user-management',
    icon: Building2,
    title: 'Enterprise User Management Guide',
    desc: 'Manage roles, permissions, SSO configuration, multi-tenancy, and full audit trails for your organisation at scale.',
    time: '20 min read',
    date: 'March 2025',
    category: 'Administration',
    sections: [
      {
        heading: 'User Account Structure',
        body: (
          <>
            <p>iTech uses a hierarchical account model designed for enterprise organisations:</p>
            <div className="bg-[#F8F9FA] rounded-xl p-5 my-4 border border-[#E5E7EB] font-mono text-xs">
              <div className="text-[#0A0A0A] font-bold mb-1">Organisation (Root)</div>
              <div className="ml-4 text-[#6B7280] mb-1">├── Business Unit</div>
              <div className="ml-8 text-[#6B7280] mb-1">├── Department</div>
              <div className="ml-12 text-[#6B7280] mb-1">├── Team</div>
              <div className="ml-16 text-[#9CA3AF]">└── User</div>
            </div>
            <p>Each node inherits permissions from its parent unless explicitly overridden. This allows you to set organisation-wide policies while giving individual units flexibility.</p>
          </>
        ),
      },
      {
        heading: 'Bulk User Provisioning',
        body: (
          <>
            <p>For organisations with 20+ users, use the CSV import tool or the API for bulk provisioning.</p>
            <p className="font-semibold text-[#0A0A0A] mt-4 mb-2">CSV Format</p>
            <CodeBlock lang="csv" code={`email,first_name,last_name,role,department,business_unit
john.doe@acme.com,John,Doe,Manager,Sales,West Africa
jane.smith@acme.com,Jane,Smith,Operator,Finance,East Africa`} />
            <p className="font-semibold text-[#0A0A0A] mt-4 mb-2">API (bulk create)</p>
            <CodeBlock lang="bash" code={`POST /v2/users/bulk
Content-Type: application/json

{
  "users": [
    {
      "email": "john.doe@acme.com",
      "role": "manager",
      "department_id": "dept_sales_west",
      "send_welcome_email": true
    }
  ]
}`} />
          </>
        ),
      },
      {
        heading: 'Single Sign-On (SSO) Setup',
        body: (
          <>
            <p>iTech supports SAML 2.0 and OIDC SSO. Setting up SSO is a four-step process:</p>
            <Step n={1} title="Register iTech as a Service Provider in your IdP">
              <p>Use the Entity ID and ACS URL from Settings → SSO → Configuration. Most IdPs (Okta, Azure AD, Google Workspace) have a pre-built iTech connector in their app gallery.</p>
            </Step>
            <Step n={2} title="Copy the IdP metadata into iTech">
              <p>Paste your IdP's metadata XML or provide the metadata URL in Settings → SSO → Identity Provider Metadata.</p>
            </Step>
            <Step n={3} title="Map attributes">
              <p>Configure attribute mappings so iTech receives the right user information:</p>
              <div className="overflow-x-auto my-3">
                <table className="w-full text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#F9FAFB] border-b border-[#E5E7EB]">
                      <th className="text-left px-3 py-2 font-bold text-[#374151]">iTech Field</th>
                      <th className="text-left px-3 py-2 font-bold text-[#374151]">Okta Attribute</th>
                      <th className="text-left px-3 py-2 font-bold text-[#374151]">Azure AD Attribute</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      ['email', 'user.email', 'user.mail'],
                      ['first_name', 'user.firstName', 'user.givenname'],
                      ['last_name', 'user.lastName', 'user.surname'],
                      ['role', 'user.iTechRole', 'extensionAttribute1'],
                    ].map(([field, okta, azure]) => (
                      <tr key={field} className="border-b border-[#F3F4F6]">
                        <td className="px-3 py-2 font-mono text-[#3CB52A]">{field}</td>
                        <td className="px-3 py-2 text-[#6B7280] font-mono">{okta}</td>
                        <td className="px-3 py-2 text-[#6B7280] font-mono">{azure}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Step>
            <Step n={4} title="Test and enforce SSO">
              <p>Use the "Test SSO" button before enforcing. Once enforced, password-based login is disabled for all users in your domain.</p>
            </Step>
            <Warning>Have at least one "break glass" Super Admin account with a local password before enforcing SSO. If your IdP goes down, you'll need this to access iTech.</Warning>
          </>
        ),
      },
      {
        heading: 'Audit Logs & Compliance',
        body: (
          <>
            <p>iTech maintains a tamper-evident audit log of every action taken by users and API keys.</p>
            <CheckList items={[
              'Audit logs are retained for 24 months on Enterprise plans (7 years with Compliance Add-on)',
              'Logs can be streamed in real time to your SIEM via webhook or AWS S3/Azure Blob export',
              'Each log entry includes: actor, IP address, action, affected resource, timestamp, and outcome',
              'Logs are cryptographically signed and can be verified for non-repudiation',
            ]} />
            <p className="mt-4">To export logs for a compliance audit:</p>
            <CodeBlock lang="bash" code={`GET /v2/audit-logs?from=2025-01-01&to=2025-06-30&format=csv
Authorization: Bearer YOUR_API_KEY`} />
          </>
        ),
      },
      {
        heading: 'Multi-Tenancy',
        body: (
          <>
            <p>If you are an iTech Partner or ISV deploying iTech for multiple end-clients, use the multi-tenant configuration:</p>
            <CheckList items={[
              'Each client gets an isolated tenant with its own data, users, and settings',
              'As a Partner Admin you can switch between tenants without logging out',
              'Billing is consolidated at the partner level — you control cost allocation',
              'Tenants can optionally be white-labelled with the client\'s own branding and domain',
              'Cross-tenant data access is never permitted — this is enforced at the infrastructure level',
            ]} />
            <Note>Multi-tenancy is available on the Partner and Enterprise plans. Contact your iTech account manager to enable it for your organisation.</Note>
          </>
        ),
      },
    ],
  },
];

export default function GuideDetailPage() {
  const [, params] = useRoute('/resources/guides/:slug');
  const slug = params?.slug ?? '';
  const guide = GUIDES.find(g => g.slug === slug);

  if (!guide) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6">
        <h1 className="text-2xl font-black text-[#0A0A0A] mb-3">Guide not found</h1>
        <p className="text-[#6B7280] mb-6">We couldn't find the guide you're looking for.</p>
        <Link href="/resources">
          <a className="inline-flex items-center gap-2 text-[#3CB52A] font-bold hover:underline">
            <ArrowLeft size={16} /> Back to Resources
          </a>
        </Link>
      </div>
    );
  }

  const Icon = guide.icon;

  return (
    <div className="flex flex-col w-full bg-white">

      {/* ─── Hero ─── */}
      <section className="relative bg-[#060E18] pt-20 pb-20 overflow-hidden">
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(#fff 1px,transparent 1px),linear-gradient(90deg,#fff 1px,transparent 1px)',
            backgroundSize: '64px 64px',
          }}
        />
        <div
          aria-hidden="true"
          className="absolute left-0 top-0 w-[500px] h-[500px] rounded-full pointer-events-none"
          style={{ background: 'radial-gradient(circle, rgba(60,181,42,0.07) 0%, transparent 65%)' }}
        />
        <div className="max-w-4xl mx-auto px-6 lg:px-10 relative z-10">
          {/* Breadcrumb */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-2 text-white/40 text-sm mb-10 flex-wrap"
          >
            <Link href="/"><a className="hover:text-white transition-colors">Home</a></Link>
            <ChevronRight size={13} />
            <Link href="/resources"><a className="hover:text-white transition-colors">Resources</a></Link>
            <ChevronRight size={13} />
            <span className="text-white/70">{guide.title}</span>
          </motion.div>

          {/* Category badge */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-[#3CB52A]/15 border border-[#3CB52A]/30 mb-6"
          >
            <BookOpen size={13} className="text-[#3CB52A]" />
            <span className="text-[#3CB52A] text-xs font-bold tracking-widest uppercase">{guide.category}</span>
          </motion.div>

          {/* Icon + Title */}
          <div className="flex items-start gap-5 mb-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
              className="w-14 h-14 rounded-2xl bg-[#3CB52A]/15 border border-[#3CB52A]/30 flex items-center justify-center shrink-0"
            >
              <Icon size={26} className="text-[#3CB52A]" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, delay: 0.12, ease: EASE }}
              className="text-3xl md:text-4xl lg:text-5xl font-black text-white leading-tight"
            >
              {guide.title}
            </motion.h1>
          </div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.18 }}
            className="text-white/50 text-lg leading-relaxed mb-8 max-w-2xl"
          >
            {guide.desc}
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.24 }}
            className="flex items-center gap-5 text-white/40 text-sm"
          >
            <span className="flex items-center gap-1.5"><Clock size={14} /> {guide.time}</span>
            <span className="flex items-center gap-1.5"><Calendar size={14} /> {guide.date}</span>
          </motion.div>
        </div>
      </section>

      {/* ─── Content ─── */}
      <section className="py-16 lg:py-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-[220px_1fr] gap-12">

            {/* Sidebar TOC */}
            <aside className="hidden lg:block">
              <div className="sticky top-24">
                <p className="text-xs font-bold text-[#9CA3AF] tracking-widest uppercase mb-4">On This Page</p>
                <nav className="space-y-1">
                  {guide.sections.map((s, i) => (
                    <a
                      key={i}
                      href={`#section-${i}`}
                      className="block text-sm text-[#6B7280] hover:text-[#3CB52A] py-1.5 border-l-2 border-transparent hover:border-[#3CB52A] pl-3 transition-all"
                    >
                      {s.heading}
                    </a>
                  ))}
                </nav>
                <div className="mt-8 pt-6 border-t border-[#F3F4F6]">
                  <Link href="/resources">
                    <a className="flex items-center gap-2 text-sm text-[#6B7280] hover:text-[#3CB52A] transition-colors font-medium">
                      <ArrowLeft size={14} /> All Resources
                    </a>
                  </Link>
                </div>
              </div>
            </aside>

            {/* Article body */}
            <article>
              {guide.sections.map((s, i) => (
                <motion.div
                  key={i}
                  id={`section-${i}`}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.5, delay: i * 0.04, ease: EASE }}
                  className="mb-12 pb-12 border-b border-[#F3F4F6] last:border-b-0"
                >
                  <h2 className="text-2xl font-black text-[#0A0A0A] mb-5">{s.heading}</h2>
                  <div className="text-[#4B5563] leading-relaxed [&_p]:mb-4 [&_p:last-child]:mb-0">
                    {s.body}
                  </div>
                </motion.div>
              ))}

              {/* Back / Related */}
              <div className="mt-10 pt-8 border-t border-[#E5E7EB] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <Link href="/resources">
                  <a className="inline-flex items-center gap-2 text-sm font-bold text-[#6B7280] hover:text-[#3CB52A] transition-colors">
                    <ArrowLeft size={15} /> Back to Resources
                  </a>
                </Link>
                <Link href="/resources/docs">
                  <a className="inline-flex items-center gap-2 bg-[#3CB52A] hover:bg-[#2da822] text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-colors shadow-[0_4px_20px_rgba(60,181,42,0.35)]">
                    Explore Full Documentation <ChevronRight size={14} />
                  </a>
                </Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </div>
  );
}
