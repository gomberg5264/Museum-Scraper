import React, { useState } from "react";
import { useGetMuseums, getGetMuseumsQueryKey, GetMuseumsBorough } from "@workspace/api-client-react";
import { useDebounce } from "@/hooks/use-debounce";
import { Search, Map, FilterX } from "lucide-react";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { StatsBar } from "@/components/stats-bar";
import { MuseumCard, MuseumCardSkeleton } from "@/components/museum-card";

export function Home() {
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 300);
  
  const [borough, setBorough] = useState<GetMuseumsBorough | "All">("All");
  const [openNow, setOpenNow] = useState(false);
  const [category, setCategory] = useState<string>("All");

  // Query params
  const queryParams = {
    ...(borough !== "All" ? { borough: borough as GetMuseumsBorough } : {}),
    ...(openNow ? { openNow: true } : {}),
    ...(debouncedSearch ? { search: debouncedSearch } : {}),
  };

  const { data: museums, isLoading } = useGetMuseums(queryParams, {
    query: {
      queryKey: getGetMuseumsQueryKey(queryParams),
    }
  });

  // Unique categories derived from museums if we wanted to dynamically list them, 
  // but let's hardcode the main ones based on spec
  const categories = ["All", "art", "history", "science", "natural history", "specialty", "children"];

  // Client-side category filtering since API doesn't support category param
  const filteredMuseums = React.useMemo(() => {
    if (!museums) return [];
    if (category === "All") return museums;
    return museums.filter(m => m.category.toLowerCase() === category.toLowerCase());
  }, [museums, category]);

  const clearFilters = () => {
    setSearch("");
    setBorough("All");
    setOpenNow(false);
    setCategory("All");
  };

  return (
    <div className="w-full flex flex-col">
      {/* Hero Section */}
      <section className="relative w-full py-20 md:py-32 bg-primary/5 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent pointer-events-none" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-6xl font-serif font-bold text-foreground leading-tight tracking-tight mb-6">
              The Definitive Guide to NYC's Cultural Institutions.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl">
              From the iconic halls of the Met to hidden galleries in Brooklyn, discover every major museum in New York City with real-time hours, admission details, and locations.
            </p>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search museums..."
                  className="pl-10 h-12 text-base bg-background/80 backdrop-blur-sm border-primary/20 focus-visible:ring-primary"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 w-full">
        <StatsBar />

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-6 mt-8 mb-10 p-6 bg-card rounded-xl border border-border shadow-sm">
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Borough</Label>
              <Select value={borough} onValueChange={(v: any) => setBorough(v)}>
                <SelectTrigger>
                  <SelectValue placeholder="All Boroughs" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Boroughs</SelectItem>
                  {Object.values(GetMuseumsBorough).map((b) => (
                    <SelectItem key={b} value={b}>{b}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Category</Label>
              <Select value={category} onValueChange={setCategory}>
                <SelectTrigger className="capitalize">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((c) => (
                    <SelectItem key={c} value={c} className="capitalize">{c}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2 pt-6">
              <Switch 
                id="open-now" 
                checked={openNow} 
                onCheckedChange={setOpenNow}
                className="data-[state=checked]:bg-green-600"
              />
              <Label htmlFor="open-now" className="font-medium cursor-pointer">Open Right Now</Label>
            </div>
          </div>

          <div className="flex items-end pt-2 md:pt-0">
            <Button variant="ghost" onClick={clearFilters} className="text-muted-foreground w-full md:w-auto">
              <FilterX className="w-4 h-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </div>

        {/* Results */}
        <div className="mb-6 flex justify-between items-end">
          <h2 className="text-2xl font-serif font-semibold">
            {isLoading ? "Finding museums..." : `${filteredMuseums.length} Museum${filteredMuseums.length === 1 ? '' : 's'} Found`}
          </h2>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <MuseumCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredMuseums.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMuseums.map((museum) => (
              <MuseumCard key={museum.id} museum={museum} />
            ))}
          </div>
        ) : (
          <div className="py-24 text-center flex flex-col items-center bg-muted/20 rounded-2xl border border-dashed border-border">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center text-muted-foreground mb-4">
              <Map className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-serif font-semibold text-foreground mb-2">No museums found</h3>
            <p className="text-muted-foreground max-w-md mx-auto mb-6">
              We couldn't find any museums matching your current filters. Try adjusting your search or clearing the filters to see more results.
            </p>
            <Button onClick={clearFilters} variant="outline">
              Clear All Filters
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}
