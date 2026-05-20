# Job Board Frontend

Next.js frontend for a Job Board application backed by a Laravel 13 REST API. The app uses Laravel Sanctum SPA authentication with cookie-based sessions, not JWT tokens.

## Tech Stack

- Next.js App Router with TypeScript
- React 19
- Tailwind CSS
- Axios with interceptors
- Zustand for auth state
- React Hook Form and Zod for forms
- Docker Compose for local full-stack development

> Note: this repository currently uses `next@16.2.6`. Next's bundled docs mark `middleware.ts` as deprecated in favor of `proxy.ts`, so route protection is implemented in `src/proxy.ts`.

## Backend

The frontend expects the Laravel API project at:

```text
C:\dashboard-api
```

Default API URL:

```text
http://localhost:8000
```

Required Laravel endpoints:

- `GET /sanctum/csrf-cookie`
- `POST /api/v1/auth/login`
- `POST /api/v1/auth/logout`
- `GET /api/v1/auth/me`

## Auth Flow

Login follows the Sanctum SPA sequence:

1. `GET /sanctum/csrf-cookie`
2. `POST /api/v1/auth/login`
3. `GET /api/v1/auth/me`
4. Save the authenticated user in Zustand
5. Protected routes call Laravel `/api/v1/auth/me` from `src/proxy.ts`

Axios is configured in `src/lib/axios.ts` with:

- `baseURL` from `NEXT_PUBLIC_API_URL`
- `withCredentials: true`
- XSRF cookie forwarding from `XSRF-TOKEN`
- `401` auth clear and redirect to `/login`
- `422` validation error extraction
- `500+` generic error toast

## Environment

Create a local env file from the example:

```powershell
copy .env.example .env.local
```

Current example values:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_INTERNAL_API_URL=http://localhost:8000
NEXT_TELEMETRY_DISABLED=1
```

For Docker, `.env.docker` is already included:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
NEXT_INTERNAL_API_URL=http://laravel-api:8000
NEXT_TELEMETRY_DISABLED=1
WATCHPACK_POLLING=true
CHOKIDAR_USEPOLLING=true
```

`NEXT_PUBLIC_API_URL` is used by the browser. `NEXT_INTERNAL_API_URL` is used by server-side route protection inside Docker.

## Local Development

Install dependencies:

```powershell
npm install
```

Run the frontend:

```powershell
npm run dev
```

Open:

```text
http://localhost:3000
```

The root route redirects to `/login`.

## Docker Development

The included `docker-compose.yml` runs:

- `laravel-api`: PHP 8.3-FPM + Nginx on port `8000`
- `nextjs-app`: Node 20 on port `3000`
- `mysql`: MySQL 8.0 with persistent volume
- `redis`: Redis 7 for cache and queues
- `mailpit`: email testing, UI on port `8025`

Run the full stack:

```powershell
docker compose up --build
```

Useful URLs:

- Frontend: `http://localhost:3000`
- Laravel API: `http://localhost:8000`
- Mailpit: `http://localhost:8025`

Both Laravel and Next.js source folders are bind-mounted for hot reload in development.

## Project Structure

```text
src/
  app/
    (auth)/
      login/page.tsx
      register/page.tsx
    (dashboard)/
      dashboard/page.tsx
      employer/jobs/page.tsx
      jobseeker/browse/page.tsx
    layout.tsx
    page.tsx
  components/
    ClientEventBridge.tsx
  hooks/
    useAuth.ts
  lib/
    auth.ts
    axios.ts
    client-events.ts
  store/
    authStore.ts
  types/
    api.types.ts
  proxy.ts
```

## Important Files

- `src/lib/axios.ts`: shared Axios instance and API error handling
- `src/lib/auth.ts`: Sanctum auth API helpers
- `src/store/authStore.ts`: Zustand auth state
- `src/hooks/useAuth.ts`: public auth hook for UI components
- `src/proxy.ts`: protected route guard
- `src/types/api.types.ts`: shared API interfaces
- `docker-compose.yml`: full local stack

## API Types

Shared TypeScript response models live in `src/types/api.types.ts`:

- `ApiResponse<T>`
- `User`
- `Job`
- `Application`
- `ValidationErrors`

Expected API wrapper:

```ts
{
  success: boolean;
  data: T;
  message: string;
  errors: Record<string, string[]> | null;
}
```

## Scripts

```powershell
npm run dev
npm run build
npm run start
npm run lint
```

## Verification

Before pushing changes:

```powershell
npm run lint
npm run build
docker compose config --quiet
```

## AI Disclosure

This project was scaffolded and iterated with AI assistance. The generated code was reviewed through linting and production build checks.
