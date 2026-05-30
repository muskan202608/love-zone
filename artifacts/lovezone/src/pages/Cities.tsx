import { Link } from "wouter";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListCities } from "@workspace/api-client-react";

export default function Cities() {
  const { data: cities, isLoading } = useListCities();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center">
          <MapPin className="mr-3 h-10 w-10 text-primary" />
          Cities in India
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find top-rated male escorts in your city. Select a city to browse local profiles.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((i) => (
            <div key={i} className="h-20 bg-card border border-border rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : cities?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <p className="text-xl text-muted-foreground">No cities found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {cities?.map((city) => (
            <Link 
              key={city.id} 
              href={`/city/${city.slug}`}
              className="group flex flex-col justify-center p-5 bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors">
                  {city.name}
                </h3>
                <Badge variant="secondary" className="bg-muted group-hover:bg-primary/20 group-hover:text-primary">
                  {city.listingCount}
                </Badge>
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {city.stateName}
              </p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}