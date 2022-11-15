import Joi from "joi";
import {
  createEntity,
  NextApiHandlerWithContext,
  TYPES,
  withContext,
} from "../../../services/api";

const handler: NextApiHandlerWithContext = async (req, res, ctx) =>
  createEntity(req, res, ctx, ctx.Wishes, {
    schema: Joi.object({
      content: Joi.string().required(),
      user: TYPES.objectId.default(ctx.me._id),
      groups: Joi.array().required().items(TYPES.objectId).min(1),
    }),
  });

export default withContext(handler);
