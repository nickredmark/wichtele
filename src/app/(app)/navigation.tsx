"use client";

import { useRouter, useSelectedLayoutSegments } from "next/navigation";
import { FC, useEffect, useState } from "react";
import { FaChevronDown, FaChevronRight, FaCopy, FaUser } from "react-icons/fa";
import { AddMember } from "../../components/add-member";
import { Column } from "../../components/column";
import { CreateGroup } from "../../components/create-group";
import { User } from "../../config/models";

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
    <Column showWithSegments={[["groups", "*"]]} className="sm:max-w-xs">
      <h1 className="nav-header">
        <a href="/account" className="flex flex-row items-center">
          <span className="flex-grow">Hallo, {me.name}</span>
          <FaUser />
        </a>
      </h1>
      <div className="flex-grow">
        <div className="border-gray-300 border-b">
          <h2>
            <a
              href="/wishes"
              className={`p-2 flex flex-row items-center ${
                segments[0] === "wishes" ? "bg-gray-100" : "hover:bg-gray-100"
              }`}
            >
              <span className="flex-grow">Your Wishes</span>
            </a>
          </h2>
        </div>
        {me.groups.map((group) => {
          const active = segments[0] === "groups" && segments[1] === group._id;

          return (
            <div key={group._id} className="border-gray-300 border-b">
              <h2>
                <a
                  href={`/groups/${group._id}`}
                  className={`p-2 flex flex-row items-center ${
                    active ? "bg-gray-100" : "hover:bg-gray-100"
                  }`}
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
                        href={`/groups/${group._id}/members/${member._id}`}
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
  const url = `${location.origin}/?code=${code}`;
  const [copied, setCopied] = useState(false);
  const [open, setOpen] = useState(false);

  return (
    <button
      className="flex flex-row space-x-1 items-center text-xs text-gray-500 absolute right-2 top-2"
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
      <span>invite link</span>
      <FaCopy />
      {copied && <div className="absolute top-full">Copied!</div>}
      {open && (
        <input
          onBlur={() => setOpen(false)}
          autoFocus
          onFocus={(e) => e.target.select()}
          readOnly
          className="absolute top-full"
          value={url}
        />
      )}
    </button>
  );
};
