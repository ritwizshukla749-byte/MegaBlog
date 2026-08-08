import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import appwriteService from "../appwrite/config";
import { Container, PageLoader } from "../components";
import AuthorChip from "../components/AuthorChip.jsx";
import formatDate from "../utils/formatDate";
import readingTime from "../utils/readingTime";
import parse from "html-react-parser";
import DOMPurify from "dompurify";
import { useSelector } from "react-redux";
import hljs from "highlight.js/lib/common";

export default function Post() {
  const [post, setPost] = useState(null);
  const { slug } = useParams();
  const navigate = useNavigate();

  const userData = useSelector((state) => state.auth.userData);

  const isAuthor = post && userData ? post.userId === userData.$id : false;

  useEffect(() => {
    if (!slug) {
      navigate("/");
      return;
    }

    let cancelled = false;

    appwriteService
      .getPost(slug)
      .then((post) => {
        if (cancelled) return;
        if (post) {
          setPost(post);
        } else {
          navigate("/");
        }
      })
      .catch((err) => {
        if (cancelled) return;
        console.error("Error fetching post:", err);
        navigate("/");
      });

    return () => {
      cancelled = true;
    };
  }, [slug, navigate]);

  const deletePost = async () => {
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    try {
      const status = await appwriteService.deletePost(post.$id);
      if (!status) throw new Error("Delete failed");
      if (post.featuredImage) {
        await appwriteService.deleteFile(post.featuredImage);
      }
      toast.success("Post deleted");
      navigate("/");
    } catch (err) {
      console.error("Error deleting post:", err);
      toast.error("Could not delete the post. Please try again.");
    }
  };

  const loading = post === null;

  useEffect(() => {
    if (!post) return;
    const codes = document.querySelectorAll(".post-content pre code");
    codes.forEach((el) => {
      if (!el.dataset.highlighted) {
        hljs.highlightElement(el);
        el.dataset.highlighted = "yes";
      }
    });
  }, [post]);

  if (loading) {
    return <PageLoader />;
  }

  if (!post) return null;

  return (
    <section className="py-12 sm:py-16">
      <Container>
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              to={isAuthor ? "/all-posts" : "/"}
              className="inline-block text-sm font-medium text-stone-500 transition-colors hover:text-stone-800 dark:text-zinc-400 dark:hover:text-white"
            >
              ← Back to all posts
            </Link>

            {isAuthor && (
              <div className="flex items-center gap-3">
                <Link
                  to={`/edit-post/${post.$id}`}
                  className="inline-flex items-center rounded-lg border border-stone-300 px-4 py-2 text-sm font-medium text-stone-700 transition-colors hover:bg-stone-50 dark:border-pink-500/30 dark:text-pink-500 dark:hover:bg-pink-500/10"
                >
                  Edit Post
                </Link>
                <button
                  type="button"
                  onClick={deletePost}
                  className="inline-flex items-center gap-2 rounded-lg bg-red-700 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-800 dark:bg-pink-600 dark:hover:bg-pink-500 dark:shadow-[0_0_15px_rgba(219,39,119,0.5)]"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6h14" />
                  </svg>
                  Delete Post
                </button>
              </div>
            )}
          </div>

          {post.featuredImage ? (
            <img
              src={appwriteService.getFileView(post.featuredImage)}
              alt={post.title}
              className="aspect-video w-full rounded-2xl object-cover"
            />
          ) : (
            <div className="flex aspect-video w-full items-center justify-center rounded-2xl bg-stone-100 text-stone-400 dark:bg-zinc-800 dark:text-zinc-500">
              No image
            </div>
          )}

          <div className="mt-10 text-center">
            <h1 className="font-display text-4xl leading-tight font-bold tracking-tight text-stone-900 dark:text-white sm:text-6xl">
              {post.title}
            </h1>

            <div className="mt-6 flex items-center justify-center gap-3 text-sm">
              {post.authorName && (
                <>
                  <AuthorChip name={post.authorName} size="md" showBy />
                  <span
                    aria-hidden="true"
                    className="text-stone-300 dark:text-zinc-600"
                  >
                    •
                  </span>
                </>
              )}
              <span className="text-stone-500 dark:text-zinc-400">
                {formatDate(post.$createdAt)} • {readingTime(post.content)} min
                read
              </span>
            </div>
          </div>

          <div className="post-content mt-12">
            {parse(DOMPurify.sanitize(post.content || ""))}
          </div>
        </div>
      </Container>
    </section>
  );
}
