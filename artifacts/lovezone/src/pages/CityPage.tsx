import { useParams, Link } from "wouter";
import { Phone, Map } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ListingCard } from "@/components/listing/ListingCard";
import { 
  useGetCity, 
  getGetCityQueryKey,
  useListListings, 
  getListListingsQueryKey,
  useGetSiteSettings 
} from "@workspace/api-client-react";

export default function CityPage() {
  const { slug } = useParams<{ slug: string }>();
  
  const { data: city, isLoading: loadingCity } = useGetCity(slug || "", {
    query: { enabled: !!slug, queryKey: getGetCityQueryKey(slug || "") }
  });
  
  const { data: listings, isLoading: loadingListings } = useListListings(
    { citySlug: slug }, 
    { query: { enabled: !!slug, queryKey: getListListingsQueryKey({ citySlug: slug }) } }
  );

  const { data: settings } = useGetSiteSettings();
  const phone = settings?.phoneNumber || "+91 8929364337";

  if (loadingCity) {
    return <div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-primary"></div></div>;
  }

  if (!city) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-3xl font-bold text-destructive mb-4">City not found</h1>
        <Button asChild><Link href="/cities">Back to Cities</Link></Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen pb-20">
      {/* City Hero */}
      <section className="bg-card border-b border-border/50 py-16 relative overflow-hidden">
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Link href={`/state/${city.stateSlug}`}>
              <Badge variant="outline" className="hover:bg-primary/10 hover:text-primary cursor-pointer border-border">
                <Map className="mr-1 h-3 w-3" /> {city.stateName}
              </Badge>
            </Link>
            <Badge className="bg-primary/20 text-primary border-primary/20">City</Badge>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Male Escorts in {city.name}
          </h1>
          
          {city.description && (
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto mb-8">
              {city.description}
            </p>
          )}
          
          <div className="flex justify-center mt-8">
            <Button asChild size="lg" className="font-bold text-lg rounded-full px-8">
              <a href={`tel:${phone.replace(/\D/g, "")}`}>
                <Phone className="mr-2 h-5 w-5" /> Book Now: {phone}
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Listings */}
      <section className="py-16 bg-background flex-1">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold text-foreground mb-8">
            Available Profiles in {city.name}
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
              <p className="text-xl text-muted-foreground mb-4">No profiles currently available in {city.name}.</p>
              <Button asChild variant="outline">
                <Link href={`/state/${city.stateSlug}`}>View all in {city.stateName}</Link>
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}