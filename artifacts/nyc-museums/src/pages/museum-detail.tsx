import React from "react";
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
  Info
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";

export function MuseumDetail() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const { toast } = useToast();
  const queryClient = useQueryClient();

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
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Skeleton className="h-6 w-24 mb-8" />
        <Skeleton className="h-12 w-3/4 mb-4" />
        <Skeleton className="h-6 w-1/2 mb-8" />
        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
            <Skeleton className="h-40 w-full" />
            <Skeleton className="h-40 w-full" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-64 w-full" />
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

  return (
    <div className="w-full pb-20">
      {/* Header Banner */}
      <div className="bg-primary/5 border-b border-border/40 py-12 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/" className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6">
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
              >
                {museum.isOpenNow ? "Open Now" : "Closed"}
              </Badge>
            )}
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold text-foreground tracking-tight leading-tight mb-4">
            {museum.name}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-muted-foreground mt-6 text-lg">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-primary" />
              <span>{museum.neighborhood ? `${museum.neighborhood}, ` : ""}{museum.borough}</span>
            </div>
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
                <div className="prose prose-p:text-muted-foreground prose-p:leading-relaxed max-w-none">
                  <p className="text-lg">{museum.description}</p>
                </div>
              </section>
            )}

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
                >
                  <RefreshCw className={`w-4 h-4 mr-2 ${refreshMutation.isPending ? "animate-spin" : ""}`} />
                  Refresh
                </Button>
              </div>

              {museum.hours ? (
                <div className="space-y-1">
                  {days.map((day) => {
                    const dayHours = museum.hours?.[day];
                    const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() === day;
                    
                    return (
                      <div 
                        key={day} 
                        className={`flex justify-between py-3 px-4 rounded-lg ${isToday ? 'bg-primary/5 border border-primary/20' : 'hover:bg-muted/50'}`}
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
                    <p className="text-muted-foreground text-sm mt-1">{museum.address}</p>
                    <p className="text-muted-foreground text-sm">{museum.borough}, NY</p>
                    <a 
                      href={`https://maps.google.com/?q=${encodeURIComponent(`${museum.name} ${museum.address} NYC`)}`} 
                      target="_blank" 
                      rel="noreferrer"
                      className="text-primary text-sm font-medium hover:underline inline-block mt-2"
                    >
                      Get Directions
                    </a>
                  </div>
                </li>

                {museum.admission && (
                  <li className="flex items-start gap-3">
                    <Ticket className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground">Admission</p>
                      <p className="text-muted-foreground text-sm mt-1">{museum.admission}</p>
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
                      >
                        {museum.phone}
                      </a>
                    </div>
                  </li>
                )}
              </ul>
            </div>
            
            <Button className="w-full py-6 text-lg rounded-xl shadow-md font-medium" asChild>
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
