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

interface LookbooksHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  sortBy: string;
  onSortChange: (sort: string) => void;
  totalLookbooks: number;
}

export function LookbooksHeader({
  searchQuery,
  onSearchChange,
  selectedFilter,
  onFilterChange,
  sortBy,
  onSortChange,
  totalLookbooks,
}: LookbooksHeaderProps) {
  const [showSearch, setShowSearch] = useState(false);

  const filters = [
    { value: "all", label: "All Lookbooks" },
    { value: "public", label: "Public" },
    { value: "private", label: "Private" },
  ];

  const sortOptions = [
    { value: "recent", label: "Recently Updated" },
    { value: "oldest", label: "Oldest First" },
    { value: "name", label: "Name A-Z" },
    { value: "size", label: "Most Looks" },
  ];

  const activeFilter = filters.find((f) => f.value === selectedFilter);
  const activeSortOption = sortOptions.find((s) => s.value === sortBy);

  return (
    <header className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
      <div className="p-4 space-y-3">
        {/* Title and Search Toggle */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-semibold">My Lookbooks</h1>
            <Badge variant="secondary" className="text-xs">
              {totalLookbooks} {totalLookbooks === 1 ? "lookbook" : "lookbooks"}
            </Badge>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSearch(!showSearch)}
            className="p-2"
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
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Search your lookbooks..."
              className="pl-10"
              autoFocus
            />
          </div>
        )}

        {/* Filters and Sort */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {/* Filter Tags */}
          <div className="flex gap-2 min-w-0 flex-1">
            {filters.map((filter) => (
              <Button
                key={filter.value}
                variant={
                  selectedFilter === filter.value ? "default" : "outline"
                }
                size="sm"
                onClick={() => onFilterChange(filter.value)}
                className="whitespace-nowrap text-xs bg-transparent"
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
                className="whitespace-nowrap bg-transparent"
              >
                <SortAsc className="w-4 h-4 mr-2" />
                {activeSortOption?.label}
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
