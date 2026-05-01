import React from "react";
import { Link } from "wouter";
import { MapPin, Clock, ArrowRight } from "lucide-react";
import type { Museum } from "@workspace/api-client-react";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface MuseumCardProps {
  museum: Museum;
}

export function MuseumCard({ museum }: MuseumCardProps) {
  const isOpen = museum.isOpenNow;

  return (
    <Card className="flex flex-col h-full overflow-hidden transition-all duration-300 hover:shadow-md hover:-translate-y-1 group">
      <CardHeader className="pb-4 gap-2 flex-none">
        <div className="flex justify-between items-start gap-4">
          <Badge variant="secondary" className="capitalize shrink-0">
            {museum.category}
          </Badge>
          {isOpen !== undefined && (
            <Badge 
              variant={isOpen ? "default" : "secondary"} 
              className={isOpen ? "bg-green-600 hover:bg-green-700 shrink-0" : "shrink-0"}
            >
              {isOpen ? "Open Now" : "Closed"}
            </Badge>
          )}
        </div>
        <h3 className="font-serif text-xl font-semibold leading-tight line-clamp-2 mt-2">
          {museum.name}
        </h3>
      </CardHeader>
      
      <CardContent className="pb-4 flex-1 flex flex-col gap-3 text-sm text-muted-foreground">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
          <span className="line-clamp-1">
            {museum.neighborhood ? `${museum.neighborhood}, ` : ""}{museum.borough}
          </span>
        </div>
        
        {museum.todayHours && (
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 shrink-0 mt-0.5 text-primary/70" />
            <span className="line-clamp-1">{museum.todayHours}</span>
          </div>
        )}
      </CardContent>
      
      <CardFooter className="pt-4 border-t border-border/40 mt-auto bg-muted/10">
        <Link href={`/museums/${museum.id}`} className="w-full flex items-center justify-between text-sm font-medium text-primary group-hover:text-primary/80 transition-colors">
          <span>View Details</span>
          <ArrowRight className="w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export function MuseumCardSkeleton() {
  return (
    <div className="flex flex-col h-[280px] rounded-xl border border-border bg-card p-6 gap-4">
      <div className="flex justify-between">
        <div className="w-16 h-5 rounded-full bg-muted animate-pulse" />
        <div className="w-20 h-5 rounded-full bg-muted animate-pulse" />
      </div>
      <div className="space-y-2 mt-2">
        <div className="w-3/4 h-6 rounded-md bg-muted animate-pulse" />
        <div className="w-1/2 h-6 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="space-y-3 mt-auto">
        <div className="w-2/3 h-4 rounded-md bg-muted animate-pulse" />
        <div className="w-3/4 h-4 rounded-md bg-muted animate-pulse" />
      </div>
      <div className="w-full h-10 mt-4 rounded-md bg-muted animate-pulse" />
    </div>
  );
}
