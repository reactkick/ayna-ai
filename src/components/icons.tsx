
import type { SVGProps } from "react";

export function Mirror(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 18.5a6.5 6.5 0 0 0 6.5-6.5h-13A6.5 6.5 0 0 0 12 18.5Z" />
      <path d="M12 8V5" />
      <path d="M5.5 12H3" />
      <path d="M18.5 12H21" />
      <path d="M12 18.5V22" />
    </svg>
  );
}
