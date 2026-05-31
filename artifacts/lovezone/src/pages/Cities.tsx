import { useState, useCallback } from "react";
import { Link } from "wouter";
import { MapPin, Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useListCities, useListStates } from "@workspace/api-client-react";

const PAGE_SIZE = 120;

export default function Cities() {
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [stateFilter, setStateFilter] = useState<string | undefined>(undefined);
  const [offset, setOffset] = useState(0);

  const { data: citiesPage, isLoading } = useListCities({
    search: search || undefined,
    stateSlug: stateFilter || undefined,
    limit: PAGE_SIZE,
    offset,
  });
  const { data: states } = useListStates();

  const cities = citiesPage?.data ?? [];
  const total = citiesPage?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);
  const currentPage = Math.floor(offset / PAGE_SIZE) + 1;

  const handleSearch = useCallback(() => {
    setSearch(searchInput);
    setOffset(0);
  }, [searchInput]);

  const handleStateFilter = (val: string) => {
    setStateFilter(val === "all" ? undefined : val);
    setOffset(0);
    setSearch("");
    setSearchInput("");
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 flex items-center justify-center">
          <MapPin className="mr-3 h-10 w-10 text-primary" />
          Cities in India
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Find top-rated male escorts in your city. Browse {total > 0 ? <span className="text-foreground font-semibold">{total.toLocaleString()}+</span> : ""} cities across all Indian states.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-8 max-w-2xl mx-auto">
        <div className="flex gap-2 flex-1">
          <Input
            placeholder="Search city name..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
          />
          <Button variant="outline" size="icon" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
        </div>
        <Select onValueChange={handleStateFilter} value={stateFilter ?? "all"}>
          <SelectTrigger className="w-full sm:w-[200px]">
            <SelectValue placeholder="All States" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All States</SelectItem>
            {states?.map(s => <SelectItem key={s.id} value={s.slug}>{s.name}</SelectItem>)}
          </SelectContent>
        </Select>
      </div>

      {search && (
        <p className="text-center text-sm text-muted-foreground mb-6">
          {total} result{total !== 1 ? "s" : ""} for "<span className="text-foreground">{search}</span>"
          <button className="ml-2 text-primary hover:underline" onClick={() => { setSearch(""); setSearchInput(""); setOffset(0); }}>Clear</button>
        </p>
      )}

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="h-20 bg-card border border-border rounded-lg animate-pulse"></div>
          ))}
        </div>
      ) : cities.length === 0 ? (
        <div className="text-center py-20 bg-card rounded-xl border border-border">
          <p className="text-xl text-muted-foreground">No cities found.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {cities.map((city) => (
              <Link
                key={city.id}
                href={`/city/${city.slug}`}
                className="group flex flex-col justify-center p-5 bg-card border border-border/50 hover:border-primary/50 hover:bg-primary/5 rounded-lg transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {city.name}
                  </h3>
                  {city.listingCount > 0 && (
                    <Badge variant="secondary" className="bg-muted group-hover:bg-primary/20 group-hover:text-primary shrink-0 ml-1">
                      {city.listingCount}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground font-medium truncate">{city.stateName}</p>
              </Link>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10">
              <Button variant="outline" disabled={offset === 0} onClick={() => { setOffset(Math.max(0, offset - PAGE_SIZE)); window.scrollTo(0,0); }}>
                ← Previous
              </Button>
              <span className="text-sm text-muted-foreground">Page {currentPage} of {totalPages}</span>
              <Button variant="outline" disabled={offset + PAGE_SIZE >= total} onClick={() => { setOffset(offset + PAGE_SIZE); window.scrollTo(0,0); }}>
                Next →
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
