import { useParams, Link } from "wouter";
import { Phone, MapPin, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listing/ListingCard";
import { 
  useGetState, 
  getGetStateQueryKey,
  useListListings, 
  getListListingsQueryKey,
  useListCities,
  getListCitiesQueryKey,
  useGetSiteSettings 
} from "@workspace/api-client-react";

export default function StatePage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: state, isLoading: loadingState } = useGetState(slug || "", {
    query: { enabled: !!slug, queryKey: getGetStateQueryKey(slug || "") }
  });
  
  const { data: listings, isLoading: loadingListings } = useListListings(
    { stateSlug: slug }, 
    { query: { enabled: !!slug, queryKey: getListListingsQueryKey({ stateSlug: slug }) } }
  );
  
  const { data: cities, isLoading: loadingCities } = useListCities(
    { stateSlug: slug },
    { query: { enabled: !!slug, queryKey: getListCitiesQueryKey({ stateSlug: slug }) } }
  );

  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";

  if (loadingState) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  }

  if (!state) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">State not found</h1>
        <Button asChild><Link href="/states">Back to States</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* State Hero */}
      <section className="bg-card border-b border-border/50 py-16">
        <div className="container mx-auto px-4 text-center">
          <Badge className="mb-4">State</Badge>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Male Escorts in {state.name}
          </h1>
          {state.description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {state.description}
            </p>
          )}
          <div className="flex justify-center">
            <Button asChild size="lg" className="font-bold text-lg rounded-full">
              <a href={`tel:${phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> Book Now: {phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Cities in State */}
      {!loadingCities && cities && cities.length > 0 && (
        <section className="py-12 bg-background border-b border-border/50">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold text-foreground mb-6 flex items-center">
              <MapPin className="mr-2 text-primary h-6 w-6" /> Cities in {state.name}
            </h2>
            <div className="flex flex-wrap gap-3">
              {cities.map(city => (
                <Link 
                  key={city.id} 
                  href={`/city/${city.slug}`}
                  className="inline-flex items-center px-4 py-2 bg-card hover:bg-primary/10 border border-border hover:border-primary/50 rounded-full text-sm font-medium transition-colors"
                >
                  {city.name}
                  <Badge variant="secondary" className="ml-2 text-[10px] h-5 px-1.5 min-w-[20px] justify-center">
                    {city.listingCount}
                  </Badge>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Listings */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Available Profiles in {state.name}
          </h2>
          
          {loadingListings ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4].map(i => (
               <div key={i} className="rounded-xl bg-card border border-border h-80 animate-pulse"></div>
             ))}
           </div>
          ) : listings?.data && listings.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {listings.data.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-card rounded-xl border border-border/50">
              <p className="text-xl text-muted-foreground mb-4">No profiles currently available in {state.name}.</p>
              <p className="text-muted-foreground mb-6">Check back later or explore other locations.</p>
              <Button asChild variant="outline">
                <Link href="/states">Explore Other States</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}