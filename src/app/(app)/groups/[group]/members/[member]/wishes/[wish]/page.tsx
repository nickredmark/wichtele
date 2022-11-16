import { ObjectId } from "mongodb";
import { Group, Wish } from "../../../../../../../../config/models";
import { getDb } from "../../../../../../../../services/db";
import { getMe } from "../../../../../../../../utils/data";
import { serialize } from "../../../../../../../../utils/objects";
import { Column } from "../../../../../../column";
import { EditWish } from "./edit-wish";

export const getData = async (groupId: string, wishId: string) => {
  const { Groups, Wishes } = await getDb();

  const me = await getMe();

  const groups = serialize(
    await Groups.find({ members: new ObjectId(me._id) })
      .project<Group>({
        _id: true,
        name: true,
      })
      .toArray()
  );

  const wish = serialize(
    await Wishes.findOne<Wish>({
      _id: new ObjectId(wishId),
      createdBy: new ObjectId(me._id),
      groups: new ObjectId(groupId),
    })
  )!;

  return { groups, wish };
};

const WishPage = async ({
  params: { group: groupId, wish: wishId },
}: {
  params: { group: string; wish: string };
}) => {
  const { groups, wish } = await getData(groupId, wishId);
  return (
    <Column className="bg-gray-200 sm:max-w-sm">
      <h2 className="nav-header">Edit Wish</h2>
      <EditWish initialState={wish} availableGroups={groups} />
    </Column>
  );
};

export default WishPage;
