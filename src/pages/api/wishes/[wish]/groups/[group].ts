import { ObjectId } from "mongodb";
import { sendError } from "next/dist/server/api-utils";
import {
  getEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../../services/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Groups, Wishes }
) => {
  const wish = await getEntity(req, res, Wishes, "wish");
  const group = await getEntity(req, res, Groups, "group");
  if (!wish.createdBy.equals(me._id)) {
    return sendError(res, 400, "You cannot manage this wish.");
  }
  if (!group.users.some((_id: ObjectId) => _id.equals(me._id))) {
    return sendError(res, 400, "You don't belong to this group.");
  }
  switch (req.method) {
    case "PUT":
      await Wishes.updateOne(
        { _id: wish._id },
        {
          $addToSet: {
            groups: group._id,
          },
        }
      );
      return group._id;
    case "DELETE":
      await Wishes.updateOne(
        { _id: wish._id },
        {
          $pull: {
            groups: group._id,
          },
        }
      );
      return group._id;
    default:
      return sendError(res, 400, "Unsupported method");
  }
};

export default withContext(handler);
