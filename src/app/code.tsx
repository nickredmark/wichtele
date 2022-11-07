"use client";

import { FC, useState } from "react";
import { Form } from "../components/form";

export const CodeForm: FC = () => {
  const [code, setCode] = useState("");

  return (
    <Form
      onSubmit={() => {
        document.cookie = `code=${code}`;
        location.reload();
      }}
      canSubmit={!!code}
      submitLabel="Send"
    >
      <input
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Enter code"
      />
    </Form>
  );
};
