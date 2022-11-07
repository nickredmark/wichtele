"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Form } from "../../../../form";

export const AddComment: FC = () => {
  const router = useRouter();
  const [content, setContent] = useState("");

  return (
    <Form
      onSubmit={async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/comments`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name: content,
          }),
        });
        const id = await res.json();
        setContent("");
        router.push(`groups/${id}`);
        router.refresh();
      }}
      canSubmit={!!content}
      submitLabel="Comment"
    >
      <textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Leave a comment"
        required
      />
    </Form>
  );
};
