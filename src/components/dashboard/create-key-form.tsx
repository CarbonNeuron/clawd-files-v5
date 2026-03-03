"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Plus } from "lucide-react";

export function CreateKeyForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [createdKey, setCreatedKey] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/dashboard/keys/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: name.trim() }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Failed to create key");
        return;
      }
      setCreatedKey(data.key);
      setName("");
      router.refresh();
    } catch {
      setError("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card className="mb-6">
      <h2 className="mb-3 text-lg font-semibold">Create API Key</h2>
      <form onSubmit={handleSubmit} className="flex items-end gap-3">
        <div className="flex-1">
          <label htmlFor="key-name" className="mb-1 block text-sm text-text-muted">
            Key Name
          </label>
          <Input
            id="key-name"
            placeholder="e.g. my-app-key"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <Button type="submit" variant="primary" disabled={loading || !name.trim()}>
          <Plus size={16} />
          {loading ? "Creating..." : "Create"}
        </Button>
      </form>
      {error && <p className="mt-2 text-sm text-danger">{error}</p>}
      {createdKey && (
        <div className="mt-3 rounded-md border border-accent/30 bg-accent/5 p-3">
          <p className="mb-1 text-sm font-medium text-accent">
            Key created! Copy it now -- it will not be shown again.
          </p>
          <code className="block break-all rounded bg-surface-2 p-2 font-mono text-sm text-text">
            {createdKey}
          </code>
        </div>
      )}
    </Card>
  );
}
