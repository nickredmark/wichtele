import Joi from "joi";
import {
  handleEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../services/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Groups, Wishes, Comments }
) =>
  handleEntity(req, res, Groups, "group", {
    canUpdate: (group) => group.createdBy.equals(me._id),
    updateSchema: Joi.object({
      name: Joi.string(),
    }),
    canDelete: async (group) => {
      if (!group.createdBy.equals(me._id)) {
        return false;
      }

      if (await Wishes.countDocuments({ groups: group._id })) {
        return false;
      }

      if (await Comments.countDocuments({ group: group._id })) {
        return false;
      }

      return true;
    },
    cascade: async (group) => {
      await Wishes.updateMany(
        { groups: group._id },
        { $pull: { groups: group._id } }
      );
      await Comments.deleteMany({ group: group._id });
    },
  });

export default withContext(handler);
