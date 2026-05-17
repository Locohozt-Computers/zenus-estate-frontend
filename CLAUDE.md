# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Related Projects

The **backend** for this frontend lives one directory up:

```
../zenu-estate-backend/
```

Full path: `/Users/akeem/Documents/personal_projects/zenus-estate/zenu-estate-backend`

Refer to `../zenu-estate-backend/CLAUDE.md` for backend architecture, API routes, and multi-tenancy details.

## Dev Setup

```bash
npm install
npm start        # Runs on port 7000
npm run build
npm test
npm run lint     # ESLint on src/ (.ts/.tsx)
```

## Environment Variables

Copy `.env.sample` to `.env` and fill in:

```
REACT_APP_BASE_URL=http://127.0.0.1:9005/api
REACT_APP_PAYSTACK_KEY=
PORT=7000
```

## Architecture

- **Routing**: React Router v6, lazy-loaded pages in `src/pages/`, protected via `PrivateRoute`/`ProtectedRoute`
- **State**: Redux Toolkit + Redux Persist (auth/client state); React Query v4 (server state)
- **API client**: Axios instance in `src/api/request.ts` — reads `REACT_APP_BASE_URL`, attaches Bearer token, handles 401 by dispatching logout
- **Forms**: Formik + Yup
- **Styling**: Styled Components + Tailwind CSS
- **Constants/routes**: `src/app-constants/`
- TypeScript `baseUrl` is `./src`, enabling absolute imports like `pages/HomePage`
