import { Link } from "wouter";

export default function Terms() {
  return (
    <div className="container mx-auto px-4 py-16 max-w-4xl">
      <div className="mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">Terms and Conditions</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>
      </div>

      <div className="prose prose-invert max-w-none text-muted-foreground">
        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">1. Acceptance of Terms</h2>
        <p>
          By accessing and using LoveZone, you confirm that you are at least 18 years of age and agree to be bound by these Terms and Conditions. If you do not agree with any part of these terms, you must not use our website or services.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">2. Age Restriction</h2>
        <p>
          Our services are strictly limited to individuals who are 18 years of age or older. By using this website, you represent and warrant that you meet this age requirement.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">3. Nature of Services</h2>
        <p>
          LoveZone operates as an advertising directory and booking platform for independent companions. We act as a facilitator to connect consenting adults. All interactions and arrangements are strictly between the client and the companion.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">4. Code of Conduct</h2>
        <p>
          When interacting with companions listed on our site, you agree to:
        </p>
        <ul className="list-disc pl-6 space-y-2 my-4">
          <li>Treat all companions with respect and courtesy.</li>
          <li>Refrain from any abusive, aggressive, or inappropriate behavior.</li>
          <li>Respect the boundaries and limits set by the companion.</li>
          <li>Ensure a safe and secure environment for any meetings.</li>
        </ul>
        <p>Companions reserve the right to refuse service or terminate a meeting at any time if they feel uncomfortable or unsafe.</p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">5. Legal Compliance</h2>
        <p>
          Users agree to comply with all applicable local, state, and national laws regarding their use of our services. Our platform must not be used for any illegal activities.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">6. Disclaimer of Liability</h2>
        <p>
          LoveZone acts solely as a directory. We are not responsible for any incidents, disputes, or damages that may arise from meetings arranged through our platform. Users assume all risks associated with their interactions.
        </p>

        <h2 className="text-2xl font-semibold text-foreground mt-8 mb-4">7. Contact Information</h2>
        <p>
          For any questions regarding these terms, please reach out via our <Link href="/contact" className="text-primary hover:underline">Contact Page</Link>.
        </p>
      </div>
    </div>
  );
}