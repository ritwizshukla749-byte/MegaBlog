function PostCardSkeleton() {
  return (
    <div className="animate-pulse overflow-hidden rounded-2xl border border-stone-200 bg-white dark:border-stone-800 dark:bg-stone-900">
      <div className="aspect-video w-full bg-stone-200 dark:bg-stone-800" />
      <div className="flex flex-col gap-3 p-5">
        <div className="h-5 w-3/4 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-full rounded bg-stone-200 dark:bg-stone-800" />
        <div className="h-4 w-1/2 rounded bg-stone-200 dark:bg-stone-800" />
        <div className="mt-2 h-3 w-1/3 rounded bg-stone-200 dark:bg-stone-800" />
      </div>
    </div>
  );
}

export default PostCardSkeleton;
