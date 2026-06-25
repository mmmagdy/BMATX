import type { SVGProps } from "react";

/** Inline icon set — 1.5px stroke, rounded, currentColor. */
const paths: Record<string, React.ReactNode> = {
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </>
  ),
  cart: (
    <>
      <circle cx="9" cy="20" r="1.4" />
      <circle cx="18" cy="20" r="1.4" />
      <path d="M2 3h2.2l2.2 12.2a1.5 1.5 0 0 0 1.5 1.2h9.1a1.5 1.5 0 0 0 1.5-1.2L21 7H6" />
    </>
  ),
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 20a8 8 0 0 1 16 0" />
    </>
  ),
  menu: (
    <>
      <path d="M3 6h18M3 12h18M3 18h18" />
    </>
  ),
  close: (
    <>
      <path d="M6 6l12 12M18 6 6 18" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s7-5.5 7-11a7 7 0 0 0-14 0c0 5.5 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  "chevron-down": <path d="m6 9 6 6 6-6" />,
  "chevron-end": <path d="m9 6 6 6-6 6" />,
  plus: <path d="M12 5v14M5 12h14" />,
  minus: <path d="M5 12h14" />,
  star: (
    <path d="M12 3.5l2.6 5.3 5.9.8-4.3 4.1 1 5.8-5.2-2.7-5.2 2.7 1-5.8L3.5 9.6l5.9-.8z" />
  ),
  check: <path d="m5 12 4.5 4.5L19 7" />,
  "check-circle": (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="m8.5 12 2.3 2.3 4.7-4.6" />
    </>
  ),
  truck: (
    <>
      <path d="M3 6h10v9H3zM13 9h4l3 3v3h-7z" />
      <circle cx="7" cy="18" r="1.6" />
      <circle cx="17" cy="18" r="1.6" />
    </>
  ),
  layers: (
    <>
      <path d="M12 3 3 8l9 5 9-5z" />
      <path d="m3 13 9 5 9-5" />
    </>
  ),
  package: (
    <>
      <path d="M12 3 4 7v10l8 4 8-4V7z" />
      <path d="M4 7l8 4 8-4M12 11v10" />
    </>
  ),
  filter: <path d="M3 5h18l-7 8v6l-4-2v-4z" />,
  sort: (
    <>
      <path d="M7 5v14M7 5 4 8M7 5l3 3" />
      <path d="M17 19V5M17 19l3-3M17 19l-3-3" />
    </>
  ),
  building: (
    <>
      <path d="M4 21V5l8-2v18M12 21h8V9l-8-2" />
      <path d="M7 8h2M7 12h2M7 16h2M15 12h2M15 16h2" />
    </>
  ),
  shield: (
    <>
      <path d="M12 3 5 5.5V11c0 4.5 3 7.5 7 9 4-1.5 7-4.5 7-9V5.5z" />
      <path d="m9.2 12 1.9 1.9 3.7-3.7" />
    </>
  ),
  trash: (
    <>
      <path d="M4 7h16M9 7V5h6v2M6 7l1 13h10l1-13" />
    </>
  ),
  info: (
    <>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" />
    </>
  ),
  "arrow-end": <path d="M5 12h14M13 6l6 6-6 6" />,
  spark: <path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M18 6l-2.5 2.5M8.5 15.5 6 18" />,

  // category glyphs (simplified)
  cement: (
    <>
      <path d="M5 8h14l-1.5 11h-11z" />
      <path d="M8 8V5h8v3M9 12h6" />
    </>
  ),
  steel: (
    <>
      <path d="M5 5v14M9 5v14M13 5v14M17 5v14" />
      <path d="M5 9h12M5 15h12" />
    </>
  ),
  blocks: (
    <>
      <path d="M3 6h8v5H3zM13 6h8v5h-8zM8 13h8v5H8z" />
    </>
  ),
  tiles: (
    <>
      <path d="M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z" />
    </>
  ),
  paint: (
    <>
      <path d="M5 4h11v6H5zM5 7H4a2 2 0 0 0-2 2v2h3" />
      <path d="M16 7h2l1 4-2.5 1.5V20a1 1 0 0 1-1 1h0a1 1 0 0 1-1-1v-7.5z" />
    </>
  ),
  wood: (
    <>
      <path d="M4 6h16v12H4z" />
      <path d="M7 6c1 4-1 8 0 12M12 6c1 4-1 8 0 12M17 6c1 4-1 8 0 12" />
    </>
  ),
  plumbing: (
    <>
      <path d="M7 3v6a3 3 0 0 0 3 3h2a3 3 0 0 1 3 3v6" />
      <path d="M5 3h4M15 18h4" />
    </>
  ),
  electrical: <path d="M13 3 5 13h6l-2 8 8-11h-6z" />,
  tools: (
    <>
      <path d="M14 7a3 3 0 1 0 3 3l4 4-3 3-4-4a3 3 0 0 1-4-4z" />
      <path d="m9 9-5 5 3 3 5-5" />
    </>
  ),
  aggregates: (
    <>
      <circle cx="8" cy="9" r="3" />
      <circle cx="15" cy="11" r="2.5" />
      <circle cx="11" cy="16" r="3.2" />
    </>
  ),
};

export type IconName = keyof typeof paths;

interface IconProps extends SVGProps<SVGSVGElement> {
  name: IconName;
  size?: number;
}

export function Icon({ name, size = 20, ...props }: IconProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      {...props}
    >
      {paths[name]}
    </svg>
  );
}
