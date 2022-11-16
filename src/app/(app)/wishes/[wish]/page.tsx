import { ObjectId } from "mongodb";
import { Column } from "../../../../components/column";
import { Group, Wish } from "../../../../config/models";
import { getDb } from "../../../../services/db";
import { getMe } from "../../../../utils/data";
import { serialize } from "../../../../utils/objects";
import { EditWish } from "./edit-wish";

const getData = async (wishId: string) => {
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
    })
  )!;

  return { groups, wish };
};

const WishPage = async ({
  params: { wish: wishId },
}: {
  params: { wish: string };
}) => {
  const { groups, wish } = await getData(wishId);
  return (
    <Column className="sm:max-w-sm">
      <h2 className="nav-header">Edit Wish</h2>
      <EditWish initialState={wish} availableGroups={groups} />
    </Column>
  );
};

export default WishPage;
