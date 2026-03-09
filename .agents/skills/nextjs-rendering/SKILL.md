---
name: nextjs-rendering
description: >-
  Provides expert guidance on Next.js rendering behavior, including static vs dynamic rendering, streaming, Suspense boundaries, and the prospective render system. Use when working with Next.js SSG, ISR, streaming, or server components.
---

## Core Concepts

### Static vs Dynamic Rendering

Understand that Next.js has exactly two rendering modes: **static** and **dynamic**. SSG and ISR are both static rendering—the only difference is whether all paths are generated at build time (SSG) or incrementally on-demand (ISR). The underlying mechanism is identical.

Static pages involve no compute at request time. They are built once, uploaded to a CDN, and replicated to edge locations globally. Dynamic pages execute in a configured region when requested.

This distinction explains three critical behaviors:
- Static content is faster because it requires no compute and is cached near the user
- Static content remains available if a region goes down; dynamic content does not
- Streaming is disabled for static content because there is no live render process to stream from

### The Prospective Render System

Cache components (`"use cache"`) trigger a two-phase rendering process:

1. **Warmup render (prospective render)**: Next.js searches for cached instances and fills those caches
2. **Instant check render**: A second render runs for a single tick, then aborts

This second render is how Next.js determines if something is async. Everything that resolves within that microtask is considered "instant" and therefore static. Anything that takes longer is dynamic.

### How Next.js Detects Dynamic Rendering

Async dynamic APIs (like `cookies()`, `headers()`, `searchParams`) are how Next.js determines if a route is dynamic. If any async operation cannot resolve within a single tick, the route becomes dynamic.

The `params` API is a special case: when used with `generateStaticParams`, the route is called once per item returned. Each call resolves instantly, making the route static despite being async.

```typescript
// Static: params resolves instantly for each generated path
export async function generateStaticParams() {
  return [{ slug: 'a' }, { slug: 'b' }]
}

export default async function Page({ params }: { params: { slug: string } }) {
  const { slug } = await params // Instant resolution
  return <div>{slug}</div>
}
```

## Patterns & Strategies

### Enabling Full Streaming Control

Wrap the HTML document with an empty Suspense boundary to block the server from rendering a page without a skeleton. Without a document outside the Suspense boundary, there is nothing to stream—the client receives nothing until the entire page resolves.

```tsx
// layout.tsx
import { Suspense } from 'react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        <Suspense fallback={null}>
          {children}
        </Suspense>
      </body>
    </html>
  )
}
```

This pattern ensures the shell (html, body) streams immediately while the page content can show fallbacks.

### Using Cache Components Correctly

Adding `"use cache"` to a page or its main component produces static output. This cached output:
- Will not stream
- Will not have "holes" (Suspense fallback slots)
- Behaves like a static page even if it contains async operations

```tsx
"use cache"

export default async function Page() {
  const data = await fetchData() // Cached, no streaming
  return <div>{data}</div>
}
```

Cache components can combine static and dynamic rendering within a single page, but the cached portions themselves are always static artifacts.

## Common Pitfalls

### Expecting Suspense Fallbacks During ISR Generation

Suspense boundary fallbacks do not display while generating ISR paths. Because ISR produces static content and static content involves no compute at request time, streaming is not enabled during generation. The page waits for all content to resolve before saving the static output.

Do not rely on Suspense fallbacks to improve perceived performance for the first visitor to an ISR path—they will see nothing until the full page is generated.

### Confusing SSG and ISR as Different Rendering Modes

Treat SSG and ISR as the same rendering mode with different generation timing. Both produce static artifacts with identical runtime characteristics. The only question is whether paths are generated at build time (SSG) or on first request (ISR). Do not expect different caching, streaming, or performance behavior between them.

### Misunderstanding Cache Component Streaming

Do not expect a `"use cache"` page to stream content or show Suspense fallbacks. Even with async operations inside, the entire cached output is a single static artifact. To enable streaming, keep the page itself uncached and use cache components for specific data-fetching subtrees instead.