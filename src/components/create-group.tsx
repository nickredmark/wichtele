"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { User } from "../config/models";
import { useI18n } from "../utils/i18n";
import { useData } from "./data";
import { Form } from "./form";

export const CreateGroup: FC<{ me: User }> = ({ me }) => {
  const router = useRouter();
  const { refetch } = useData();
  const [name, setName] = useState("");
  const { t } = useI18n();

  return (
    <Form
      className="flex flex-row p-2"
      onSubmit={async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/groups`, {
          method: "POST",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        });
        const id = await res.json();
        setName("");
        await refetch();
        router.push(`groups/${id}/members/${me._id}`);
      }}
      canSubmit={!!name}
      submitLabel={t("create")}
    >
      <input
        type="text"
        className="flex-grow"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder={t("new-group")}
        required
      />
    </Form>
  );
};
