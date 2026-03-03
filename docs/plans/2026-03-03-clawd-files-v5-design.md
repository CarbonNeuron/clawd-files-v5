# clawd-files-v5 Frontend Design

## Overview

Next.js 16 frontend for the carbon-files API. Server-component-first architecture with real-time SignalR updates, cookie-based auth, and a "Deep Sea Terminal" design theme.

## Foundation

- **Framework:** Next.js 16 (App Router, `output: 'standalone'`)
- **Language:** TypeScript strict mode
- **Styling:** Tailwind CSS v4 with CSS custom properties for the color palette
- **API Client:** `@hey-api/openapi-ts` generating from the live OpenAPI spec
- **Real-Time:** `@microsoft/signalr` for live file/bucket updates
- **Fonts:** Inter (body), JetBrains Mono (code), Space Grotesk (brand) via `next/font/google`
- **Icons:** `lucide-react` (no emoji)
- **Env vars:** `API_URL` (server), `NEXT_PUBLIC_API_URL` (client), `AUTH_COOKIE_SECRET`

## Authentication

Cookie-based JWT auth. No login page — admin generates a dashboard JWT shared as a URL (`?token=...`).

1. User opens URL with `?token=` → route handler writes `HttpOnly; Secure; SameSite=Strict` cookie
2. `router.replace` strips token from URL
3. Server components validate via `GET /api/tokens/dashboard/me`
4. Invalid → redirect to `/` with "Session expired" message
5. Without auth: full public bucket browsing works, no dashboard access

## Routes

| Route                           | Purpose                                         | Auth          |
| ------------------------------- | ----------------------------------------------- | ------------- |
| `/`                             | Landing — bucket ID input or dashboard redirect | None          |
| `/buckets/[id]`                 | Public bucket view                              | None          |
| `/buckets/[id]/files/[...path]` | File detail + content negotiation               | None          |
| `/buckets/[id]/upload`          | Upload token page                               | Upload token  |
| `/s/[code]`                     | Short URL redirect                              | None          |
| `/dashboard`                    | Admin dashboard home                            | Dashboard JWT |
| `/dashboard/keys`               | API key management                              | Dashboard JWT |
| `/dashboard/buckets`            | All buckets                                     | Dashboard JWT |
| `/dashboard/buckets/[id]`       | Bucket detail + file management                 | Dashboard JWT |
| `/dashboard/stats`              | System statistics                               | Dashboard JWT |

## Component Architecture

### Server Components (default)

- `BucketHeader` — name, description, file count, size, expiry
- `FileList` / `FileGrid` — file listing with sort/filter
- `ReadmeSection` — finds and renders README.md
- `MarkdownRenderer` — rehype-shiki code blocks, relative link/image rewriting
- `CodeBlock` — first 50 lines plain monospace with line numbers
- `FileIcon` — SVG by MIME type
- `FileThumbnail` — grid card preview by type
- `Pagination` — `<Link>` with search params

### Client Components (interactivity only)

- `BucketEventsProvider` — SignalR connection for real-time updates
- `SyntaxHighlightToggle` — plain ↔ highlighted code swap
- `UploadZone` — drag & drop with per-file progress
- `ThemeToggle` — dark/light
- `ShowAllButton` — loads lines beyond 50-line preview
- `Toast` — shared notification system

### Suspense Streaming

Each route segment has `loading.tsx` skeletons. Nested suspense boundaries stream content progressively: bucket header → file list → README.

### Cookie Preferences

| Cookie                | Values           | Default |
| --------------------- | ---------------- | ------- |
| `cf-view-mode`        | `list` / `grid`  | `list`  |
| `cf-syntax-highlight` | `true` / `false` | `true`  |
| `cf-theme`            | `dark` / `light` | `dark`  |

Read server-side for correct first paint. No flash or hydration mismatch.

## Real-Time (SignalR)

- Hub at `/hub/files`, cookie auth
- `useBucketEvents(bucketId)` — FileCreated/Updated/Deleted
- `useFileEvents(bucketId, filePath)` — file-specific live content updates
- `withAutomaticReconnect()`
- Client component merges real-time updates into server-rendered initial data

## File Previews

| MIME Type   | Preview Strategy                                                  |
| ----------- | ----------------------------------------------------------------- |
| Text/code   | Two-phase: SSR plain (50 lines) → client syntax highlight (shiki) |
| Images      | `next/image` with explicit dimensions, blur placeholder           |
| Video/audio | Native HTML5 player, `preload="metadata"`                         |
| PDF         | `<iframe>` with fixed dimensions                                  |
| Markdown    | `react-markdown` + `rehype-shiki` + relative link/image rewriting |
| Other       | Download button with file size                                    |

## Content Negotiation

Middleware on `/buckets/[id]/files/*`: if `Accept` header doesn't include `text/html`, 302 redirect to API's raw content endpoint. Browsers get the page, curl/wget get the file.

## Upload UX

- Full-page drop target
- Per-file progress bars (percentage + speed)
- Multipart for batches (`POST /api/buckets/{id}/upload`)
- Streaming for >100MB (`PUT /api/buckets/{id}/upload/stream`)
- Cancel via AbortController
- Per-file success/error states

## Design System: "Deep Sea Terminal"

Deep navy background, bioluminescent cyan accents. CSS custom properties for the full palette. Dark default, light mode option.

### Zero Layout Shift (mandatory)

- Skeletons match loaded content dimensions
- Fixed row heights in file lists
- Explicit image dimensions
- `next/font` for FOUT prevention

### OG Images

- `generateMetadata` on every page
- Dynamic cards for buckets and code files (via `satori`)
- Dashboard pages: `noindex, nofollow`
- Title template: `%s — clawd-files`

## CI/CD

- Trigger: push to `main`, all PRs
- Pipeline: `npm ci` → `prettier --check` → `tsc --noEmit` → `next build` → Docker build → GHCR push
- Tags: `latest` + git SHA
- Typecheck catches API drift

## Testing

- **Unit/Component:** Vitest + React Testing Library
- **E2E:** Playwright (upload, browse, download, auth)
- **API Mocking:** MSW (Mock Service Worker)

## Docker

Multi-stage build: `node:22-alpine` build → standalone runtime. Copies `.next/standalone`, `.next/static`, `public`.
