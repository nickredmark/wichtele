"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { FC, useState } from "react";
import { FaChevronDown, FaChevronRight, FaCopy } from "react-icons/fa";
import { User } from "../config/models";
import { AddMember } from "./add-member";

export const Groups = ({ me }: { me: User }) => {
  const segments = useSelectedLayoutSegments();

  return (
    <div className="flex-grow">
      {me.groups.map((group) => {
        const active = segments[0] === "groups" && segments[1] === group._id;

        return (
          <div key={group._id} className="border-gray-300 border-b">
            <h2>
              <a
                href={
                  active ? "/" : `/groups/${group._id}/members/${me._id}/wishes`
                }
                className="p-2 flex flex-row items-center hover:bg-gray-100"
              >
                <span className="flex-grow">{group.name}</span>
                {active ? <FaChevronDown /> : <FaChevronRight />}
              </a>
            </h2>
            {active && (
              <>
                {group.members.map((member) => (
                  <h2 key={member._id} className="relative">
                    <a
                      href={`/groups/${group._id}/members/${member._id}/wishes`}
                      className={`p-2 pl-4 border-t border-gray-200 flex flex-row ${
                        segments[2] === "members" && segments[3] === member._id
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      <span className="flex-grow">{member.name}</span>
                    </a>
                    {member.code && <Code code={member.code} />}
                  </h2>
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
  );
};

const Code: FC<{ code: string }> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  return (
    <a
      href={`/?code=${code}`}
      className="flex flex-row space-x-1 items-center text-xs text-gray-500 absolute right-2 top-2"
      onBlur={() => setCopied(false)}
      onClick={(e) => {
        e.preventDefault();
        navigator.clipboard.writeText(e.currentTarget.href);
        setCopied(true);
      }}
    >
      <span>invite link</span>
      <FaCopy />
      {copied && <div className="absolute top-full">Copied!</div>}
    </a>
  );
};
