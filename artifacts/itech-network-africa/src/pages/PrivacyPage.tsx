import React from 'react';
import { PageHero } from '@/components/PageHero';

export default function PrivacyPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Privacy Policy" subtitle="Last Updated: January 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">
        <h2>1. Introduction</h2>
        <p>iTech Network Africa ("we," "our," or "us") respects your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website or use our software applications and services.</p>
        
        <h2>2. Information We Collect</h2>
        <p>We collect information that you voluntarily provide to us when you register for the Services, express an interest in obtaining information about us or our products, participate in activities on the Services, or contact us. This may include:</p>
        <ul>
          <li>Personal identification information (Name, Email, Phone number, Address)</li>
          <li>Business information (Company name, role, industry)</li>
          <li>Technical data (IP address, browser type, device information)</li>
        </ul>

        <h2>3. How We Use Your Information</h2>
        <p>We use the information we collect or receive:</p>
        <ul>
          <li>To facilitate account creation and logon process.</li>
          <li>To send administrative information to you.</li>
          <li>To fulfill and manage your orders, payments, and subscriptions.</li>
          <li>To deliver services to the user and respond to inquiries.</li>
        </ul>

        <h2>4. Data Security</h2>
        <p>We implement a variety of enterprise-grade security measures to maintain the safety of your personal information. We utilize AWS and Google Cloud infrastructure with AES-256 encryption at rest and TLS 1.3 in transit.</p>

        <h2>5. Your Privacy Rights</h2>
        <p>Depending on your location, you may have the right to request access to the personal information we collect from you, change that information, or delete it in some circumstances.</p>

        <h2>6. Contact Us</h2>
        <p>If you have questions or comments about this Privacy Policy, please contact our Data Protection Officer at privacy@itechnetworkafrica.com.</p>
      </section>
    </div>
  );
}
