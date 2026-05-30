import { Link } from "wouter";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Introduction</h2>
        <p>
          At LoveZone, we take your privacy and discretion extremely seriously. This Privacy Policy outlines how we collect, use, and protect your personal information when you use our website and services.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Information We Collect</h2>
        <p>
          We only collect the minimum amount of information necessary to provide our services effectively:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Contact information provided during booking inquiries (phone number or email).</li>
          <li>Location preferences to match you with appropriate profiles.</li>
          <li>Basic usage data to improve our website experience.</li>
        </ul>
        <p>
          We do not require account creation or mandatory registration to browse our public directory.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. How We Use Your Information</h2>
        <p>Your information is used strictly for:</p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Facilitating contact between you and your chosen companion.</li>
          <li>Customer support and service coordination.</li>
          <li>Ensuring safety and security for all parties involved.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Discretion and Confidentiality</h2>
        <p>
          Discretion is the cornerstone of our business. We guarantee that:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Your inquiries are kept strictly confidential.</li>
          <li>We never sell, rent, or trade your personal information to third parties.</li>
          <li>Communication history is regularly purged.</li>
          <li>We employ security measures to protect against unauthorized access.</li>
        </ul>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Third-Party Links</h2>
        <p>
          Our website may contain links to external sites. We are not responsible for the privacy practices or content of these external sites.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Contact Us</h2>
        <p>
          If you have any questions or concerns regarding our privacy practices, please contact us via our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.
        </p>
      </div>
    </div>
  );
}