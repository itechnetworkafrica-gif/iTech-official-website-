import React from 'react';
import { PageHero } from '@/components/PageHero';

export default function RefundPolicyPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Refund Policy" subtitle="Last Updated: July 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">
        <h2>1. Overview</h2>
        <p>At iTech Network Africa, we are committed to delivering exceptional technology solutions and maintaining the highest standards of client satisfaction. This Refund Policy outlines the conditions and procedures under which refunds may be requested and granted across our range of services.</p>
        <p>We encourage all clients to review this policy carefully before engaging our services. By entering into a project agreement, SOW, or purchasing a service plan, you acknowledge and accept these terms.</p>

        <h2>2. Project Deposits</h2>
        <p>A non-refundable deposit is required to commence any custom software development, consulting, or implementation project. This deposit:</p>
        <ul>
          <li>Secures your place in our project pipeline and reserves dedicated team resources.</li>
          <li>Covers initial discovery, requirements gathering, technical architecture, and project planning costs.</li>
          <li>Is non-refundable once the discovery phase has commenced, regardless of whether the project proceeds to development.</li>
          <li>Typically ranges from 25% to 50% of the total project value, as specified in the signed proposal.</li>
        </ul>

        <h2>3. Project Milestone Payments</h2>
        <p>Most projects are structured around milestone-based billing:</p>
        <ul>
          <li>Once a project milestone has been formally completed and accepted by the Client (via written confirmation or lack of objection within the review period), the milestone payment becomes non-refundable.</li>
          <li>Clients have a 7-business-day review period upon delivery of each milestone to raise objections or request revisions per the scope of work.</li>
          <li>Revision requests within scope will be accommodated at no additional charge. Out-of-scope changes will be quoted separately.</li>
          <li>If a project is paused by the Client for more than 30 days without written notice, iTech Network Africa reserves the right to invoice for work completed to date.</li>
        </ul>

        <h2>4. Project Cancellations</h2>
        <p>Clients wishing to cancel a project must provide written notice via email to their assigned account manager or to support@itechnetworkafrica.com. Upon cancellation:</p>
        <ul>
          <li><strong>Before work commences:</strong> A full refund of any payments made (excluding the initial deposit) will be issued within 14 business days.</li>
          <li><strong>After work commences:</strong> A refund of payments for uncompleted, unstarted milestones will be considered. Payments for completed or in-progress milestones are non-refundable.</li>
          <li><strong>Mid-milestone cancellation:</strong> A fair valuation of work completed to the cancellation date will be retained; any overpayment will be refunded within 30 business days.</li>
        </ul>

        <h2>5. Hosting & Managed Services</h2>
        <p>For recurring hosting, cloud management, and managed IT service subscriptions:</p>
        <ul>
          <li>Monthly subscription fees are non-refundable once the billing cycle has commenced.</li>
          <li>Annual plan subscribers who cancel within the first 30 days of the initial subscription (not renewal) may receive a pro-rated refund for unused months, minus a 10% administrative fee.</li>
          <li>Cancellations after 30 days of an annual plan will not attract a refund for the remaining term.</li>
          <li>Domain registration fees are non-refundable once the domain has been registered with the registry.</li>
          <li>SSL certificate fees are non-refundable after issuance.</li>
        </ul>

        <h2>6. SaaS and Software Licences</h2>
        <p>For software-as-a-service (SaaS) products and platform licences provided by iTech Network Africa:</p>
        <ul>
          <li>A 14-day free trial or evaluation period is available on selected products. No charges apply during the trial.</li>
          <li>After the trial period, subscription charges are non-refundable once the billing cycle has commenced.</li>
          <li>If a product is discontinued by iTech Network Africa, a pro-rated refund for the unused subscription period will be issued automatically.</li>
        </ul>

        <h2>7. Digital Products and Downloads</h2>
        <p>Due to the intangible nature of digital products (including templates, code packages, design assets, and digital reports), all sales are final once access has been granted or a download link has been delivered. Exceptions will only be considered if the product is materially different from its description.</p>

        <h2>8. Training and Workshops</h2>
        <p>For scheduled training sessions, workshops, and capacity-building programmes:</p>
        <ul>
          <li>Cancellations made more than 5 business days before the scheduled date are eligible for a full refund or rescheduling at no charge.</li>
          <li>Cancellations within 5 business days of the scheduled date are subject to a 50% cancellation fee.</li>
          <li>No-shows and same-day cancellations are non-refundable.</li>
        </ul>

        <h2>9. Service Failures and Credits</h2>
        <p>Where iTech Network Africa fails to meet the uptime or performance guarantees specified in a signed SLA, affected clients may be eligible for service credits applied to future invoices. Monetary refunds for SLA breaches are governed by the terms of the individual SLA agreement.</p>

        <h2>10. Refund Process</h2>
        <p>To request a refund, please follow these steps:</p>
        <ol>
          <li>Submit your request in writing to <a href="mailto:support@itechnetworkafrica.com">support@itechnetworkafrica.com</a> within the applicable eligibility window.</li>
          <li>Include your full name, company name, invoice number(s), and a clear explanation of the reason for your refund request.</li>
          <li>Our billing team will acknowledge your request within 3 business days.</li>
          <li>Approved refunds will be processed within 14 business days via the original payment method where possible.</li>
          <li>For international transactions, currency exchange rates at the time of the original payment will apply.</li>
        </ol>

        <h2>11. Disputes</h2>
        <p>We strive to resolve all refund disputes amicably. If you are unsatisfied with our decision, you may escalate to our management team at <a href="mailto:legal@itechnetworkafrica.com">legal@itechnetworkafrica.com</a>. Unresolved disputes may be referred to binding arbitration as outlined in our Terms and Conditions.</p>

        <h2>12. Contact Us</h2>
        <p>For refund requests, billing queries, or further information, please contact us:</p>
        <ul>
          <li><strong>Email:</strong> <a href="mailto:support@itechnetworkafrica.com">support@itechnetworkafrica.com</a></li>
          <li><strong>Phone:</strong> +231 761 978 796</li>
          <li><strong>WhatsApp:</strong> <a href="https://wa.me/231761978796" target="_blank" rel="noopener noreferrer">wa.me/231761978796</a></li>
        </ul>
      </section>
    </div>
  );
}
