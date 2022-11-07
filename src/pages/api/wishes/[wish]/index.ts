import Joi from "joi";
import {
  handleEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../services/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Wishes, Comments }
) =>
  handleEntity(req, res, Wishes, "wish", {
    canUpdate: async (wish) => wish.createdBy.equals(me._id),
    updateSchema: Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      url: Joi.string().uri(),
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
