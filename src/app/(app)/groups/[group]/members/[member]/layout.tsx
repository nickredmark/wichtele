"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowLeft, FaChevronRight, FaPencilAlt } from "react-icons/fa";
import { AddComment } from "../../../../../../components/add-comment";
import { Column } from "../../../../../../components/column";
import { Comments } from "../../../../../../components/comments";
import { CreateWish } from "../../../../../../components/create-wish";
import { useData } from "../../../../../../components/data";
import { Elf } from "../../../../../../components/elf";
import { Markdown } from "../../../../../../components/markdown";
import { WishComponent } from "../../../../../../components/wish";
import { WishesComponent } from "../../../../../../components/wishes";
import { useI18n } from "../../../../../../utils/i18n";

const MemberLayout = ({
  params: { group: groupId, member: memberId },
  children,
}: {
  params: { group: string; member: string };
  children: ReactNode;
}) => {
  const { me } = useData();
  const { t } = useI18n();

  const group = me.groups.find((group) => group._id === groupId)!;
  const member = group.members.find((member) => member._id === memberId)!;

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-center space-x-2">
          <Link href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </Link>
          <span>{group.name}</span>
          <span className="text-xs">
            <FaChevronRight />
          </span>
          <span className="flex-grow">{member.name}</span>
        </h2>
        <WishesComponent>
          {member.wishes.length ? (
            member.wishes.map((wish) => (
              <WishComponent key={wish._id}>
                {wish.createdBy === me._id && (
                  <Link
                    href={`/groups/${groupId}/members/${member._id}/${wish._id}`}
                    className="float-right"
                  >
                    <FaPencilAlt />
                  </Link>
                )}
                {wish.createdBy !== member._id && (
                  <span className="font-bold text-sm">
                    {
                      group.members.find(
                        (member) => member._id === wish.createdBy
                      )?.name
                    }
                    {t("s-proposal")}
                  </span>
                )}
                <div>
                  <Markdown>{wish.content}</Markdown>
                </div>
                {/* {wish.createdBy === me._id && (
                  <EditWishGroups
                    id={wish._id}
                    groups={wish.groups}
                    availableGroups={me.groups}
                  />
                )} */}
                <Comments comments={wish.comments} users={group.members} />
                <AddComment member={member} group={groupId} wish={wish._id} />
              </WishComponent>
            ))
          ) : (
            <Elf />
          )}
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
