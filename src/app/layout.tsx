import { cookies } from "next/headers";
import { ReactNode } from "react";
import "../../styles/globals.css";
import { Group, User, Wish } from "../config/models";
import { getDb } from "../services/db";
import { CreateGroup } from "./create-group";
import { CreateWish } from "./create-wish";
import { SetCode } from "./set-code";

export const getData = async (): Promise<User | null> => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  if (!code) {
    return null;
  }

  const { Users, Wishes, Groups } = await getDb();

  const me = await (async () => {
    const me = await Users.findOne<User>({ code });
    if (me) {
      return me;
    }

    if (code === process.env.ADMIN_CODE) {
      await Users.insertOne({
        name: "Admin",
        code,
      });
      return await Users.findOne<User>({ code });
    }
  })();

  if (!me) {
    throw new Error("No user found with this code.");
  }

  if (!me.loggedIn) {
    await Users.updateOne({ _id: me._id }, { $set: { loggedIn: true } });
  }

  me.wishes = await Wishes.find<Wish>({
    user: me._id,
    createdBy: me._id,
  }).toArray();

  me.groups = await Groups.find<Group>({ members: me._id }).toArray();

  return me;
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const me = await getData();

  if (!me) {
    return (
      <html>
        <body>
          <SetCode />
        </body>
      </html>
    );
  }

  return (
    <html>
      <head></head>
      <body>
        <h1>Hallo, {me.name}</h1>
        <div className="flex">
          <div className="w-96">
            <h2>Your Wishes</h2>
            <ul>
              {me.wishes.map((wish) => (
                <li key={wish._id}>
                  <a href={`/wishes/${wish._id}`}>{wish.name}</a>
                </li>
              ))}
            </ul>
            <CreateWish />
            <h2>Your Groups</h2>
            <ul>
              {me.groups.map((group) => (
                <li key={group._id}>
                  <a href={`/groups/${group._id}`}>{group.name}</a>
                </li>
              ))}
            </ul>
            <CreateGroup />
          </div>
          <div>{children}</div>
        </div>
      </body>
    </html>
  );
};

export default RootLayout;
