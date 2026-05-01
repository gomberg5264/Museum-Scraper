import React from "react";
import { Link } from "wouter";
import { Building2 } from "lucide-react";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-[100dvh] flex flex-col bg-background">
      <header className="border-b border-border/50 sticky top-0 z-50 bg-background/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 text-primary transition-opacity hover:opacity-80">
            <Building2 className="h-6 w-6" />
            <span className="font-serif text-xl font-semibold tracking-tight">NYC Museums</span>
          </Link>
          <nav className="flex gap-4">
            <Link href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
              Directory
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        {children}
      </main>
      <footer className="border-t border-border/50 py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-muted-foreground">
          <p className="font-serif italic mb-2">A curated guide to the culture of New York City.</p>
          <p>&copy; {new Date().getFullYear()} NYC Museums Directory</p>
        </div>
      </footer>
    </div>
  );
}
