import React from 'react';
import { PageHero } from '@/components/PageHero';

export default function TermsPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Terms & Conditions" subtitle="Last Updated: January 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">
        <h2>1. Agreement to Terms</h2>
        <p>These Terms and Conditions constitute a legally binding agreement made between you, whether personally or on behalf of an entity ("you") and iTech Network Africa ("we," "us" or "our"), concerning your access to and use of the website and enterprise software services.</p>
        
        <h2>2. Intellectual Property Rights</h2>
        <p>Unless otherwise indicated, the Site and Software are our proprietary property and all source code, databases, functionality, software, website designs, audio, video, text, photographs, and graphics on the Site (collectively, the "Content") and the trademarks, service marks, and logos contained therein are owned or controlled by us or licensed to us.</p>

        <h2>3. User Representations</h2>
        <p>By using the Site or Services, you represent and warrant that: (1) all registration information you submit will be true, accurate, current, and complete; (2) you will maintain the accuracy of such information; (3) you have the legal capacity and you agree to comply with these Terms.</p>

        <h2>4. Prohibited Activities</h2>
        <p>You may not access or use the Site for any purpose other than that for which we make the Site available. The Site may not be used in connection with any commercial endeavors except those that are specifically endorsed or approved by us.</p>

        <h2>5. Software Service Level Agreements (SLAs)</h2>
        <p>Specific enterprise software deployments are governed by individual Service Level Agreements (SLAs) signed during the procurement phase. In the event of a conflict between these general terms and an enterprise SLA, the SLA shall take precedence.</p>
      </section>
    </div>
  );
}
