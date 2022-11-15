"use client";

import { FC, useState } from "react";
import { Form } from "./form";

export const SetCode: FC = () => {
  const [code, setCode] = useState("");

  return (
    <Form
      className="flex flex-row"
      onSubmit={() => {
        document.cookie = `code=${code}`;
        location.reload();
      }}
      canSubmit={!!code}
      submitLabel="Send"
    >
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
    </Form>
  );
};
