"use client";

import { union, without } from "lodash";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useState } from "react";
import { Group } from "../../../../../../../../config/models";
import { Form, Textarea } from "../../../../../../form";

type State = {
  _id: string;
  content: string;
  groups: string[];
};

export const EditWish: FC<{
  initialState: State;
  availableGroups: Group[];
}> = ({ initialState, availableGroups }) => {
  const router = useRouter();
  const [{ _id, content, groups }, setState] = useState(initialState);

  const onSubmit = async () => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishes/${_id}`, {
      method: "PUT",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        content,
        groups,
      }),
    });
    router.back();
  };

  return (
    <>
      <Form
        onSubmit={onSubmit}
        canSubmit={!!content && groups.length > 0}
        deleteLabel="Delete"
        onDelete={async () => {
          await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishes/${_id}`, {
            method: "DELETE",
            headers: {
              "content-type": "application/json",
            },
          });
          router.back();
        }}
        cancelLabel="Cancel"
        onCancel={() => router.back()}
        submitLabel="Save"
        className="flex flex-col p-2 items-stretch"
      >
        <Textarea
          value={content}
          onChange={(e) =>
            setState((state) => ({ ...state, content: e.target.value }))
          }
          onSubmit={onSubmit}
          placeholder="New Wish"
        />
        {(availableGroups.length > 1 || groups.length === 0) && (
          <div className="flex flex-row flex-wrap mt-2 space-x-1 items-center">
            <label>Shared with:</label>
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
      </Form>
    </>
  );
};

const Pill: FC<
  PropsWithChildren<{
    selected: boolean;
    setSelected: (selected: boolean) => void;
  }>
> = ({ selected, setSelected, children }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      setSelected(!selected);
    }}
    className={`rounded-2xl px-2 text-sm ${
      selected ? "bg-gray-500 text-white" : "bg-gray-200"
    }`}
  >
    {children}
  </button>
);
