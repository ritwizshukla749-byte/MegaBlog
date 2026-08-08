# MegaBlog

A full-stack blog platform built with **React**, **Redux Toolkit**, **React Router**, and **Appwrite** as the backend-as-a-service. Authenticated users can write, edit, and delete posts with a rich text editor; anyone can browse and read published posts.

## Features

- User authentication (signup / login / logout) via Appwrite
- Protected routes for authenticated users
- Rich text editing with **TinyMCE** (self-hosted v6, MIT license — no API key required)
- Create, edit, and delete posts with optional featured images
- Image upload and delivery through Appwrite Storage
- Responsive post grid with hover cards
- Client-side routing with deep-link support (SPA)
- Environment-driven configuration (no hardcoded credentials)

## Tech Stack

- **React 19** + **Vite**
- **Redux Toolkit** (state) + **React Redux**
- **React Router DOM** (routing)
- **Tailwind CSS v4** (styling, via `@tailwindcss/vite`)
- **Appwrite** JS SDK (auth, database, storage)
- **TinyMCE** (self-hosted 6.8.6, MIT)
- **DOMPurify** (XSS-safe rendering of post HTML)

## Getting Started

### 1. Clone & install

```bash
git clone https://github.com/ritwizshukla749-byte/MegaBlog.git
cd MegaBlog
npm install
```

### 2. Configure environment variables

Create a `.env` file in the project root (copy from `.env.example`):

```bash
cp .env.example .env
```

| Variable                       | Description                          |
| ------------------------------ | ------------------------------------ |
| `VITE_APPWRITE_URL`            | Your Appwrite project endpoint       |
| `VITE_APPWRITE_PROJECT_ID`     | Appwrite project ID                  |
| `VITE_APPWRITE_DATABASE_ID`    | Database ID                          |
| `VITE_APPWRITE_COLLECTION_ID`  | Posts collection ID                  |
| `VITE_APPWRITE_BUCKET_ID`      | Storage bucket ID                    |

### 3. Run locally

```bash
npm run dev
```

## Appwrite Setup

1. Create a project at [Appwrite Cloud](https://cloud.appwrite.io) (or self-hosted).
2. Create a **Database** → **Posts collection** with these attributes:
   - `title` (string)
   - `content` (string)
   - `featuredImage` (string) — Appwrite file ID
   - `status` (boolean) — `true` = published, `false` = draft
   - `userId` (string)
   - **Slug is not an attribute** — the app uses the post slug as the Appwrite document ID.
3. Configure **collection permissions**: read = `any`, create/update/delete = `users`.
4. Add **indexes**: `status` and `$createdAt`.
5. Create a **Storage bucket** for featured images (read = `any`, write = `users`).
6. Copy the project/database/collection/bucket IDs into `.env`.

## Deployment (Vercel)

1. Push this repo to GitHub and import it in [Vercel](https://vercel.com).
2. Add the five `VITE_*` variables from `.env` to the project's **Environment Variables**.
3. Framework preset: **Vite** (auto-detected). Build command `npm run build`, output `dist`.
4. The included `vercel.json` rewrites all routes to `index.html` so deep links like `/post/:slug` work.
5. In the Appwrite Console, add your production domain (e.g. `https://megablog.vercel.app`) under
   **Project Settings → Domains**. Without this, requests from the deployed origin are blocked (CORS).

> **Note:** TinyMCE assets are self-hosted under `public/tinymce` (v6.8.6, MIT). No cloud CDN or API key is used, so the editor works offline and on any host.

## Available Scripts

| Command           | Description                |
| ----------------- | -------------------------- |
| `npm run dev`     | Start the dev server       |
| `npm run build`   | Build for production       |
| `npm run preview` | Preview the production build |
| `npm run lint`    | Run ESLint                 |

## License

MIT — see [LICENSE](./LICENSE).
