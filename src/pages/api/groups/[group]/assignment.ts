import { clone } from "lodash";
import { sendError } from "next/dist/server/api-utils";
import {
  getEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../utils/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Groups, Wishes, Comments }
) => {
  const group = await getEntity(req, res, Groups, "group");

  switch (req.method) {
    case "PUT":
      const assignment: Record<string, string> = {};
      const members: string[] = clone(group.members);
      if (members.length < 2) {
        throw sendError(res, 400, "Group has too little members");
      }
      const [first] = members.splice(0, 1);
      let current = first;
      while (members.length) {
        const [next] = members.splice(
          Math.floor(Math.random() * members.length),
          1
        );
        assignment[current] = next;
        current = next;
      }
      assignment[current] = first;
      await Groups.updateOne(
        { _id: group._id },
        {
          $set: {
            assignment,
          },
        }
      );
      return group._id;
    case "DELETE":
      await Groups.updateOne(
        { _id: group._id },
        {
          $unset: {
            assignment: true,
          },
        }
      );
      return group._id;
    default:
      throw sendError(res, 400, "Unsupported method");
  }
};

export default withContext(handler);
