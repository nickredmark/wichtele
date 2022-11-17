"use client";

import { FC, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { useI18n } from "../utils/i18n";
import { useData } from "./data";
import { Form, Textarea } from "./form";

export const AddComment: FC<{ mine: boolean; wish: string; group: string }> = ({
  mine,
  wish,
  group,
}) => {
  const { refetch } = useData();
  const [content, setContent] = useState("");
  const { t } = useI18n();

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
        placeholder={
          mine ? t("comment-placeholder") : t("secret-comment-placeholder")
        }
        required
      />
    </Form>
  );
};
