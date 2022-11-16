"use client";

import { FC, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useData } from "../app/(app)/data";
import { Form, Textarea } from "./form";

export const AddComment: FC<{ mine: boolean; wish: string; group: string }> = ({
  mine,
  wish,
  group,
}) => {
  const { refetch } = useData();
  const [content, setContent] = useState("");

  const onSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        wish,
        group,
        content,
      }),
    });
    setContent("");
    refetch();
  };

  return (
    <Form
      onSubmit={onSubmit}
      canSubmit={!!content}
      submitLabel={<FaPaperPlane />}
      className="flex flex-row space-x-1"
    >
      <Textarea
        rows={1}
        onSubmit={onSubmit}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder={mine ? "Comment" : "Secret comment"}
        required
      />
    </Form>
  );
};
