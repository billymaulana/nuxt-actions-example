# nuxt-actions Example

Real-world examples for [nuxt-actions](https://github.com/billymaulana/nuxt-actions) v1.3.0 — type-safe server actions for Nuxt.

<p>
  <a href="https://npmjs.com/package/nuxt-actions"><img src="https://img.shields.io/npm/v/nuxt-actions/latest.svg?style=flat&colorA=020420&colorB=00DC82" alt="npm version"></a>
  <a href="https://npmjs.com/package/nuxt-actions"><img src="https://img.shields.io/npm/l/nuxt-actions.svg?style=flat&colorA=020420&colorB=00DC82" alt="License"></a>
  <a href="https://nuxt.com"><img src="https://img.shields.io/badge/Nuxt-020420?logo=nuxt" alt="Nuxt"></a>
</p>

<p>
  <a href="https://billymaulana.github.io/nuxt-actions/">Documentation</a> |
  <a href="https://stackblitz.com/github/billymaulana/nuxt-actions-example">StackBlitz Playground</a> |
  <a href="https://github.com/billymaulana/nuxt-actions">Source</a>
</p>

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/billymaulana/nuxt-actions-example)

## Demos

| Page | Feature | Composable / Utility |
|------|---------|----------------------|
| `/actions` | CRUD with E2E typed action refs | `useAction` |
| `/forms` | Field-level errors, dirty tracking, reset | `useFormAction` |
| `/optimistic` | Instant UI + automatic rollback | `useOptimisticAction` |
| `/mutations` | Smart cache — a write auto-refetches every tagged query | `useActionMutation` |
| `/uploads` | multipart/form-data parsed into typed file fields | `useAction`, `ActionFile` |
| `/auth` | Protect actions, resolve `ctx.user`, reject with 401 | `defineAuthMiddleware` |
| `/openapi` | Generate an OpenAPI 3.1 doc + Swagger UI from actions | `openapi` module option |
| `/payments` | Double-click-safe payments — duplicates replay, not re-charge | `idempotency` option |
| `/observability` | Global action hooks for analytics + grouped `actions.admin.metrics` | `action:*` hooks |
| `/resilience` | Exponential retry backoff, `cancelPrevious` search, `cancel()` | `useAction` |
| `/streaming` | SSE text streaming with stop control | `useStreamAction` |
| `/queries` | SSR queries + debounced search + transform | `useActionQuery` |
| `/middleware` | Auth chain, skip behavior, typed context | `defineMiddleware` |
| `/advanced` | Retry, timeout, headers, dedupe, throttle, output validation | `useAction` |
| `/polling` | Auto-refetch, focus/reconnect refetch, enabled toggle, transform | `useActionQuery` |
| `/infinite` | Cursor-based infinite scroll | `useInfiniteActionQuery` |
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

## All Available Composables & Utilities

### Client Composables

| Composable | Description |
|------------|-------------|
| `useAction` | Core composable — reactive state, retry, dedupe, debounce, throttle, transform |
| `useActionMutation` | Write action that auto-refetches affected queries (typed refs and/or tags) |
| `useFormAction` | Form-aware — field-level errors, dirty tracking, v-model support |
| `useOptimisticAction` | Instant UI updates with automatic rollback on server error |
| `useActionQuery` | SSR queries via `useAsyncData` — polling, focus/reconnect refetch, transform |
| `useStreamAction` | SSE streaming with chunk accumulation and stop control |
| `useStreamActionQuery` | Streaming with persistent cache across navigations |
| `useInfiniteActionQuery` | Cursor-based pagination — `fetchNextPage`, `hasNextPage` |
| `useActions` | Batch execution — parallel (`Promise.allSettled`) or sequential |
| `useActionState` | Progressive enhancement — native HTML form fallback |
| `prefetchAction` | Pre-warm Nuxt data cache on hover, route prefetch, or idle |
| `invalidateActions` | Refetch cached data for specific or all action queries |
| `clearActionCache` | Clear cached data without refetching |

### Server Utilities

| Utility | Description |
|---------|-------------|
| `defineAction` | Type-safe server actions with Standard Schema validation |
| `defineStreamAction` | Streaming server actions via SSE |
| `createActionClient` | Builder pattern — chain middleware, schema, metadata |
| `defineMiddleware` | Reusable middleware with typed context accumulation |
| `defineAuthMiddleware` | Auth preset — resolve `ctx.user` or reject with a typed 401 |
| `createMiddleware` | Alias for publishable middleware (npm packages) |
| `createActionError` | Typed error creation with field-level details |
| `returnValidationErrors` | Throw structured validation errors from handlers |
| `rateLimitMiddleware` | In-memory rate limiting per IP |
| `csrfMiddleware` | CSRF token protection with timing-safe comparison |
| `invalidateActions` / `invalidateTags` | Refetch action queries by reference, path, or tag |

## What's New in v1.3.0

- **Idempotency** — `idempotency` option replays duplicate `Idempotency-Key` requests instead of re-running the handler (double-charge protection). See `/payments`.
- **Global action hooks** — `action:start/success/error/settled` on `nuxtApp` for analytics, toasts, and monitoring. See `/observability`.
- **Retry backoff** — `retry: { backoff: 'exponential' | 'linear', maxDelay, jitter }`. See `/resilience`.
- **`cancelPrevious` + `cancel()`** — abort the previous/in-flight request for stale-free type-ahead search. See `/resilience`.
- **Typed error codes** — `ActionErrorCode` union + client-side `isActionError`.
- **Grouped namespace** — `actions.admin.metrics` mirrors the directory structure alongside flat exports.

## What's New in v1.2.0

- **Smart Cache Invalidation** — `useActionMutation` auto-refetches the queries a write affects, targeting typed action references and/or string tags. Adds `invalidateTags()` and a `tags` option on `useActionQuery`. See `/mutations`.
- **File Uploads** — `multipart/form-data` requests are parsed into typed `{ filename, type, data }` file fields. See `/uploads`.
- **Auth Preset** — `defineAuthMiddleware` resolves the current user into `ctx.user` or rejects with a typed 401. See `/auth`.
- **OpenAPI & Swagger UI** — generate an OpenAPI 3.1 document (and optional Swagger UI) from your actions via the `openapi` module option. See `/openapi`.
- **CLI Scaffolding** — `npx nuxt-actions add <name>` generates a typed action file.
- **DevTools** — the actions tab lists each endpoint with a ready-to-copy curl snippet.

This example runs on **Nuxt 4**.

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
- **SSR Queries** — Server-rendered data with reactive re-fetching and transform
- **Streaming** — Real-time SSE chunks with `stop()` control and persistent cache
- **Middleware Chain** — Reusable auth/rate-limit middleware with typed context accumulation
- **Retry & Timeout** — Configurable retry with status code matching and request timeout
- **Dedupe & Throttle** — Cancel/defer duplicate requests and throttle rapid calls
- **Output Validation** — Server validates both input AND output schemas
- **Custom Headers** — Static and dynamic header passing per-request
- **executeAsync** — Throw-on-error alternative to `execute()`
- **Security Middleware** — Rate limiting and CSRF protection out of the box
- **Progressive Enhancement** — Native HTML form fallback with `useActionState`
- **Prefetch & Cache** — Pre-warm queries on hover, cache streamed results across navigations
- **Cache Management** — `invalidateActions` and `clearActionCache` for fine-grained cache control
- **Infinite Scroll** — Cursor-based pagination with SSR first page
- **Smart Cache Invalidation** — A mutation auto-refetches every query under a shared tag
- **File Uploads** — `multipart/form-data` parsed into typed file fields
- **Auth Preset** — `defineAuthMiddleware` for `ctx.user` resolution and 401 rejection
- **OpenAPI** — Generated OpenAPI 3.1 document and Swagger UI from your actions

## License

[MIT](./LICENSE)
