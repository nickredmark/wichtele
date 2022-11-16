"use client";

import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { Column } from "../../../components/column";
import { CreateWish } from "../../../components/create-wish";
import { useData } from "../../../components/data";
import { EditWishGroups } from "../../../components/edit-wish-groups";
import { Elf } from "../../../components/elf";
import { Markdown } from "../../../components/markdown";
import { WishComponent } from "../../../components/wish";
import { WishesComponent } from "../../../components/wishes";

const WishesPage = ({ children }: { children: ReactNode }) => {
  const { me } = useData();

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-stretch space-x-1">
          <a href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </a>
          <span>All your wishes</span>
        </h2>
        <WishesComponent>
          {me.wishes.length ? (
            me.wishes.map((wish) => (
              <WishComponent key={wish._id}>
                <a href={`/wishes/${wish._id}`} className="float-right">
                  <FaPencilAlt />
                </a>
                <div>
                  <Markdown>{wish.content}</Markdown>
                </div>
                <EditWishGroups
                  id={wish._id}
                  groups={wish.groups}
                  availableGroups={me.groups}
                />
              </WishComponent>
            ))
          ) : (
            <Elf />
          )}
        </WishesComponent>
        <CreateWish
          initialState={{
            content: "",
            groups: me.groups.map((group) => group._id),
          }}
          availableGroups={me.groups}
        />
      </Column>
      {children}
    </>
  );
};

export default WishesPage;
