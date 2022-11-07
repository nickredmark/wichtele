import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Group, User, Wish } from "../../../config/models";
import { getDb } from "../../../services/db";
import { AddToGroup } from "./add-to-group";

export const getData = async (groupId: string) => {
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

  const wish = await Wishes.findOne<Wish>({ _id: new ObjectId(groupId) });

  if (!wish) {
    throw new Error("Not found");
  }

  wish.groups = await Groups.find({ _id: { $in: wish.groups || [] } })
    .project<Group>({ _id: true, name: true })
    .toArray();

  return { wish, groups };
};

const GroupLayout = async ({
  params: { wish: wishId },
  children,
}: {
  params: { wish: string };
  children: ReactNode;
}) => {
  const { wish, groups } = await getData(wishId);

  console.log(typeof groups[0]._id);

  return (
    <div>
      <h2>{wish.name}</h2>
      <div>{wish.description}</div>
      <div>{wish.url}</div>
      <h3>Groups</h3>
      <ul>
        {wish.groups.map((group) => (
          <li key={group._id}>
            <a href={`/groups/${group._id}`}>{group.name}</a>
          </li>
        ))}
      </ul>
      <AddToGroup
        wishId={wishId}
        groups={groups
          .filter((group) => !wish.groups.some(({ _id }) => group._id === _id))
          .map((group) => [group._id, group.name])}
      />
      {children}
    </div>
  );
};

export default GroupLayout;
