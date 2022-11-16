"use client";

import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { AddComment } from "../../../../../components/add-comment";
import { Column } from "../../../../../components/column";
import { Comments } from "../../../../../components/comments";
import { CreateWish } from "../../../../../components/create-wish";
import { useData } from "../../../../../components/data";
import { EditWishGroups } from "../../../../../components/edit-wish-groups";
import { Elf } from "../../../../../components/elf";
import { Markdown } from "../../../../../components/markdown";
import { WishComponent } from "../../../../../components/wish";
import { WishesComponent } from "../../../../../components/wishes";

const GroupPage = ({
  params: { group: groupId },
  children,
}: {
  params: { group: string };
  children: ReactNode;
}) => {
  const { me } = useData();
  const group = me.groups.find((group) => group._id === groupId)!;
  const meMember = group.members.find((member) => member._id === me._id)!;

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
          {meMember.wishes.length ? (
            meMember.wishes.map((wish) => (
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
                    availableGroups={me.groups}
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
