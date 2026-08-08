import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import appwriteService from "../appwrite/config";
import { Button, Container, PostCard } from "../components/index";
import PostCardSkeleton from "../components/PostCardSkeleton.jsx";

function AllPosts() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        const result = await appwriteService.getPosts([]);
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

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <header className="mb-10 text-center sm:mb-12">
          <h1 className="font-display text-3xl font-semibold text-stone-900 dark:text-stone-100 sm:text-4xl">
            All Posts
          </h1>
          <p className="mt-3 text-base text-stone-500 dark:text-stone-400">
            Stories worth reading, written by our community.
          </p>
        </header>

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
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-stone-100 text-stone-400 dark:bg-stone-800 dark:text-stone-500">
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
            <h2 className="font-display text-xl font-semibold text-stone-900 dark:text-stone-100">
              No posts yet
            </h2>
            <p className="max-w-sm text-sm text-stone-500 dark:text-stone-400">
              Be the first to share a story with the community.
            </p>
            <Link to="/add-post">
              <Button>Write a post</Button>
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <PostCard key={post.$id} {...post} />
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}

export default AllPosts;
