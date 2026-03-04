import { NextResponse } from "next/server";

const content = `# clawd-files

> File sharing platform powered by CarbonFiles. Organize files into buckets, share via short URLs, upload programmatically, and download individually or as ZIP archives.

## Browsing Buckets

Every bucket has a unique ID. To view a bucket's files in a browser:

    GET /buckets/{bucketId}

To get bucket metadata and file listing from the API:

    GET /api/buckets/{bucketId}

Response (JSON):
    {
      "id": "string",
      "name": "string",
      "owner": "string",
      "description": "string | null",
      "created_at": "ISO 8601",
      "expires_at": "ISO 8601 | null",
      "file_count": number,
      "total_size": number,
      "files": [{ "path", "name", "size", "mime_type", "short_code", "short_url", "created_at", "updated_at" }],
      "has_more_files": boolean
    }

To get a plaintext summary suitable for LLM context windows:

    GET /api/buckets/{bucketId}/summary

## Downloading Files

### Single file

    curl -L https://{host}/buckets/{bucketId}/files/{filePath} -o filename

The middleware serves raw file content for non-browser requests (no Accept: text/html header). Browser requests get the HTML preview page.

### Via short URL

Some files have short URLs. If a file has a short_code, you can download it with:

    curl -L https://{host}/s/{shortCode} -o filename

Short URLs redirect (302) to the backend which serves the file content directly.

### Entire bucket as ZIP

    curl https://{host}/buckets/{bucketId}/zip -o bucket.zip

Streams all files in the bucket as a ZIP archive.

## Uploading Files

Uploads require an upload token scoped to a specific bucket.

### Multipart upload (files under 100 MB)

    curl -X POST https://{host}/api/buckets/{bucketId}/upload?token={uploadToken} \\
      -F "path/to/file.txt=@localfile.txt"

The form field name becomes the file path in the bucket. If the field name is generic (like "file" or "upload"), the original filename is used.

Response (201 Created):
    { "uploaded": [{ "path", "name", "size", "mime_type", "short_code", "short_url", "created_at", "updated_at" }] }

### Streaming upload (large files)

    curl -X PUT https://{host}/api/buckets/{bucketId}/upload/stream?token={uploadToken}&filename=largefile.bin \\
      -H "Content-Type: application/octet-stream" \\
      --data-binary @largefile.bin

Use this for files over 100 MB. The filename query parameter is required.

### Patching files (byte range writes)

    curl -X PATCH https://{host}/api/buckets/{bucketId}/files/{filePath}?token={uploadToken} \\
      -H "Content-Range: bytes 0-99/200" \\
      --data-binary @chunk.bin

To append to a file, use the X-Append header:

    curl -X PATCH https://{host}/api/buckets/{bucketId}/files/{filePath}?token={uploadToken} \\
      -H "X-Append: true" \\
      --data-binary @chunk.bin

## API Authentication

There are three authentication methods:

1. **API Key** (admin operations, bucket management):
   Authorization: Bearer {apiKey}

2. **Dashboard Token** (web dashboard access):
   Authorization: Bearer {dashboardToken}
   Or via cookie: cf-auth-token={dashboardToken}

3. **Upload Token** (scoped file uploads):
   Query parameter: ?token={uploadToken}

## Bucket Management (requires API key)

### Create a bucket

    curl -X POST https://{host}/api/buckets \\
      -H "Authorization: Bearer {apiKey}" \\
      -H "Content-Type: application/json" \\
      -d '{"name": "my-bucket", "description": "optional", "expires_in": "24h"}'

### Update a bucket

    curl -X PATCH https://{host}/api/buckets/{bucketId} \\
      -H "Authorization: Bearer {apiKey}" \\
      -H "Content-Type: application/json" \\
      -d '{"name": "new-name", "description": "updated"}'

### Delete a bucket

    curl -X DELETE https://{host}/api/buckets/{bucketId} \\
      -H "Authorization: Bearer {apiKey}"

### List buckets

    curl https://{host}/api/buckets?limit=20&offset=0&sort=created_at&order=desc \\
      -H "Authorization: Bearer {apiKey}"

## Upload Tokens

Create a scoped upload token for a bucket (requires API key or dashboard token):

    curl -X POST https://{host}/api/buckets/{bucketId}/tokens \\
      -H "Authorization: Bearer {apiKey}" \\
      -H "Content-Type: application/json" \\
      -d '{"expires_in": "1h", "max_uploads": 10}'

Response (201 Created):
    { "token": "string", "bucket_id": "string", "expires_at": "ISO 8601", "max_uploads": number, "uploads_used": number }

Share the token with the uploader. They can use it via the web UI at:

    https://{host}/buckets/{bucketId}/upload?token={uploadToken}

Or via the API endpoints documented above.

## File Listing (paginated)

    curl https://{host}/api/buckets/{bucketId}/files?limit=50&offset=0&sort=name&order=asc

Response:
    { "items": [BucketFile], "total": number, "limit": number, "offset": number }

## Error Responses

All errors return JSON:
    { "error": "message", "hint": "optional suggestion" }

Status codes: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 413 Payload Too Large, 416 Range Not Satisfiable.

## Typical Workflow

1. Create a bucket with an API key
2. Generate an upload token for that bucket
3. Upload files using the token (multipart or streaming)
4. Share the bucket URL: https://{host}/buckets/{bucketId}
5. Recipients can browse, preview, and download files — no auth needed
6. Files with short URLs can be shared as: https://{host}/s/{code}
7. Download everything at once: https://{host}/buckets/{bucketId}/zip
`;

export function GET() {
  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400",
    },
  });
}
