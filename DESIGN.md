# MegaBlog — Design Specification

> Design system for the MegaBlog UI/UX redesign ("Modern Editorial").
> Scope: foundation, brand, layout, components, pages, states, dark mode, a11y, responsive.

## 1. Overview
Modern editorial style: strong serif typography for reading, clean sans UI, generous whitespace,
a single indigo→violet gradient accent, and full dark/light mode with a manual selector
(defaults to the OS preference on first visit, then persists the user's choice). Feels like a
publication, not a dashboard.

## 2. Brand
- **Name:** MegaBlog
- **Logo:** SVG wordmark — rounded-square gradient mark (indigo→violet) with a white "M" + "MegaBlog" in
  Sora SemiBold beside it. Prop: `width` (px). Used in header (~32px) and footer (~40px).
- **Favicon:** `public/favicon.svg` — the gradient "M" mark alone on transparent bg.
- **Page title:** `MegaBlog` (+ meta description).

## 3. Color System
Tailwind palette (built-in) + one gradient accent.

### Light mode
| Token | Value | Usage |
|---|---|---|
| bg | `stone-50 #fafaf9` | page background |
| surface | `white` | cards, header, forms |
| elevated | `stone-100` | hover fills |
| text-strong | `stone-900` | headings, body |
| text-muted | `stone-500` | secondary text, captions |
| border | `stone-200` | dividers, cards (inputs use `stone-300` for field visibility) |
| accent | indigo-500 → purple-500 gradient | primary buttons, links, active nav, hero |

### Dark mode (manual selector; defaults to OS preference)
"Neon Tokyo" — deep black base, neon-pink accent.
| Token | Value |
|---|---|
| bg | `#0a0a0c` |
| surface | `#111114` |
| elevated | `zinc-800 #27272a` |
| text-strong | `white` |
| text-muted | `zinc-400 #a1a1aa` |
| border | `white/10` (inputs `white/15`) |
| accent | `pink-500 #ff2d78` (links, active states, actions) |
| glow | `0 0 15px rgba(219,39,119,0.5)` on delete/primary actions |

Theme switching is **class-based**, not media-query based:
- `src/index.css` defines `@custom-variant dark (&:where(.dark, .dark *));` so `dark:` utilities
  key off a `.dark` class on `<html>`.
- Toggle button (sun/moon) in the header toggles a Redux `theme` slice (`toggleTheme`).
- Choice persisted to `localStorage` under `megablog-theme`; an inline `index.html` bootstrap script
  applies the saved (or system) theme before first paint to avoid a flash.
- On first visit (no saved value) the theme follows the OS; once the user toggles, their choice wins.

### Status
success `emerald-500` · danger `rose-500` · warning `amber-500` · info `sky-500`

### Gradients
- **Primary action:** `bg-gradient-to-r from-indigo-500 to-purple-500` (hover: `opacity-90`)
- **Hero accent text:** `bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent`

## 4. Typography
| Role | Font | Usage |
|---|---|---|
| Display | **Sora** | hero `h1`, post titles, featured card title |
| UI / Body | **Sora** (geometric sans) | nav, buttons, forms, body copy, metadata, article body copy |
| Mono | **JetBrains Mono** | code blocks in post content |

Loaded via Google Fonts in `index.html` with graceful system fallbacks.
- **Scale:** `h1` 2.5–3rem (post detail up to `text-6xl`), `h2` 1.5rem, body 1rem/1.6, small 0.875rem, caption 0.75rem
- **Weights:** 400/500/600/700/800; post detail headline `tracking-tight`
- Line height ~1.6 for reading; letter-spacing normal

## 5. Layout & Spacing
- **Container:** `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8` (max-w-6xl = 1152px)
- **Reading column:** `mx-auto max-w-3xl` → article body ~720px (`max-w-[720px]`) on the post page
- **Post grid:** `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (Home featured card spans 2 on `md+` as a 2-col split card)
- **Section rhythm:** `section-gap` 5rem desktop / 3rem tablet / fluid on mobile; 1rem mobile margin
- **Spacing scale:** Tailwind defaults (`space-y-6`, `py-16`, `gap-6`, …)
- **Radius:** large containers/cards `rounded-2xl`, functional `rounded-lg`, images `rounded-xl`
- **Depth (tonal layering, minimal shadows):** Level 0 = base canvas (light stone-50 / dark `#0a0a0c`); Level 1 = card (light white / dark `#111114`) + 1px border (light stone-200 / dark `white/10`); hover lift = `0 10px 25px -5px rgba(0,0,0,0.05)` + `-2px` translate; overlays/menus = 12px backdrop blur

## 6. Components

### Button
Props: `variant` (`primary` gradient / `secondary` white+border / `danger` rose), `size` (`sm`/`md`/`lg`), `loading` (spinner + disabled).
Focus: `focus-visible:ring-2 ring-indigo-500 ring-offset-2`.

### Input / Select
- Height `h-11`, `rounded-lg`, border `stone-300` / dark `white/15`, bg `white` / dark `#111114`,
  padding `px-4`, focus ring indigo (dark pink).
- Labels: small `font-semibold text-stone-700 dark:text-zinc-300` above field; error message in `rose-500`.
- `Select` styled like Input with chevron.

### PostCard
`Link` → `rounded-2xl` bordered card (light white / dark `#111114`, 1px light stone-200 / dark `white/10`).
Top: `aspect-video` image (`object-cover`, "No image" placeholder) → Sora title (2-line clamp) →
HTML-stripped excerpt (`line-clamp-2`) → byline row (author chip if `authorName` present, then formatted date).
Hover: soft shadow `0 10px 25px -5px rgba(0,0,0,0.05)` + `-translate-y-0.5`. Whole card clickable.
Category chip deferred (no category data yet; see §7 data notes).

### AuthorChip
Circular 24px gradient (indigo→purple) initials avatar + Sora Medium name label.

### PostCardSkeleton
`animate-pulse` card mirroring PostCard layout (image block + title/excerpt/date bars) for loading grids.

### Header
- Sticky, `backdrop-blur-xl bg-white/80 dark:bg-[#0a0a0c]/80`, `border-b` (`dark:border-white/5`).
- Left: Logo (→ `/`). Right: `<NavLink>`s — Home, All Posts, Add Post (auth) / Login, Signup (guest); ThemeToggle (sun/moon); Logout button (auth).
- Active NavLink: solid `bg-indigo-600 text-white` pill (`rounded-full px-4 py-1.5`); dark = neon pink glow
  (`dark:bg-pink-500/20 dark:text-pink-500 dark:border dark:border-pink-500/50`).
- Mobile (< `lg`): hamburger toggles a stacked menu (links + ThemeToggle + Logout).

### Footer
3 zones: brand blurb + logo · real links (Home, All Posts) · GitHub link.
Dark = `#111114` surface, pink links (`dark:text-pink-500 dark:hover:text-pink-400`).
Bottom bar: `© {currentYear} MegaBlog. All rights reserved.` (dark `zinc-600`).

### PageLoader / Skeletons
- Page loader: centered themed spinner.
- Skeletons: `animate-pulse` blocks mirroring card layout; skeletons for Home/AllPosts grids.

### Toast
`react-hot-toast`, `top-center`. Success (check) / error (x) toasts for login, signup, post created/updated/deleted.

## 7. Pages

### Home
1. **Hero:** serif display headline with gradient accent word, one-line sub, CTAs (primary: "Write a post" (auth) / "Sign in" (guest); secondary: "All Posts" (auth) / "Create account" (guest)).
2. **Featured:** first post as a large 2-col card (image left, content right on `md+`) with a "Featured" eyebrow.
3. **Grid:** remaining posts.
4. States: skeleton → empty ("No posts yet — be the first!" + CTA) → error banner + retry.

### All Posts
Serif page `h1` ("All Posts") + subtitle, `grid gap-6 sm:grid-cols-2 lg:grid-cols-3`.
Same skeleton/empty/error states.

### Data notes
- **Author:** posts store only `userId` (Appwrite can't fetch profiles client-side). Cards render the author chip
  only when `authorName` is present on the document; `PostForm` persists it for new/edited posts.
- **Category chip:** deferred — no category attribute exists yet.

### Post
Editorial "Post Detail (v3)" reading layout (centered `max-w-3xl`):
- Loading → `PageLoader`; not found/error → redirect home.
- Top bar above the hero image: `← Back to all posts` link (`text-sm font-medium text-stone-500`) on the
  left; author-only "Edit Post" (`border border-stone-300 text-stone-700 rounded-lg px-4 py-2`; dark =
  `dark:border-pink-500/30 dark:text-pink-500 dark:hover:bg-pink-500/10`) and "Delete Post"
  (`bg-red-700 text-white rounded-lg px-4 py-2` + trash icon; dark = `dark:bg-pink-600` +
  `dark:shadow-[0_0_15px_rgba(219,39,119,0.5)]`) on the right.
- Hero image: `aspect-video w-full object-cover rounded-2xl` (+ "No image" placeholder).
- Centered header: `h1` (`text-4xl sm:text-6xl font-bold tracking-tight`), derived intro (first ~140 chars of stripped
  content, `text-lg text-stone-500`), byline (avatar + "By {name}" via `AuthorChip` `size="md"
  showBy`, then "{date} • {X} min read" with `readingTime` from word count).
- Body: `.post-content` (`text-xl leading-relaxed`, light `stone-800` / dark `white`; `h2`
  `text-3xl font-bold mt-12 mb-6`; pull-quote `blockquote` left-aligned `border-l-4`
  `border-indigo-600` italic `text-2xl text-stone-600` — dark = neon pink `dark:bg-pink-500/5
  dark:border-pink-500 dark:p-8 dark:rounded-r-xl dark:text-pink-100`; code blocks `rounded-xl p-8`
  on `stone-100` / dark `#111114` + `border-white/10` + `shadow-inner`).
- Code blocks are syntax-highlighted via **highlight.js** (`hljs.highlightElement` on `.post-content pre code`);
  tokens = indigo/violet on light, neon pink/violet on dark (custom CSS, no stock theme).
  `DOMPurify.sanitize` + `html-react-parser` unchanged.
- Delete → `toast.success` / `toast.error`.
Intentionally omitted (mock-only in the spec): category tag, Like/Share, Subscribe, mock nav links.

### Auth (Login / Signup)
Single tabbed card (`src/components/Auth.jsx`) used by both `/login` and `/signup` routes — tabs are
URL-synced (Log In / Sign Up switch routes; refresh keeps the tab):
- Logo above the card: 48px icon-only gradient `M` mark in a white `rounded-md shadow-sm` container.
- Card: `max-w-md rounded-2xl`, `border-stone-200 dark:border-white/10`, `shadow-xl shadow-stone-200/50`.
- Tabs: active = `border-b-2 border-indigo-600 font-bold` + `stone-900` (dark: `dark:border-pink-500 dark:text-white`);
  inactive = `text-stone-400 hover:text-stone-600`.
- Heading `text-3xl font-bold`: "Welcome back" / "Create your account". Rose error banner on failure.
- Inputs with leading icons (envelope/lock/user), per global Input style; CTA `variant="auth"` (indigo-600→purple-600,
  `font-bold tracking-wide`, `shadow-lg shadow-indigo-200/60`, uppercase label) with `loading` spinner + double-submit guard.
- Below card: `© {year} MegaBlog.` + "Return to Home." link. Guest only (redirect if authed).

### Add / Edit Post (`PostForm`)
"Dashboard" layout `mx-auto max-w-6xl`, `grid gap-6 lg:grid-cols-3` (left `lg:col-span-2`, right `lg:col-span-1`).
Every group is a `rounded-2xl border` surface card (light white / dark `#111114`) with a Sora panel heading:
- **Content** (left): Title (`placeholder="Enter an engaging headline..."`), combined Slug input with static
  `megablog.com/` prefix (auto-slug from title), TinyMCE RTE (full toolbar + menubar, placeholder text). Stacked on mobile.
  RTE follows the theme via TinyMCE `oxide-dark` UI skin + `dark` content skin (remounts on toggle, content preserved).
- **Publish** (right): Status Select (Active/Inactive) + dual actions — `Save Draft` (secondary, sets
  `status:false`) and `Publish Post`/`Update Post` (primary gradient, sets `status:true`). Toasts on success/failure.
- **Featured Image** (right): dashed dropzone (`bg-stone-50`, upload icon, "PNG, JPG, JPEG, GIF · Max 5MB"),
  click or drag-drop, live preview via object URL (existing image via `getFileView` on edit).
  Selected images are **client-side resized before upload**: `resizeImage` downscales to ≤1600px on the
  longest edge at ~85% quality, keeping the original name/mime (PNG/GIF transparency preserved, JPEG fallback);
  same-size images pass through unchanged.
Page headings: "Create New Post" / "Edit Post" (`font-display text-3xl sm:text-4xl`).
Organization (Category/Tags) panel omitted — no schema fields.

## 8. States
| State | Pattern |
|---|---|
| Loading | `animate-pulse` skeletons; spinner in buttons |
| Empty | centered icon + message + CTA |
| Error | `rose` banner + retry; toast on mutations |

## 9. Post Content Typography (`.post-content`)
Stylized output for sanitized HTML: Sora `text-xl leading-relaxed` (light `stone-800` / dark `white`);
`h2` `text-3xl font-bold mt-12 mb-6`; paragraphs, lists; `blockquote` (pull-quote: left-aligned,
thick `border-l-4 border-indigo-600`, italic `text-2xl text-stone-600`; dark = neon pink
`dark:bg-pink-500/5 dark:border-pink-500 dark:p-8 dark:rounded-r-xl dark:text-pink-100`); `code`/`pre`
(mono, `rounded-xl p-8` on `stone-100`; dark = `#111114` + `border-white/10` + `shadow-inner`); links
(indigo underline; dark pink); images (`rounded-xl max-w-full h-auto`); tables (borders); hr.
Code blocks syntax-highlighted with highlight.js — indigo/violet tokens on light, neon pink/violet on dark.
Dark-mode aware.

## 10. Accessibility
- Visible `:focus-visible` rings everywhere
- Icon buttons have `aria-label`; nav is semantic `<nav>`; header `<header>`, footer `<footer>`
- Contrast ≥ 4.5:1 for body text
- `alt` text on all images
- Respect `prefers-reduced-motion` (disable non-essential transitions)

## 11. Responsive
Mobile-first. Breakpoints: `sm 640 · md 768 · lg 1024 · xl 1280`.
Nav collapses < `lg`; grids 1 → 2 → 3; form stacks; type scales down on small screens.

## 12. Implementation Map
| Area | Files |
|---|---|
| Tokens/base/prose | `src/index.css` |
| Theme (class-based dark) | `@custom-variant dark` in `index.css`, `src/store/themeSlice.js`, `src/components/ThemeToggle.jsx`, bootstrap script in `index.html` |
| Tailwind entry | move `@import "tailwindcss"` from `App.css` → `index.css`; empty `App.css` |
| Fonts/meta/favicon | `index.html`, `public/favicon.svg` |
| Brand | `src/components/Logo.jsx` |
| Layout | `src/App.jsx`, `Header.jsx`, `Footer.jsx`, `PageLoader.jsx`, `Container.jsx` |
| UI kit | `Button.jsx`, `Input.jsx`, `Select.jsx` |
| Pages | `Home.jsx`, `AllPosts.jsx`, `Post.jsx`, `PostForm.jsx` (auth via `Auth.jsx` component) |
| Syntax highlighting | `highlight.js` (`hljs.highlightElement` in `Post.jsx`; token CSS in `index.css`) |
| Image resize | `src/utils/imageResize.js` (client-side downscale ≤1600px / ~85% before upload) |
| Notifications | `react-hot-toast` (install) + `<Toaster>` in `App.jsx` |
