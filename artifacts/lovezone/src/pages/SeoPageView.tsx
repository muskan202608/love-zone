import { useParams } from "wouter";
import { Link } from "wouter";
import { useGetSeoPage, getGetSeoPageQueryKey, useGetSiteSettings } from "@workspace/api-client-react";
import { Phone, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import NotFound from "@/pages/not-found";

export default function SeoPageView() {
  const { seoSlug } = useParams<{ seoSlug: string }>();
  
  const { data: page, isLoading, isError } = useGetSeoPage(seoSlug || "", {
    query: { enabled: !!seoSlug, queryKey: getGetSeoPageQueryKey(seoSlug || ""), retry: false }
  });

  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  }

  if (isError || !page || !page.isActive) {
    return <NotFound />;
  }

  // Parse FAQ
  let parsedFaq: Array<{q: string, a: string}> = [];
  if (page.faq) {
    try {
      parsedFaq = JSON.parse(page.faq);
    } catch (e) {
      console.error("Failed to parse FAQ JSON", e);
    }
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Hero Section */}
      <section className="bg-card border-b border-border/50 py-16 md:py-24">
        <div className="container mx-auto px-4 text-center max-w-4xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6">
            {page.h1Heading}
          </h1>
          <div className="flex justify-center mt-8">
            <Button asChild size="lg" className="font-bold text-lg rounded-full px-8 h-14">
              <a href={`tel:${phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> Call Now: {phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Content Section */}
      <section className="py-16 md:py-20 flex-1">
        <div className="container mx-auto px-4 max-w-4xl">
          <div 
            className="prose prose-invert prose-lg max-w-none text-muted-foreground
              prose-headings:text-foreground prose-headings:font-bold
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-foreground
              prose-p:leading-relaxed"
            dangerouslySetInnerHTML={{ 
              __html: page.content.replace(/\n/g, '<br />')
            }}
          />

          {/* Call to Action */}
          <div className="mt-16 bg-card border border-border/50 rounded-2xl p-8 text-center">
            <h3 className="text-2xl font-bold text-foreground mb-4">Looking for the perfect companion?</h3>
            <p className="text-muted-foreground mb-6">Browse our complete directory of verified profiles or contact our support team for recommendations.</p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Button asChild size="lg">
                <Link href="/listings">View All Profiles</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href={`tel:${phone.replace(/\D/g, "")}`}>Call Support</a>
              </Button>
            </div>
          </div>

          {/* FAQ Section */}
          {parsedFaq.length > 0 && (
            <div className="mt-20">
              <h2 className="text-3xl font-bold text-foreground mb-8 text-center">Frequently Asked Questions</h2>
              <Accordion type="single" collapsible className="w-full">
                {parsedFaq.map((item, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="border-border/50">
                    <AccordionTrigger className="text-left text-lg font-semibold hover:text-primary transition-colors">
                      {item.q}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground text-base leading-relaxed">
                      {item.a}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}