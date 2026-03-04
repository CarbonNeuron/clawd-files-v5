import { Skeleton } from "@/components/ui/skeleton";

export default function FileDetailLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Skeleton className="mb-6 h-5 w-32" />
      <div className="mb-8 space-y-4">
        <div className="flex items-center gap-4">
          <Skeleton className="h-10 w-10 rounded" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
      </div>
      <div className="space-y-3 rounded-lg border border-border bg-surface p-6">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </main>
  );
}
