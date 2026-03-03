import { redirect } from "next/navigation";
import { Suspense } from "react";
import { validateAuth } from "@/lib/auth/validate";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { TokenHandler } from "@/components/auth/token-handler";

export default async function LandingPage() {
  const auth = await validateAuth();
  if (auth.authenticated) {
    redirect("/dashboard");
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-4">
      <Suspense>
        <TokenHandler />
      </Suspense>
      <div className="w-full max-w-md space-y-8 text-center">
        <div>
          <h1 className="font-brand text-4xl font-bold text-accent">clawd-files</h1>
          <p className="mt-2 text-text-muted">File sharing powered by CarbonFiles</p>
        </div>
        <form action="/buckets" className="space-y-4">
          <div>
            <label htmlFor="bucket-id" className="sr-only">Bucket ID</label>
            <Input
              id="bucket-id"
              name="id"
              placeholder="Enter a bucket ID to browse"
              className="text-center font-mono"
              required
            />
          </div>
          <Button type="submit" variant="primary" className="w-full">
            Browse Bucket
          </Button>
        </form>
      </div>
    </main>
  );
}
