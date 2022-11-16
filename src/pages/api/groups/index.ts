import Joi from "joi";
import {
  createEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../utils/api";

const handler: NextApiHandlerWithContext = async (req, res, ctx) =>
  createEntity(req, res, ctx, ctx.Groups, {
    schema: Joi.object({ name: Joi.string().required() }),
    data: { members: [ctx.me._id] },
  });

export default withContext(handler);
