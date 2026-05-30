import { Link } from "wouter";
import { Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useListStates } from "@workspace/api-client-react";

export default function States() {
  const { data: states, isLoading } = useListStates();

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center">
          <Map className="mr-3 h-10 w-10 text-primary" />
          States in India
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Browse premium male escorts across all states in India. Select a state to view available cities and profiles.
        </p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-24 bg-card border border-border rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : states?.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <p className="text-xl text-muted-foreground">No states found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {states?.map((state) => (
            <Link 
              key={state.id} 
              href={`/state/${state.slug}`}
              className="group relative flex flex-col justify-center p-6 bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-xl transition-all overflow-hidden"
            >
              <div className="absolute right-0 top-0 h-full w-1 bg-primary transform scale-y-0 group-hover:scale-y-100 transition-transform origin-bottom duration-300"></div>
              <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition-colors mb-2">
                {state.name}
              </h3>
              <div className="flex items-center text-sm text-muted-foreground">
                <Badge variant="secondary" className="mr-2 bg-muted text-foreground group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {state.listingCount}
                </Badge>
                Profiles available
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}