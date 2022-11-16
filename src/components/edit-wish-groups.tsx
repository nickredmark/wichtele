"use client";

import { union, without } from "lodash";
import { useRouter } from "next/navigation";
import { FC } from "react";
import { Pill } from "../app/(app)/wishes/[wish]/edit-wish";
import { Group } from "../config/models";

export const EditWishGroups: FC<{
  id: string;
  groups: string[];
  availableGroups: Group[];
}> = ({ id, groups, availableGroups }) => {
  const router = useRouter();

  return (
    <>
      {availableGroups.length > 0 && (
        <div className="flex flex-row flex-wrap mt-2 space-x-1 items-center">
          {availableGroups.map(({ _id, name }) => (
            <Pill
              key={_id}
              selected={!!groups.includes(_id)}
              setSelected={async (selected) => {
                await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishes/${id}`, {
                  method: "PUT",
                  headers: {
                    "content-type": "application/json",
                  },
                  body: JSON.stringify({
                    groups: selected
                      ? union(groups, [_id])
                      : without(groups, _id),
                  }),
                });
                router.refresh();
              }}
            >
              {name}
            </Pill>
          ))}
        </div>
      )}
    </>
  );
};
