import { forwardRef, useId } from "react";

const Input = forwardRef(function Input(
  { label, type = "text", error = "", className = "", ...props },
  ref,
) {
  const id = useId();

  return (
    <div className={`w-full ${className}`}>
      {label && (
        <label
          htmlFor={id}
          className="mb-1.5 block text-sm font-medium text-stone-600 dark:text-stone-400"
        >
          {label}
        </label>
      )}
      <input
        id={id}
        type={type}
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={`h-11 w-full rounded-lg border border-stone-200 bg-white px-3.5 text-sm text-stone-900 shadow-sm transition-colors placeholder:text-stone-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100 dark:placeholder:text-stone-500 ${
          error
            ? "border-rose-500 dark:border-rose-500"
            : ""
        }`}
        {...props}
      />
      {error && (
        <p className="mt-1.5 text-sm text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Input;
