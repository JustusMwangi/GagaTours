import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Privacy Policy | Book With Sheilla",
  description:
    "How Book With Sheilla collects, uses, and protects your personal data under GDPR.",
};

export default function PrivacyPolicyPage() {
  return (
    <>
      {/* Hero */}
      <header className="pt-32 pb-20 px-6 md:px-12 max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-heading font-bold text-primary mb-6 tracking-tight">
          Privacy Policy
        </h1>
        <p className="text-on-surface-variant font-body text-lg max-w-2xl mx-auto leading-relaxed">
          Your privacy matters to us. This policy explains how Book With Sheilla
          collects, uses, and protects your personal data in compliance with the
          General Data Protection Regulation (GDPR).
        </p>
        <p className="text-on-surface-variant/60 text-sm mt-4">
          Last updated: 5 April 2026
        </p>
      </header>

      <div className="px-6 md:px-12 max-w-4xl mx-auto pb-24 space-y-16">
        {/* 1. Data Controller */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            1. Data Controller
          </h2>
          <div className="bg-surface-container-lowest p-8 rounded-xl border-l-4 border-secondary">
            <p className="text-on-surface-variant leading-relaxed font-body">
              <strong>Book With Sheilla</strong>
              <br />
              Operated by Sheilla Jepkemboi
              <br />
              Belgium
              <br />
              Email:{" "}
              <a href="mailto:hello@bookwithsheilla.com" className="text-primary underline">
                hello@bookwithsheilla.com
              </a>
            </p>
            <p className="text-on-surface-variant leading-relaxed font-body mt-4">
              For any privacy-related questions or to exercise your data rights, please
              contact us at the email address above or visit our{" "}
              <Link href="/data-rights" className="text-primary underline">
                Data Rights page
              </Link>.
            </p>
          </div>
        </section>

        {/* 2. Data We Collect */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            2. Data We Collect
          </h2>
          <div className="space-y-6">
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h3 className="font-semibold text-primary mb-2">Contact &amp; Booking Inquiries</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                When you submit a contact form or booking request, we collect: your name,
                email address, phone number (optional), travel dates, group size, special
                requests, and any message you provide.
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h3 className="font-semibold text-primary mb-2">Customer Records</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                When you become a customer, we may additionally collect: nationality,
                passport number (for travel arrangements), and postal address. Passport
                information is only collected when necessary for international travel
                logistics.
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h3 className="font-semibold text-primary mb-2">Newsletter Subscription</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                When you subscribe to our newsletter, we collect your email address.
              </p>
            </div>
            <div className="bg-surface-container-low p-6 rounded-xl">
              <h3 className="font-semibold text-primary mb-2">Technical Data</h3>
              <p className="text-sm text-on-surface-variant leading-relaxed">
                When you interact with our website, we collect minimal technical data
                through essential cookies (session management only). We record IP
                addresses and browser information when you submit forms, solely for
                consent record-keeping as required by GDPR.
              </p>
            </div>
          </div>
        </section>

        {/* 3. Purposes & Legal Basis */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            3. Purposes &amp; Legal Basis
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="text-left py-3 pr-4 font-semibold text-primary">Purpose</th>
                  <th className="text-left py-3 pr-4 font-semibold text-primary">Legal Basis (GDPR Art. 6)</th>
                </tr>
              </thead>
              <tbody className="text-on-surface-variant">
                <tr className="border-b border-outline-variant/30">
                  <td className="py-3 pr-4">Responding to contact inquiries</td>
                  <td className="py-3">Legitimate interest (Art. 6(1)(f))</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="py-3 pr-4">Processing booking requests</td>
                  <td className="py-3">Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="py-3 pr-4">Managing customer records &amp; travel logistics</td>
                  <td className="py-3">Performance of a contract (Art. 6(1)(b))</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="py-3 pr-4">Sending newsletters</td>
                  <td className="py-3">Consent (Art. 6(1)(a))</td>
                </tr>
                <tr className="border-b border-outline-variant/30">
                  <td className="py-3 pr-4">Financial record-keeping (invoices)</td>
                  <td className="py-3">Legal obligation (Art. 6(1)(c)) &mdash; Belgian accounting law</td>
                </tr>
                <tr>
                  <td className="py-3 pr-4">Consent record-keeping</td>
                  <td className="py-3">Legal obligation (Art. 6(1)(c)) &mdash; GDPR accountability</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        {/* 4. Data Recipients */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            4. Data Recipients &amp; Sub-processors
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            Your data is never sold to third parties. We share data only with the
            following service providers who process data on our behalf:
          </p>
          <div className="space-y-3">
            <div className="bg-surface-container-low p-5 rounded-xl flex items-start gap-4">
              <span className="text-secondary font-bold text-lg mt-0.5">1</span>
              <div>
                <p className="font-semibold text-primary text-sm">Amazon Web Services (AWS SES)</p>
                <p className="text-xs text-on-surface-variant">Email delivery &mdash; EU/US regions with Standard Contractual Clauses</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex items-start gap-4">
              <span className="text-secondary font-bold text-lg mt-0.5">2</span>
              <div>
                <p className="font-semibold text-primary text-sm">MinIO (Self-hosted)</p>
                <p className="text-xs text-on-surface-variant">File storage for tour images and documents &mdash; hosted on our own infrastructure</p>
              </div>
            </div>
            <div className="bg-surface-container-low p-5 rounded-xl flex items-start gap-4">
              <span className="text-secondary font-bold text-lg mt-0.5">3</span>
              <div>
                <p className="font-semibold text-primary text-sm">Safari lodges &amp; local partners</p>
                <p className="text-xs text-on-surface-variant">Name, nationality, and passport data shared only when required for travel arrangements, with your knowledge</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Data Retention */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            5. Data Retention
          </h2>
          <div className="space-y-3">
            {[
              { label: "Contact inquiries", period: "2 years after last activity" },
              { label: "Customer & booking records", period: "7 years (Belgian accounting law)" },
              { label: "Financial records (invoices, payments)", period: "7 years (Belgian accounting law)" },
              { label: "Newsletter subscriptions", period: "Until you unsubscribe" },
              { label: "Consent records", period: "Retained indefinitely as legal proof of consent" },
            ].map((item) => (
              <div key={item.label} className="flex justify-between items-center bg-surface-container-low p-4 rounded-xl text-sm">
                <span className="text-on-surface-variant">{item.label}</span>
                <span className="font-medium text-primary text-right ml-4">{item.period}</span>
              </div>
            ))}
          </div>
        </section>

        {/* 6. Your Rights */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            6. Your Rights Under GDPR
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-6">
            As a data subject, you have the following rights:
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[
              { title: "Right of Access", desc: "Request a copy of all personal data we hold about you." },
              { title: "Right to Rectification", desc: "Request correction of inaccurate personal data." },
              { title: "Right to Erasure", desc: "Request deletion of your personal data (subject to legal retention requirements)." },
              { title: "Right to Restrict Processing", desc: "Request that we limit how we use your data." },
              { title: "Right to Data Portability", desc: "Receive your data in a structured, machine-readable format." },
              { title: "Right to Object", desc: "Object to processing based on legitimate interest." },
            ].map((right) => (
              <div key={right.title} className="bg-surface-container-lowest p-5 rounded-xl border-l-4 border-secondary/40">
                <h4 className="font-semibold text-primary text-sm mb-1">{right.title}</h4>
                <p className="text-xs text-on-surface-variant leading-relaxed">{right.desc}</p>
              </div>
            ))}
          </div>
          <p className="text-on-surface-variant leading-relaxed">
            To exercise any of these rights, visit our{" "}
            <Link href="/data-rights" className="text-primary underline font-medium">
              Data Rights page
            </Link>{" "}
            or email us at{" "}
            <a href="mailto:hello@bookwithsheilla.com" className="text-primary underline">
              hello@bookwithsheilla.com
            </a>.
            We will respond within 30 days.
          </p>
        </section>

        {/* 7. Cookies */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            7. Cookies
          </h2>
          <p className="text-on-surface-variant leading-relaxed mb-4">
            We use only <strong>strictly necessary cookies</strong> for session management
            (keeping you logged in during your visit). We do not use any marketing,
            analytics, or third-party tracking cookies.
          </p>
          <p className="text-on-surface-variant leading-relaxed">
            Under Belgian law (transposing the ePrivacy Directive), strictly necessary
            cookies do not require consent. We inform you of their use via a banner
            on your first visit.
          </p>
        </section>

        {/* 8. International Transfers */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            8. International Data Transfers
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            Our servers are hosted in Germany (EU). Email delivery via AWS SES may
            involve data transfers to the United States, governed by Standard
            Contractual Clauses (SCCs) as approved by the European Commission.
            Safari partner data sharing is limited to what is strictly necessary
            for travel arrangements and is done with your knowledge.
          </p>
        </section>

        {/* 9. Complaints */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            9. Supervisory Authority
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            If you believe your data protection rights have been violated, you have the
            right to lodge a complaint with the Belgian Data Protection Authority:
          </p>
          <div className="bg-surface-container-low p-6 rounded-xl mt-4">
            <p className="text-on-surface-variant text-sm leading-relaxed">
              <strong>Autorit&eacute; de protection des donn&eacute;es (APD)</strong>
              <br />
              <strong>Gegevensbeschermingsautoriteit (GBA)</strong>
              <br />
              Rue de la Presse 35, 1000 Brussels, Belgium
              <br />
              Phone: +32 (0)2 274 48 00
              <br />
              Website:{" "}
              <a
                href="https://www.dataprotectionauthority.be"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline"
              >
                www.dataprotectionauthority.be
              </a>
            </p>
          </div>
        </section>

        {/* 10. Changes */}
        <section>
          <h2 className="text-2xl font-heading text-primary mb-4">
            10. Changes to This Policy
          </h2>
          <p className="text-on-surface-variant leading-relaxed">
            We may update this policy to reflect changes in our practices or legal
            requirements. Material changes will be communicated via a notice on our
            website. We encourage you to review this page periodically.
          </p>
        </section>

        {/* CTA */}
        <div className="bg-tertiary-container text-on-surface p-12 rounded-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="max-w-lg">
            <h3 className="text-3xl font-heading mb-4">
              Questions about your privacy?
            </h3>
            <p className="text-on-surface-variant">
              We&apos;re here to help. Reach out to us or exercise your data rights
              directly.
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/data-rights"
              className="bg-primary text-on-primary px-8 py-4 rounded-xl font-semibold shadow-xl hover:shadow-2xl transition-all whitespace-nowrap"
            >
              Data Rights
            </Link>
            <Link
              href="/contact"
              className="border-2 border-primary text-primary px-8 py-4 rounded-xl font-semibold hover:bg-primary/5 transition-all whitespace-nowrap"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
