import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, type = "text", error = "", className = "", icon, ...props },
  ref,
) {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-semibold text-stone-700 dark:text-zinc-300"
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-stone-400 dark:text-zinc-500"
          >
            {icon}
          </span>
        )}
        <input
          id={id}
          type={type}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={`h-11 w-full rounded-lg border border-stone-300 bg-white px-4 text-sm text-stone-900 shadow-sm transition-colors placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-white/15 dark:bg-[#111114] dark:text-white dark:placeholder:text-zinc-500 ${
            icon ? "pl-10" : ""
          } ${error ? "border-rose-500 dark:border-rose-500" : ""}`}
          {...props}
        />
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
