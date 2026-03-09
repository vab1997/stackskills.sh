# Next.js Caching Detailed Guide

## Table of Contents

- [Core Concepts](#core-concepts)
- [API Specifics](#api-specifics)
- [Patterns & Strategies](#patterns--strategies)
- [Common Pitfalls](#common-pitfalls)
- [Build & Runtime Behavior](#build--runtime-behavior)

---

## Core Concepts

### The "use cache" Directive

The `"use cache"` directive does not immediately cache content. It marks a component or function as **cacheable**. The actual cache write occurs at build time during the pre-rendering phase. Think of it as an annotation that tells Next.js "this output is safe to cache."

```tsx
// Marks the component as cacheable — cache populated at build time
"use cache"

export default function ProductList() {
  return <div>...</div>
}
```

### Automatic Dynamic Hole Detection

Next.js automatically renders from top to bottom, going as deep as possible until encountering something dynamic. Cached functions are **not** considered dynamic. When dynamic content is detected, Next.js creates a "dynamic hole" — no `"use cache"` directive is required for this automatic behavior.

### The Two-Render Process

During build, two renders occur for each page:

1. **Warmup render (prospective render)** — Detects whether dynamic APIs are used. Any operation that doesn't resolve within a microtask is classified as dynamic.

2. **Final render** — Captures the actual output that becomes the pre-rendered content.

### Cache Snapshots

Every cacheable function receives a snapshot when called at build time. Using a `"use cache"` function inside a dynamic component only guarantees a cache hit if the snapshot was captured during the build. Otherwise, it serves as an in-memory cache only.

---

## API Specifics

### revalidatePath and revalidateTag

`revalidatePath` is actually `revalidateTag` under the hood — the path argument functions as a tag. When deciding between them, understand they share the same underlying mechanism.

```tsx
// These are conceptually similar
revalidatePath('/products')
revalidateTag('/products')
```

### revalidateTag vs updateTag

| Function | Behavior | Use Case |
|----------|----------|----------|
| `revalidateTag` | Stale-while-revalidate when used in server actions | Background refresh, users see stale then fresh |
| `updateTag` | Read-your-own-writes, purges previous cache immediately | When user must see their own changes immediately |

**Important:** `updateTag` cannot be used in route handlers.

### connection() Function

`connection()` is the stable replacement for `unstable_noStore()`. Use it to opt out of static rendering:

```tsx
import { connection } from 'next/server'

export default async function Page() {
  await connection()
  // This page is now dynamic
}
```

### unstable_cache vs "use cache: remote"

These have different persistence characteristics:

- `unstable_cache` — Persists **across deployments**
- `"use cache: remote"` — Does **NOT** persist across deployments

Choose based on whether cached data should survive redeployment.

### unstable_cache Timing

Functions wrapped with `unstable_cache` are considered **instant** by the Next.js render detection system. They won't trigger dynamic classification during the warmup render.

---

## Patterns & Strategies

### ISR-Like Behavior with "use cache"

Adding `"use cache"` to a page makes it work like Incremental Static Regeneration (ISR). The entire output is cached — caches cannot be partial. No dynamic holes are created.

To achieve ISR-like behavior for a path:
1. Add `"use cache"` to the top of the file, OR
2. Add `"use cache"` to the main exported component

```tsx
// Option 1: File-level
"use cache"

export default function Page() {
  return <div>Fully cached page</div>
}

// Option 2: Component-level
export default function Page() {
  "use cache"
  return <div>Fully cached page</div>
}
```

### Partial Caching with Suspense

When parts of a page need caching while others remain dynamic:

1. Leave the page **without** `"use cache"`
2. Add `"use cache"` to individual components that should be cached
3. Wrap dynamic components with Suspense boundaries

```tsx
// page.tsx — no "use cache" here
import { Suspense } from 'react'
import { CachedSidebar } from './CachedSidebar'
import { DynamicFeed } from './DynamicFeed'

export default function Page() {
  return (
    <div>
      <CachedSidebar /> {/* Has "use cache" internally */}
      <Suspense fallback={<Loading />}>
        <DynamicFeed /> {/* Dynamic, fetches fresh data */}
      </Suspense>
    </div>
  )
}
```

Alternative: Use parallel routes for the same separation.

### Suspense Boundaries with "use cache"

When using `"use cache"` on a component containing a Suspense boundary (with a data-fetching child), the behavior resembles ISR:

1. First request triggers the Suspense fallback
2. Content renders and result is cached
3. Subsequent requests serve cached content

To show dynamic content within the Suspense boundary on every request:
1. Extract static content to its own component
2. Add `"use cache"` only to the static component
3. Or use a parallel route with this approach

### Sharing Cached Values Between Layout and Page

When a cached value from a layout is needed in a page, cache the **function output** instead of the component. Call the same cached function in both locations:

```tsx
// lib/data.ts
import { unstable_cache } from 'next/cache'

export const getCachedUser = unstable_cache(
  async (id: string) => fetchUser(id),
  ['user-cache']
)

// layout.tsx
export default async function Layout({ children }) {
  const user = await getCachedUser('123')
  return <div><Nav user={user} />{children}</div>
}

// page.tsx
export default async function Page() {
  const user = await getCachedUser('123') // Cache hit
  return <Profile user={user} />
}
```

---

## Common Pitfalls

### Layout "use cache" Does Not Cascade

Setting `"use cache"` in a layout does **NOT** make child pages static. Each page must independently opt into caching. The layout and page are cached separately.

```tsx
// layout.tsx
"use cache"  // Only caches the layout itself

// page.tsx — still dynamic unless it also has "use cache"
export default function Page() {
  return <DynamicContent />
}
```

### generateStaticParams Requirements

Without `generateStaticParams`, dynamic pages fail because there's no Suspense boundary above when reading params.

**Requirement for ISR:** All dynamic pages with `generateStaticParams` should export at least one param to enable ISR behavior.

**Workaround when no params needed:** Return a placeholder and handle it in the component:

```tsx
export async function generateStaticParams() {
  return [{ id: '__placeholder__' }]
}

export default function Page({ params }) {
  if (params.id === '__placeholder__') {
    return null // or redirect
  }
  return <Content id={params.id} />
}
```

**Alternative workaround:** Add a `loading.tsx` file or wrap body content in an empty Suspense to block the server.

### Static Shell Generation

At least one param must be generated in `generateStaticParams` to actually generate a static shell for that route. Empty returns won't create shells.

### Short Cache Exclusion from Prefetch

Caches with a `stale` configuration under 30 seconds are considered "short cache" and are **excluded from runtime prefetch**. Account for this when setting aggressive revalidation times.

### Misreading Build Output

Static pages sometimes show as `ppr` in build logs. This is not a reliable indicator. The definitive way to verify a page is static: check for `x-nextjs-cache: HIT` header on the document request.

---

## Build & Runtime Behavior

### Edge Proxy Architecture

The proxy that returns the shell runs on the edge. It:
1. Returns the static shell immediately
2. Continues the request for dynamic content in parallel

If a region goes down, the proxy continues functioning — it's decoupled from the dynamic content servers.

### Cache Snapshot Timing

Cacheable functions get their snapshots at build time. When using a cached function in a dynamic component:
- **Build-time call:** Guaranteed cache hit on subsequent requests
- **Runtime-only call:** Serves as in-memory cache only, no persistence guarantee