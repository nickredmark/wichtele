import { pick } from "lodash";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { Comment, User, Wish } from "../../../../../../../config/models";
import { getDb } from "../../../../../../../services/db";
import { serialize } from "../../../../../../../utils/objects";
import { Column } from "../../../../../column";
import { Markdown } from "../../../../../markdown";
import { AddComment } from "./add-comment";
import { CreateWish } from "./create-wish";

export const getData = async (groupId: string, memberId: string) => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;

  const { Users, Groups, Wishes, Comments } = await getDb();

  const me = serialize(
    pick((await Users.findOne<User>({ code }))!, "_id", "name")
  );
  const group = (await Groups.findOne({ _id: new ObjectId(groupId) }))!;

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

  return serialize({ me, group, members, member });
};

const MemberLayout = async ({
  params: { group: groupId, member: memberId },
  children,
}: {
  params: { group: string; member: string };
  children: ReactNode;
}) => {
  const { me, group, members, member } = await getData(groupId, memberId);

  return (
    <>
      <Column className="bg-gray-100">
        <h2 className="nav-header flex items-stretch space-x-1">
          <a href={`/groups/${groupId}`} className="p-1 sm:hidden">
            <FaArrowLeft />
          </a>
          <span className="flex-grow">
            {me._id === memberId ? "Your wishes" : `${member.name}'s wishes`}{" "}
            shared with {group.name}
          </span>
        </h2>
        <div className="flex-grow flex flex-col p-2 space-y-2 overflow-y-auto">
          {member.wishes.map((wish) => (
            <div key={wish._id} className="bg-gray-200 rounded-lg p-2">
              {wish.createdBy === me._id && (
                <a
                  href={`/groups/${groupId}/members/${member._id}/wishes/${wish._id}`}
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
              <div className="my-2 border-gray-300 border-b">
                {wish.comments.map((comment) => (
                  <div
                    key={comment._id}
                    className="border-gray-300 border-t py-2"
                  >
                    <div className="flex flex-row items-baseline space-x-1">
                      <span className="font-bold text-sm">
                        {
                          members.find(
                            (member) => member._id === comment.createdBy
                          )?.name
                        }
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(comment.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div>
                      <Markdown>{comment.content}</Markdown>
                    </div>
                  </div>
                ))}
              </div>
              <AddComment group={groupId} wish={wish._id} />
            </div>
          ))}
        </div>
        <div className="m-2 p-2 bg-gray-200 rounded-lg">
          <CreateWish
            user={member._id !== me._id ? member : undefined}
            initialState={{ content: "", groups: [groupId] }}
          />
        </div>
      </Column>
      {children}
    </>
  );
};

export default MemberLayout;
