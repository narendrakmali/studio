# Copilot / AI Agent Instructions — Studio

Short actionable guide to be immediately productive working in this repository.

## Big picture
- This is a Next.js (App Router) frontend in `src/app` using React 19 and Tailwind ([package.json](package.json)).
- State, forms and validation: `react-hook-form` + `zod` (see `src/app/*/page.tsx` forms such as `/indoor-request` and `/outdoor-request`).
- Backend/data layer: Firebase + Data Connect. Firebase client wrappers live in `src/firebase` (see [src/firebase/index.ts](src/firebase/index.ts)).
- Generated Data Connect SDK lives in `src/dataconnect-generated` and is imported as `@dataconnect/generated` (local file dependency in [package.json](package.json)). If you modify connectors, regenerate the SDK.
- AI flows are implemented with Genkit under `src/ai` (see [src/ai/genkit.ts](src/ai/genkit.ts) and `src/ai/flows/*`). The dispatch page calls an AI helper flow in `src/app/dispatch/page.tsx`.

## Key files and entry points
- UI/layout and routing: [src/app/layout.tsx](src/app/layout.tsx) and pages under [src/app](src/app).
- Shared components: [src/components/ui](src/components/ui) (design system primitives used across pages).
- Firebase setup: [src/firebase/config.ts](src/firebase/config.ts) and provider at [src/firebase/provider.tsx](src/firebase/provider.tsx).
- DataConnect schema: `dataconnect/schema/schema.gql` and connector configs in `dataconnect/dataconnect.yaml`.
- Genkit/AI dev runner: [src/ai/dev.ts](src/ai/dev.ts).

## Developer workflows (concrete commands)
- Start dev Next.js (with Turbopack, port 9002):
  - `npm run dev` (runs `next dev --turbopack -p 9002`).
- Run Genkit AI flows locally:
  - `npm run genkit:dev` (start genkit for `src/ai/dev.ts`)
  - `npm run genkit:watch` (watch mode)
- Build / production:
  - `npm run build` then `npm run start`.
- Type checking and linting:
  - `npm run typecheck` and `npm run lint`.

## Patterns & conventions (project-specific)
- Form validation: Use `zod` schemas and wire into `react-hook-form` via `@hookform/resolvers` — examples in `src/app/*/page.tsx` (search for `z.object(`).
- UI composition: Prefer primitives from `src/components/ui/*` (Button, Dialog, Table, Form inputs) rather than ad-hoc HTML.
- Polling: Several pages poll Firestore frequently (e.g., dashboard/requests poll every 500ms). Be cautious when changing to avoid high read costs — see [src/app/dashboard/page.tsx](src/app/dashboard/page.tsx).
- Camera & media capture: Reception flow uses `getUserMedia()` with canvas capture — see [src/app/reception/page.tsx](src/app/reception/page.tsx).
- DataConnect usage: Use generated hooks or action functions from `@dataconnect/generated/react` when available; wrap app in TanStack Query provider if you add new DataConnect React hooks (see `src/dataconnect-generated/react/README.md`).

## Integration points / external dependencies
- Firebase (auth, firestore, storage): configured in `src/firebase` and used throughout the app.
- Data Connect (generated SDK) under `src/dataconnect-generated` — if connector/schema changes, regenerate the SDK and ensure `@dataconnect/generated` local dependency is updated.
- Genkit / Google GenAI: AI flows depend on `genkit` packages and `@genkit-ai/google-genai` — check `src/ai` flows for expected input shapes.

## When editing or adding code
- Keep shared UI in `src/components/ui` and use exported primitives.
- Add Zod schemas next to forms and export when reusable (`src/lib/types.ts` holds project types).
- If adding DataConnect operations, update `dataconnect/schema/schema.gql` and regenerate the SDK; runtime expects the local `@dataconnect/generated` package.

## Quick examples (copy-paste intent)
- Initialize DataConnect (emulator):
  ```ts
  import { getDataConnect, connectDataConnectEmulator } from 'firebase/data-connect';
  import { connectorConfig } from '@dataconnect/generated';
  const dc = getDataConnect(connectorConfig);
  connectDataConnectEmulator(dc, 'localhost', 9399);
  ```
- Start app + Genkit during feature development:
  ```bash
  npm run dev     # Next.js on :9002
  npm run genkit:dev   # Genkit flow runner
  ```

## Unknowns / things to ask the maintainers
- Is there a CI workflow that regenerates `src/dataconnect-generated` or is regeneration manual?
- Any environment variables (Firebase, GenAI keys) with non-standard names? (check `.env` usage in `src/firebase/config.ts`)

---
If anything above looks incomplete or you want examples for a specific page or flow, tell me which area to expand. I can iterate.
