"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Form } from "./form";

export const AddMember: FC<{ groupId: string }> = ({ groupId }) => {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <Form
      className="flex flex-row p-2 pl-4"
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
  );
};
