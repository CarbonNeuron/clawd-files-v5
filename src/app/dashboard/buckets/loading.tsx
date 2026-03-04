import { Skeleton } from "@/components/ui/skeleton";

export default function BucketsLoading() {
  return (
    <div>
      <Skeleton className="mb-6 h-8 w-32" />
      <Skeleton className="mb-6 h-24 w-full rounded-lg" />
      <div className="space-y-0 divide-y divide-border rounded-lg border border-border">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-4 h-12">
            <Skeleton className="h-4 w-40" />
            <Skeleton className="h-4 w-20 hidden sm:block" />
            <Skeleton className="ml-auto h-4 w-12" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-6 w-24 rounded-full hidden md:block" />
          </div>
        ))}
      </div>
    </div>
  );
}
