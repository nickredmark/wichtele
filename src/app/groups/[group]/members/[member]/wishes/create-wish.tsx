"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { User } from "../../../../../../config/models";
import { Form, Textarea } from "../../../../../form";

type State = {
  content: string;
  groups: string[];
};

export const CreateWish: FC<{
  initialState: State;
  user?: User;
}> = ({ user, initialState }) => {
  const router = useRouter();
  const [{ content, groups }, setState] = useState(initialState);

  const onSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishes`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        content,
        groups,
        user: user?._id,
      }),
    });
    setState(initialState);
    router.refresh();
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        canSubmit={!!content && groups.length > 0}
        onCancel={() => router.back()}
        submitLabel={user ? "Propose" : "Create"}
        className="flex flex-row"
      >
        <Textarea
          value={content}
          onChange={(e) =>
            setState((state) => ({ ...state, content: e.target.value }))
          }
          onSubmit={onSubmit}
          placeholder={
            user ? `Surprise gift idea for ${user.name}` : "New Wish"
          }
        />
      </Form>
    </>
  );
};
