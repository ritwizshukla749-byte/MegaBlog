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
  Inter SemiBold beside it. Prop: `width` (px). Used in header (~32px) and footer (~40px).
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
| border | `stone-200` | dividers, inputs, cards |
| accent | indigo-500 → purple-500 gradient | primary buttons, links, active nav, hero |

### Dark mode (manual selector; defaults to OS preference)
| Token | Value |
|---|---|
| bg | `stone-950 #0c0a09` |
| surface | `stone-900` |
| elevated | `stone-800` |
| text-strong | `stone-100` |
| text-muted | `stone-400` |
| border | `stone-800` |

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
| Display | **Source Serif 4** (serif) | hero `h1`, post titles, featured card title |
| UI / Body | **Inter** (sans) | nav, buttons, forms, body copy, metadata |
| Mono | **JetBrains Mono** | code blocks in post content |

Loaded via Google Fonts in `index.html` with graceful system fallbacks.
- **Scale:** `h1` 2.5–3rem, `h2` 1.5rem, body 1rem/1.6, small 0.875rem, caption 0.75rem
- **Weights:** sans 400/500/600/700; display 600/700
- Line height ~1.6 for reading; letter-spacing normal

## 5. Layout & Spacing
- **Container:** `mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8` (max-w-6xl = 1152px)
- **Reading column:** `mx-auto max-w-3xl` → article body ~720px (`max-w-[720px]`) on the post page
- **Post grid:** `grid gap-6 sm:grid-cols-2 lg:grid-cols-3` (Home featured card spans 2 on `md+` as a 2-col split card)
- **Section rhythm:** `section-gap` 5rem desktop / 3rem tablet / fluid on mobile; 1rem mobile margin
- **Spacing scale:** Tailwind defaults (`space-y-6`, `py-16`, `gap-6`, …)
- **Radius:** large containers/cards `rounded-2xl`, functional `rounded-lg`, images `rounded-xl`
- **Depth (tonal layering, minimal shadows):** Level 0 = base canvas (stone-50/950); Level 1 = white/stone-900 card + 1px border (stone-200/800); hover lift = `0 10px 25px -5px rgba(0,0,0,0.05)` + `-2px` translate; overlays/menus = 12px backdrop blur

## 6. Components

### Button
Props: `variant` (`primary` gradient / `secondary` white+border / `danger` rose), `size` (`sm`/`md`/`lg`), `loading` (spinner + disabled).
Focus: `focus-visible:ring-2 ring-indigo-500 ring-offset-2`.

### Input / Select
- Height `h-11`, `rounded-lg`, border `stone-200 dark:border-stone-800`, focus ring indigo.
- Labels: small `text-stone-600` above field; error message in `rose-500`.
- `Select` styled like Input with chevron.

### PostCard
`Link` → `rounded-2xl` bordered card (white/stone-900, 1px stone-200/800). Top: `aspect-video` image
(`object-cover`, "No image" placeholder) → serif title (2-line clamp) → HTML-stripped excerpt
(`line-clamp-2`) → byline row (author chip if `authorName` present, then formatted date).
Hover: soft shadow `0 10px 25px -5px rgba(0,0,0,0.05)` + `-translate-y-0.5`. Whole card clickable.
Category chip deferred (no category data yet; see §7 data notes).

### AuthorChip
Circular 24px gradient (indigo→purple) initials avatar + Inter Medium name label.

### PostCardSkeleton
`animate-pulse` card mirroring PostCard layout (image block + title/excerpt/date bars) for loading grids.

### Header
- Sticky, `backdrop-blur bg-white/70 dark:bg-stone-950/70`, `border-b`.
- Left: Logo (→ `/`). Right: `<NavLink>`s — Home, All Posts, Add Post (auth) / Login, Signup (guest); ThemeToggle (sun/moon); Logout button (auth).
- Active NavLink: `bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300` pill.
- Mobile (< `lg`): hamburger toggles a stacked menu (links + ThemeToggle + Logout).

### Footer
3 zones: brand blurb + logo · real links (Home, All Posts) · GitHub link.
Bottom bar: `© {currentYear} MegaBlog. All rights reserved.`

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
Back link → centered `max-w-3xl`: constrained image (`max-h-96 w-full object-cover rounded-2xl`),
serif title, byline (date, author), then `.post-content` typography. Author-only Edit/Delete actions.
`DOMPurify.sanitize` + `html-react-parser` unchanged.

### Login / Signup
Centered `max-w-md` card (surface + shadow). Logo, heading, fields, submit with `loading` spinner,
inline error banner on failure. Guest only (redirect if authed).

### Add / Edit Post (`PostForm`)
`lg`: two-column — left `w-2/3` (title, slug, RTE), right `w-1/3` (featured image + preview, status select,
submit). Stacked on mobile. Image resized client-side before upload.

## 8. States
| State | Pattern |
|---|---|
| Loading | `animate-pulse` skeletons; spinner in buttons |
| Empty | centered icon + message + CTA |
| Error | `rose` banner + retry; toast on mutations |

## 9. Post Content Typography (`.post-content`)
Stylized output for sanitized HTML: headings (serif), paragraphs, lists, `blockquote` (pull-quote:
large centered Source Serif 4 with indigo accent bars top & bottom), `code`/`pre` (mono, surface bg),
links (indigo underline), images (`rounded-xl max-w-full h-auto`), tables (borders), hr. Dark-mode aware.

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
| Pages | `Home.jsx`, `AllPosts.jsx`, `Post.jsx`, `Login.jsx`, `Signup.jsx`, `PostForm.jsx` |
| Image resize | `src/utils/imageResize.js` |
| Notifications | `react-hot-toast` (install) + `<Toaster>` in `App.jsx` |
