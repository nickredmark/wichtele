import { randomBytes } from "crypto";
import Joi from "joi";
import {
  createEntity,
  NextApiHandlerWithContext,
  TYPES,
  withContext,
} from "../../../utils/api";

const handler: NextApiHandlerWithContext = async (req, res, ctx) =>
  createEntity(req, res, ctx, ctx.Users, {
    schema: Joi.object({
      name: Joi.string().required(),
      language: TYPES.language.required(),
    }),
    data: {
      code: randomBytes(20).toString("hex"),
    },
  });

export default withContext(handler);
