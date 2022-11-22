"use client";

import { Column } from "../../../../components/column";
import { useData } from "../../../../components/data";
import { useI18n } from "../../../../utils/i18n";
import { EditWish } from "./edit-wish";

const WishPage = ({
  params: { wish: wishId },
}: {
  params: { wish: string };
}) => {
  const { me } = useData();
  const wish = (me.wishes.find((wish) => wish._id === wishId) ||
    me.proposals.find((wish) => wish._id === wishId))!;
  const { t } = useI18n();

  return (
    <Column className="sm:max-w-sm">
      <h2 className="nav-header">{t("edit-wish")}</h2>
      <EditWish initialState={wish} availableGroups={me.groups} />
    </Column>
  );
};

export default WishPage;
