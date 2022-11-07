"use client";

import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Form } from "../../form";

export const AddToGroup: FC<{
  wishId: string;
  groups: [string, string][];
}> = ({ wishId, groups }) => {
  const router = useRouter();
  const [group, setGroup] = useState(null);

  return (
    <Form
      onSubmit={async () => {
        const res2 = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/wishes/${wishId}/groups/${group}`,
          {
            method: "PUT",
          }
        );
        await res2.json();
        setGroup(null);
        router.refresh();
      }}
      canSubmit={!!group}
      submitLabel="Create"
    >
      <select required>
        {groups.map(([_id, name]) => (
          <option key={_id} value={_id}>
            {name}
          </option>
        ))}
      </select>
    </Form>
  );
};
