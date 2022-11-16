import { FC } from "react";
import { Comment, User } from "../config/models";
import { Markdown } from "./markdown";

export const Comments: FC<{ comments: Comment[]; users: User[] }> = ({
  comments,
  users,
}) => (
  <div className="my-2 border-gray-300 border-b text-sm">
    {comments.map((comment) => (
      <div key={comment._id} className="border-gray-300 border-t py-2 pl-2">
        <div className="flex flex-row items-baseline space-x-1">
          <span className="font-bold text-xs">
            {users.find((user) => user._id === comment.createdBy)?.name}
          </span>
          <span className="text-xs text-gray-400">
            {new Date(comment.createdAt).toLocaleString()}
          </span>
        </div>
        <div>
          <Markdown>{comment.content}</Markdown>
        </div>
      </div>
    ))}
  </div>
);
