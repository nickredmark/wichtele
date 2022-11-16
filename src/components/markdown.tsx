import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import stripMarkdown from "strip-markdown";

export const Markdown: FC<{ children: string; strip?: boolean }> = ({
  children,
  strip,
}) => (
  <ReactMarkdown
    className="markdown"
    remarkPlugins={[remarkGfm, ...(strip ? [stripMarkdown] : [])]}
    linkTarget="_blank"
  >
    {children}
  </ReactMarkdown>
);
