import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { Group } from "../../../config/models";
import { getDb } from "../../../services/db";
import { AddMember } from "./add-member";

export const getData = async (groupId: string): Promise<Group> => {
  const { Groups, Users } = await getDb();
  const group = await Groups.findOne({ _id: new ObjectId(groupId) });

  if (!group) {
    throw new Error("Not found");
  }

  group.members = await Users.find({ _id: { $in: group.members } })
    .project({ _id: true, name: true })
    .toArray();

  return group as unknown as Group;
};

const GroupLayout = async ({
  params: { group: groupId },
  children,
}: {
  params: { group: string };
  children: ReactNode;
}) => {
  const group = await getData(groupId);

  return (
    <div>
      <h2>{group.name}</h2>
      <h3>Members</h3>
      <ul>
        {group.members.map((member) => (
          <li key={member._id}>
            <a href={`/groups/${groupId}/members/${member._id}`}>
              {member.name}
            </a>
          </li>
        ))}
      </ul>
      <AddMember groupId={groupId} />

      {children}
    </div>
  );
};

export default GroupLayout;
