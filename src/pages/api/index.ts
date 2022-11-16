import { flatMap, maxBy, orderBy, uniqBy } from "lodash";
import { NextApiHandlerWithContext, withContext } from "../../utils/api";

const handler: NextApiHandlerWithContext = async (
  _req,
  res,
  { me, Users, Groups, Wishes, Comments }
) => {
  me.groups = await Groups.find({ members: me._id }).toArray();
  me.wishes = await Wishes.find({ user: me._id, createdBy: me._id }).toArray();

  for (const group of me.groups) {
    group.members = (
      await Users.find({
        _id: {
          $in: (group.members as unknown as string[]).map((id) => id),
        },
      }).toArray()
    ).map(({ _id, name, code, createdBy, loggedIn, ...rest }) => ({
      _id,
      name,
      createdBy,
      ...(!loggedIn && createdBy === me._id && { code }),
      ...rest,
    }));

    for (const member of group.members) {
      const candidates: any[] = [];

      member.wishes = await Wishes.find({
        user: member._id,
        groups: group._id,
        ...(me._id === member._id && {
          createdBy: me._id,
        }),
      }).toArray();
      candidates.push(...member.wishes);

      for (const wish of member.wishes) {
        wish.comments = await Comments.find(
          {
            wish: wish._id,
            group: group._id,
            ...(me._id === member._id && {
              createdBy: me._id,
            }),
          },
          { sort: { createdAt: "desc" } }
        ).toArray();

        if (wish.comments.length) {
          candidates.push(wish.comments[wish.comments.length - 1]);
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

  const users = uniqBy(
    flatMap(me.groups.map((group: any) => group.members)),
    "_id"
  );

  return { me, users };
};

export default withContext(handler);
