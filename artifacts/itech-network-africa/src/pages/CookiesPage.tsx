import React from 'react';
import { PageHero } from '@/components/PageHero';

export default function CookiesPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Cookies Policy" subtitle="Last Updated: January 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">
        <h2>What Are Cookies</h2>
        <p>As is common practice with almost all professional websites, this site uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it and why we sometimes need to store these cookies.</p>
        
        <h2>How We Use Cookies</h2>
        <p>We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site.</p>

        <h2>The Cookies We Set</h2>
        <ul>
          <li><strong>Account related cookies:</strong> If you create an account with us, we will use cookies for the management of the signup process and general administration.</li>
          <li><strong>Login related cookies:</strong> We use cookies when you are logged in so that we can remember this fact.</li>
          <li><strong>Site preferences cookies:</strong> In order to provide you with a great experience on this site, we provide the functionality to set your preferences.</li>
        </ul>

        <h2>Third Party Cookies</h2>
        <p>In some special cases, we also use cookies provided by trusted third parties (e.g., Google Analytics for traffic analysis). We do not use third-party tracking cookies for cross-site advertising.</p>

        <h2>Managing Cookies</h2>
        <p>You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit.</p>
      </section>
    </div>
  );
}
