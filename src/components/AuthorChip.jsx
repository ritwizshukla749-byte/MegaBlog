function AuthorChip({ name }) {
  const initials = name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase())
    .join("");

  return (
    <span className="inline-flex items-center gap-2">
      <span
        aria-hidden="true"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-purple-500 text-[10px] font-medium text-white"
      >
        {initials}
      </span>
      <span className="text-xs font-medium text-stone-600 dark:text-stone-300">
        {name}
      </span>
    </span>
  );
}

export default AuthorChip;
