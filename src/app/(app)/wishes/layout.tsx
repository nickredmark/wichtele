import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { Group, Wish } from "../../../config/models";
import { getDb } from "../../../services/db";
import { getMe } from "../../../utils/data";
import { serialize } from "../../../utils/objects";
import { Column } from "../column";
import { CreateWish } from "../groups/[group]/members/[member]/wishes/create-wish";
import { EditWishGroups } from "../groups/[group]/members/[member]/wishes/edit-wish.groups";
import { Markdown } from "../markdown";

export const getData = async () => {
  const { Groups, Wishes } = await getDb();
  const me = await getMe();

  const wishes = serialize(
    await Wishes.find<Wish>({
      user: new ObjectId(me._id),
      createdBy: new ObjectId(me._id),
    }).toArray()
  );

  const groups = serialize(
    await Groups.find<Group>({
      members: new ObjectId(me._id),
    })
      .sort("createdAt", "asc")
      .toArray()
  );

  return { wishes, groups };
};

const WishesPage = async ({ children }: { children: ReactNode }) => {
  const { wishes, groups } = await getData();

  return (
    <>
      <Column>
        <h2 className="nav-header flex items-stretch space-x-1">
          <a href="/account" className="p-1 sm:hidden">
            <FaArrowLeft />
          </a>
          <span>All your wishes</span>
        </h2>
        <div className="flex-grow flex flex-col p-2 space-y-2 overflow-y-auto">
          {wishes.map((wish) => (
            <div key={wish._id} className="bg-gray-200 rounded-lg p-2">
              <a href={`/wishes/${wish._id}`} className="float-right">
                <FaPencilAlt />
              </a>
              <div>
                <Markdown>{wish.content}</Markdown>
              </div>
              <EditWishGroups
                id={wish._id}
                groups={wish.groups}
                availableGroups={groups}
              />
            </div>
          ))}
        </div>
        <div className="m-2 p-2 bg-gray-200 rounded-lg">
          <CreateWish
            initialState={{
              content: "",
              groups: groups.map((group) => group._id),
            }}
            availableGroups={groups}
          />
        </div>
      </Column>
      {children}
    </>
  );
};

export default WishesPage;
