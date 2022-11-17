"use client";

import { union, without } from "lodash";
import { useRouter } from "next/navigation";
import { FC, PropsWithChildren, useState } from "react";
import { Form, Textarea } from "../../../../components/form";
import { WishComponent } from "../../../../components/wish";
import { Group } from "../../../../config/models";
import { useI18n } from "../../../../utils/i18n";

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
  const { t } = useI18n();

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
    <div className="p-2">
      <WishComponent>
        <Form
          onSubmit={onSubmit}
          canSubmit={!!content && groups.length > 0}
          deleteLabel={t("delete")}
          onDelete={async () => {
            await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishes/${_id}`, {
              method: "DELETE",
              headers: {
                "content-type": "application/json",
              },
            });
            router.back();
          }}
          cancelLabel={t("cancel")}
          onCancel={() => router.back()}
          submitLabel={t("save")}
          className="flex flex-col items-stretch"
        >
          <Textarea
            value={content}
            onChange={(e) =>
              setState((state) => ({ ...state, content: e.target.value }))
            }
            onSubmit={onSubmit}
            placeholder={t("new-wish")}
          />
          {availableGroups.length > 0 && (
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
        </Form>
      </WishComponent>
    </div>
  );
};

export const Pill: FC<
  PropsWithChildren<{
    selected: boolean;
    setSelected?: (selected: boolean) => void;
  }>
> = ({ selected, setSelected, children }) => (
  <button
    onClick={(e) => {
      e.preventDefault();
      setSelected?.(!selected);
    }}
    className={`rounded-2xl px-2 text-sm ${
      selected
        ? "border border-gray-400 bg-gray-400 text-white"
        : "border border-gray-100 text-gray-400 hover:bg-gray-100"
    }`}
  >
    {children}
  </button>
);
