# nuxt-actions Example

Real-world examples for [nuxt-actions](https://github.com/billymaulana/nuxt-actions) — type-safe server actions for Nuxt.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/billymaulana/nuxt-actions-example)

## Demos

| Page | Feature | Composable |
|------|---------|------------|
| `/actions` | CRUD with typed refs | `useAction` |
| `/forms` | Field errors, dirty tracking, reset | `useFormAction` |
| `/optimistic` | Instant UI + rollback | `useOptimisticAction` |
| `/streaming` | SSE text streaming | `useStreamAction` |
| `/queries` | SSR reactive queries + debounce | `useActionQuery` |
| `/middleware` | Auth + chain break behavior | `defineMiddleware` |
| `/advanced` | Retry, timeout, headers, dedupe, throttle, output validation | `useAction` |

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

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

## License

[MIT](./LICENSE)
