import Joi from "joi";
import {
  createEntity,
  NextApiHandlerWithContext,
  TYPES,
  withContext,
} from "../../../utils/api";

const handler: NextApiHandlerWithContext = async (req, res, ctx) =>
  createEntity(req, res, ctx, ctx.Wishes, {
    schema: Joi.object({
      content: Joi.string().required(),
      user: TYPES.objectId.default(ctx.me._id),
      groups: Joi.array().required().items(TYPES.objectId),
    }),
  });

export default withContext(handler);
