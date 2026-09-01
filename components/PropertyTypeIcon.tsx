import type { ReactNode } from "react";
import type { PropertyType } from "@/lib/constants";

function Icon({ children }: { children: ReactNode }) {
  return (
    <svg
      className="h-6 w-6 shrink-0"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {children}
    </svg>
  );
}

export function PropertyTypeIcon({ type }: { type: PropertyType }) {
  switch (type) {
    case "appartement":
      return (
        <Icon>
          <path d="M4 21V7l8-4 8 4v14" />
          <path d="M9 21v-6h6v6" />
          <path d="M9 10h.01M15 10h.01M9 14h.01M15 14h.01" />
        </Icon>
      );
    case "maison":
      return (
        <Icon>
          <path d="M3 11.5 12 4l9 7.5" />
          <path d="M5 10.5V21h14V10.5" />
          <path d="M10 21v-6h4v6" />
        </Icon>
      );
    case "terrain":
      return (
        <Icon>
          <path d="M3 19h18" />
          <path d="M5 19 8 9l4 6 3-4 4 8" />
          <path d="M14 8.5a1.5 1.5 0 1 0 3 0 1.5 1.5 0 0 0-3 0Z" />
        </Icon>
      );
    case "immeuble":
      return (
        <Icon>
          <path d="M5 21V4h9v17" />
          <path d="M14 10h5v11" />
          <path d="M8 8h.01M11 8h.01M8 12h.01M11 12h.01M8 16h.01M11 16h.01" />
        </Icon>
      );
    case "local":
      return (
        <Icon>
          <path d="M4 10h16v11H4z" />
          <path d="M4 10 6.5 4h11L20 10" />
          <path d="M10 21v-6h4v6" />
        </Icon>
      );
    default:
      return null;
  }
}
