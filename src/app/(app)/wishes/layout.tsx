"use client";

import Link from "next/link";
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
import { useI18n } from "../../../utils/i18n";

const WishesPage = ({ children }: { children: ReactNode }) => {
  const { me } = useData();
  const { t } = useI18n();

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-stretch space-x-1">
          <Link href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </Link>
          <span>{t("all-your-wishes")}</span>
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
