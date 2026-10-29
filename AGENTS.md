<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Bolsillo Roto / Zenubit

- Contexto canónico: `docs/CONTEXTO.md`; diseño: `docs/DISENO.md`; contratos: `docs/API.md`.
- Next.js App Router, TypeScript, React Hook Form + Zod y Supabase.
- Comandos: `npm ci`, `npm run dev`, `npm run typecheck`, `npm test`, `npm run build`.
- Única base autorizada: Supabase bolsillo-roto, ref `kgergeimnxcyptffvmnp`. No crear bases/ramas paralelas ni probar con escrituras en datos reales sin concretar el alcance autorizado.
- Usar migraciones versionadas. RLS y propietario deben verificarse en servidor/base. Nunca publicar `.env.local`, service_role ni API Keys.
- `/demo` usa datos ficticios locales; no usarla para afirmar integración real.
- Finanzas en COP y centavos; no reemplazar cálculos SQL por valores del navegador.
- Mantener marca original y firma discreta Creado por Zenubit → https://zenubit.com.
