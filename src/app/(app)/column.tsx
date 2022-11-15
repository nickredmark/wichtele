"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { FC, PropsWithChildren } from "react";

export const Column: FC<
  PropsWithChildren<{ maxSegments?: number; className?: string }>
> = ({ children, maxSegments = 0, className = "" }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <div
      className={`flex-col flex-grow sm:border-rose-900 sm:border-r sm:last:border-none ${
        segments.length > maxSegments ? "hidden sm:flex" : "flex"
      } ${className}`}
    >
      {children}
    </div>
  );
};
