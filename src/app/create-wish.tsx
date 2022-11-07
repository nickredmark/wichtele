"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Form } from "./form";

export const CreateWish: FC = () => {
  const router = useRouter();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [url, setUrl] = useState("");

  return (
    <Form
      onSubmit={async () => {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishes`, {
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
        router.push(`wishes/${id}`);
        router.refresh();
      }}
      canSubmit={!!name}
      submitLabel="Create"
    >
      <input
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Wish"
        required
      />
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
      />
      <input
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="URL"
      />
    </Form>
  );
};
