import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { Group, User, Wish } from "../../../../../../../../config/models";
import { getDb } from "../../../../../../../../services/db";
import { serialize } from "../../../../../../../../utils/objects";
import { Column } from "../../../../../../column";
import { EditWish } from "./edit-wish";

export const getData = async (groupId: string, wishId: string) => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;

  const { Users, Groups, Wishes } = await getDb();

  const me = (await Users.findOne<User>({ code }))!;
  const groups = await Groups.find({ members: me._id })
    .project<Group>({
      _id: true,
      name: true,
    })
    .toArray();

  const wish = (await Wishes.findOne<Wish>({
    _id: new ObjectId(wishId),
    createdBy: me._id,
    groups: new ObjectId(groupId),
  }))!;

  return serialize({ groups, wish });
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
