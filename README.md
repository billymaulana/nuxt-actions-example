# nuxt-actions Example

Real-world examples for [nuxt-actions](https://github.com/billymaulana/nuxt-actions) — type-safe server actions for Nuxt.

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/billymaulana/nuxt-actions-example)

## Demos

| Page | Feature | Composable |
|------|---------|------------|
| `/actions` | CRUD with typed refs | `useAction` |
| `/optimistic` | Instant UI + rollback | `useOptimisticAction` |
| `/streaming` | SSE text streaming | `useStreamAction` |
| `/queries` | SSR reactive queries | `useActionQuery` |
| `/middleware` | Auth + field validation | `defineMiddleware` |
| `/builder` | Shared middleware chain | `createActionClient` |
| `/errors` | Error codes + recovery | `createActionError` |

## Setup

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

## What This Demonstrates

- **E2E Type Inference** — Import typed action refs from `#actions` with zero generics
- **Standard Schema** — Zod validation with automatic field-level error formatting
- **Builder Pattern** — `createActionClient().use(middleware).schema().action()`
- **Optimistic Updates** — Instant UI with automatic rollback on server error
- **SSR Queries** — Server-rendered data with reactive re-fetching
- **Streaming** — Real-time SSE chunks with `stop()` control
- **Middleware Chain** — Reusable auth/rate-limit middleware with typed context
- **Error Handling** — Consistent format with custom codes and field errors

## License

[MIT](./LICENSE)
