import { pick } from "lodash";
import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { Comment, User, Wish } from "../../../../../config/models";
import { getDb } from "../../../../../services/db";
import { AddComment } from "./add-comment";

export const getData = async (
  groupId: string,
  memberId: string
): Promise<User> => {
  const { Users, Wishes, Comments } = await getDb();
  const member = pick(
    await Users.findOne<User>({ _id: new ObjectId(memberId) }),
    "_id",
    "name"
  ) as User;

  if (!member) {
    throw new Error("Not found");
  }

  member.wishes = await Wishes.find<Wish>({
    groups: groupId,
    users: memberId,
  }).toArray();

  for (const wish of member.wishes) {
    wish.comments = await Comments.find<Comment>({
      wish: wish._id,
      group: groupId,
    }).toArray();
  }

  return member;
};

const MemberLayout = async ({
  params: { group: groupId, member: memberId },
}: {
  params: { group: string; member: string };
  children: ReactNode;
}) => {
  const member = await getData(groupId, memberId);

  return (
    <div>
      <h2>{member.name}</h2>
      {member.wishes.map((wish) => (
        <div key={wish._id}>
          <h3>{wish.name}</h3>
          <div>{wish.description}</div>
          <div>{wish.url}</div>
          <div>
            <h4>Comments</h4>
            {wish.comments.map((comment) => (
              <div key={comment._id}></div>
            ))}
            <AddComment />
          </div>
        </div>
      ))}
    </div>
  );
};

export default MemberLayout;
