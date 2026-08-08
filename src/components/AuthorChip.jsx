function AuthorChip({ name, size = "sm", showBy = false }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  const isMd = size === "md";

  return (
    <span className={`inline-flex items-center ${isMd ? "gap-2.5" : "gap-2"}`}>
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-500 font-medium text-white ${
          isMd ? "h-8 w-8 rounded-lg text-xs" : "h-6 w-6 rounded-full text-[10px]"
        }`}
      >
        {initials}
      </span>
      <span
        className={`font-medium text-stone-900 dark:text-white ${
          isMd ? "text-sm" : "text-xs text-stone-600 dark:text-zinc-300"
        }`}
      >
        {showBy && (
          <span className="text-stone-500 dark:text-zinc-400">By </span>
        )}
        {name}
      </span>
    </span>
  );
}

export default AuthorChip;
