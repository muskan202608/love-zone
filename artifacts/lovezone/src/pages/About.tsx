import { ShieldCheck, Heart, Clock, Star, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useGetSiteSettings } from "@workspace/api-client-react";

export default function About() {
  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";
  const whatsapp = settings?.whatsappNumber || "+91 8929364337";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="bg-card border-b border-border/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            About <span className="text-primary">LoveZone</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            India's most trusted and premium directory for verified male escorts. 
            We connect you with genuine, professional companions for unforgettable experiences.
          </p>
        </div>
      </section>

      {/* Mission & Values */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-4 max-w-5xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
              <p className="text-muted-foreground mb-4 leading-relaxed">
                At LoveZone, our mission is to provide a safe, reliable, and premium platform for individuals seeking companionship. We understand the importance of discretion, trust, and quality in this industry.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                We've built our reputation on rigorous verification processes and uncompromising standards, ensuring that every profile on our platform represents a genuine professional committed to providing exceptional service.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border border-border/50">
                <ShieldCheck className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Safety First</h3>
                <p className="text-sm text-muted-foreground">Rigorous verification for all profiles.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border/50">
                <Heart className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">Premium Quality</h3>
                <p className="text-sm text-muted-foreground">Only the best, most professional companions.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border/50">
                <Clock className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">24/7 Availability</h3>
                <p className="text-sm text-muted-foreground">Companions available around the clock.</p>
              </div>
              <div className="bg-card p-6 rounded-xl border border-border/50">
                <Star className="h-8 w-8 text-primary mb-4" />
                <h3 className="font-bold text-lg mb-2">100% Discreet</h3>
                <p className="text-sm text-muted-foreground">Your privacy is completely protected.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-card border-t border-border/50 text-center">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-6">Ready to find your perfect match?</h2>
          <p className="text-muted-foreground mb-10 max-w-2xl mx-auto">
            Our team is available to help you find exactly what you're looking for. Contact us today for personalized recommendations.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="font-bold text-lg h-14 px-8 rounded-full">
              <a href={`tel:${phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> Call {phone}
              </a>
            </Button>
            <Button asChild variant="outline" size="lg" className="font-bold text-lg h-14 px-8 rounded-full border-[#25D366]/50 text-[#25D366] hover:bg-[#25D366]/10">
              <a href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`} target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-5 w-5" /> WhatsApp Us
              </a>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}