"use client";

import { FC, useEffect, useState } from "react";
import { FaDoorOpen } from "react-icons/fa";
import { Form } from "./form";

export const SetCode: FC = () => {
  const [code, setCode] = useState("");

  useEffect(() => {
    const searchCode = new URLSearchParams(location.search).get("code");
    if (searchCode) {
      document.cookie = `code=${searchCode}`;
      location.replace("/");
    }
  }, []);

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

export const Logout: FC = () => (
  <button
    onClick={() => {
      document.cookie = `code=`;
      location.replace("/");
    }}
  >
    <FaDoorOpen />
  </button>
);
