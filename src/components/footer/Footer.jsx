import { Link } from "react-router-dom";
import Logo from "../Logo.jsx";
import Container from "../container/Container.jsx";

const exploreLinks = [
  { name: "Home", to: "/" },
  { name: "All Posts", to: "/all-posts" },
  { name: "Add Post", to: "/add-post" },
];

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="border-t border-stone-200 bg-white dark:border-white/10 dark:bg-[#111114]">
      <Container>
        <div className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <Logo width="140px" />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-stone-500 dark:text-zinc-400">
              A modern editorial blog built with React, Redux Toolkit, and
              Appwrite. Write, share, and read stories worth your time.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-stone-900 uppercase dark:text-white">
              Explore
            </h3>
            <ul className="mt-4 space-y-2">
              {exploreLinks.map((link) => (
                <li key={link.to}>
                  <Link
                    to={link.to}
                    className="text-sm text-stone-600 transition-colors hover:text-indigo-600 dark:text-pink-500 dark:hover:text-pink-400"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold tracking-wide text-stone-900 uppercase dark:text-white">
              Connect
            </h3>
            <ul className="mt-4 space-y-2">
              <li>
                <a
                  href="https://github.com/ritwizshukla749-byte/MegaBlog"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-stone-600 transition-colors hover:text-indigo-600 dark:text-zinc-300 dark:hover:text-pink-400"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-stone-200 py-6 dark:border-white/10">
          <p className="text-center text-sm text-stone-500 dark:text-zinc-600">
            © {year} MegaBlog. All rights reserved.
          </p>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
