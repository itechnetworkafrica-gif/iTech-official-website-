import React from 'react';
import { PageHero } from '@/components/PageHero';

export default function CookiesPage() {
  return (
    <div className="flex flex-col w-full bg-white">
      <PageHero badge="Legal" title="Cookies Policy" subtitle="Last Updated: July 2026" />
      <section className="py-20 max-w-4xl mx-auto px-6 w-full prose prose-green max-w-none text-[#111827]">
        <h2>1. What Are Cookies?</h2>
        <p>Cookies are small text files that are placed on your device (computer, smartphone, or tablet) by websites you visit. They are widely used by website owners to make websites work more efficiently, provide a better user experience, and deliver reporting information.</p>
        <p>This Cookies Policy explains how iTech Network Africa uses cookies and similar tracking technologies on our website and services. By using our website, you consent to our use of cookies as described in this policy.</p>

        <h2>2. Types of Cookies We Use</h2>
        <p>We use the following categories of cookies:</p>

        <h3>2.1 Strictly Necessary Cookies</h3>
        <p>These cookies are essential for the website to function properly and cannot be switched off. They are usually set in response to actions you take, such as logging in or filling in forms.</p>
        <ul>
          <li><strong>Session cookies:</strong> Temporary cookies that expire when you close your browser. They enable navigation and form submissions across our site.</li>
          <li><strong>Security cookies:</strong> Used to detect authentication abuse and protect against cross-site request forgery (CSRF) attacks.</li>
          <li><strong>Load balancing cookies:</strong> Ensure consistent performance by directing requests to available servers.</li>
        </ul>

        <h3>2.2 Performance and Analytics Cookies</h3>
        <p>These cookies allow us to measure and improve the performance of our website by collecting information about how visitors use it.</p>
        <ul>
          <li><strong>Google Analytics:</strong> We use Google Analytics to understand how visitors interact with our site, track page views, session duration, and bounce rates. This data is anonymised and aggregated.</li>
          <li><strong>Hotjar:</strong> May be used to record session heatmaps and identify usability improvements. Personal data is anonymised.</li>
        </ul>

        <h3>2.3 Functionality Cookies</h3>
        <p>These cookies enable enhanced functionality and personalisation.</p>
        <ul>
          <li><strong>Language and region preferences:</strong> Remember your selected language or regional settings.</li>
          <li><strong>Theme preferences:</strong> Store your display preferences, such as dark or light mode.</li>
          <li><strong>Account related cookies:</strong> If you have a client portal account, we use cookies to manage your login session and remember your preferences between visits.</li>
        </ul>

        <h3>2.4 Targeting and Marketing Cookies</h3>
        <p>We may use these cookies to deliver relevant content and advertising, and to measure the effectiveness of marketing campaigns. We do not use third-party tracking cookies for cross-site advertising without your explicit consent.</p>
        <ul>
          <li><strong>LinkedIn Insight Tag:</strong> Used to track conversions from LinkedIn campaigns and build audience segments.</li>
          <li><strong>Google Ads:</strong> Used to measure the effectiveness of advertising and show relevant ads on partner networks.</li>
        </ul>

        <h2>3. How Long Cookies Last</h2>
        <p>Cookies can be either:</p>
        <ul>
          <li><strong>Session Cookies:</strong> These are temporary and are deleted from your device when you close your browser.</li>
          <li><strong>Persistent Cookies:</strong> These remain on your device for a set period (e.g., 1 year) or until you manually delete them. They allow us to recognise you on return visits.</li>
        </ul>

        <h2>4. Third-Party Cookies</h2>
        <p>Some pages on our website may include content from third parties (such as embedded videos or social media widgets), which may set their own cookies. We have no control over these third-party cookies and recommend reviewing the respective privacy and cookie policies of those third parties. Common third-party cookies may come from:</p>
        <ul>
          <li>Google (Analytics, Ads, Maps)</li>
          <li>LinkedIn</li>
          <li>YouTube (embedded videos)</li>
          <li>Intercom or similar chat platforms</li>
        </ul>

        <h2>5. Your Cookie Choices</h2>
        <p>You have the right to choose whether to accept or reject cookies (except strictly necessary cookies). You can manage your cookie preferences in the following ways:</p>
        <ul>
          <li><strong>Browser settings:</strong> Most browsers allow you to view, manage, and delete cookies through your browser settings. Visit your browser's help section for instructions.</li>
          <li><strong>Opt-out tools:</strong> You can opt out of Google Analytics tracking at <a href="https://tools.google.com/dlpage/gaoptout" target="_blank" rel="noopener noreferrer">tools.google.com/dlpage/gaoptout</a>.</li>
          <li><strong>Do Not Track:</strong> We respect browser "Do Not Track" signals where technically feasible.</li>
        </ul>
        <p>Please note that disabling certain cookies may affect the functionality of our website and your user experience. Strictly necessary cookies cannot be disabled as they are essential for the site to function.</p>

        <h2>6. Updates to This Policy</h2>
        <p>We may update this Cookies Policy periodically to reflect changes in the cookies we use or for other operational, legal, or regulatory reasons. We encourage you to review this policy each time you visit our website. The "Last Updated" date at the top of this page indicates when this policy was last revised.</p>

        <h2>7. Contact Us</h2>
        <p>If you have any questions or concerns about our use of cookies or this policy, please contact us at:</p>
        <ul>
          <li><strong>Email:</strong> privacy@itechnetworkafrica.com</li>
          <li><strong>Phone:</strong> +231 761 978 796</li>
        </ul>
      </section>
    </div>
  );
}
