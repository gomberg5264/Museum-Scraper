import React from "react";
import { useGetMuseumStats } from "@workspace/api-client-react";
import { MapPin, LibraryBig, Clock } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

export function StatsBar() {
  const { data: stats, isLoading } = useGetMuseumStats();

  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-y border-border/30">
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
        <Skeleton className="h-20 w-full rounded-md" />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-8 border-y border-border/30">
      <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          <LibraryBig className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Total Museums</p>
          <p className="text-2xl font-serif font-semibold">{stats.total}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
        <div className="p-3 bg-green-500/10 rounded-full text-green-600">
          <Clock className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">Open Right Now</p>
          <p className="text-2xl font-serif font-semibold">{stats.openNow}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-4 p-4 rounded-lg bg-card border border-border/50 shadow-sm">
        <div className="p-3 bg-blue-500/10 rounded-full text-blue-600">
          <MapPin className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">In Manhattan</p>
          <p className="text-2xl font-serif font-semibold">{stats.byBorough["Manhattan"] || 0}</p>
        </div>
      </div>
    </div>
  );
}
