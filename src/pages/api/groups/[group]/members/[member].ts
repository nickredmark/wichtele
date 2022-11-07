import { sendError } from "next/dist/server/api-utils";
import {
  canManage,
  getEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../../services/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Users, Groups }
) => {
  const group = await getEntity(req, res, Groups, "group");
  const user = await getEntity(req, res, Users, "member");
  if (!(me._id.equals(user._id) || canManage(me, user))) {
    return sendError(res, 400, "You cannot manage this user.");
  }
  if (!group.createdBy.equals(me._id)) {
    return sendError(res, 400, "You cannot manage this group.");
  }
  switch (req.method) {
    case "PUT":
      await Groups.updateOne(
        { _id: group._id },
        {
          $addToSet: {
            members: user._id,
          },
        }
      );
      return group._id;
    case "DELETE":
      await Groups.updateOne(
        { _id: group._id },
        {
          $pull: {
            members: user._id,
          },
        }
      );
      return user._id;
    default:
      return sendError(res, 400, "Unsupported method");
  }
};

export default withContext(handler);
