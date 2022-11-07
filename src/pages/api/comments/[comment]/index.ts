import {
  handleEntity,
  NextApiHandlerWithContext,
  withContext,
} from "../../../../services/api";

const handler: NextApiHandlerWithContext = (req, res, { me, Comments }) =>
  handleEntity(req, res, Comments, "comment", {
    canUpdate: () => false,
    canDelete: (comment) => comment.createdBy.equals(me._id),
  });

export default withContext(handler);
