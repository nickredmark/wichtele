import Joi from "joi";
import { Collection, Document, ObjectId, WithId } from "mongodb";
import { NextApiRequest, NextApiResponse } from "next";
import { sendError } from "next/dist/server/api-utils";
import { getDb } from "../services/db";

type Context = {
  Users: Collection;
  Groups: Collection;
  Wishes: Collection;
  Comments: Collection;
  me: WithId<Document>;
  now: Date;
};

export type NextApiHandlerWithContext = (
  req: NextApiRequest,
  res: NextApiResponse,
  ctx: Context
) => unknown | Promise<unknown>;

export const withContext =
  (handler: NextApiHandlerWithContext) =>
  async (req: NextApiRequest, res: NextApiResponse) => {
    try {
      const code = req.cookies["code"];

      if (!code) {
        return sendError(res, 400, "No code cookie provided.");
      }

      const { Users, Groups, Wishes, Comments } = await getDb();

      const me = await (async () => {
        const me = await Users.findOne({ code });
        if (me) {
          return me;
        }

        if (code === process.env.ADMIN_CODE) {
          await Users.insertOne({
            name: "Admin",
            code,
          });
          return await Users.findOne({ code });
        }
      })();

      if (!me) {
        return sendError(res, 404, "No user found with this code.");
      }

      if (!me.loggedIn) {
        await Users.updateOne({ _id: me._id }, { $set: { loggedIn: true } });
      }

      const now = new Date();

      const ctx = {
        Users,
        Groups,
        Wishes,
        Comments,
        me,
        now,
      };

      return res.json(await handler(req, res, ctx));
    } catch (e) {
      if (!e) {
        return;
      }
      console.error(e);
      sendError(res, 500, "Unknown error");
    }
  };

export const TYPES = {
  objectId: Joi.string()
    .hex()
    .length(24)
    .custom((id) => new ObjectId(id)) as unknown as Joi.AnySchema<ObjectId>,
};

export const getEntity = async (
  req: NextApiRequest,
  res: NextApiResponse,
  collection: Collection,
  param: string
) => {
  const id = Joi.attempt(req.query[param], TYPES.objectId.required());
  const entity = await collection.findOne(id);
  if (!entity) {
    throw sendError(res, 404, "Entity not found");
  }
  return entity;
};

export const handleEntity = async (
  req: NextApiRequest,
  res: NextApiResponse,
  collection: Collection,
  param: string,
  {
    canUpdate,
    updateSchema,
    canDelete,
    cascade,
  }: {
    canUpdate: (entity: any) => boolean | Promise<boolean>;
    updateSchema?: Joi.Schema;
    canDelete: (entity: any) => boolean | Promise<boolean>;
    cascade?: (entity: any) => void | Promise<void>;
  }
) => {
  const entity = await getEntity(req, res, collection, param);

  switch (req.method) {
    case "PUT":
      if (!updateSchema) {
        throw new Error("Should not happen.");
      }
      if (!(await canUpdate(entity))) {
        throw sendError(res, 400, "You cannot update this entity.");
      }
      await collection.updateOne(
        { _id: entity._id },
        {
          $set: Joi.attempt(req.body, updateSchema),
        }
      );
      return entity._id;
    case "DELETE":
      if (!(await canDelete(entity))) {
        throw sendError(res, 400, "You cannot delete this entity.");
      }
      await cascade?.(entity);
      await collection.deleteOne({ _id: entity._id });
      return entity._id;
    default:
      throw sendError(res, 400, "Unsupported method");
  }
};

export const canManage = (me: any, user: any) =>
  user._id.equals(me._id) || (user.createdBy.equals(me._id) && !user.loggedIn);

export const createEntity = async (
  req: NextApiRequest,
  res: NextApiResponse,
  { me, now }: Context,
  collection: Collection,
  {
    schema,
    data,
    canCreate,
  }: {
    schema: Joi.Schema;
    data?: any;
    canCreate?: (entity: any) => boolean | Promise<boolean>;
  }
) => {
  const entity = {
    ...Joi.attempt(req.body, schema),
    ...data,
    createdBy: me._id,
    createdAt: now,
  };
  if (canCreate && !(await canCreate(entity))) {
    return sendError(res, 400, "You cannot create this entity.");
  }
  const { insertedId } = await collection.insertOne(entity);

  return insertedId;
};
