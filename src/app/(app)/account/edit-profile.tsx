"use client";

import { FC, useState } from "react";
import { Form } from "../../../components/form";
import { User } from "../../../config/models";
import { useData } from "../data";

export const EditProfile: FC<{ me: User }> = ({ me }) => {
  const [name, setName] = useState(me.name);
  const { refetch } = useData();

  return (
    <Form
      onSubmit={async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${me._id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
          }),
        });
        refetch();
      }}
      cancelLabel="Cancel"
      onCancel={() => setName(me.name)}
      submitLabel="Save"
      className="flex flex-col p-2 items-stretch space-y-2"
    >
      <div className="flex flex-row space-x-1 items-center">
        <label className="w-32 text-sm font-medium">Name</label>
        <input
          type="text"
          placeholder="Will Ferrell"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
    </Form>
  );
};
