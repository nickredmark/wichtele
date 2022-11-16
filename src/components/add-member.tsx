"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { User } from "../config/models";
import { Form } from "./form";

export const AddMember: FC<{
  groupId: string;
  members: User[];
  users: User[];
}> = ({ groupId, members, users }) => {
  const router = useRouter();
  const [name, setName] = useState("");

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
          router.refresh();
        }}
        canSubmit={!!name}
        submitLabel="Add"
      >
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New member"
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
                  router.refresh();
                }}
              >
                {user.name}
              </button>
            ))}
      </div>
    </div>
  );
};
