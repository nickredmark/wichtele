"use client";

import Link from "next/link";
import { useSelectedLayoutSegments } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaCopy,
  FaTimes,
  FaUser,
} from "react-icons/fa";
import { remark } from "remark";
import strip from "strip-markdown";
import { AddMember } from "../../components/add-member";
import { Column } from "../../components/column";
import { CreateGroup } from "../../components/create-group";
import { useData } from "../../components/data";
import { Group, User } from "../../config/models";
import { useI18n } from "../../utils/i18n";

export const Navigation = () => {
  const segments = useSelectedLayoutSegments();
  const { me, users, refetch } = useData();
  const { t } = useI18n();

  useEffect(() => {
    const interval = setInterval(() => {
      refetch();
    }, 10000);

    return () => clearInterval(interval);
  }, [JSON.stringify(segments)]);

  return (
    <Column className="sm:max-w-xs" border={false} paper={false}>
      <h1 className="nav-header">
        <Link href="/account" className="flex flex-row items-center">
          <span className="flex-grow">
            {t("hello")}, {me.name}!
          </span>
          <FaUser />
        </Link>
      </h1>
      <div className="flex flex-col flex-1 overflow-y-auto">
        <div className="flex-grow">
          <div className="border-gray-300 border-b">
            <h2>
              <Link
                href="/wishes"
                className={`p-2 flex flex-row items-center ${
                  segments[0] === "wishes" ? "bg-gray-100" : "hover:bg-gray-100"
                }`}
              >
                <span className="flex-grow">{t("your-wishes")}</span>
              </Link>
            </h2>
          </div>
          {me.proposals.length > 0 && (
            <div className="border-gray-300 border-b">
              <h2>
                <Link
                  href="/proposals"
                  className={`p-2 flex flex-row items-center ${
                    segments[0] === "wishes"
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="flex-grow">{t("your-proposals")}</span>
                </Link>
              </h2>
            </div>
          )}
          {me.gifts.length > 0 && (
            <div className="border-gray-300 border-b">
              <h2>
                <Link
                  href="/gifts"
                  className={`p-2 flex flex-row items-center ${
                    segments[0] === "wishes"
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <span className="flex-grow">{t("your-gifts")}</span>
                </Link>
              </h2>
            </div>
          )}
          {me.groups.map((group, i) => (
            <GroupComponent
              key={group._id}
              me={me}
              group={group}
              users={users}
              segments={segments}
              first={i === 0}
            />
          ))}
        </div>
        <CreateGroup me={me} />
      </div>
    </Column>
  );
};

const GroupComponent: FC<{
  me: User;
  group: Group;
  users: User[];
  segments: string[];
  first?: boolean;
}> = ({ me, group, users, segments, first }) => {
  {
    const [toggled, setToggled] = useState(
      first || (segments[0] === "groups" && segments[1] === group._id)
    );
    const { refetch } = useData();
    const { t } = useI18n();

    return (
      <div className="border-gray-300 border-b">
        <h2
          className="p-2 cursor-pointer flex flex-row items-center hover:bg-gray-100"
          onClick={() => setToggled(!toggled)}
        >
          <span className="flex-grow">{group.name}</span>
          {toggled ? <FaChevronDown /> : <FaChevronRight />}
        </h2>
        {toggled && (
          <>
            {group.members
              .filter((member) => member._id !== me._id)
              .filter(
                (member) =>
                  group.createdBy === me._id ||
                  !group.assignment ||
                  member._id === group.assignment[me._id]
              )
              .map((member) => (
                <div
                  key={member._id}
                  className={`relative border-t border-gray-200 ${
                    segments[2] === "members" && segments[3] === member._id
                      ? "bg-gray-100"
                      : "hover:bg-gray-100"
                  }`}
                >
                  <Link
                    href={`/groups/${group._id}/members/${member._id}`}
                    className="flex flex-col p-2 pl-4"
                  >
                    <h2>
                      <span className="flex-grow">
                        {member.name}
                        {group.assignment?.[me._id] === member._id &&
                          ` (${t("your-beneficiary")})`}
                      </span>
                    </h2>
                    {group.createdBy === me._id && (
                      <Code
                        code={member.code}
                        onRemoveMember={async () => {
                          await fetch(
                            `${process.env.NEXT_PUBLIC_API_URL}/groups/${group._id}/members/${member._id}`,
                            {
                              method: "DELETE",
                            }
                          );
                          await refetch();
                        }}
                      />
                    )}
                    {member.lastActivity && (
                      <span className="text-sm text-gray-500 break-words">
                        {remark()
                          .use(strip)
                          .processSync(member.lastActivity.content)
                          .toString()
                          .slice(0, 50)}
                      </span>
                    )}
                  </Link>
                </div>
              ))}
            <div className="border-t border-gray-200">
              {group.createdBy === me._id && (
                <AddMember group={group} users={users} />
              )}
            </div>
          </>
        )}
      </div>
    );
  }
};

const Code: FC<{ code?: string; onRemoveMember: () => void }> = ({
  code,
  onRemoveMember,
}) => {
  const [url, setUrl] = useState<string>();
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);
  const { t } = useI18n();

  useEffect(() => {
    setUrl(`${location.origin}/?code=${code}`);
  }, []);

  if (!url) {
    return null;
  }

  return (
    <>
      <div className="text-xs text-gray-500 flex flex-row absolute top-3 right-2 space-x-2">
        {code && <button
          className="flex flex-row space-x-1 items-center"
          onBlur={() => setCopied(false)}
          onClick={(e) => {
            e.preventDefault();
            if (navigator.clipboard) {
              navigator.clipboard.writeText(url);
              setCopied(true);
            } else {
              setOpen(true);
            }
          }}
        >
          <span>{t("invite-link")}</span>
          <FaCopy />
          {copied && <div className="absolute top-full">{t("copied")}</div>}
        </button>}
        <button
          onClick={(e) => {
            e.preventDefault();
            onRemoveMember();
          }}
        >
          <FaTimes />
        </button>
      </div>
      {open && (
        <input
          onKeyDown={(e) => {
            if (e.key === "Escape") {
              setOpen(false);
            }
          }}
          onBlur={() => setOpen(false)}
          autoFocus
          onFocus={(e) => e.target.select()}
          readOnly
          value={url}
        />
      )}
    </>
  );
};
