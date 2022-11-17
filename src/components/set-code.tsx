"use client";

import { FC, useEffect, useState } from "react";
import { Form } from "./form";

export const SetCode: FC = () => {
  const [code, setCode] = useState<string>();

  useEffect(() => {
    const searchCode = new URLSearchParams(location.search).get("code");
    if (searchCode) {
      document.cookie = `code=${searchCode};max-age=31536000`;
      location.replace("/");
    } else {
      setCode("");
    }
  }, []);

  if (code === undefined) {
    return null;
  }

  return (
    <Form
      className="flex flex-row flex-grow items-center"
      onSubmit={() => {
        document.cookie = `code=${code};max-age=31536000`;
        location.reload();
      }}
      canSubmit={!!code}
      submitLabel="Send"
    >
      <input
        type="text"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        placeholder="Code"
      />
    </Form>
  );
};
