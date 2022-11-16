"use client";

import { Column } from "../../../../components/column";
import { useData } from "../../../../components/data";
import { EditWish } from "./edit-wish";

const WishPage = ({
  params: { wish: wishId },
}: {
  params: { wish: string };
}) => {
  const { me } = useData();
  const wish = me.wishes.find((wish) => wish._id === wishId)!;

  return (
    <Column className="sm:max-w-sm">
      <h2 className="nav-header">Edit Wish</h2>
      <EditWish initialState={wish} availableGroups={me.groups} />
    </Column>
  );
};

export default WishPage;
