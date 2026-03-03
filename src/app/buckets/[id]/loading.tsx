import { Skeleton } from "@/components/ui/skeleton";

export default function BucketLoading() {
  return (
    <main className="mx-auto max-w-5xl px-4 py-8 space-y-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="space-y-3">
          <Skeleton className="h-8 w-64" />
          <Skeleton className="h-5 w-96" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
            <Skeleton className="h-6 w-32 rounded-full" />
          </div>
        </div>
        <Skeleton className="h-10 w-36" />
      </div>

      {/* Table skeleton */}
      <div className="space-y-0 divide-y divide-border rounded-lg border border-border">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 h-12">
            <Skeleton className="h-4 w-4 shrink-0" />
            <Skeleton className="h-4 w-48" />
            <div className="ml-auto flex gap-6">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-24 hidden sm:block" />
              <Skeleton className="h-4 w-20 hidden md:block" />
            </div>
          </div>
        ))}
      </div>
    </main>
  );
}
