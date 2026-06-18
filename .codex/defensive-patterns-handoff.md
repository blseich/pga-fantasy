# Defensive Patterns Handoff

Date: 2026-06-17

## Goal

Track follow-up work for making API failures, data-source failures, and malformed
responses predictable across the PGA pick'em app.

## Summary

The app currently relies on happy-path assumptions at most external boundaries.
When the PGA Tour GraphQL endpoint, Supabase, route handlers, or browser fetches
fail, the most likely outcomes are route-level crashes, silent empty UI, stuck
loading overlays, or generic `{ success: false }` responses that the client
cannot distinguish.

## Prioritized Work

| Priority | Area | Files | Current Failure Mode | Recommendation | Suggested Tests |
| --- | --- | --- | --- | --- | --- |
| P0 | PGA Tour GraphQL wrapper | `lib/pga-endpoints/get-pga-endpoints.ts` | `fetch` failures, non-2xx responses, invalid JSON, GraphQL `errors`, or missing `data` are not handled. Callers destructure immediately, so pages can crash into `app/(base)/error.tsx`. | Add a typed PGA client boundary that checks `res.ok`, validates JSON shape, detects GraphQL `errors`, and returns either typed data or a domain-specific error. Decide whether pages should show stale/empty states or throw controlled errors. Consider request caching so one page does not call the endpoint multiple times. | Unit test non-2xx, invalid JSON, GraphQL errors, missing tournament/field/leaderboard, and successful shape. |
| P0 | Pick and tiebreaker mutation endpoints | `app/(api)/pick/route.ts`, `app/(api)/tiebreaker/route.ts` | `request.json()`, `auth.getUser()`, and `getTournament()` can throw. Invalid request bodies are accepted until database failure. All failures return status 200 with `{ success: false }`, except unhandled throws become 500. | Wrap route logic in `try/catch`, validate request payloads, return meaningful HTTP statuses (`400`, `401`, `403`, `409`, `502`, `500`) and stable error codes. Keep tournament-status guard. | Route tests for invalid JSON/body, unauthenticated user, tournament already started, Supabase upsert error, PGA outage, and success. |
| P0 | Client mutation handling | `features/golfer-selection/components/selection-button.tsx`, `features/tiebreaker-view/api/post-tiebreaker-change.ts` | `fetch` failures or non-JSON responses throw. Pick button sets `loading` to `true` and never resets on failure. Tiebreaker debounce ignores rejected promises and gives no visible feedback. | Use a small client helper that checks `res.ok`, safely parses JSON, catches network errors, resets loading in `finally`, and exposes user-visible failure state. Disable duplicate submissions while pending. | Component tests for failed pick request resetting loading, non-2xx response, malformed JSON, success redirect, and tiebreaker failure behavior. |
| P1 | Supabase read error handling | `utils/db/get-profile-link.ts`, `features/roster-view/utils/get-user-picks.tsx`, `features/tiebreaker-view/utils/get-current-tiebreaker-value.ts`, `features/rankings/utils/generate-rankings.tsx`, `features/leaderboard/utils/get-all-picks.ts`, `app/(base)/tiebreakers/page.tsx`, `app/(base)/user/[public_id]/page.tsx` | Most reads ignore `error`. `.single()` failures can turn into `/user/undefined`, empty roster/tiebreaker state, or missing headings. Some list queries silently render empty lists on infrastructure failures. | Add feature-local data loaders or a shared Supabase result helper that distinguishes not-found from query failure. Use `notFound()` for missing user profiles, controlled empty states for genuine no-data, and controlled errors/logging for infrastructure failures. | Tests for not-found profile, Supabase error, empty picks, empty tiebreakers, and valid data. |
| P1 | Leaderboard/ranking score parsing and empty leaderboard assumptions | `features/rankings/utils/generate-rankings.tsx`, `app/(base)/tiebreakers/page.tsx` | `leaderboard[0]` is assumed in rankings. `Number.parseInt()` can return `NaN` for `E`, `-`, `CUT`, `WD`, or unexpected PGA strings; `NaN` can break sorting. | Centralize PGA score parsing into a tested utility returning explicit states: numeric score, even, no-score, cut, withdrawn, unknown. Guard empty leaderboard before computing leading score. | Unit tests for `E`, negative scores, positive scores, `-`, `CUT`, `WD`, empty leaderboard, and malformed score strings. |
| P1 | DataGolf CSV ranking loader | `features/golfer-selection/utils/get-golfer-rankings.ts`, `features/golfer-selection/utils/get-golfer-selections.ts` | Missing CSV file, parse failure, unknown bucket, or malformed `player_name` can throw or return `undefined`, causing `.map()` failures. | Validate `bucket`, catch CSV load/parse errors at the loader boundary, type `cachedData`, and verify required CSV columns before returning selections. Return a controlled error or empty state for unavailable rankings. | Unit tests for unknown bucket, missing file, malformed record, valid bucket slices, and cache behavior. |
| P2 | Rostered golfer lookup | `features/roster-view/utils/get-rostered-golfer.tsx`, roster components | Missing field/leaderboard golfer returns `undefined` or `{ player: undefined }`, shifting the problem into render components. | Return a typed fallback golfer state with an explicit `status: 'missing' | 'field' | 'leaderboard'` instead of allowing undefined player data. | Component tests for missing golfer in field, missing golfer in leaderboard, and normal selected golfer render. |
| P2 | Auth action consistency | `app/(base)/actions.ts` | `resetPasswordAction` calls `encodedRedirect()` without `return`; this works only because `redirect()` throws. Sign-in does not validate missing credentials before Supabase call. | Return each redirect call for readability and consistency. Validate required form values before calling Supabase. | Action tests or focused unit tests around missing password fields and mismatched passwords. |
| P2 | Supabase environment validation | `utils/supabase/server.ts`, `utils/supabase/client.ts`, `utils/supabase/middleware.ts`, `utils/supabase/check-env-vars.ts` | Env vars use non-null assertions. Missing config can fail at runtime in multiple places. `check-env-vars.ts` exists but is not used here. | Add one explicit config accessor that throws a clear setup error server-side and avoids constructing clients with undefined values. | Unit test config accessor with missing and present env vars. |

## Auth Flow Review

| Priority | Flow | Files | Current Failure Mode | User Impact | Recommendation | Suggested Tests |
| --- | --- | --- | --- | --- | --- | --- |
| P0 | Sign in error display | `app/(auth)/sign-in/page.tsx`, `app/(base)/actions.ts` | `signInAction` redirects to `/sign-in?error=...`, but the sign-in page does not read `searchParams` or render `FormMessage`. | Bad credentials, inactive accounts, rate limits, and backend failures appear to do nothing. | Add `searchParams` to `LoginPage`, render `FormMessage`, and use `SubmitButton` for pending state. Map Supabase auth errors to clearer user-facing messages. | Invalid credentials show message, empty form shows validation message, successful sign-in redirects. |
| P0 | Password reset callback | `app/(api)/auth/callback/route.ts`, `app/(auth)/reset-password/page.tsx` | `exchangeCodeForSession()` errors are ignored. Missing/expired/invalid reset links still redirect to `/reset-password`, where update later fails generically. | Users can land on the change-password form with no valid recovery session and only see `Password update failed`. | Check `{ error }` from `exchangeCodeForSession()`. If exchange fails, redirect to `/forgot-password?error=...`. If no `code`, redirect to sign-in or forgot-password with a specific message. | Expired code redirects with useful message, missing code redirects, valid code reaches reset form. |
| P0 | Change password session guard | `app/(auth)/reset-password/page.tsx`, `app/(base)/actions.ts`, `utils/supabase/middleware.ts` | `/reset-password` is not listed as an auth route in middleware. Depending on session state, middleware may redirect away from the reset page. The page does not verify that a recovery session exists before showing the form. | Recovery links may be interrupted, and direct visits can show a form that cannot succeed. | Decide the intended access model: allow `/reset-password` only when a recovery session is present, otherwise redirect to `/forgot-password?error=Reset link required or expired`. Update middleware auth-route matching accordingly. | Recovery session can view reset form, unauthenticated direct visit gets helpful redirect, already-authenticated normal user behavior is defined. |
| P1 | Change password action feedback | `app/(base)/actions.ts` | Missing password, mismatch, update failure, and success paths call `encodedRedirect()` without `return`. Error handling is generic and does not distinguish expired session, weak password, same password, or auth service errors. | Users get vague or inconsistent feedback when password changes fail. | Return all redirects. Validate password length client and server side. Map Supabase errors to friendly messages such as expired reset link, password too short, or unable to update right now. | Missing fields, mismatch, weak password, expired session, Supabase failure, and success messages. |
| P1 | Forgot password feedback | `app/(base)/actions.ts`, `app/(auth)/forgot-password/page.tsx` | All Supabase reset errors become `Could not reset password`; unknown emails may behave according to Supabase settings. Optional `callbackUrl` is not validated. | Users cannot tell whether email format, rate limiting, or service failure caused the issue. | Validate email before Supabase call. Use neutral success messaging to avoid account enumeration. Map rate-limit/service errors to actionable messages. Validate or remove `callbackUrl`. | Missing email, invalid email, rate-limited reset, service error, success. |
| P1 | Auth message system | `components/form-message.tsx`, auth pages | Messages are plain query-string text. They are not announced to assistive tech, and pages apply inconsistent form components/styling. | Errors can be missed visually or by screen reader users. | Add `role="alert"`/`aria-live` for errors, consistent success/error styling, and use `FormMessage` on all auth pages. Consider typed message codes instead of raw text in URLs. | Message renders accessible alert, no message renders nothing, all auth pages display message. |
| P2 | Sign-in form validation | `app/(base)/actions.ts`, `app/(auth)/sign-in/page.tsx` | Server action casts `FormData` values to strings without checking. Browser `required` helps but is bypassable. | Malformed submissions go directly to Supabase and produce less precise errors. | Server-validate required email/password and normalize email before sign-in. | Missing email/password redirects with local validation message. |
| P2 | Auth route matching | `utils/supabase/middleware.ts` | Auth-route detection uses regex snippets and omits `/reset-password`. Matching can become brittle as auth routes grow. | Some auth pages can be protected or redirected incorrectly. | Replace regex with explicit route classification helpers, including `/reset-password`, and document intended behavior for authenticated users visiting auth pages. | Middleware tests or helper unit tests for each auth route and protected route. |

## Recommended Implementation Order

1. Harden `lib/pga-endpoints/get-pga-endpoints.ts` first. It is the highest
   blast-radius dependency and is used by home, rankings, leaderboard, roster,
   picker, tiebreaker, and mutation endpoints.
2. Update `/pick` and `/tiebreaker` route handlers to return stable HTTP
   contracts and error codes.
3. Update client mutation callers to handle the new route contract and recover
   loading state.
4. Fix auth flow visibility and recovery-link handling: display sign-in errors,
   check callback exchange errors, and guard reset-password access.
5. Add Supabase read result handling where `.single()` or ignored `error`
   currently affects navigation or user-facing pages.
6. Centralize score parsing and DataGolf CSV validation once the failure
   boundaries are predictable.

## Notes

- No production dependency is required for the first pass. If adding a runtime
  validation library such as Zod is desired later, ask for confirmation first.
- After modifying JavaScript or TypeScript files, run `npm test`.
- Prefer focused tests around utility boundaries and route handlers before
  broad page tests.
