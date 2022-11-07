import { ObjectId } from "mongodb";
import { NextApiHandlerWithContext, withContext } from "../../services/api";

const handler: NextApiHandlerWithContext = async (
  _req,
  _res,
  { me, Wishes, Groups, Users, Comments }
) => {
  me.wishes = await Wishes.find({
    user: me._id,
    createdBy: me._id,
  }).toArray();
  me.groups = await Groups.find({ members: me._id }).toArray();

  for (const group of me.groups) {
    group.members = await Users.find({
      _id: group.members.filter((_id: ObjectId) => !_id.equals(me._id)),
    }).toArray();

    for (const member of group.members) {
      member.wishes = await Wishes.find({
        user: member._id,
        groups: group._id,
      }).toArray();

      for (const wish of member.wishes) {
        wish.comments = await Comments.find({
          wish: wish._id,
          group: group._id,
        }).toArray();
        wish.reserved = !!(await Comments.findOne({
          wish: wish._id,
          reserved: true,
        }));
      }
    }
  }

  return me;
};

export default withContext(handler);
