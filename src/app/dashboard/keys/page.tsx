import { getAuthToken } from "@/lib/auth/cookies";
import { CreateKeyForm } from "@/components/dashboard/create-key-form";
import { DeleteKeyButton } from "@/components/dashboard/delete-key-button";
import { formatBytes } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { PaginatedResponseOfApiKeyListItem } from "@/lib/api/client";

export default async function KeysPage() {
  const token = await getAuthToken();
  const res = await fetch(`${process.env.API_URL}/api/keys?limit=100&offset=0`, {
    headers: { Authorization: `Bearer ${token}` },
    cache: "no-store",
  });

  const keys: PaginatedResponseOfApiKeyListItem | null = res.ok
    ? await res.json()
    : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">API Keys</h1>
      <CreateKeyForm />
      {!keys ? (
        <p className="text-text-muted">Failed to load API keys.</p>
      ) : keys.items.length === 0 ? (
        <p className="text-text-muted">No API keys yet. Create one above.</p>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Prefix</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="hidden sm:table-cell">Created</TableHead>
              <TableHead className="hidden md:table-cell">Last Used</TableHead>
              <TableHead className="hidden lg:table-cell">Buckets</TableHead>
              <TableHead className="hidden lg:table-cell">Files</TableHead>
              <TableHead className="hidden lg:table-cell">Size</TableHead>
              <TableHead className="w-20">{""}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.items.map((key) => (
              <TableRow key={key.prefix}>
                <TableCell>
                  <code className="rounded bg-surface-2 px-1.5 py-0.5 font-mono text-xs">
                    {key.prefix}
                  </code>
                </TableCell>
                <TableCell className="font-medium">{key.name}</TableCell>
                <TableCell className="hidden text-text-muted sm:table-cell">
                  {key.created_at
                    ? new Date(key.created_at).toLocaleDateString()
                    : "-"}
                </TableCell>
                <TableCell className="hidden text-text-muted md:table-cell">
                  {key.last_used_at
                    ? new Date(key.last_used_at).toLocaleDateString()
                    : "Never"}
                </TableCell>
                <TableCell className="hidden text-text-muted lg:table-cell">
                  {Number(key.bucket_count ?? 0)}
                </TableCell>
                <TableCell className="hidden text-text-muted lg:table-cell">
                  {Number(key.file_count ?? 0)}
                </TableCell>
                <TableCell className="hidden text-text-muted lg:table-cell">
                  {formatBytes(Number(key.total_size ?? 0))}
                </TableCell>
                <TableCell>
                  <DeleteKeyButton prefix={key.prefix} keyName={key.name} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
