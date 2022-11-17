import { FC } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const Markdown: FC<{ children: string }> = ({ children }) => (
  <ReactMarkdown
    className="markdown"
    remarkPlugins={[remarkGfm]}
    linkTarget="_blank"
  >
    {children}
  </ReactMarkdown>
);
