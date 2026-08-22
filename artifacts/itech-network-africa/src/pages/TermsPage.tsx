import React from 'react';
import { PageHero } from '@/components/PageHero';
import { LegalTOC } from '@/components/LegalTOC';

const TOC_ITEMS = [
  { id: 'agreement-to-terms', title: 'Agreement to Terms' },
  { id: 'services-description', title: 'Services Description' },
  { id: 'intellectual-property', title: 'Intellectual Property Rights' },
  { id: 'user-representations', title: 'User Representations and Warranties' },
  { id: 'prohibited-activities', title: 'Prohibited Activities' },
  { id: 'payment-terms', title: 'Payment Terms' },
  { id: 'sla', title: 'Service Level Agreements (SLAs)' },
  { id: 'limitation-of-liability', title: 'Limitation of Liability' },
  { id: 'indemnification', title: 'Indemnification' },
  { id: 'confidentiality', title: 'Confidentiality' },
  { id: 'termination', title: 'Termination' },
  { id: 'governing-law', title: 'Governing Law and Dispute Resolution' },
  { id: 'changes-to-terms', title: 'Changes to Terms' },
  { id: 'contact', title: 'Contact' },
];

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Terms & Conditions" subtitle="Last Updated: July 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">

        <LegalTOC items={TOC_ITEMS} />

        <h2 id="agreement-to-terms" className="scroll-mt-28">1. Agreement to Terms</h2>
        <p>These Terms and Conditions ("Terms") constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you," "your," or "Client") and iTech Network Africa ("we," "us," "our," or "Company"), a global technology company, concerning your access to and use of our website at itechnetworkafrica.com and all associated enterprise software services, digital products, and professional services (collectively, the "Services").</p>
        <p>By accessing our website or engaging our services, you confirm that you have read, understood, and agree to be bound by these Terms. If you do not agree, you must immediately cease use of our services.</p>

        <h2 id="services-description" className="scroll-mt-28">2. Services Description</h2>
        <p>iTech Network Africa provides a range of technology solutions including but not limited to: enterprise software development, AI and machine learning solutions, cloud infrastructure management, cybersecurity services, web and mobile application development, IT consulting, managed services, and digital transformation advisory. Specific deliverables, timelines, and service levels are governed by individual Statements of Work (SOW) or Service Level Agreements (SLAs) entered into with each client.</p>

        <h2 id="intellectual-property" className="scroll-mt-28">3. Intellectual Property Rights</h2>
        <p>Unless otherwise expressly agreed in writing:</p>
        <ul>
          <li><strong>Our Property:</strong> All source code, proprietary frameworks, methodologies, tools, templates, and pre-existing intellectual property used or developed by iTech Network Africa remain our exclusive property. No license to our proprietary IP is transferred under these Terms.</li>
          <li><strong>Client IP:</strong> Any materials, data, or specifications provided by the Client remain the Client's intellectual property. By submitting materials to us, you grant us a limited, non-exclusive license to use them solely for the purpose of delivering the agreed services.</li>
          <li><strong>Work Product:</strong> Ownership of deliverables created specifically for a Client project is governed by the relevant SOW or SLA. In the absence of a written agreement to the contrary, all work product remains the property of iTech Network Africa until full payment is received.</li>
          <li><strong>Website Content:</strong> All website content, including text, graphics, logos, and software, is our proprietary property and is protected by applicable intellectual property laws globally.</li>
        </ul>

        <h2 id="user-representations" className="scroll-mt-28">4. User Representations and Warranties</h2>
        <p>By using our Services, you represent and warrant that:</p>
        <ul>
          <li>You are at least 18 years of age or the legal age of majority in your jurisdiction.</li>
          <li>You have the legal capacity and authority to enter into these Terms on behalf of yourself or your organisation.</li>
          <li>All registration and business information you provide is true, accurate, current, and complete.</li>
          <li>You will maintain the accuracy of such information and promptly update it as necessary.</li>
          <li>Your use of the Services does not violate any applicable laws or regulations in your jurisdiction.</li>
          <li>You will not use the Services for any unlawful, harmful, or fraudulent purpose.</li>
        </ul>

        <h2 id="prohibited-activities" className="scroll-mt-28">5. Prohibited Activities</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Reverse engineer, decompile, or disassemble any software or system provided by us.</li>
          <li>Attempt to gain unauthorised access to any portion of our systems or networks.</li>
          <li>Transmit viruses, malware, or any code of a destructive nature through our platforms.</li>
          <li>Use our services to transmit unsolicited commercial communications (spam).</li>
          <li>Impersonate any person or entity or misrepresent your affiliation with any person or entity.</li>
          <li>Use automated tools to scrape, crawl, or extract data from our website without our express written consent.</li>
          <li>Resell, sublicense, or transfer our services to any third party without prior written approval.</li>
        </ul>

        <h2 id="payment-terms" className="scroll-mt-28">6. Payment Terms</h2>
        <p>All pricing for services is as agreed in the applicable SOW, proposal, or pricing schedule. Unless otherwise specified:</p>
        <ul>
          <li>Project deposits are due upon contract signing and are non-refundable once work commences.</li>
          <li>Milestone payments are due within 14 days of milestone acceptance.</li>
          <li>Recurring service fees are due on the first business day of each billing cycle.</li>
          <li>Invoices unpaid after 30 days are subject to a late fee of 1.5% per month on the outstanding balance.</li>
          <li>We reserve the right to suspend services for accounts in arrears exceeding 60 days.</li>
        </ul>

        <h2 id="sla" className="scroll-mt-28">7. Service Level Agreements (SLAs)</h2>
        <p>Specific enterprise software deployments, managed services engagements, and support contracts are governed by individual Service Level Agreements signed during the procurement phase. In the event of a conflict between these general Terms and a signed enterprise SLA, the SLA shall take precedence for matters within its scope.</p>

        <h2 id="limitation-of-liability" className="scroll-mt-28">8. Limitation of Liability</h2>
        <p>To the fullest extent permitted by applicable law, iTech Network Africa shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, goodwill, or business opportunities, arising out of or in connection with your use of our services, even if we have been advised of the possibility of such damages.</p>
        <p>Our total aggregate liability to you for all claims arising under these Terms shall not exceed the total fees paid by you to us in the twelve (12) months immediately preceding the event giving rise to the claim.</p>

        <h2 id="indemnification" className="scroll-mt-28">9. Indemnification</h2>
        <p>You agree to indemnify, defend, and hold harmless iTech Network Africa, its directors, officers, employees, agents, and partners from and against any claims, liabilities, damages, losses, costs, and expenses (including reasonable legal fees) arising from: (a) your violation of these Terms; (b) your use of our services; or (c) any content or data you provide to us in connection with the services.</p>

        <h2 id="confidentiality" className="scroll-mt-28">10. Confidentiality</h2>
        <p>Both parties agree to maintain the confidentiality of all non-public information shared in connection with the delivery of services, including business information, technical specifications, and client data. This obligation survives the termination of any service agreement for a period of five (5) years.</p>

        <h2 id="termination" className="scroll-mt-28">11. Termination</h2>
        <p>Either party may terminate a service engagement as specified in the relevant SOW or SLA. We reserve the right to terminate or suspend access to our services immediately, without prior notice, for: (a) violation of these Terms; (b) non-payment of invoices; or (c) conduct that we determine, in our sole discretion, to be harmful to our business, other clients, or third parties.</p>

        <h2 id="governing-law" className="scroll-mt-28">12. Governing Law and Dispute Resolution</h2>
        <p>These Terms shall be governed by and construed in accordance with the laws of Liberia. For international clients, disputes may also be subject to the laws of the Client's jurisdiction as agreed in the applicable SOW. Any disputes arising from these Terms that cannot be resolved amicably shall be submitted to binding arbitration under internationally recognised arbitration rules before resorting to litigation.</p>

        <h2 id="changes-to-terms" className="scroll-mt-28">13. Changes to Terms</h2>
        <p>We reserve the right to modify these Terms at any time. We will notify users of material changes via email or a prominent notice on our website. Your continued use of our services after such notification constitutes acceptance of the revised Terms.</p>

        <h2 id="contact" className="scroll-mt-28">14. Contact</h2>
        <p>For questions regarding these Terms, please contact us at <a href="mailto:legal@itechnetworkafrica.com">legal@itechnetworkafrica.com</a> or call +231 761 978 796.</p>
      </section>
    </div>
  );
}
