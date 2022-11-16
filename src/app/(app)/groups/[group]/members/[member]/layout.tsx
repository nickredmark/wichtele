import { orderBy } from "lodash";
import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { AddComment } from "../../../../../../components/add-comment";
import { Column } from "../../../../../../components/column";
import { Comments } from "../../../../../../components/comments";
import { CreateWish } from "../../../../../../components/create-wish";
import { EditWishGroups } from "../../../../../../components/edit-wish-groups";
import { Markdown } from "../../../../../../components/markdown";
import { WishComponent } from "../../../../../../components/wish";
import { WishesComponent } from "../../../../../../components/wishes";
import { Comment, Group, User, Wish } from "../../../../../../config/models";
import { getDb } from "../../../../../../services/db";
import { getMe } from "../../../../../../utils/data";
import { serialize } from "../../../../../../utils/objects";

export const getData = async (groupId: string, memberId: string) => {
  const { Users, Groups, Wishes, Comments } = await getDb();

  const me = await getMe();

  const group = (await Groups.findOne({ _id: new ObjectId(groupId) }))!;

  const groups = serialize(
    await Groups.find<Group>({
      members: new ObjectId(me._id),
    })
      .sort("createdAt", "asc")
      .toArray()
  );

  const members = await Users.find({
    $and: [
      {
        _id: { $in: group.members },
      },
    ],
  })
    .project<User>({ _id: true, name: true })
    .toArray();

  const member = members.find((member) =>
    new ObjectId(memberId).equals(member._id)
  );

  if (!member) {
    throw new Error("Not found");
  }

  member.wishes = await Wishes.find<Wish>({
    user: member._id,
    groups: group._id,
    ...(me._id === memberId && {
      createdBy: new ObjectId(me._id),
    }),
  }).toArray();

  for (const wish of member.wishes) {
    wish.comments = await Comments.find<Comment>({
      wish: wish._id,
      group: group._id,
      ...(me._id === memberId && {
        createdBy: new ObjectId(me._id),
      }),
    }).toArray();
  }

  member.wishes = orderBy(
    member.wishes,
    "createdAt",
    // (wish) =>
    //   max([
    //     wish.createdAt,
    //     ...wish.comments.map((comment) => comment.createdAt),
    //   ]),
    "desc"
  );

  return serialize({ me, group, groups, members, member });
};

const MemberLayout = async ({
  params: { group: groupId, member: memberId },
  children,
}: {
  params: { group: string; member: string };
  children: ReactNode;
}) => {
  const { me, group, groups, members, member } = await getData(
    groupId,
    memberId
  );

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-stretch space-x-1">
          <a href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </a>
          <span className="flex-grow">{member.name}</span>
        </h2>
        <WishesComponent>
          {member.wishes.map((wish) => (
            <WishComponent key={wish._id}>
              {wish.createdBy === me._id && (
                <a
                  href={`/groups/${groupId}/members/${member._id}/${wish._id}`}
                  className="float-right"
                >
                  <FaPencilAlt />
                </a>
              )}
              {wish.createdBy !== member._id && (
                <span className="font-bold text-sm">
                  {
                    members.find((member) => member._id === wish.createdBy)
                      ?.name
                  }
                  's proposal
                </span>
              )}
              <div>
                <Markdown>{wish.content}</Markdown>
              </div>
              {wish.createdBy === me._id && (
                <EditWishGroups
                  id={wish._id}
                  groups={wish.groups}
                  availableGroups={groups}
                />
              )}
              <Comments comments={wish.comments} users={members} />
              <AddComment
                mine={wish.user === me._id}
                group={groupId}
                wish={wish._id}
              />
            </WishComponent>
          ))}
        </WishesComponent>
        <CreateWish
          user={member._id !== me._id ? member : undefined}
          initialState={{ content: "", groups: [groupId] }}
        />
      </Column>
      {children}
    </>
  );
};

export default MemberLayout;
