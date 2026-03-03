"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

interface DeleteKeyButtonProps {
  prefix: string;
  keyName: string;
}

export function DeleteKeyButton({ prefix, keyName }: DeleteKeyButtonProps) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/dashboard/keys/${prefix}/delete`, {
        method: "DELETE",
      });
      if (res.ok || res.status === 204) {
        router.refresh();
      }
    } catch {
      // ignore
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-danger">Delete &quot;{keyName}&quot;?</span>
        <Button variant="danger" onClick={handleDelete} disabled={loading}>
          {loading ? "..." : "Yes"}
        </Button>
        <Button variant="ghost" onClick={() => setConfirming(false)}>
          No
        </Button>
      </div>
    );
  }

  return (
    <Button variant="ghost" onClick={() => setConfirming(true)}>
      <Trash2 size={14} />
    </Button>
  );
}
