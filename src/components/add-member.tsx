"use client";

import { FC, useState } from "react";
import { User } from "../config/models";
import { useI18n } from "../utils/i18n";
import { useData } from "./data";
import { Form } from "./form";

export const AddMember: FC<{
  groupId: string;
  members: User[];
  users: User[];
}> = ({ groupId, members, users }) => {
  const { me, refetch } = useData();
  const [name, setName] = useState("");
  const { t } = useI18n();

  return (
    <div className="pl-4 p-2 space-y-1">
      <Form
        className="flex flex-row"
        onSubmit={async () => {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users`, {
            method: "POST",
            headers: {
              "content-type": "application/json",
            },
            body: JSON.stringify({
              name,
              language: me.language,
            }),
          });
          const id = await res.json();
          const res2 = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/members/${id}`,
            {
              method: "PUT",
            }
          );
          await res2.json();
          setName("");
          refetch();
        }}
        canSubmit={!!name}
        submitLabel={t("add")}
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder={t("new-member")}
          required
        />
      </Form>
      <div className="flex flex-col items-stretch">
        {name.length > 0 &&
          users
            .filter(
              (user) =>
                user.name.toLowerCase().includes(name.toLowerCase()) &&
                !members.some((member) => member._id === user._id)
            )
            .map((user) => (
              <button
                key={user._id}
                className="hover:bg-gray-100 p-1 text-left"
                onClick={async () => {
                  await fetch(
                    `${process.env.NEXT_PUBLIC_API_URL}/groups/${groupId}/members/${user._id}`,
                    {
                      method: "PUT",
                    }
                  );
                  setName("");
                  refetch();
                }}
              >
                {user.name}
              </button>
            ))}
      </div>
    </div>
  );
};
