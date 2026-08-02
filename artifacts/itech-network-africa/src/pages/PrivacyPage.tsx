import React from 'react';
import { PageHero } from '@/components/PageHero';
import { LegalTOC } from '@/components/LegalTOC';

const TOC_ITEMS = [
  { id: 'introduction', title: 'Introduction' },
  { id: 'information-we-collect', title: 'Information We Collect' },
  { id: 'how-we-use-your-information', title: 'How We Use Your Information' },
  { id: 'legal-bases-gdpr', title: 'Legal Bases for Processing (GDPR)' },
  { id: 'information-sharing', title: 'Information Sharing and Disclosure' },
  { id: 'data-security', title: 'Data Security' },
  { id: 'data-retention', title: 'Data Retention' },
  { id: 'international-transfers', title: 'International Data Transfers' },
  { id: 'your-privacy-rights', title: 'Your Privacy Rights' },
  { id: 'childrens-privacy', title: "Children's Privacy" },
  { id: 'changes-to-policy', title: 'Changes to This Policy' },
  { id: 'contact-us', title: 'Contact Us' },
];

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Privacy Policy" subtitle="Last Updated: July 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">

        <LegalTOC items={TOC_ITEMS} />

        <h2 id="introduction" className="scroll-mt-28">1. Introduction</h2>
        <p>iTech Network Africa ("we," "our," or "us") is a global technology company respecting and protecting the privacy of our users worldwide. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website, use our software applications, or engage with our services globally.</p>
        <p>By accessing or using our services, you acknowledge that you have read, understood, and agree to be bound by this Privacy Policy. If you do not agree with its terms, please discontinue use of our website and services.</p>

        <h2 id="information-we-collect" className="scroll-mt-28">2. Information We Collect</h2>
        <p>We collect information that you voluntarily provide to us when you register for the Services, express an interest in obtaining information about us or our products, participate in activities on the Services, or contact us. This may include:</p>
        <ul>
          <li><strong>Personal Identification Information:</strong> Name, email address, phone number, postal address, and job title.</li>
          <li><strong>Business Information:</strong> Company name, industry, company size, and business role.</li>
          <li><strong>Technical Data:</strong> IP address, browser type and version, device type, operating system, and referral URLs.</li>
          <li><strong>Usage Data:</strong> Pages visited, time spent on pages, click patterns, and interaction data collected via analytics tools.</li>
          <li><strong>Communications:</strong> Messages sent through our contact forms, support tickets, or direct email correspondence.</li>
        </ul>
        <p>We may also collect information automatically when you visit our site using cookies, web beacons, and similar tracking technologies (see our Cookies Policy for details).</p>

        <h2 id="how-we-use-your-information" className="scroll-mt-28">3. How We Use Your Information</h2>
        <p>We use the information we collect or receive to:</p>
        <ul>
          <li>Facilitate account creation, authentication, and management.</li>
          <li>Deliver the services, software, and solutions you have engaged us for.</li>
          <li>Respond to your inquiries, support requests, and feedback in a timely manner.</li>
          <li>Send you service-related communications, including updates, security alerts, and administrative notices.</li>
          <li>Process payments, invoices, and manage billing for enterprise contracts.</li>
          <li>Improve, personalise, and develop our website and services based on usage analytics.</li>
          <li>Conduct research and analysis to better understand client needs across global markets.</li>
          <li>Comply with applicable legal obligations in jurisdictions where we operate.</li>
          <li>Protect against fraud, unauthorised access, and misuse of our systems.</li>
        </ul>

        <h2 id="legal-bases-gdpr" className="scroll-mt-28">4. Legal Bases for Processing (GDPR)</h2>
        <p>For users located in the European Economic Area (EEA) or jurisdictions with similar legislation, we rely on the following legal bases for processing your personal data:</p>
        <ul>
          <li><strong>Contractual Necessity:</strong> Processing required to perform the contract you have with us (e.g., delivering software services).</li>
          <li><strong>Legitimate Interests:</strong> Processing for our business interests where these are not outweighed by your rights (e.g., fraud prevention, security).</li>
          <li><strong>Consent:</strong> Where you have explicitly provided consent, such as for marketing communications.</li>
          <li><strong>Legal Obligation:</strong> Processing necessary for compliance with applicable laws and regulations.</li>
        </ul>

        <h2 id="information-sharing" className="scroll-mt-28">5. Information Sharing and Disclosure</h2>
        <p>We do not sell, trade, or rent your personal information to third parties for commercial purposes. We may share information with:</p>
        <ul>
          <li><strong>Service Providers:</strong> Trusted third-party vendors who assist in operating our website and delivering services (e.g., cloud hosting on AWS and Google Cloud, payment processors), subject to confidentiality agreements.</li>
          <li><strong>Business Partners:</strong> With your consent, we may share information with strategic technology partners for the purpose of delivering integrated solutions.</li>
          <li><strong>Legal Authorities:</strong> Where required by law, regulation, court order, or governmental authority.</li>
          <li><strong>Business Transfers:</strong> In the event of a merger, acquisition, or sale of assets, your information may be transferred as part of that transaction.</li>
        </ul>

        <h2 id="data-security" className="scroll-mt-28">6. Data Security</h2>
        <p>We implement enterprise-grade security measures to maintain the safety and integrity of your personal information:</p>
        <ul>
          <li>AES-256 encryption for all data at rest across our cloud infrastructure.</li>
          <li>TLS 1.3 encryption for all data in transit between your browser and our servers.</li>
          <li>Multi-factor authentication (MFA) enforced for all system access.</li>
          <li>Regular security audits, penetration testing, and vulnerability assessments.</li>
          <li>ISO 27001-aligned information security management practices.</li>
          <li>Staff training and strict access controls on a need-to-know basis.</li>
        </ul>
        <p>While we implement these safeguards, no method of electronic transmission or storage is 100% secure. We are committed to immediately notifying affected parties in the event of a data breach as required by applicable law.</p>

        <h2 id="data-retention" className="scroll-mt-28">7. Data Retention</h2>
        <p>We retain your personal information only for as long as necessary to fulfil the purposes outlined in this policy, or as required by law. Enterprise client data is retained for the duration of the contract plus a minimum of five (5) years for compliance and audit purposes. You may request deletion of your personal data at any time, subject to legal obligations.</p>

        <h2 id="international-transfers" className="scroll-mt-28">8. International Data Transfers</h2>
        <p>As a global technology company, we may transfer your personal information to countries outside of your jurisdiction. In all cases, we ensure appropriate safeguards are in place, including Standard Contractual Clauses (SCCs) approved by relevant data protection authorities, to ensure your data receives a level of protection consistent with applicable law.</p>

        <h2 id="your-privacy-rights" className="scroll-mt-28">9. Your Privacy Rights</h2>
        <p>Depending on your location, you may have the following rights regarding your personal data:</p>
        <ul>
          <li><strong>Right to Access:</strong> Request a copy of the personal data we hold about you.</li>
          <li><strong>Right to Rectification:</strong> Request correction of inaccurate or incomplete data.</li>
          <li><strong>Right to Erasure ("Right to be Forgotten"):</strong> Request deletion of your personal data in certain circumstances.</li>
          <li><strong>Right to Restriction:</strong> Request that we limit how we process your data.</li>
          <li><strong>Right to Data Portability:</strong> Receive your data in a structured, machine-readable format.</li>
          <li><strong>Right to Object:</strong> Object to processing based on legitimate interests or for direct marketing.</li>
          <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time where processing is based on consent.</li>
        </ul>
        <p>To exercise any of these rights, please contact our Data Protection Officer (details below). We will respond to all legitimate requests within 30 days.</p>

        <h2 id="childrens-privacy" className="scroll-mt-28">10. Children's Privacy</h2>
        <p>Our services are not directed to individuals under the age of 18. We do not knowingly collect personal information from minors. If you become aware that a child has provided us with personal data without parental consent, please contact us immediately.</p>

        <h2 id="changes-to-policy" className="scroll-mt-28">11. Changes to This Policy</h2>
        <p>We may update this Privacy Policy periodically to reflect changes in our practices, technology, legal requirements, or other factors. We will notify you of any material changes by posting the new policy on this page with an updated date and, where appropriate, via email notification.</p>

        <h2 id="contact-us" className="scroll-mt-28">12. Contact Us</h2>
        <p>If you have questions, concerns, or requests regarding this Privacy Policy or our data handling practices, please contact our Data Protection Officer:</p>
        <ul>
          <li><strong>Email:</strong> privacy@itechnetworkafrica.com</li>
          <li><strong>Phone:</strong> +231 761 978 796</li>
          <li><strong>Address:</strong> iTech Network Africa, Monrovia, Liberia</li>
        </ul>
      </section>
    </div>
  );
}
