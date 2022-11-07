import Joi from "joi";
import {
  createEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../services/api";

const handler: NextApiHandlerWithContext = async (req, res, ctx) =>
  createEntity(req, res, ctx, ctx.Users, {
    schema: Joi.object({
      name: Joi.string().required(),
    }),
  });

export default withContext(handler);
