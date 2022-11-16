import Joi from "joi";
import { ObjectId } from "mongodb";
import { sendError } from "next/dist/server/api-utils";
import {
  createEntity,
  NextApiHandlerWithContext,
  TYPES,
  withContext,
} from "../../../utils/api";

const handler: NextApiHandlerWithContext = async (req, res, ctx) =>
  createEntity(req, res, ctx, ctx.Comments, {
    schema: Joi.object({
      content: Joi.string().required(),
      wish: TYPES.objectId.required(),
      group: TYPES.objectId.required(),
      reserved: Joi.bool(),
    }),
    canCreate: async (comment) => {
      const group = await ctx.Groups.findOne({ _id: comment.group });
      if (!group) {
        throw sendError(res, 404, "Group not found.");
      }
      if (!group.members.some((_id: ObjectId) => _id.equals(ctx.me._id))) {
        throw sendError(res, 404, "You are not a member of this group.");
      }

      return true;
    },
  });

export default withContext(handler);
