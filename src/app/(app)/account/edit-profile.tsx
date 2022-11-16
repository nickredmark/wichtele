"use client";

import { FC, useState } from "react";
import { Form } from "../../../components/form";
import { User } from "../../../config/models";

export const EditProfile: FC<{ me: User }> = ({ me }) => {
  const [username, setUsername] = useState(me.name);

  return (
    <Form
      onSubmit={() => {}}
      cancelLabel="Cancel"
      onCancel={() => setUsername(me.name)}
      submitLabel="Save"
      className="flex flex-col p-2 items-stretch space-y-2"
    >
      <div className="flex flex-row space-x-1 items-center">
        <label className="w-32 text-sm font-medium">Username</label>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />
      </div>
    </Form>
  );
};
