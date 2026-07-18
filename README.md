# AquaFlow Liberia — Digital Water Wallet

Frontend interactive prototype for AquaFlow Liberia. Built with React, TypeScript, Vite and Tailwind CSS. All data is persisted to `localStorage` — there is no backend yet, so the app starts empty and every action (sign up, deposit, dispense, card requests, etc.) writes real state that survives a refresh.

## Running locally

```bash
npm i
npm run dev
```

## Deploying to Vercel

This is a standard Vite app — push to a repo and import it in Vercel, or run `vercel` from this folder. Build command `npm run build`, output directory `dist` (already configured in `vercel.json`).

## Structure

```
src/
  app/
    components/   shared UI (design system + feature components)
    context/       app-wide state (auth, wallet, navigation)
    lib/           localStorage data layer, types, formatters
    pages/         one file per screen, grouped by flow
    App.tsx        shell + router
  styles/          design tokens & global styles
```

## Notes

- No demo accounts are pre-seeded — everything is created by the user at runtime.
- The storage layer (`src/app/lib/storage.ts`) is written as a small repository so it can be swapped for real API calls later without touching the UI.
