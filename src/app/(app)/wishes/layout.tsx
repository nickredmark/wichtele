import { ObjectId } from "mongodb";
import { ReactNode } from "react";
import { FaArrowLeft, FaPencilAlt } from "react-icons/fa";
import { Column } from "../../../components/column";
import { CreateWish } from "../../../components/create-wish";
import { EditWishGroups } from "../../../components/edit-wish-groups";
import { Markdown } from "../../../components/markdown";
import { WishComponent } from "../../../components/wish";
import { WishesComponent } from "../../../components/wishes";
import { Group, Wish } from "../../../config/models";
import { getDb } from "../../../services/db";
import { getMe } from "../../../utils/data";
import { serialize } from "../../../utils/objects";

const getData = async () => {
  const { Groups, Wishes } = await getDb();
  const me = await getMe();

  const groups = serialize(
    await Groups.find<Group>({
      members: new ObjectId(me._id),
    })
      .sort("createdAt", "desc")
      .toArray()
  );

  const wishes = serialize(
    await Wishes.find<Wish>({
      user: new ObjectId(me._id),
      createdBy: new ObjectId(me._id),
    })
      .sort("createdAt", "desc")
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
          <a href="/" className="p-1 sm:hidden">
            <FaArrowLeft />
          </a>
          <span>All your wishes</span>
        </h2>
        <WishesComponent>
          {wishes.map((wish) => (
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
                availableGroups={groups}
              />
            </WishComponent>
          ))}
        </WishesComponent>
        <CreateWish
          initialState={{
            content: "",
            groups: groups.map((group) => group._id),
          }}
          availableGroups={groups}
        />
      </Column>
      {children}
    </>
  );
};

export default WishesPage;
