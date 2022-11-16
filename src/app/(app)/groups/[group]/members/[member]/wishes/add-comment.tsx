"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { Form, Textarea } from "../../../../../form";

export const AddComment: FC<{ wish: string; group: string }> = ({
  wish,
  group,
}) => {
  const router = useRouter();
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
    router.refresh();
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
        placeholder="Secret comment"
        required
      />
    </Form>
  );
};
