import { max, orderBy } from "lodash";
import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { AddComment } from "../../../../../components/add-comment";
import { Column } from "../../../../../components/column";
import { Comments } from "../../../../../components/comments";
import { CreateWish } from "../../../../../components/create-wish";
import { EditWishGroups } from "../../../../../components/edit-wish-groups";
import { Elf } from "../../../../../components/elf";
import { Markdown } from "../../../../../components/markdown";
import { WishComponent } from "../../../../../components/wish";
import { WishesComponent } from "../../../../../components/wishes";
import { Comment, Group, User, Wish } from "../../../../../config/models";
import { getDb } from "../../../../../services/db";
import { getMe } from "../../../../../utils/data";
import { serialize } from "../../../../../utils/objects";
const getData = async (groupId: string) => {
  const { Users, Groups, Wishes, Comments } = await getDb();

  const me = await getMe();

  const group = (await Groups.findOne<Group>({ _id: new ObjectId(groupId) }))!;

  const groups = serialize(
    await Groups.find<Group>({
      members: new ObjectId(me._id),
    })
      .sort("createdAt", "asc")
      .toArray()
  );

  group.members = await Users.find({
    $and: [
      {
        _id: { $in: group.members },
      },
    ],
  })
    .project<User>({ _id: true, name: true })
    .toArray();

  let wishes = serialize(
    await Wishes.find<Wish>({
      groups: group._id,
      $or: [
        { createdBy: new ObjectId(me._id) },
        {
          user: {
            $ne: new ObjectId(me._id),
          },
        },
      ],
    }).toArray()
  );

  for (const wish of wishes) {
    wish.comments = serialize(
      await Comments.find<Comment>({
        wish: new ObjectId(wish._id),
        group: new ObjectId(group._id),
        ...(me._id === wish.user && {
          createdBy: new ObjectId(me._id),
        }),
      }).toArray()
    );
  }

  wishes = orderBy(
    wishes,
    (wish) =>
      max([
        wish.createdAt,
        ...wish.comments.map((comment) => comment.createdAt),
      ]),
    "desc"
  );

  return serialize({ me, group, wishes, groups });
};

const GroupPage = async ({
  params: { group: groupId },
  children,
}: {
  params: { group: string };
  children: ReactNode;
}) => {
  const { me, group, groups, wishes } = await getData(groupId);

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-stretch space-x-1">
          <a href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </a>
          <span className="flex-grow">{group.name}</span>
        </h2>
        <WishesComponent>
          {wishes.length ? (
            wishes.map((wish) => (
              <WishComponent key={wish._id}>
                {wish.createdBy === me._id && (
                  <a
                    href={`/groups/${groupId}/${wish._id}`}
                    className="float-right"
                  >
                    <FaPencilAlt />
                  </a>
                )}
                {wish.createdBy === wish.user ? (
                  <span className="text-sm">
                    <span className="font-bold">
                      {
                        group.members.find(
                          (member) => member._id === wish.createdBy
                        )?.name
                      }
                    </span>{" "}
                    wishes:
                  </span>
                ) : (
                  <span className="text-sm">
                    <span className="font-bold">
                      {
                        group.members.find(
                          (member) => member._id === wish.createdBy
                        )?.name
                      }
                    </span>{" "}
                    proposes for{" "}
                    <span className="font-bold">
                      {
                        group.members.find((member) => member._id === wish.user)
                          ?.name
                      }
                    </span>
                    :
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
                <Comments comments={wish.comments} users={group.members} />
                <AddComment
                  mine={wish.user === me._id}
                  group={groupId}
                  wish={wish._id}
                />
              </WishComponent>
            ))
          ) : (
            <Elf />
          )}
        </WishesComponent>
        <CreateWish initialState={{ content: "", groups: [groupId] }} />
      </Column>
      {children}
    </>
  );
};

export default GroupPage;
