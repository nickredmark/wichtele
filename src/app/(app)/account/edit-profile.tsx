"use client";

import { FC, useState } from "react";
import { useData } from "../../../components/data";
import { Form } from "../../../components/form";
import { User } from "../../../config/models";
import { LOCALES, useI18n } from "../../../utils/i18n";

export const EditProfile: FC<{ me: User }> = ({ me }) => {
  const [name, setName] = useState(me.name);
  const [language, setLanguage] = useState(me.language);
  const { refetch } = useData();
  const { t } = useI18n();

  return (
    <Form
      onSubmit={async () => {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/${me._id}`, {
          method: "PUT",
          headers: {
            "content-type": "application/json",
          },
          body: JSON.stringify({
            name,
            language,
          }),
        });
        refetch();
      }}
      cancelLabel={t("cancel")}
      onCancel={() => setName(me.name)}
      submitLabel={t("save")}
      className="flex flex-col p-2 items-stretch space-y-2"
    >
      <div className="flex flex-row space-x-1 items-center">
        <label className="w-32 text-sm font-medium">{t("name")}</label>
        <input
          type="text"
          placeholder="Will Ferrell"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-row space-x-1 items-center">
        <label className="w-32 text-sm font-medium">{t("language")}</label>
        <select value={language} onChange={(e) => setLanguage(e.target.value)}>
          {Object.keys(LOCALES).map((locale) => (
            <option key={locale} value={locale}>
              {t(locale)}
            </option>
          ))}
        </select>
      </div>
    </Form>
  );
};
