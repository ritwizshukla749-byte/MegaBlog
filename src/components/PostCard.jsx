import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import AuthorChip from "./AuthorChip.jsx";
import formatDate from "../utils/formatDate";
import stripHtml from "../utils/stripHtml";

function PostCard({
  $id,
  title,
  featuredImage,
  content,
  $createdAt,
  authorName,
}) {
  return (
    <Link
      to={`/post/${$id}`}
      className="group flex flex-col overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-sm transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.05)] dark:border-white/10 dark:bg-[#111114]"
    >
      <div className="aspect-video w-full overflow-hidden bg-stone-100 dark:bg-zinc-800">
        {featuredImage ? (
          <img
            src={appwriteService.getFileView(featuredImage)}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-stone-400 dark:text-zinc-500">
            <svg
              width="40"
              height="40"
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

      <div className="flex flex-1 flex-col gap-2 p-5">
        <h3 className="font-display text-xl leading-snug font-semibold text-stone-900 line-clamp-2 dark:text-white">
          {title}
        </h3>
        <p className="text-sm leading-relaxed text-stone-500 line-clamp-2 dark:text-zinc-400">
          {stripHtml(content)}
        </p>

        <div className="mt-auto flex items-center gap-3 border-t border-stone-100 pt-4 dark:border-white/10">
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

export default PostCard;
