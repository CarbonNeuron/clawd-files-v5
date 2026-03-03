"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Save } from "lucide-react";

interface EditBucketFormProps {
  bucketId: string;
  initialName: string;
  initialDescription: string;
}

export function EditBucketForm({ bucketId, initialName, initialDescription }: EditBucketFormProps) {
  const router = useRouter();
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [expiresIn, setExpiresIn] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const body: Record<string, string | null> = {};
      if (name.trim() !== initialName) body.name = name.trim();
      if (description.trim() !== initialDescription) body.description = description.trim() || null;
      if (expiresIn.trim()) body.expires_in = expiresIn.trim();

      const res = await fetch(`/dashboard/buckets/${bucketId}/edit`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to update bucket");
        return;
      }
      setSuccess(true);
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="mb-3 text-lg font-semibold">Edit Bucket</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div>
            <label htmlFor="edit-name" className="mb-1 block text-sm text-text-muted">
              Name
            </label>
            <Input id="edit-name" value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div>
            <label htmlFor="edit-desc" className="mb-1 block text-sm text-text-muted">
              Description
            </label>
            <Input
              id="edit-desc"
              placeholder="Optional description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="edit-expiry" className="mb-1 block text-sm text-text-muted">
              Extend Expiry
            </label>
            <Input
              id="edit-expiry"
              placeholder="e.g. 24h, 7d"
              value={expiresIn}
              onChange={(e) => setExpiresIn(e.target.value)}
            />
          </div>
        </div>
        <Button type="submit" variant="primary" disabled={loading}>
          <Save size={16} />
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {success && <p className="mt-2 text-sm text-success">Bucket updated.</p>}
    </Card>
  );
}
