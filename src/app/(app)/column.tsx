"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const segmentsMatch = (segments: string[], matches: string[][]) => {
  candidate: for (const candidate of matches) {
    for (let i = 0; i < Math.min(segments.length, candidate.length); i++) {
      if (!(candidate[i] === "*" || candidate[i] === segments[i])) {
        continue candidate;
      }
    }
    return true;
  }
  return false;
};

export const Column: FC<
  PropsWithChildren<{ showWithSegments?: string[][]; className?: string }>
> = ({ children, showWithSegments = [[]], className = "" }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <div
      className={`flex-col flex-grow sm:border-rose-900 sm:border-r sm:last:border-none ${
        segmentsMatch(segments, showWithSegments) ? "flex" : "hidden sm:flex"
      } ${className}`}
    >
      {children}
    </div>
  );
};
