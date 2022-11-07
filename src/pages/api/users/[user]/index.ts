import Joi from "joi";
import {
  canManage,
  handleEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../services/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Users, Groups, Wishes, Comments }
) =>
  handleEntity(req, res, Users, "user", {
    canUpdate: async (user) => {
      if (user._id.equals(me._id)) {
        return true;
      }

      if (!user.createdBy.equals(me._id)) {
        return false;
      }

      if (user.loggedIn) {
        return false;
      }

      return true;
    },
    updateSchema: Joi.object({
      name: Joi.string(),
    }),
    canDelete: async (user) => {
      if (user._id.equals(me._id)) {
        return true;
      }

      if (!canManage(me, user)) {
        return false;
      }

      const wishes = await Wishes.find({ user: user._id })
        .project({ _id: true })
        .toArray();

      if (
        await Comments.countDocuments({
          wish: { $in: wishes.map(({ _id }) => _id) },
        })
      ) {
        return false;
      }

      return true;
    },
    cascade: async (user) => {
      await Wishes.deleteMany({ userId: user._id });
      await Groups.updateMany(
        { members: user._id },
        { $pull: { members: user._id } }
      );
      await Comments.deleteMany({ createdBy: user._id });
    },
  });

export default withContext(handler);
