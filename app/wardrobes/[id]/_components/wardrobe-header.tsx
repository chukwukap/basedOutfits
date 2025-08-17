"use client";

import { useState } from "react";
import { Search, SortAsc, X } from "lucide-react";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Badge } from "@/app/_components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/_components/ui/dropdown-menu";

interface WardrobeHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalWardrobes: number;
}

export function WardrobeHeader({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  totalWardrobes,
}: WardrobeHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  const filters = [
    { value: "all", label: "All Wardrobes" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const sortOptions = [
    { value: "recent", label: "Recently Updated" },
    { value: "oldest", label: "Oldest First" },
    { value: "name", label: "Name A-Z" },
    { value: "size", label: "Most Outfits" },
  ];

  // const activeFilter = filters.find((f) => f.value === selectedFilter);
  const activeSortOption = sortOptions.find((s) => s.value === sortBy);

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="p-3 sm:p-4 space-y-2 sm:space-y-3">
        {/* Title and Search Toggle */}
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <h1 className="text-lg sm:text-xl font-semibold truncate">
              My Wardrobes
            </h1>
            <Badge
              variant="secondary"
              className="text-[10px] sm:text-xs shrink-0"
            >
              <span className="sm:hidden">{totalWardrobes}</span>
              <span className="hidden sm:inline">
                {totalWardrobes}{" "}
                {totalWardrobes === 1 ? "wardrobe" : "wardrobes"}
              </span>
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 shrink-0"
            aria-label={showSearch ? "Close search" : "Open search"}
          >
            {showSearch ? (
              <X className="w-5 h-5" />
            ) : (
              <Search className="w-5 h-5" />
            )}
          </Button>
        </div>

        {/* Search Bar */}
        {showSearch && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your wardrobes..."
              className="pl-10 h-9 sm:h-10 w-full"
              autoFocus
            />
          </div>
        )}

        {/* Filters and Sort */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 -mx-3 px-3 sm:mx-0 sm:px-0">
          {/* Filter Tags */}
          <div className="flex gap-2 min-w-0 flex-1 flex-nowrap">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={
                  selectedFilter === filter.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => onFilterChange(filter.value)}
                className="whitespace-nowrap text-[11px] sm:text-xs h-8 px-2 bg-transparent"
              >
                {filter.label}
              </Button>
            ))}
          </div>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-2 whitespace-nowrap bg-transparent"
              >
                <SortAsc className="w-4 h-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">
                  {activeSortOption?.label}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => onSortChange(option.value)}
                >
                  {option.label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}
