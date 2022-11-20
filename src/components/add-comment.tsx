"use client";

import { FC, useState } from "react";
import { FaPaperPlane } from "react-icons/fa";
import { User } from "../config/models";
import { useI18n } from "../utils/i18n";
import { useData } from "./data";
import { Form, Textarea } from "./form";

export const AddComment: FC<{ member: User; wish: string; group: string }> = ({
  member,
  wish,
  group,
}) => {
  const { me, refetch } = useData();
  const [content, setContent] = useState("");
  const { t } = useI18n();
  const mine = member._id === me._id;

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
    <div className="flex flex-col space-y-2">
      {!mine && (
        <span className="text-xs text-gray-400">
          {t("everyone-sees-except")} {member.name}
        </span>
      )}
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
    </div>
  );
};
