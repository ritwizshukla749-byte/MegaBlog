import { useId } from "react";

function Logo({ width = "112px", iconOnly = false }) {
  const id = useId();
  const markSize = iconOnly ? "100%" : `calc(${width} * 0.36)`;
  const textSize = `calc(${width} * 0.21)`;

  const mark = (
    <svg
      width={markSize}
      height={markSize}
      viewBox="0 0 40 40"
      role="img"
      aria-label="MegaBlog"
      className="shrink-0"
    >
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#6366f1" />
          <stop offset="100%" stopColor="#a855f7" />
        </linearGradient>
      </defs>
      <rect
        x="1"
        y="1"
        width="38"
        height="38"
        rx="10"
        fill={`url(#${id})`}
      />
      <path
        d="M11 28 V12 L20 21 L29 12 V28"
        fill="none"
        stroke="#ffffff"
        strokeWidth="4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

  if (iconOnly) return mark;

  return (
    <div className="flex items-center gap-2" style={{ width }}>
      {mark}
      <span
        className="font-semibold tracking-tight whitespace-nowrap"
        style={{ fontSize: textSize }}
      >
        Mega
        <span className="bg-gradient-to-r from-indigo-500 to-purple-500 bg-clip-text text-transparent">
          Blog
        </span>
      </span>
    </div>
  );
}

export default Logo;
