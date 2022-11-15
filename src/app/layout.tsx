import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import "../../styles/globals.css";
import { Group, User } from "../config/models";
import { getDb } from "../services/db";
import { serialize } from "../utils/objects";
import { CreateGroup } from "./create-group";
import { Groups } from "./groups";
import { Logout, SetCode } from "./set-code";

export const getData = async (): Promise<User | null> => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  if (!code) {
    return null;
  }

  const { Users, Groups } = await getDb();

  const me = await (async () => {
    const me = serialize(await Users.findOne<User>({ code }));
    if (me) {
      return me;
    }

    if (code === process.env.ADMIN_CODE) {
      await Users.insertOne({
        name: "Admin",
        code,
        loggedIn: true,
      });
      return serialize(await Users.findOne<User>({ code }));
    }
  })();

  if (!me) {
    return null;
  }

  if (!me.loggedIn) {
    await Users.updateOne({ _id: me._id }, { $set: { loggedIn: true } });
  }

  me.groups = await Groups.find<Group>({
    members: new ObjectId(me._id),
  }).toArray();

  for (const group of me.groups) {
    group.members = serialize(
      await Users.find<User>({
        _id: { $in: group.members },
      }).toArray()
    ).map(({ _id, name, code, createdBy, loggedIn, ...rest }) => ({
      _id,
      name,
      createdBy,
      ...(!loggedIn && createdBy === me._id && { code }),
      ...rest,
    }));
  }

  return serialize(me);
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
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width" />
      </head>
      <body>
        <main>
          <nav id="left-nav">
            <h1 className="nav-header flex">
              <span className="flex-grow">Hallo, {me.name}</span>
              <Logout />
            </h1>
            <Groups me={me} />
            <CreateGroup me={me} />
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
