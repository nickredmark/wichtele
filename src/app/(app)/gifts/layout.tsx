"use client";

import Link from "next/link";
import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { Column } from "../../../components/column";
import { useData } from "../../../components/data";
import { Elf } from "../../../components/elf";
import { Markdown } from "../../../components/markdown";
import { WishComponent } from "../../../components/wish";
import { WishesComponent } from "../../../components/wishes";
import { useI18n } from "../../../utils/i18n";

const WishesPage = ({ children }: { children: ReactNode }) => {
  const { me, users, refetch } = useData();
  const { t } = useI18n();

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-stretch space-x-1">
          <Link href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </Link>
          <span>{t("your-gifts")}</span>
        </h2>
        <WishesComponent>
          {me.gifts.length ? (
            me.gifts.map((wish) => {
              const user = users.find((user) => user._id === wish.user)!;
              return (
                <WishComponent key={wish._id}>
                  <a href={`/gifts/${wish._id}`} className="float-right">
                    <FaPencilAlt />
                  </a>
                  <span className="font-bold text-sm">
                    {t("for")} {user.name}
                  </span>
                  <div>
                    <Markdown>{wish.content}</Markdown>
                  </div>
                  <div className="flex flex-col items-end">
                    <button
                      className={`py-1 px-2 bg-gray-300 text-white cursor-pointer disabled:cursor-default`}
                      onClick={async () => {
                        await fetch(
                          `${process.env.NEXT_PUBLIC_API_URL!}/wishes/${
                            wish._id
                          }/reserved`,
                          {
                            method: "PUT",
                            body: JSON.stringify(wish.reservedBy !== me._id),
                          }
                        );
                        refetch();
                      }}
                    >
                      {t("reserved")}
                    </button>
                    {user.address && (
                      <div className="text-sm mt-2">
                        <div className="mb-1">{t("send-to")}</div>
                        <div className="whitespace-pre">{user.address}</div>
                      </div>
                    )}
                  </div>
                </WishComponent>
              );
            })
          ) : (
            <Elf />
          )}
        </WishesComponent>
      </Column>
      {children}
    </>
  );
};

export default WishesPage;
