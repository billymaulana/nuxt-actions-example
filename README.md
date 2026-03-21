# nuxt-actions Example

Real-world examples for [nuxt-actions](https://github.com/billymaulana/nuxt-actions) v1.1.2 — type-safe server actions for Nuxt.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/billymaulana/nuxt-actions-example)

## Demos

| Page | Feature | Composable / Utility |
|------|---------|----------------------|
| `/actions` | CRUD with typed refs | `useAction` |
| `/forms` | Field errors, dirty tracking, reset | `useFormAction` |
| `/optimistic` | Instant UI + rollback | `useOptimisticAction` |
| `/streaming` | SSE text streaming | `useStreamAction` |
| `/queries` | SSR reactive queries + debounce | `useActionQuery` |
| `/middleware` | Auth + chain break behavior | `defineMiddleware` |
| `/advanced` | Retry, timeout, headers, dedupe, throttle, output validation | `useAction` |
| `/polling` | Auto-refetch, focus refetch, enabled toggle, transform | `useActionQuery` |
| `/infinite` | Cursor-based pagination | `useInfiniteActionQuery` |
| `/batch` | Parallel/sequential batch execution | `useActions` |
| `/security` | Rate limiting + CSRF protection | `rateLimitMiddleware`, `csrfMiddleware` |
| `/progressive` | Forms with/without JS | `useActionState` |
| `/real-world` | Auth + CRUD + polling + optimistic + validation | All composables |
| `/prefetch` | Pre-warm cache on hover, stream cache | `prefetchAction`, `useStreamActionQuery` |

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What's New in v1.1.0+

- **Nuxt 4 Compatibility** — Full support for Nuxt 4 module structure
- **useActionQuery Enhancements** — `refetchInterval`, `refetchOnFocus`, `refetchOnReconnect`, `enabled` toggle, and `transform`
- **useInfiniteActionQuery** — Cursor-based pagination with `fetchNextPage` / `hasNextPage`
- **useActions** — Batch execution of multiple actions (parallel or sequential)
- **useActionState** — Progressive enhancement for forms that work with and without JavaScript
- **prefetchAction** — Pre-warm the Nuxt data cache ahead of time (hover, route prefetch, idle)
- **useStreamActionQuery** — Streaming with persistent cache (restore chunks on remount)
- **rateLimitMiddleware** — In-memory rate limiting per IP with configurable window and limit
- **csrfMiddleware** — CSRF token protection with cookie/header matching and timing-safe comparison
- **returnValidationErrors** — Throw structured field-level validation errors from handlers
- **Action Colocation** — Define actions alongside pages or in any `server/actions/` subdirectory

## What This Demonstrates

- **E2E Type Inference** — Import typed action refs from `#actions` with zero generics
- **Standard Schema** — Zod validation with automatic field-level error formatting
- **Form Actions** — `useFormAction` with dirty tracking, field errors, and reset
- **Optimistic Updates** — Instant UI with automatic rollback on server error
- **SSR Queries** — Server-rendered data with reactive re-fetching
- **Streaming** — Real-time SSE chunks with `stop()` control
- **Middleware Chain** — Reusable auth/rate-limit middleware with typed context
- **Retry & Timeout** — Configurable retry with status code matching and request timeout
- **Dedupe & Throttle** — Cancel/defer duplicate requests and throttle rapid calls
- **Output Validation** — Server validates both input AND output schemas
- **Custom Headers** — Static and dynamic header passing per-request
- **executeAsync** — Throw-on-error alternative to `execute()`
- **Security Middleware** — Rate limiting and CSRF protection out of the box
- **Progressive Enhancement** — Native HTML form fallback with `useActionState`
- **Prefetch & Cache** — Pre-warm queries on hover, cache streamed results across navigations

## License

[MIT](./LICENSE)
