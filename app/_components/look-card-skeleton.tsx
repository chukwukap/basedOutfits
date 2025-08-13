import { Card } from "@/app/_components/ui/card";

export function LookCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Image skeleton */}
      <div className="aspect-[3/4] bg-muted animate-pulse" />

      {/* Content skeleton */}
      <div className="p-4 space-y-3">
        {/* Author skeleton */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-muted animate-pulse" />
          <div className="flex-1 space-y-1">
            <div className="h-4 bg-muted rounded animate-pulse w-24" />
            <div className="h-3 bg-muted rounded animate-pulse w-16" />
          </div>
        </div>

        {/* Title and description skeleton */}
        <div className="space-y-2">
          <div className="h-5 bg-muted rounded animate-pulse w-3/4" />
          <div className="h-4 bg-muted rounded animate-pulse w-full" />
          <div className="h-4 bg-muted rounded animate-pulse w-2/3" />
        </div>

        {/* Tags skeleton */}
        <div className="flex gap-2">
          <div className="h-6 bg-muted rounded-full animate-pulse w-16" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-20" />
          <div className="h-6 bg-muted rounded-full animate-pulse w-14" />
        </div>

        {/* Stats skeleton */}
        <div className="flex gap-4">
          <div className="h-4 bg-muted rounded animate-pulse w-12" />
          <div className="h-4 bg-muted rounded animate-pulse w-16" />
        </div>

        {/* Actions skeleton */}
        <div className="flex gap-2 pt-2">
          <div className="h-9 bg-muted rounded animate-pulse flex-1" />
          <div className="h-9 bg-muted rounded animate-pulse flex-1" />
          <div className="h-9 w-9 bg-muted rounded animate-pulse" />
        </div>
      </div>
    </Card>
  );
}
