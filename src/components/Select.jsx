import { forwardRef, useId } from "react";

const Select = forwardRef(function Select(
  { options, label, error = "", className = "", ...props },
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
        <select
          id={id}
          ref={ref}
          aria-invalid={error ? true : undefined}
          className={`h-11 w-full appearance-none rounded-lg border border-stone-300 bg-white px-4 pr-10 text-sm text-stone-900 shadow-sm transition-colors focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 focus:outline-none dark:border-white/15 dark:bg-[#111114] dark:text-white ${
            error ? "border-rose-500 dark:border-rose-500" : ""
          }`}
          {...props}
        >
          {options?.map((option) => (
            <option
              key={option?.value ?? option}
              value={option?.value ?? option}
            >
              {option?.label ?? option}
            </option>
          ))}
        </select>
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
          className="pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-stone-400 dark:text-zinc-500"
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
      </div>
      {error && (
        <p className="mt-1.5 text-sm text-rose-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Select;
