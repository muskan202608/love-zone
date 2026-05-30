import { Mail, Phone, MessageCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSiteSettings } from "@workspace/api-client-react";

export default function Contact() {
  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";
  const whatsapp = settings?.whatsappNumber || "+91 8929364337";
  const email = settings?.email || "contact@lovezone.in";

  return (
    <div className="min-h-screen bg-background">
      <section className="bg-card border-b border-border/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Contact <span className="text-primary">Us</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Have questions or need help booking? Our support team is available 24/7 to assist you with total discretion.
          </p>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-8">
            <div className="space-y-8">
              <h2 className="text-2xl font-bold text-foreground mb-6">Get in Touch</h2>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Phone Support</h3>
                  <p className="text-muted-foreground mb-3">Available 24/7 for instant bookings and queries.</p>
                  <a href={`tel:${phone.replace(/\D/g, "")}`} className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                    {phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-[#25D366]/10 flex items-center justify-center shrink-0">
                  <MessageCircle className="h-6 w-6 text-[#25D366]" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">WhatsApp</h3>
                  <p className="text-muted-foreground mb-3">Message us for quick replies and profile pictures.</p>
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer" className="text-xl font-bold text-foreground hover:text-[#25D366] transition-colors">
                    {whatsapp}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <Mail className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email</h3>
                  <p className="text-muted-foreground mb-3">For business inquiries and support.</p>
                  <a href={`mailto:${email}`} className="text-xl font-bold text-foreground hover:text-primary transition-colors">
                    {email}
                  </a>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center shrink-0">
                  <MapPin className="h-6 w-6 text-secondary-foreground" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Operating Across India</h3>
                  <p className="text-muted-foreground">
                    Providing premium services in all major cities including Mumbai, Delhi, Bangalore, Chennai, and more.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-card p-8 rounded-2xl border border-border/50 flex flex-col justify-center text-center">
              <h3 className="text-2xl font-bold mb-4">Fastest Way to Book</h3>
              <p className="text-muted-foreground mb-8">
                Call us directly or send a WhatsApp message to get instant access to available profiles in your city. We respect your privacy and ensure 100% confidentiality.
              </p>
              
              <div className="flex flex-col gap-4">
                <Button asChild size="lg" className="w-full h-14 font-bold text-lg">
                  <a href={`tel:${phone.replace(/\D/g, "")}`}>
                    <Phone className="mr-2 h-5 w-5" /> Call Now
                  </a>
                </Button>
                <Button asChild variant="outline" size="lg" className="w-full h-14 font-bold text-lg border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10">
                  <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                    <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}