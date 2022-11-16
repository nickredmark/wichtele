"use client";

import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { FC, useEffect, useState } from "react";
import {
  FaChevronDown,
  FaChevronRight,
  FaCopy,
  FaSignOutAlt,
} from "react-icons/fa";
import { User } from "../../config/models";
import { AddMember } from "./add-member";
import { Column } from "./column";
import { CreateGroup } from "./create-group";

export const Navigation = ({ me }: { me: User }) => {
  const segments = useSelectedLayoutSegments();
  const router = useRouter();

  useEffect(() => {
    const interval = setInterval(() => {
      router.refresh();
    }, 10000);

    return () => clearInterval(interval);
  }, [JSON.stringify(segments)]);

  return (
    <Column maxSegments={2} className="sm:max-w-xs">
      <h1 className="nav-header flex items-center">
        <span className="flex-grow">Hallo, {me.name}</span>
        <a href="/logout">
          <FaSignOutAlt />
        </a>
      </h1>
      <div className="flex-grow">
        {me.groups.map((group) => {
          const active = segments[0] === "groups" && segments[1] === group._id;

          return (
            <div key={group._id} className="border-gray-300 border-b">
              <h2>
                <a
                  href={active ? "/" : `/groups/${group._id}`}
                  className="p-2 flex flex-row items-center hover:bg-gray-100"
                >
                  <span className="flex-grow">{group.name}</span>
                  {active ? <FaChevronDown /> : <FaChevronRight />}
                </a>
              </h2>
              {active && (
                <>
                  {group.members.map((member) => (
                    <div
                      key={member._id}
                      className={`relative border-t border-gray-200 ${
                        segments[2] === "members" && segments[3] === member._id
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <a
                        href={`/groups/${group._id}/members/${member._id}/wishes`}
                        className="flex flex-col p-2 pl-4"
                      >
                        <h2>
                          <span className="flex-grow">{member.name}</span>
                        </h2>
                        {member.code && <Code code={member.code} />}
                        {member.lastActivity && (
                          <span className="text-sm text-gray-500">
                            {member.lastActivity.content}
                          </span>
                        )}
                      </a>
                    </div>
                  ))}
                  <div className="border-t border-gray-200">
                    {group.createdBy === me._id && (
                      <AddMember groupId={group._id} />
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
      <CreateGroup me={me} />
    </Column>
  );
};

const Code: FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  return (
    <button
      className="flex flex-row space-x-1 items-center text-xs text-gray-500 absolute right-2 top-2"
      onBlur={() => setCopied(false)}
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText(`${location.origin}/?code=${code}`);
        setCopied(true);
      }}
    >
      <span>invite link</span>
      <FaCopy />
      {copied && <div className="absolute top-full">Copied!</div>}
    </button>
  );
};
