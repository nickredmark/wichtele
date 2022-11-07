"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Form } from "./form";

export const CreateGroup: FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");

  return (
    <Form
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
        router.push(`groups/${id}`);
        router.refresh();
      }}
      canSubmit={!!name}
      submitLabel="Create"
      inline
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Create new group"
        required
      />
    </Form>
  );
};
