import React from "react";

export interface CrossedToolsProps extends React.SVGProps<SVGSVGElement> {
  className?: string;
  size?: number | string;
}

/**
 * Crossed Tools Icon (Hammer & Wrench / Screwdriver crossed like an X "×")
 * شارة مفك وشاكوش متقاطعين مثل إشارة ضرب (×)
 * صُممت بأبعاد وسمك متطابق مع أيقونات Lucide (24x24, stroke=2)
 */
export default function CrossedTools({
  className = "w-5 h-5",
  size,
  ...props
}: CrossedToolsProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      width={size}
      height={size}
      {...props}
    >
      {/* Hammer (Diagonal from bottom-left to top-right) */}
      <path d="m14 10-8.5 8.5a1.414 1.414 0 0 1-2-2L12 8" />
      <path d="M15 4 18 1l5 5-3 3-1.5-.5-2.5 2.5-3-3 2.5-2.5Z" />

      {/* Wrench / Screwdriver (Diagonal from bottom-right to top-left, crossing like X) */}
      <path d="m10 10 8.5 8.5a1.414 1.414 0 0 0 2-2L12 8" />
      <path d="M7.5 4.5a3 3 0 0 0-4.24 4.24l1.41-1.41a1 1 0 0 1 1.42 1.42L4.67 10.16a3 3 0 0 0 4.24-4.24" />
    </svg>
  );
}

