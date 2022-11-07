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
      name: Joi.string().required(),
      description: Joi.string(),
      url: Joi.string().uri(),
      user: TYPES.objectId.default(ctx.me._id),
    }),
  });

export default withContext(handler);
