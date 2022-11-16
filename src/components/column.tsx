"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { FC, PropsWithChildren } from "react";

const segmentsMatch = (segments: string[], matches: string[][]) => {
  candidate: for (const candidate of matches) {
    if (segments.length > candidate.length) {
      continue;
    }
    for (let i = 0; i < segments.length; i++) {
      if (!(candidate[i] === "*" || candidate[i] === segments[i])) {
        continue candidate;
      }
    }
    return true;
  }
  return false;
};

export const Column: FC<
  PropsWithChildren<{
    showWithSegments?: string[][];
    paper?: boolean;
    border?: boolean;
    className?: string;
  }>
> = ({
  children,
  showWithSegments = [[]],
  border = true,
  paper = true,
  className = "",
}) => {
  const segments = useSelectedLayoutSegments();

  return (
    <div
      className={`flex-col flex-grow sm:border-rose-900 sm:border-l ${
        border ? "sm:border-l" : ""
      } ${paper ? "paper" : ""} ${
        segmentsMatch(segments, showWithSegments) ? "flex" : "hidden sm:flex"
      } ${className}`}
      style={{
        minWidth: "30%",
      }}
    >
      {children}
    </div>
  );
};
