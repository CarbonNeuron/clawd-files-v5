import Link from "next/link";
import { getAuthToken } from "@/lib/auth/cookies";
import { CreateBucketForm } from "@/components/dashboard/create-bucket-form";
import { Pagination } from "@/components/ui/pagination";
import { Badge } from "@/components/ui/badge";
import { formatBytes, formatExpiry } from "@/lib/utils";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import type { PaginatedResponseOfBucket } from "@/lib/api/client";

interface BucketsPageProps {
  searchParams: Promise<{ offset?: string; limit?: string }>;
}

export default async function BucketsPage({ searchParams }: BucketsPageProps) {
  const { offset: offsetStr, limit: limitStr } = await searchParams;
  const offset = Number(offsetStr) || 0;
  const limit = Number(limitStr) || 20;
  const token = await getAuthToken();

  const res = await fetch(
    `${process.env.API_URL}/api/buckets?limit=${limit}&offset=${offset}&sort=created_at&order=desc`,
    {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    },
  );

  const buckets: PaginatedResponseOfBucket | null = res.ok ? await res.json() : null;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Buckets</h1>
      <CreateBucketForm />
      {!buckets ? (
        <p className="text-text-muted">Failed to load buckets.</p>
      ) : buckets.items.length === 0 ? (
        <p className="text-text-muted">No buckets yet. Create one above.</p>
      ) : (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead className="hidden sm:table-cell">Owner</TableHead>
                <TableHead>Files</TableHead>
                <TableHead>Size</TableHead>
                <TableHead className="hidden md:table-cell">Expiry</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {buckets.items.map((bucket) => {
                const isExpired =
                  bucket.expires_at && new Date(bucket.expires_at).getTime() < Date.now();
                return (
                  <TableRow key={bucket.id}>
                    <TableCell>
                      <Link
                        href={`/dashboard/buckets/${bucket.id}`}
                        className="font-medium text-link hover:underline"
                      >
                        {bucket.name}
                      </Link>
                    </TableCell>
                    <TableCell className="hidden text-text-muted sm:table-cell">
                      {bucket.owner}
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {Number(bucket.file_count ?? 0)}
                    </TableCell>
                    <TableCell className="text-text-muted">
                      {formatBytes(Number(bucket.total_size ?? 0))}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {bucket.expires_at ? (
                        <Badge variant={isExpired ? "danger" : "default"}>
                          {isExpired ? "Expired" : formatExpiry(bucket.expires_at)}
                        </Badge>
                      ) : (
                        <span className="text-text-muted">Never</span>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <Pagination
            total={Number(buckets.total ?? 0)}
            limit={limit}
            offset={offset}
            baseHref="/dashboard/buckets"
          />
        </>
      )}
    </div>
  );
}
