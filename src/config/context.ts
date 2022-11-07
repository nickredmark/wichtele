import { Db } from "mongodb";
import { NextApiRequest } from "next";

export type Context = {
  req: NextApiRequest;
  code: string;
  db: Db;
};
