import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import { Container, Logo, LogoutBtn, ThemeToggle } from "../index";

const guestNav = [
  { name: "Home", path: "/" },
  { name: "Login", path: "/login" },
  { name: "Signup", path: "/signup" },
];

const authNav = [
  { name: "Home", path: "/" },
  { name: "All Posts", path: "/all-posts" },
  { name: "Add Post", path: "/add-post" },
];

function Header() {
  const authStatus = useSelector((state) => state.auth.status);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = authStatus ? authNav : guestNav;

  const navClass = ({ isActive }) =>
    `rounded-full px-4 py-2 text-sm font-medium transition-colors ${
      isActive
        ? "bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-300"
        : "text-stone-600 hover:text-stone-900 dark:text-stone-300 dark:hover:text-white"
    }`;

  return (
    <header className="sticky top-0 z-50 border-b border-stone-200 bg-white/70 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/70">
      <Container>
        <div className="flex h-16 items-center justify-between">
          <Link to="/" aria-label="MegaBlog home">
            <Logo width="112px" />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-1 lg:flex"
          >
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/"}
                className={navClass}
              >
                {item.name}
              </NavLink>
            ))}
            <ThemeToggle />
            {authStatus && <LogoutBtn />}
          </nav>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
            aria-label="Toggle navigation menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg text-stone-600 transition-colors hover:bg-stone-100 dark:text-stone-300 dark:hover:bg-stone-800 lg:hidden"
          >
            {menuOpen ? (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M6 6l12 12M18 6L6 18" />
              </svg>
            ) : (
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              >
                <path d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </Container>

      {menuOpen && (
        <nav
          id="mobile-nav"
          aria-label="Mobile"
          className="border-t border-stone-200 bg-white/95 backdrop-blur-md dark:border-stone-800 dark:bg-stone-950/95 lg:hidden"
        >
          <Container>
            <div className="flex flex-col gap-1 py-3">
              {navItems.map((item) => (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/"}
                  onClick={() => setMenuOpen(false)}
                  className={navClass}
                >
                  {item.name}
                </NavLink>
              ))}
              <div className="mt-2 flex items-center gap-2">
                <ThemeToggle />
                {authStatus && <LogoutBtn />}
              </div>
            </div>
          </Container>
        </nav>
      )}
    </header>
  );
}

export default Header;
