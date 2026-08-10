import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion, useReducedMotion } from "framer-motion";
import appwriteService from "../appwrite/config";
import { Button, Container, PostCard } from "../components/index";
import AuthorChip from "../components/AuthorChip.jsx";
import PostCardSkeleton from "../components/PostCardSkeleton.jsx";
import formatDate from "../utils/formatDate";
import stripHtml from "../utils/stripHtml";

function FeaturedCard({ post }) {
  const { $id, title, featuredImage, content, $createdAt, authorName } = post;

  return (
    <Link
      to={`/post/${$id}`}
      className="group grid overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#111114] md:grid-cols-2"
    >
      <div className="aspect-video w-full overflow-hidden bg-stone-100 dark:bg-zinc-800 md:aspect-auto md:h-full">
        {featuredImage ? (
          <img
            src={appwriteService.getFileView(featuredImage)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400 dark:text-zinc-500">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <path d="m21 15-5-5L5 21" />
            </svg>
          </div>
        )}
      </div>

      <div className="flex flex-col justify-center gap-4 p-6 sm:p-8">
        <span className="text-xs font-medium tracking-[0.05em] text-indigo-600 uppercase dark:text-pink-400">
          Featured
        </span>
        <h2 className="font-display text-2xl leading-tight font-semibold text-stone-900 dark:text-white sm:text-3xl">
          {title}
        </h2>
        <p className="text-base leading-relaxed text-stone-500 line-clamp-3 dark:text-zinc-400">
          {stripHtml(content)}
        </p>
        <div className="flex items-center gap-3">
          {authorName && <AuthorChip name={authorName} />}
          <time
            dateTime={$createdAt}
            className="text-xs text-stone-400 dark:text-zinc-500"
          >
            {formatDate($createdAt)}
          </time>
        </div>
      </div>
    </Link>
  );
}

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const authStatus = useSelector((state) => state.auth.status);
  const reduceMotion = useReducedMotion();

  const gridVariants = {
    hidden: {},
    show: {
      transition: {
        staggerChildren: reduceMotion ? 0 : 0.06,
        delayChildren: reduceMotion ? 0 : 0.1,
      },
    },
  };
  const cardVariants = reduceMotion
    ? { hidden: {}, show: {} }
    : {
        hidden: { opacity: 0, y: 12 },
        show: {
          opacity: 1,
          y: 0,
          transition: { duration: 0.35, ease: "easeOut" },
        },
      };

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await appwriteService.getPosts();
        if (cancelled) return;
        setPosts(result?.documents ?? []);
        setError("");
      } catch (err) {
        if (cancelled) return;
        setError(err?.message || "Something went wrong while loading posts.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  const retry = () => {
    setError("");
    setLoading(true);
    setReloadKey((key) => key + 1);
  };

  const [featured, ...rest] = posts;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto mb-14 max-w-2xl text-center sm:mb-20">
          <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-stone-900 dark:text-white sm:text-5xl">
            Read. Write.{" "}
            <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
              Belong.
            </span>
          </h1>
          <p className="mt-5 text-lg leading-relaxed text-stone-600 dark:text-zinc-300">
            A modern editorial blog for thoughtful stories. Share what you
            know, and discover what others are writing.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            {authStatus ? (
              <Link to="/add-post">
                <Button size="lg">Write a post</Button>
              </Link>
            ) : (
              <Link to="/login">
                <Button size="lg">Sign in</Button>
              </Link>
            )}
            {authStatus ? (
              <Link to="/all-posts">
                <Button variant="secondary" size="lg">
                  All Posts
                </Button>
              </Link>
            ) : (
              <Link to="/signup">
                <Button variant="secondary" size="lg">
                  Create account
                </Button>
              </Link>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-8 flex flex-col items-center gap-4 rounded-xl border border-rose-200 bg-rose-50 p-6 text-center dark:border-rose-500/30 dark:bg-rose-500/10">
            <p className="text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
            <Button variant="secondary" size="sm" onClick={retry}>
              Try again
            </Button>
          </div>
        )}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <PostCardSkeleton key={i} />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-16 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-zinc-800 dark:text-zinc-500">
              <svg
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="M12 20h9" />
                <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4Z" />
              </svg>
            </div>
            <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-white">
              No posts yet — be the first!
            </h2>
            <p className="max-w-sm text-sm text-stone-500 dark:text-zinc-400">
              Share your first story with the community.
            </p>
            <Link to={authStatus ? "/add-post" : "/login"}>
              <Button>{authStatus ? "Write a post" : "Sign in to write"}</Button>
            </Link>
          </div>
        ) : (
          <motion.div
            className="space-y-12"
            variants={gridVariants}
            initial="hidden"
            animate="show"
          >
            {featured && (
              <motion.div variants={cardVariants}>
                <FeaturedCard post={featured} />
              </motion.div>
            )}
            {rest.length > 0 && (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((post) => (
                  <motion.div key={post.$id} variants={cardVariants}>
                    <PostCard {...post} />
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </Container>
    </section>
  );
}

export default Home;
