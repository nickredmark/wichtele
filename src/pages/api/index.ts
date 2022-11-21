import { clone, flatMap, maxBy, orderBy } from "lodash";
import { ObjectId } from "mongodb";
import { NextApiHandlerWithContext, withContext } from "../../utils/api";

type Entity = { _id: ObjectId };

const handler: NextApiHandlerWithContext = async (
  _req,
  _res,
  { me, Users, Groups, Wishes, Comments }
) => {
  me.groups = await Groups.find({ members: me._id }).toArray();

  const users = (
    await Users.find({
      _id: {
        $in: flatMap(me.groups.map((group: any) => group.members)),
      },
    }).toArray()
  ).map(({ _id, name, code, createdBy, loggedIn, language }) => ({
    _id,
    name,
    createdBy,
    language,
    ...(!loggedIn && createdBy.equals(me._id) && { code }),
  }));

  const allWishes = await Wishes.find({
    $or: [
      {
        groups: {
          $in: me.groups.map((group: Entity) => group._id),
        },
      },
      {
        createdBy: me._id,
      },
    ],
  }).toArray();
  me.wishes = allWishes
    .filter((wish) => wish.user.equals(me._id) && wish.createdBy.equals(me._id))
    .map(clone);

  const allComments = await Comments.find(
    {
      wish: {
        $in: allWishes.map((wish: Entity) => wish._id),
      },
    },
    { sort: { createdAt: "desc" } }
  ).toArray();

  for (const group of me.groups) {
    group.members = users
      .filter((user) =>
        group.members.some((id: ObjectId) => id.equals(user._id))
      )
      .map(clone);

    if (group.assignment && !group.createdBy.equals(me._id)) {
      group.assignment = {
        [me._id]: group.assignment[me._id],
      };
    }

    for (const member of group.members) {
      const isMe = member._id.equals(me._id);

      member.wishes = allWishes
        .filter(
          (wish) =>
            wish.user.equals(member._id) &&
            wish.groups.some((id: ObjectId) => id.equals(group._id)) &&
            (!isMe || wish.createdBy.equals(me._id))
        )
        .map(clone);

      for (const wish of member.wishes) {
        wish.comments = allComments
          .filter(
            (comment) =>
              comment.wish.equals(wish._id) &&
              comment.group.equals(group._id) &&
              (!isMe || comment.createdBy.equals(me._id))
          )
          .map(clone);
      }

      member.lastActivity = maxBy(
        flatMap(member.wishes.map((wish: any) => [wish, ...wish.comments])),
        "createdAt"
      );
    }

    group.members = orderBy(
      group.members,
      (member) => member.lastActivity?.createdAt || "",
      "desc"
    );
  }

  return { me, users };
};

export default withContext(handler);
