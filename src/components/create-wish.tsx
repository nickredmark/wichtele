"use client";

import { union, without } from "lodash";
import { useRouter } from "next/navigation";
import { FC, useState } from "react";
import { Pill } from "../app/(app)/wishes/[wish]/edit-wish";
import { Group, User } from "../config/models";
import { useData } from "./data";
import { Form, Textarea } from "./form";

type State = {
  content: string;
  groups: string[];
};

export const CreateWish: FC<{
  initialState: State;
  user?: User;
  availableGroups?: Group[];
}> = ({ user, initialState, availableGroups }) => {
  const router = useRouter();
  const { refetch } = useData();
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
    setState((state) => ({ ...state, content: "" }));
    refetch();
  };

  return (
    <div className="p-2 bg-white border-t border-rose-200">
      <Form
        onSubmit={onSubmit}
        canSubmit={!!content}
        onCancel={() => router.back()}
        submitLabel={user ? "Propose" : "Create"}
        className="flex flex-row space-x-1"
      >
        <div className="flex flex-grow flex-col">
          <Textarea
            value={content}
            onChange={(e) =>
              setState((state) => ({ ...state, content: e.target.value }))
            }
            onSubmit={onSubmit}
            placeholder={
              user ? `Propose a secret gift idea for ${user.name}` : "New Wish"
            }
          />
          {availableGroups && availableGroups.length > 0 && (
            <div className="flex flex-row flex-wrap mt-2 space-x-1 items-center">
              {availableGroups.map(({ _id, name }) => (
                <Pill
                  key={_id}
                  selected={!!groups.includes(_id)}
                  setSelected={(selected) =>
                    setState(({ groups, ...state }) => ({
                      ...state,
                      groups: selected
                        ? union(groups, [_id])
                        : without(groups, _id),
                    }))
                  }
                >
                  {name}
                </Pill>
              ))}
            </div>
          )}
        </div>
      </Form>
    </div>
  );
};
