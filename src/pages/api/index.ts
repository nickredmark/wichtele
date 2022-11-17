import { flatMap, maxBy, orderBy, uniqBy } from "lodash";
import { NextApiHandlerWithContext, withContext } from "../../utils/api";

const handler: NextApiHandlerWithContext = async (
  _req,
  _res,
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
    ).map(({ _id, name, code, createdBy, loggedIn }) => ({
      _id,
      name,
      createdBy,
      ...(!loggedIn && createdBy.equals(me._id) && { code }),
    }));

    for (const member of group.members) {
      const candidates: any[] = [];

      member.wishes = [];

      const isMe = member._id.equals(me._id);

      const wishes = await Wishes.find({
        user: member._id,
        groups: group._id,
        ...(isMe && {
          createdBy: me._id,
        }),
      }).toArray();
      candidates.push(...member.wishes);

      for (const wish of member.wishes) {
        const comments = await Comments.find(
          {
            wish: wish._id,
            ...(isMe && {
              createdBy: me._id,
            }),
          },
          { sort: { createdAt: "desc" } }
        ).toArray();

        if (
          !isMe &&
          comments.some(
            (comment) =>
              !comment.group.equals(group._id) &&
              !comment.createdBy.equals(wish.cretedBy)
          )
        ) {
          continue;
        }

        wish.comments = comments.filter((comment) =>
          comment.group.equals(group._id)
        );

        wishes.push(wish);

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
    (user: any) => user._id.toString()
  );

  return { me, users };
};

export default withContext(handler);
