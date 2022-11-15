import { cookies } from "next/headers";
import { ReactNode } from "react";
import "../../styles/globals.css";
import { Group, User } from "../config/models";
import { getDb } from "../services/db";
import { serialize } from "../utils/objects";
import { CreateGroup } from "./create-group";
import { Groups } from "./groups";
import { SetCode } from "./set-code";

export const getData = async (): Promise<User | null> => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  if (!code) {
    return null;
  }

  const { Users, Groups } = await getDb();

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

  me.groups = await Groups.find<Group>({ members: me._id }).toArray();

  for (const group of me.groups) {
    group.members = await Users.find({
      _id: { $in: group.members },
    })
      .project<User>({ _id: true, name: true })
      .toArray();
  }

  return serialize(me);
};

const RootLayout = async ({
  children,
}: {
  params: { group?: string };
  children: ReactNode;
}) => {
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
            <h1 className="nav-header">Hallo, {me.name}</h1>
            <Groups me={me} />
            <CreateGroup />
          </nav>
          {children}
        </main>
      </body>
    </html>
  );
};

export default RootLayout;
