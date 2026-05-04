import React, { useState } from "react";
import { useParams, Link } from "wouter";
import { 
  useGetMuseumById, 
  getGetMuseumByIdQueryKey, 
  useRefreshMuseumHours 
} from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { 
  ArrowLeft, 
  MapPin, 
  Phone, 
  Globe, 
  Clock, 
  RefreshCw,
  Ticket,
  Info,
  Train,
  Bus,
  Navigation,
  Map
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

const LINE_TEXT_COLORS: Record<string, string> = {
  "#FCCC0A": "#000000",
};

function SubwayBadge({ line, color }: { line: string; color: string }) {
  const textColor = LINE_TEXT_COLORS[color] ?? "#ffffff";
  return (
    <span
      data-testid={`subway-line-${line}`}
      style={{ backgroundColor: color, color: textColor }}
      className="inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold shrink-0 shadow-sm"
    >
      {line}
    </span>
  );
}

export function MuseumDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [mapLoaded, setMapLoaded] = useState(false);

  const { data: museum, isLoading, error } = useGetMuseumById(id || "", {
    query: {
      enabled: !!id,
      queryKey: getGetMuseumByIdQueryKey(id || ""),
    }
  });

  const refreshMutation = useRefreshMuseumHours({
    mutation: {
      onSuccess: (data) => {
        queryClient.setQueryData(getGetMuseumByIdQueryKey(id || ""), data);
        toast({
          title: "Hours updated",
          description: "Successfully fetched the latest hours from the museum's website.",
        });
      },
      onError: () => {
        toast({
          title: "Update failed",
          description: "Could not refresh hours at this time. Please try again later.",
          variant: "destructive",
        });
      }
    }
  });

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-12">
        <Skeleton className="h-6 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-60 w-full" />
            <Skeleton className="h-80 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
            <Skeleton className="h-48 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (error || !museum) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-serif mb-4">Museum not found</h2>
        <p className="text-muted-foreground mb-8">The museum you're looking for doesn't exist or there was an error loading it.</p>
        <Button asChild>
          <Link href="/">Back to Directory</Link>
        </Button>
      </div>
    );
  }

  const days = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"] as const;
  const todayName = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();

  const mapsQuery = encodeURIComponent(`${museum.name} ${museum.address} NYC`);
  const embedUrl = `https://maps.google.com/maps?q=${mapsQuery}&output=embed&z=16`;
  const transitDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(museum.address + " New York, NY")}&travelmode=transit`;
  const drivingDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(museum.address + " New York, NY")}&travelmode=driving`;

  return (
    <div className="w-full pb-20">
      {/* Header Banner */}
      <div className="bg-primary/5 border-b border-border/40 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6" data-testid="link-back">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Directory
          </Link>
          
          <div className="flex flex-wrap gap-3 mb-4">
            <Badge variant="secondary" className="capitalize text-sm px-3 py-1 bg-background">
              {museum.category}
            </Badge>
            {museum.isOpenNow !== undefined && (
              <Badge 
                variant={museum.isOpenNow ? "default" : "secondary"}
                className={museum.isOpenNow ? "bg-green-600 px-3 py-1" : "px-3 py-1"}
                data-testid="badge-open-status"
              >
                {museum.isOpenNow ? "Open Now" : "Closed"}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight mb-4" data-testid="heading-museum-name">
            {museum.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{museum.neighborhood ? `${museum.neighborhood}, ` : ""}{museum.borough}</span>
            </div>
            {museum.todayHours && (
              <div className="flex items-center gap-2">
                <Clock className="w-5 h-5 text-primary" />
                <span>Today: {museum.todayHours}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-10">
            {museum.description && (
              <section>
                <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center gap-2">
                  <Info className="w-5 h-5 text-primary" />
                  About
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">{museum.description}</p>
              </section>
            )}

            {/* Hours */}
            <section className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-serif font-semibold flex items-center gap-2">
                  <Clock className="w-5 h-5 text-primary" />
                  Hours
                </h2>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => refreshMutation.mutate({ id: museum.id })}
                  disabled={refreshMutation.isPending}
                  data-testid="button-refresh-hours"
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {museum.hours ? (
                <div className="space-y-1" data-testid="table-hours">
                  {days.map((day) => {
                    const dayHours = museum.hours?.[day];
                    const isToday = todayName === day;
                    return (
                      <div 
                        key={day} 
                        className={`flex justify-between py-3 px-4 rounded-lg ${isToday ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}
                        data-testid={`row-hours-${day}`}
                      >
                        <span className={`capitalize font-medium ${isToday ? 'text-primary' : 'text-foreground'}`}>
                          {day} {isToday && "(Today)"}
                        </span>
                        <span className="text-muted-foreground text-right">
                          {dayHours?.closed 
                            ? "Closed" 
                            : (dayHours?.open && dayHours?.close) 
                              ? `${dayHours.open} – ${dayHours.close}` 
                              : "Hours unknown"}
                        </span>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-muted-foreground italic p-4 bg-muted/30 rounded-lg">Detailed hours not available.</p>
              )}

              {museum.hoursNote && (
                <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg text-sm text-amber-800 dark:text-amber-300">
                  <p><strong>Note:</strong> {museum.hoursNote}</p>
                </div>
              )}
              
              {museum.lastScraped && (
                <p className="text-xs text-muted-foreground mt-4 text-right">
                  Last verified: {new Date(museum.lastScraped).toLocaleDateString()}
                </p>
              )}
            </section>

            {/* Transit */}
            {museum.transit && (
              <section className="bg-card rounded-xl p-6 md:p-8 border border-border shadow-sm" data-testid="section-transit">
                <h2 className="text-2xl font-serif font-semibold mb-6 flex items-center gap-2">
                  <Train className="w-5 h-5 text-primary" />
                  Getting Here by Transit
                </h2>

                <div className="space-y-5 mb-6">
                  {museum.transit.stations?.map((station, i) => (
                    <div key={i} className="flex items-start gap-4" data-testid={`transit-station-${i}`}>
                      <div className="flex flex-wrap gap-1.5 shrink-0 pt-0.5">
                        {station.lines?.map((l, j) => (
                          <SubwayBadge key={j} line={l.line} color={l.color} />
                        ))}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{station.name}</p>
                        <p className="text-sm text-muted-foreground">
                          ~{station.walkMinutes} min walk
                          {station.note ? ` · ${station.note}` : ""}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                {museum.transit.busRoutes && museum.transit.busRoutes.length > 0 && (
                  <div className="flex items-start gap-3 pt-5 border-t border-border">
                    <Bus className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground mb-2">Nearby Bus Routes</p>
                      <div className="flex flex-wrap gap-2">
                        {museum.transit.busRoutes.map((route) => (
                          <span key={route} className="px-2.5 py-1 bg-muted rounded-md text-sm font-medium text-muted-foreground" data-testid={`bus-route-${route}`}>
                            {route}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {museum.transit.parkingNote && (
                  <div className="mt-5 pt-5 border-t border-border flex items-start gap-3 text-sm text-muted-foreground">
                    <Navigation className="w-4 h-4 shrink-0 mt-0.5 text-primary" />
                    <p>{museum.transit.parkingNote}</p>
                  </div>
                )}

                <div className="flex flex-wrap gap-3 mt-6 pt-5 border-t border-border">
                  <Button asChild data-testid="button-transit-directions">
                    <a href={transitDirectionsUrl} target="_blank" rel="noreferrer">
                      <Train className="w-4 h-4 mr-2" />
                      Transit Directions
                    </a>
                  </Button>
                  <Button variant="outline" asChild data-testid="button-driving-directions">
                    <a href={drivingDirectionsUrl} target="_blank" rel="noreferrer">
                      <Navigation className="w-4 h-4 mr-2" />
                      Driving Directions
                    </a>
                  </Button>
                </div>
              </section>
            )}

            {/* Map Embed */}
            <section data-testid="section-map">
              <h2 className="text-2xl font-serif font-semibold mb-4 flex items-center gap-2">
                <Map className="w-5 h-5 text-primary" />
                Map
              </h2>
              <div className="rounded-xl overflow-hidden border border-border shadow-sm bg-muted aspect-video relative">
                {!mapLoaded && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <div className="text-center text-muted-foreground">
                      <Map className="w-10 h-10 mx-auto mb-3 opacity-30" />
                      <p className="text-sm">Loading map...</p>
                    </div>
                  </div>
                )}
                <iframe
                  src={embedUrl}
                  title={`Map of ${museum.name}`}
                  className="w-full h-full"
                  style={{ border: 0, minHeight: 340 }}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  onLoad={() => setMapLoaded(true)}
                  data-testid="iframe-map"
                />
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <div className="bg-card rounded-xl p-6 border border-border shadow-sm">
              <h3 className="font-serif text-xl font-semibold mb-6">Visit Information</h3>
              
              <ul className="space-y-6">
                <li className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Address</p>
                    <p className="text-muted-foreground text-sm mt-1" data-testid="text-address">{museum.address}</p>
                    <p className="text-muted-foreground text-sm">{museum.borough}, NY</p>
                    <div className="flex flex-wrap gap-3 mt-2">
                      <a 
                        href={transitDirectionsUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                        data-testid="link-transit"
                      >
                        <Train className="w-3.5 h-3.5" />
                        Transit
                      </a>
                      <a 
                        href={drivingDirectionsUrl}
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-sm font-medium hover:underline inline-flex items-center gap-1"
                        data-testid="link-driving"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Driving
                      </a>
                    </div>
                  </div>
                </li>

                {museum.admission && (
                  <li className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Admission</p>
                      <p className="text-muted-foreground text-sm mt-1" data-testid="text-admission">{museum.admission}</p>
                    </div>
                  </li>
                )}

                {museum.website && (
                  <li className="flex items-start gap-3">
                    <Globe className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Website</p>
                      <a 
                        href={museum.website} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-primary text-sm font-medium hover:underline break-all mt-1 inline-block"
                        data-testid="link-website"
                      >
                        {new URL(museum.website).hostname.replace('www.', '')}
                      </a>
                    </div>
                  </li>
                )}

                {museum.phone && (
                  <li className="flex items-start gap-3">
                    <Phone className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Phone</p>
                      <a 
                        href={`tel:${museum.phone}`}
                        className="text-primary text-sm font-medium hover:underline mt-1 inline-block"
                        data-testid="link-phone"
                      >
                        {museum.phone}
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>

            {/* Quick Transit Summary in sidebar */}
            {museum.transit?.stations && museum.transit.stations.length > 0 && (
              <div className="bg-card rounded-xl p-6 border border-border shadow-sm" data-testid="sidebar-transit">
                <h3 className="font-serif text-lg font-semibold mb-4 flex items-center gap-2">
                  <Train className="w-4 h-4 text-primary" />
                  Nearest Subway
                </h3>
                <div className="space-y-3">
                  {museum.transit.stations.slice(0, 2).map((station, i) => (
                    <div key={i} className="flex items-center gap-2 flex-wrap">
                      <div className="flex gap-1 flex-wrap">
                        {station.lines?.map((l, j) => (
                          <SubwayBadge key={j} line={l.line} color={l.color} />
                        ))}
                      </div>
                      <span className="text-sm text-muted-foreground">{station.name}</span>
                    </div>
                  ))}
                </div>
                <a
                  href={transitDirectionsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex items-center gap-1.5 text-sm text-primary font-medium hover:underline"
                  data-testid="link-sidebar-transit"
                >
                  <Train className="w-3.5 h-3.5" />
                  Get transit directions
                </a>
              </div>
            )}
            
            <Button className="w-full py-6 text-lg rounded-xl shadow-md font-medium" asChild data-testid="button-official-website">
              <a href={museum.website} target="_blank" rel="noreferrer">
                Visit Official Website
              </a>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
