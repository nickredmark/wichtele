import { maxBy, orderBy } from "lodash";
import { ObjectId } from "mongodb";
import { cookies } from "next/headers";
import { ReactNode } from "react";
import { Comment, Group, User, Wish } from "../../config/models";
import { getDb } from "../../services/db";
import { serialize } from "../../utils/objects";
import { Navigation } from "./navigation";
import { SetCode } from "./set-code";

export const getData = async (): Promise<User | null> => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  if (!code) {
    return null;
  }

  const { Users, Groups, Wishes, Comments } = await getDb();

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

    for (const member of group.members) {
      const candidates: (Wish | Comment)[] = [];

      const wishes = await Wishes.find<Wish>({
        user: new ObjectId(member._id),
        groups: new ObjectId(group._id),
        ...(me._id === member._id && {
          createdBy: new ObjectId(me._id),
        }),
      }).toArray();
      candidates.push(...wishes);

      for (const wish of wishes) {
        const lastComment = await Comments.findOne<Comment>(
          {
            wish: new ObjectId(wish._id),
            group: new ObjectId(group._id),
            ...(me._id === member._id && {
              createdBy: new ObjectId(me._id),
            }),
          },
          { sort: { createdAt: "desc" } }
        );
        if (lastComment) {
          candidates.push(lastComment);
        }
      }

      if (candidates.length) {
        member.lastActivity = maxBy(candidates, "createdAt");
      }
    }

    group.members = orderBy(
      group.members,
      (member) => member.lastActivity?.createdAt || "",
      "desc"
    );
  }

  return serialize(me);
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const me = await getData();

  if (!me) {
    return <SetCode />;
  }

  return (
    <main>
      <Navigation me={me} />
      {children}
    </main>
  );
};

export default RootLayout;
