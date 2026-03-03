"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function CreateBucketForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [expiresIn, setExpiresIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const body: Record<string, string | null> = { name: name.trim() };
      if (description.trim()) body.description = description.trim();
      if (expiresIn.trim()) body.expires_in = expiresIn.trim();

      const res = await fetch("/dashboard/buckets/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create bucket");
        return;
      }
      setName("");
      setDescription("");
      setExpiresIn("");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="mb-3 text-lg font-semibold">Create Bucket</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="bucket-name" className="mb-1 block text-sm text-text-muted">
              Name
            </label>
            <Input
              id="bucket-name"
              placeholder="my-bucket"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="bucket-desc" className="mb-1 block text-sm text-text-muted">
              Description
            </label>
            <Input
              id="bucket-desc"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="bucket-expiry" className="mb-1 block text-sm text-text-muted">
              Expires In
            </label>
            <Input
              id="bucket-expiry"
              placeholder="e.g. 24h, 7d"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
          <Plus size={16} />
          {loading ? "Creating..." : "Create Bucket"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
    </Card>
  );
}
