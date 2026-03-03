# clawd-files-v5 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a complete Next.js 16 frontend for the carbon-files API with server-component-first architecture, real-time SignalR updates, and a "Deep Sea Terminal" design theme.

**Architecture:** Server Components by default, Client Components only for interactivity (SignalR, uploads, toggles). Cookie-based auth with no hydration mismatch. Auto-generated API client from OpenAPI spec.

**Tech Stack:** Next.js 16, TypeScript strict, Tailwind CSS v4, @hey-api/openapi-ts, @microsoft/signalr, lucide-react, react-markdown, shiki, satori

---

## Phase 1: Project Scaffolding

### Task 1: Initialize Next.js project

**Step 1: Create Next.js app**

```bash
cd /home/carbon/clawd-files-v5
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --turbopack
```

Select defaults when prompted.

**Step 2: Verify it builds**

Run: `npm run build`
Expected: Build succeeds

**Step 3: Commit**

```bash
git init && git add -A && git commit -m "chore: initialize Next.js 16 project"
```

### Task 2: Configure TypeScript strict mode and project settings

**Files:**

- Modify: `tsconfig.json`
- Modify: `next.config.ts`
- Create: `.env.local`
- Create: `.env.example`

**Step 1: Ensure tsconfig.json has strict mode**

```json
{
  "compilerOptions": {
    "strict": true,
    "noUncheckedIndexedAccess": true
  }
}
```

**Step 2: Update next.config.ts**

```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "http", hostname: "localhost" }],
  },
};

export default nextConfig;
```

**Step 3: Create .env.local and .env.example**

```
API_URL=http://localhost:5239
NEXT_PUBLIC_API_URL=http://localhost:5239
AUTH_COOKIE_SECRET=dev-secret-change-in-production
```

**Step 4: Verify build and commit**

### Task 3: Install dependencies

**Step 1: Install production deps**

```bash
npm install lucide-react @microsoft/signalr react-markdown rehype-shiki shiki remark-gfm @hey-api/client-fetch
```

**Step 2: Install dev deps**

```bash
npm install -D @hey-api/openapi-ts prettier
```

**Step 3: Verify build and commit**

### Task 4: Configure fonts in root layout

**Files:**

- Modify: `src/app/layout.tsx`

```tsx
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-body" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-mono" });
const spaceGrotesk = Space_Grotesk({ subsets: ["latin"], variable: "--font-brand" });

export const metadata: Metadata = {
  title: { template: "%s — clawd-files", default: "clawd-files" },
  description: "File sharing powered by CarbonFiles",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${spaceGrotesk.variable}`}>
      <body className="font-body bg-bg text-text antialiased">{children}</body>
    </html>
  );
}
```

**Commit after verifying build.**

### Task 5: Set up Tailwind CSS v4 design tokens

**Files:**

- Modify: `src/app/globals.css`

```css
@import "tailwindcss";

@theme {
  --font-body: var(--font-body);
  --font-mono: var(--font-mono);
  --font-brand: var(--font-brand);
  --color-bg: #0a0e17;
  --color-surface: #161b22;
  --color-surface-2: #1c2333;
  --color-border: #30363d;
  --color-accent: #00e5ff;
  --color-accent-2: #26c6da;
  --color-danger: #ff6b6b;
  --color-success: #3fb950;
  --color-link: #58a6ff;
  --color-text: #e6edf3;
  --color-text-muted: #8b949e;
}

body {
  background-color: var(--color-bg);
  color: var(--color-text);
}

.light {
  --color-bg: #ffffff;
  --color-surface: #f6f8fa;
  --color-surface-2: #f0f2f5;
  --color-border: #d0d7de;
  --color-text: #1f2328;
  --color-text-muted: #656d76;
}
```

**Commit after verifying build.**

---

## Phase 2: API Client Generation

### Task 6: Generate typed API client

**Files:**

- Create: `openapi-ts.config.ts` (project root)
- Generated: `src/lib/api/generated/` (auto-generated)
- Create: `src/lib/api/client.ts`
- Create: `src/lib/api/server.ts`

**Step 1: Create openapi-ts config**

`openapi-ts.config.ts`:

```typescript
import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:5239/openapi/v1.json",
  output: { path: "src/lib/api/generated", format: "prettier" },
  plugins: ["@hey-api/typescript", { name: "@hey-api/sdk", asClass: false, operationId: true }],
});
```

**Step 2: Add scripts to package.json**

```json
"generate-api": "openapi-ts"
```

**Step 3: Run generation**

```bash
npx openapi-ts
```

**Step 4: Create client wrapper** (`src/lib/api/client.ts`)

```typescript
import { client } from "./generated/sdk.gen";

export function configureApiClient(baseUrl: string, token?: string) {
  client.setConfig({ baseUrl });
  if (token) {
    client.interceptors.request.use((req) => {
      req.headers.set("Authorization", `Bearer ${token}`);
      return req;
    });
  }
}

export { client };
export * from "./generated/sdk.gen";
export * from "./generated/types.gen";
```

**Step 5: Create server-side helper** (`src/lib/api/server.ts`)

```typescript
import { createClient } from "@hey-api/client-fetch";
import { cookies } from "next/headers";

export async function getServerClient() {
  const cookieStore = await cookies();
  const token = cookieStore.get("cf-auth-token")?.value;
  const serverClient = createClient({ baseUrl: process.env.API_URL! });
  if (token) {
    serverClient.interceptors.request.use((req) => {
      req.headers.set("Authorization", `Bearer ${token}`);
      return req;
    });
  }
  return serverClient;
}
```

**Step 6: Verify typecheck and commit**

---

## Phase 3: Auth Flow

### Task 7: Auth cookie helpers

**Files:**

- Create: `src/lib/auth/cookies.ts`

```typescript
import { cookies } from "next/headers";

const AUTH_COOKIE = "cf-auth-token";
const COOKIE_MAX_AGE = 60 * 60 * 24; // 24h

export async function setAuthToken(token: string) {
  const cookieStore = await cookies();
  cookieStore.set(AUTH_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: COOKIE_MAX_AGE,
    path: "/",
  });
}

export async function getAuthToken(): Promise<string | undefined> {
  const cookieStore = await cookies();
  return cookieStore.get(AUTH_COOKIE)?.value;
}

export async function clearAuthToken() {
  const cookieStore = await cookies();
  cookieStore.delete(AUTH_COOKIE);
}
```

### Task 8: Auth set-token route handler

**Files:**

- Create: `src/app/auth/set-token/route.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";
import { setAuthToken } from "@/lib/auth/cookies";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const token = body.token;
  if (!token || typeof token !== "string") {
    return NextResponse.json({ error: "Missing token" }, { status: 400 });
  }
  const res = await fetch(`${process.env.API_URL}/api/tokens/dashboard/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  if (!res.ok) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }
  await setAuthToken(token);
  return NextResponse.json({ ok: true });
}
```

### Task 9: Auth validation helper

**Files:**

- Create: `src/lib/auth/validate.ts`

```typescript
import { getAuthToken } from "./cookies";

export interface AuthState {
  authenticated: boolean;
  expiresAt?: string;
}

export async function validateAuth(): Promise<AuthState> {
  const token = await getAuthToken();
  if (!token) return { authenticated: false };
  try {
    const res = await fetch(`${process.env.API_URL}/api/tokens/dashboard/me`, {
      headers: { Authorization: `Bearer ${token}` },
      cache: "no-store",
    });
    if (!res.ok) return { authenticated: false };
    const data = await res.json();
    return { authenticated: true, expiresAt: data.expires_at };
  } catch {
    return { authenticated: false };
  }
}
```

### Task 10: Content negotiation middleware

**Files:**

- Create: `src/middleware.ts`

```typescript
import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  const accept = request.headers.get("accept") ?? "";
  const { pathname } = request.nextUrl;
  const fileMatch = pathname.match(/^\/buckets\/([^/]+)\/files\/(.+)$/);
  if (fileMatch && !accept.includes("text/html")) {
    const [, bucketId, filePath] = fileMatch;
    const apiUrl = process.env.API_URL!;
    return NextResponse.redirect(
      `${apiUrl}/api/buckets/${bucketId}/files/${encodeURIComponent(filePath)}/content`,
      { status: 302 },
    );
  }
  return NextResponse.next();
}

export const config = { matcher: ["/buckets/:id/files/:path*"] };
```

**Commit all of Phase 3 together.**

---

## Phase 4: Base UI Components

### Task 11: Core UI components

**Files to create:**

- `src/components/ui/button.tsx` — Button with variants: primary, secondary, danger, ghost
- `src/components/ui/card.tsx` — Card, CardHeader, CardContent
- `src/components/ui/badge.tsx` — Badge with variants: default, success, danger, accent
- `src/components/ui/input.tsx` — Styled input with focus ring
- `src/components/ui/skeleton.tsx` — Pulse-animated placeholder
- `src/components/ui/table.tsx` — Table, TableHeader, TableBody, TableRow, TableHead, TableCell
- `src/components/ui/pagination.tsx` — Server-side pagination using Link with search params

All use Tailwind with design tokens. No UI framework. See design doc for exact implementations.

### Task 12: FileIcon component

**Files:**

- Create: `src/components/file/file-icon.tsx`

Maps MIME types to lucide-react icons with color coding. Handles: image, video, audio, pdf, archive, code, text, folder, and fallback.

### Task 13: Utility functions

**Files:**

- Create: `src/lib/utils.ts`

```typescript
export function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

export function formatExpiry(expiresAt: string): string {
  const diff = new Date(expiresAt).getTime() - Date.now();
  if (diff <= 0) return "Expired";
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (days > 0) return `${days}d ${hours % 24}h remaining`;
  return `${hours}h remaining`;
}

export function isTextType(mimeType: string): boolean {
  if (mimeType.startsWith("text/")) return true;
  return [
    "application/json",
    "application/javascript",
    "application/typescript",
    "application/xml",
    "application/yaml",
    "application/toml",
    "application/x-sh",
    "application/x-python",
  ].includes(mimeType);
}
```

**Commit all of Phase 4 together.**

---

## Phase 5: Landing Page

### Task 14: Landing page with token handler

**Files:**

- Modify: `src/app/page.tsx`
- Create: `src/app/buckets/route.ts` (redirect helper for form)
- Create: `src/components/auth/token-handler.tsx`

Landing page: if authenticated, redirect to /dashboard. Otherwise show bucket ID input.

TokenHandler client component: reads `?token=` from URL, POSTs to `/auth/set-token`, redirects to `/dashboard` on success, cleans URL.

The form submits to `/buckets?id=...` which redirects to `/buckets/{id}`.

**Commit after verifying build.**

---

## Phase 6: Public Bucket View

### Task 15: Bucket page with streaming

**Files:**

- Create: `src/app/buckets/[id]/page.tsx`
- Create: `src/app/buckets/[id]/loading.tsx`
- Create: `src/components/bucket/bucket-header.tsx`
- Create: `src/components/bucket/file-list.tsx`
- Create: `src/components/bucket/file-grid.tsx`
- Create: `src/components/bucket/readme-section.tsx`

**BucketHeader:** Server component showing name, description, file count, size, expiry countdown, ZIP download button.

**FileList:** Server component — table with icon, name, size, MIME type, modified date. Fixed 48px row height.

**FileGrid:** Server component — card grid with FileThumbnail previews. Same fixed card height.

**ReadmeSection:** Server component — finds README.md (case-insensitive) in current directory, renders via MarkdownRenderer. Shows nothing if no README.

**Bucket page:** Uses Suspense boundaries — BucketHeader streams first, FileList/FileGrid second, ReadmeSection last.

**View mode:** Read `cf-view-mode` cookie server-side to decide list vs grid.

**loading.tsx:** Skeleton matching the loaded layout.

**generateMetadata:** Title = bucket name. Description = file count + size.

---

## Phase 7: File Detail Page

### Task 16: File detail page with preview

**Files:**

- Create: `src/app/buckets/[id]/files/[...path]/page.tsx`
- Create: `src/app/buckets/[id]/files/[...path]/loading.tsx`
- Create: `src/components/file/code-block.tsx`
- Create: `src/components/file/markdown-renderer.tsx`

**CodeBlock:** Server component — first 50 lines as plain monospace with line numbers. "Show all" stub at bottom.

**MarkdownRenderer:** Server component — react-markdown + remark-gfm. Custom components:

- `a`: Rewrite relative links to `/buckets/{id}/files/{resolved}`
- `img`: Rewrite relative images to API content URL
- `code`: Fenced blocks get monospace styling

**File detail page:** Server component with Suspense. Fetches file metadata, shows:

- Header: icon, name, size, MIME badge, short URL, download button
- curl snippet: `curl -L {shortUrl} -o {filename}`
- Preview by MIME type: markdown, text/code, image, video, audio, PDF, fallback download

**generateMetadata:** Title = filename. Description = size + type.

---

## Phase 8: Dashboard

### Task 17: Dashboard layout with auth guard and nav

**Files:**

- Create: `src/app/dashboard/layout.tsx`
- Create: `src/components/dashboard/dashboard-nav.tsx`

DashboardNav: Links to Overview, Buckets, API Keys, Stats with lucide icons.

Layout: Server-side auth check — if not authenticated, redirect to `/?error=session_expired`. Metadata: `robots: noindex, nofollow`.

### Task 18: Dashboard overview page

**Files:**

- Create: `src/app/dashboard/page.tsx`
- Create: `src/components/dashboard/stats-card.tsx`

Fetches `GET /api/stats` with auth token. Shows grid of StatsCards: Buckets, Files, Storage, API Keys, Downloads.

### Task 19: API Key management page

**Files:**

- Create: `src/app/dashboard/keys/page.tsx`
- Create: `src/components/dashboard/create-key-form.tsx` (client component)
- Create: `src/components/dashboard/delete-key-button.tsx` (client component)

Server component fetches `GET /api/keys`. Table: prefix, name, created, last used, buckets, files, size.

CreateKeyForm: Client component — name input, POST to API, shows full key ONCE with copy button.

DeleteKeyButton: Client component — confirmation dialog, DELETE to API.

### Task 20: Bucket management pages

**Files:**

- Create: `src/app/dashboard/buckets/page.tsx`
- Create: `src/app/dashboard/buckets/[id]/page.tsx`
- Create: `src/components/dashboard/create-bucket-form.tsx` (client component)

Bucket list: Server component, paginated table. Search, sort, filter. `include_expired` toggle. Create bucket inline form.

Bucket detail: Server component. Edit form (name, description, expiry). File list with upload zone. Create upload token. Delete with confirmation.

### Task 21: Stats page

**Files:**

- Create: `src/app/dashboard/stats/page.tsx`

Server component fetching `GET /api/stats`. System totals + storage by owner breakdown table.

---

## Phase 9: SignalR Integration

### Task 22: SignalR client and hooks

**Files:**

- Create: `src/lib/signalr/client.ts`
- Create: `src/hooks/use-bucket-events.ts`
- Create: `src/hooks/use-file-events.ts`

**SignalR client:**

```typescript
import * as signalR from "@microsoft/signalr";

export function createFileHub(baseUrl: string) {
  return new signalR.HubConnectionBuilder()
    .withUrl(`${baseUrl}/hub/files`)
    .withAutomaticReconnect()
    .build();
}
```

**useBucketEvents:** Client hook — subscribes to bucket group, handles FileCreated/Updated/Deleted, merges into state initialized from server-rendered data.

**useFileEvents:** Client hook — subscribes to file group, returns `{ deleted: boolean, updatedAt?: string }`.

### Task 23: Wire SignalR into bucket and file pages

Create wrapper client components that:

- Take server-rendered initial data as props
- Use the hooks to subscribe to real-time updates
- Render the same FileList/FileGrid with live data

---

## Phase 10: Upload UX

### Task 24: Upload zone component

**Files:**

- Create: `src/components/file/upload-zone.tsx` (client component)

Features:

- Drag and drop zone with visual feedback (border highlight on drag over)
- Hidden file input for click-to-browse
- Per-file progress tracked via XMLHttpRequest or fetch with ReadableStream
- Multipart upload (POST) for normal files
- Streaming upload (PUT) for files > 100MB
- AbortController per file for cancellation
- Success/error/progress state per file
- Upload token passed via `?token=` query param when applicable

### Task 25: Upload token page

**Files:**

- Create: `src/app/buckets/[id]/upload/page.tsx`

Server component validates upload token from `?token=` search param against the API. Shows UploadZone if valid, error if invalid. No file listing, no admin UI.

---

## Phase 11: Preferences and Theme

### Task 26: Cookie-based preferences

**Files:**

- Create: `src/hooks/use-preferences.ts`
- Create: `src/components/ui/theme-toggle.tsx` (client component)
- Create: `src/components/bucket/view-mode-toggle.tsx` (client component)

Cookies: `cf-theme` (dark/light), `cf-view-mode` (list/grid), `cf-syntax-highlight` (true/false).

ThemeToggle: Reads cookie, toggles `light` class on `<html>`, sets cookie.

ViewModeToggle: Reads cookie, sets cookie, triggers router.refresh() to re-render server components with new preference.

---

## Phase 12: Docker and CI

### Task 27: Dockerfile and docker-compose

**Files:**

- Create: `Dockerfile`
- Create: `.dockerignore`
- Create: `docker-compose.yml`

Multi-stage Dockerfile: node:22-alpine build, standalone runtime.

docker-compose.yml: carbon-files API + frontend, shared network.

### Task 28: GitHub Actions CI

**Files:**

- Create: `.github/workflows/ci.yml`

Jobs: lint (prettier), typecheck (tsc), build (next build), docker (build + push to GHCR on main).

---

## Phase 13: Testing Setup

### Task 29: Vitest setup

Install vitest, @testing-library/react, @testing-library/jest-dom, jsdom, msw. Create vitest.config.ts. Write sample component test for Button. Verify tests pass.

### Task 30: Playwright setup

Install @playwright/test. Create playwright.config.ts. Write smoke test for landing page. Verify test runs.

---

## Phase 14: Final Polish

### Task 31: Short URL fallback route

**Files:**

- Create: `src/app/s/[code]/route.ts`

Redirects to API's `/s/{code}` endpoint.

### Task 32: README.md

Include: description, screenshot placeholder, quick start with Docker Compose, dev setup, API client regen workflow, env vars table, deployment notes.

### Task 33: Prettier config and format

Create `.prettierrc` if needed. Run `npx prettier --write .`. Commit.

### Task 34: Final verification

- `npx tsc --noEmit` — no type errors
- `npm run build` — successful build
- `npx prettier --check .` — clean formatting
- Manual smoke test against running API
