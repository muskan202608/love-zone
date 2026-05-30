import { useState } from "react";
import { Link } from "wouter";
import { Search, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ListingCard } from "@/components/listing/ListingCard";
import { useListListings, useListStates, useListCities } from "@workspace/api-client-react";

export default function Listings() {
  const [selectedState, setSelectedState] = useState<string>("all");
  const [selectedCity, setSelectedCity] = useState<string>("all");

  const { data: states } = useListStates();
  
  // Only fetch cities for selected state if one is selected
  const { data: cities } = useListCities(
    selectedState !== "all" ? { stateSlug: selectedState } : {}
  );

  const { data: listingsPage, isLoading } = useListListings({
    ...(selectedState !== "all" ? { stateSlug: selectedState } : {}),
    ...(selectedCity !== "all" ? { citySlug: selectedCity } : {}),
    limit: 50 // Get more on main page
  });

  const handleStateChange = (value: string) => {
    setSelectedState(value);
    setSelectedCity("all"); // Reset city when state changes
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Search Header */}
      <section className="bg-card border-b border-border/50 py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-6">Browse All Profiles</h1>
          
          <div className="bg-background border border-border p-4 rounded-xl flex flex-col md:flex-row gap-4 max-w-4xl">
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">State</label>
              <Select value={selectedState} onValueChange={handleStateChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All States" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All States</SelectItem>
                  {states?.map(state => (
                    <SelectItem key={state.id} value={state.slug}>{state.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex-1">
              <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2 block">City</label>
              <Select 
                value={selectedCity} 
                onValueChange={setSelectedCity}
                disabled={selectedState === "all"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder={selectedState === "all" ? "Select a state first" : "All Cities"} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities?.map(city => (
                    <SelectItem key={city.id} value={city.slug}>{city.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-end">
              <Button className="w-full md:w-auto h-10 px-8" variant="default">
                <Filter className="mr-2 h-4 w-4" /> Filter
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-12 bg-background flex-1">
        <div className="container mx-auto px-4">
          <div className="mb-6 flex justify-between items-end">
            <p className="text-muted-foreground font-medium">
              Showing <span className="text-foreground">{listingsPage?.data.length || 0}</span> profiles
            </p>
          </div>

          {isLoading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
             {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
               <div key={i} className="rounded-xl bg-card border border-border h-80 animate-pulse"></div>
             ))}
           </div>
          ) : listingsPage?.data && listingsPage.data.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {listingsPage.data.map(listing => (
                <ListingCard key={listing.id} listing={listing} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card rounded-xl border border-border/50 max-w-2xl mx-auto">
              <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-2xl font-bold text-foreground mb-2">No profiles found</p>
              <p className="text-muted-foreground mb-6">Try adjusting your filters to see more results.</p>
              <Button onClick={() => { setSelectedState("all"); setSelectedCity("all"); }} variant="outline">
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}