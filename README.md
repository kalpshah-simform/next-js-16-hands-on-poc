# Next.js 16 Fullstack POC

A production-style POC built with Next.js 16 App Router, Auth.js credentials authentication, Prisma, PostgreSQL, Server Actions, and Zod validation.

## Architecture

This repo demonstrates one complete user journey:

1. User signs up with email/password.
2. User logs in and gets an authenticated session.
3. User accesses protected routes.
4. User creates, edits, and deletes posts persisted in PostgreSQL.

Core layers:

- Routing/UI: `src/app` route groups for auth and protected sections.
- Mutations: server actions in `src/actions`.
- Data: Prisma client via `src/lib/db.ts` and `prisma/schema.prisma`.
- Validation: Zod schemas in `src/lib/validations.ts`.
- Auth: Auth.js credentials provider in `src/lib/auth.ts`.
- Security edge checks: `proxy.ts` protected-route redirect and headers.

## Tech Stack

- Next.js 16.2.0
- React 19
- TypeScript
- Tailwind CSS
- Auth.js (`next-auth` v5 beta)
- Prisma ORM + PostgreSQL
- Zod

## Project Structure

```text
src/
	app/
		(auth)/
			login/page.tsx
			signup/page.tsx
		(protected)/
			dashboard/page.tsx
			posts/page.tsx
			posts/new/page.tsx
			posts/[id]/edit/page.tsx
		api/
			auth/[...nextauth]/route.ts
			posts/route.ts
		error.tsx
		not-found.tsx
		robots.ts
		sitemap.ts
	actions/
		auth-actions.ts
		post-actions.ts
	components/
		auth/
			login-form.tsx
			signup-form.tsx
		posts/
			new-post-form.tsx
			edit-post-form.tsx
		ui/
			form-submit-button.tsx
	lib/
		auth.ts
		db.ts
		env.ts
		logger.ts
		password.ts
		validations.ts

prisma/
	schema.prisma
	seed.mjs
	migrations/

proxy.ts
```

## Environment Variables

Use `.env.example` as the base. Required values:

```env
DATABASE_URL=
AUTH_SECRET=
NEXTAUTH_URL=
LOG_LEVEL=info
NEXT_PUBLIC_APP_NAME=Next16 Fullstack POC
```

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy env file and configure values:

```bash
cp .env.example .env.local
```

3. Generate Prisma client:

```bash
npm run prisma:generate
```

4. Run migration:

```bash
npm run prisma:migrate:dev -- --name init
```

5. Seed demo data:

```bash
npm run prisma:seed
```

6. Start the app:

```bash
npm run dev
```

## Seeded Demo Credentials

After `npm run prisma:seed`:

- Email: `demo@example.com`
- Password: `Password123!`

## Scripts

- `npm run dev`: Start development server.
- `npm run lint`: Run ESLint.
- `npm run typecheck`: Run TypeScript checks.
- `npm run build`: Build production bundle.
- `npm run prisma:generate`: Generate Prisma client.
- `npm run prisma:migrate:dev`: Apply development migrations.
- `npm run prisma:migrate:deploy`: Apply migrations for deployment.
- `npm run prisma:seed`: Seed demo data.
- `npm run prisma:studio`: Open Prisma Studio.

## Auth and Security Notes

- Auth uses credentials provider and JWT session strategy.
- `proxy.ts` redirects unauthenticated users from protected routes to login.
- Security headers are applied centrally in `proxy.ts`.
- Server actions enforce ownership checks before post update/delete operations.

## Validation and Error Handling

- Login, signup, new post, and edit post forms use `useActionState` for inline field-level errors.
- Global runtime failures are handled by `src/app/error.tsx`.
- Missing pages are handled by `src/app/not-found.tsx`.

## Production Readiness Checklist

- `npm run lint`
- `npm run typecheck`
- `npm run build`
- Verify env variables are set in deployment platform.
- Run `npm run prisma:migrate:deploy` in deployment pipeline.
