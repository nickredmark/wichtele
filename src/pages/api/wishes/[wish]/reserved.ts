import Joi from "joi";
import { sendError } from "next/dist/server/api-utils";
import {
  getEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../utils/api";

const handler: NextApiHandlerWithContext = async (
  req,
  res,
  { me, Wishes, Comments }
) => {
  const entity = await getEntity(req, res, Wishes, "wish");

  switch (req.method) {
    case "PUT":
      if (entity.reservedBy && !entity.reservedBy.equals(me._id)) {
        throw sendError(res, 400, "Wish already reserved");
      }
      const reserved = Joi.attempt(req.body, Joi.boolean().required());
      await Wishes.updateOne(
        { _id: entity._id },
        reserved
          ? {
              $set: {
                reservedBy: me._id,
              },
            }
          : {
              $unset: {
                reservedBy: true,
              },
            }
      );

    default:
      throw sendError(res, 400, "Unsupported method");
  }
};

export default withContext(handler);
