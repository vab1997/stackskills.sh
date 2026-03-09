---
name: nextjs-caching
description: >-
  Provides expert guidance on Next.js caching behavior, including use cache directive, revalidation strategies, ISR patterns, and common pitfalls. Use when working with Next.js caching, revalidatePath, revalidateTag, use cache, or stale-while-revalidate patterns.
---

# Next.js Caching

## Core Mental Model

The `"use cache"` directive marks a component or function as **cacheable**, not cached. The actual cache write happens at build time during pre-rendering. Next.js automatically renders top-to-bottom until hitting something dynamic, creating "dynamic holes" — no `"use cache"` required for this behavior.

Two renders occur during build:
1. **Warmup render (prospective)** — detects dynamic API usage (anything not resolving in a microtask is dynamic)
2. **Final render** — captures actual output for pre-rendered content

## Key Distinctions

| API | Behavior |
|-----|----------|
| `revalidateTag` | Stale-while-revalidate in server actions |
| `updateTag` | Read-your-own-writes, purges cache immediately (not usable in route handlers) |
| `unstable_cache` | Persists across deployments |
| `"use cache: remote"` | Does NOT persist across deployments |
| `connection()` | Replacement for deprecated `unstable_noStore()` |

## Quick Rules

- `revalidatePath` internally uses `revalidateTag` — the path argument functions as a tag
- Adding `"use cache"` to a page makes it ISR-like: entire output cached, no dynamic holes
- Adding `"use cache"` to a layout does NOT make child pages static
- Cached functions are not considered dynamic during render detection
- `unstable_cache` functions are treated as instant (non-dynamic)
- Caches with `stale` < 30 seconds excluded from runtime prefetch

## ISR Pattern Requirements

To achieve ISR behavior:
1. Add `"use cache"` to the main exported component or top of file
2. Export at least one param from `generateStaticParams` to generate static shell
3. Without `generateStaticParams`, dynamic pages fail due to missing Suspense above params

## Determining Static Status

Build logs showing `ppr` don't reliably indicate static pages. Check `x-nextjs-cache: HIT` header on document requests for definitive verification.

## References

Consult these references for detailed guidance:

| Reference | When to use |
|-----------|-------------|
| [detailed-guide.md](./references/detailed-guide.md) | Full patterns for partial caching, Suspense strategies, generateStaticParams workarounds, and architecture decisions |