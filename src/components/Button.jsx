const variants = {
  primary:
    "bg-gradient-to-r from-indigo-500 to-purple-500 font-medium text-white hover:opacity-90 dark:shadow-[0_0_20px_rgba(168,85,247,0.25)]",
  secondary:
    "border border-stone-200 bg-white font-medium text-stone-700 hover:bg-stone-100 dark:border-white/15 dark:bg-[#111114] dark:text-zinc-200 dark:hover:bg-zinc-800",
  danger: "bg-rose-500 font-medium text-white hover:bg-rose-600",
  auth: "bg-gradient-to-r from-indigo-600 to-purple-600 font-bold tracking-wide text-white shadow-lg shadow-indigo-200/60 hover:opacity-90",
};

const sizes = {
  sm: "px-3 py-1.5 text-sm",
  md: "px-4 py-2.5 text-sm",
  lg: "px-6 py-3 text-base",
};

function Button({
  children,
  type = "button",
  variant = "primary",
  size = "md",
  loading = false,
  disabled = false,
  className = "",
  ...props
}) {
  const isDisabled = disabled || loading;

  return (
    <button
      type={type}
      disabled={isDisabled}
      className={`inline-flex items-center justify-center gap-2 rounded-lg transition-colors focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading && (
        <span
          aria-hidden="true"
          className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {children}
    </button>
  );
}

export default Button;
