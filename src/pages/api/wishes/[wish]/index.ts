import Joi from "joi";
import {
  handleEntity,
  NextApiHandlerWithContext,
  TYPES,
  withContext,
} from "../../../../utils/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Wishes, Comments }
) =>
  handleEntity(req, res, Wishes, "wish", {
    canUpdate: async (wish) => wish.createdBy.equals(me._id),
    updateSchema: Joi.object({
      content: Joi.string(),
      groups: Joi.array().items(TYPES.objectId),
    }),
    canDelete: async (wish) => {
      if (!wish.createdBy.equals(me._id)) {
        return false;
      }

      if (await Comments.countDocuments({ wish: wish._id })) {
        return false;
      }

      return true;
    },
    cascade: async (wish) => {
      await Comments.deleteMany({ wish: wish._id });
    },
  });

export default withContext(handler);
