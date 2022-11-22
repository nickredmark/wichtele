import { omit } from "lodash";
import { ObjectId } from "mongodb";
import { sendError } from "next/dist/server/api-utils";
import {
  getEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../../utils/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Users, Groups }
) => {
  const group = await getEntity(req, res, Groups, "group");
  const user = await getEntity(req, res, Users, "member");
  if (!group.createdBy.equals(me._id)) {
    throw sendError(res, 400, "You cannot manage this group.");
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
      const update: any = {
        $pull: {
          members: user._id,
        },
      };

      if (group.assignment) {
        const assignment = {
          ...omit(group.assignment, user._id.toString()),
          [Object.entries(group.assignment).find(([, id]) =>
            user._id.equals(id as ObjectId)
          )![0]]: group.assignment[user._id.toString()],
        };
        console.log(assignment);
        update["$set"] = {
          assignment,
        };
      }
      await Groups.updateOne({ _id: group._id }, update);
      return user._id;
    default:
      return sendError(res, 400, "Unsupported method");
  }
};

export default withContext(handler);
