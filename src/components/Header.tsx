"use client";
import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, ChevronUp, X } from "lucide-react";
import clsx from "clsx";
import DarkModeToggle from "./DarkModeToggle";
import { GAME_VERSION } from "@/constants/constants";

export default function Header({ collapsible = false }: { collapsible?: boolean }) {
  const [isOpen, setIsOpen] = useState(!collapsible);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <>
      {/* Fixed collapse/expand button - ALWAYS visible in same spot */}
      {collapsible && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-3 right-3 z-40 p-2 rounded-lg bg-base-300/80 backdrop-blur-md shadow-md hover:bg-base-200"
          aria-label={isOpen ? "Collapse header" : "Expand header"}
        >
          {isOpen ? <ChevronUp className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      )}

      {/* Full header – slides up/down as one unit */}
      <header
        className={clsx(
          "top-0 left-0 right-0 z-30 bg-base-300/80 backdrop-blur-md shadow-sm transition-all duration-300",
          collapsible ? "absolute" : "block",
          isOpen ? "translate-y-0" : "-translate-y-full"
        )}
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-14 items-center justify-between">
            {/* Title */}
            <NavButton href="/">
              <h1 className="text-xl font-bold">
                WaveTools - {GAME_VERSION}
              </h1>
            </NavButton>

            {/* Desktop Nav + controls */}
            <div className="hidden md:flex items-center gap-4 pr-14">
              <nav className="flex items-center gap-1.5">
                {/* {process.env.NODE_ENV === "development" && (
                  <>
                    <NavButton href="/">Home</NavButton>
                  </>
                )} */}
                <NavButton href="/items">Items</NavButton>
                <NavButton href="/map">Map</NavButton>
                <NavButton href="/union-level">Union Level</NavButton>
                <NavButton href="/recipes">Recipes</NavButton>
                <NavButton href="/planner">Planner</NavButton>
                <NavButton href="/echo-simulation">Echo Simulator</NavButton>
              </nav>

              {/* Dark mode toggle */}
              <DarkModeToggle />
            </div>

            {/* Mobile controls */}
            <div className="flex md:hidden items-center gap-2 pr-14">
              {/* Mobile menu button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-base-200"
                aria-label="Toggle menu"
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>

              {/* Dark mode toggle */}
              <DarkModeToggle />
            </div>
          </div>

          {/* Mobile menu dropdown */}
          {mobileMenuOpen && (
            <nav className="md:hidden py-4 flex flex-col gap-2">
              {/* {process.env.NODE_ENV === "development" && (
                <>
                </>
              )} */}
              <MobileNavButton href="/items" onClick={() => setMobileMenuOpen(false)}>Items</MobileNavButton>
              <MobileNavButton href="/map" onClick={() => setMobileMenuOpen(false)}>Map</MobileNavButton>
              <MobileNavButton href="/union-level" onClick={() => setMobileMenuOpen(false)}>Union Level</MobileNavButton>
              <MobileNavButton href="/recipes" onClick={() => setMobileMenuOpen(false)}>Recipes</MobileNavButton>
              <MobileNavButton href="/planner" onClick={() => setMobileMenuOpen(false)}>Planner</MobileNavButton>
              <MobileNavButton href="/echo-simulation" onClick={() => setMobileMenuOpen(false)}>Echo Simulator</MobileNavButton>
            </nav>
          )}
        </div>
      </header>
    </>
  );
}

function NavButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Button variant="ghost" size="sm" asChild className="text-sm font-medium px-2.5">
      <Link href={href}>{children}</Link>
    </Button>
  );
}

function MobileNavButton({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
  return (
    <Link href={href} onClick={onClick} className="px-4 py-2 rounded-lg hover:bg-base-200 text-sm font-medium">
      {children}
    </Link>
  );
}