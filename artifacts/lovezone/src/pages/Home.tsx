import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, MapPin, Map, Star, ShieldCheck, Heart, Phone } from "lucide-react";
import { ListingCard } from "@/components/listing/ListingCard";
import { useListListings, useGetDashboardStats, useListStates, useListCities, useGetSiteSettings } from "@workspace/api-client-react";

export default function Home() {
  const { data: stats } = useGetDashboardStats();
  const { data: featuredListings, isLoading: loadingFeatured } = useListListings({ featured: true, limit: 8 });
  const { data: states, isLoading: loadingStates } = useListStates();
  const { data: cities, isLoading: loadingCities } = useListCities();
  const { data: settings } = useGetSiteSettings();
  
  const phone = settings?.phoneNumber || "+91 8929364337";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-background pt-20 pb-32">
        <div className="absolute inset-0 bg-primary/5 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="container relative z-10 mx-auto px-4 text-center">
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-primary/30 px-3 py-1 text-sm rounded-full">
            India's #1 Trusted Directory
          </Badge>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6">
            Find Your Perfect <span className="text-primary">Companion</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
            Premium, verified male escorts across India. 100% genuine profiles, discreet service, and unforgettable experiences.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-lg mx-auto">
            <Button asChild size="lg" className="w-full sm:w-auto font-bold text-lg h-14 px-8 rounded-full">
              <Link href="/listings">
                <Search className="mr-2 h-5 w-5" /> Browse All Profiles
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto font-bold text-lg h-14 px-8 rounded-full border-primary/50 text-foreground hover:bg-primary/10">
              <a href={`tel:${phone.replace(/\D/g, "")}`}>
                Call {phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Bar */}
      <section className="border-y border-border/50 bg-card py-10">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-border/50">
            <div>
              <p className="text-4xl font-bold text-primary mb-1">{stats?.totalListings || "500+"}</p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Verified Profiles</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-1">{stats?.totalCities || "50+"}</p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Cities Covered</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-1">100%</p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Discreet Service</p>
            </div>
            <div>
              <p className="text-4xl font-bold text-primary mb-1">24/7</p>
              <p className="text-sm text-muted-foreground font-medium uppercase tracking-wider">Customer Support</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Profiles */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="text-3xl font-bold text-foreground flex items-center">
                <Star className="mr-3 h-8 w-8 text-primary" fill="currentColor" /> 
                Premium Profiles
              </h2>
              <p className="text-muted-foreground mt-2">Our most highly rated and verified companions</p>
            </div>
            <Button asChild variant="ghost" className="hidden sm:flex text-primary hover:text-primary hover:bg-primary/10">
              <Link href="/listings">View All</Link>
            </Button>
          </div>

          {loadingFeatured ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="rounded-xl bg-card border border-border h-80 animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredListings?.data?.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Button asChild variant="outline" className="w-full">
              <Link href="/listings">View All Profiles</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Browse by State */}
      <section className="py-20 bg-card border-y border-border/50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-10 flex items-center justify-center">
            <Map className="mr-3 h-8 w-8 text-primary" /> 
            Explore by State
          </h2>
          
          {loadingStates ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="h-20 bg-background border border-border rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {states?.slice(0, 12).map(state => (
                <Link key={state.id} href={`/state/${state.slug}`} className="flex items-center justify-between p-4 bg-background border border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all group">
                  <span className="font-semibold text-foreground group-hover:text-primary transition-colors">{state.name}</span>
                  <Badge variant="secondary" className="bg-muted text-muted-foreground group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                    {state.listingCount}
                  </Badge>
                </Link>
              ))}
            </div>
          )}
          
          <div className="mt-10 text-center">
            <Button asChild variant="outline" className="border-primary/50 hover:bg-primary/10">
              <Link href="/states">View All States</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Trust Signals */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">100% Verified</h3>
              <p className="text-muted-foreground">Every profile is manually checked and verified to ensure authenticity and safety.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                <Heart className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">Discreet Service</h3>
              <p className="text-muted-foreground">Your privacy is our top priority. We guarantee complete confidentiality in all interactions.</p>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card border border-border/50">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold mb-2">24/7 Support</h3>
              <p className="text-muted-foreground">Our dedicated support team is available round the clock to assist with your bookings.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

// Temporary workaround to use Badge in Home
function Badge({ className, children, ...props }: any) {
  return <span className={`inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 ${className}`} {...props}>{children}</span>;
}