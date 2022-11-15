"use client";

import { useSelectedLayoutSegments } from "next/navigation";
import { FaChevronDown, FaChevronRight } from "react-icons/fa";
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
                  <h2 key={member._id}>
                    <a
                      href={`/groups/${group._id}/members/${member._id}/wishes`}
                      className={`block p-2 pl-4 border-t border-gray-200 ${
                        segments[2] === "members" && segments[3] === member._id
                          ? "bg-gray-100"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {member.name}
                    </a>
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
