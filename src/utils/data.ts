import { cookies } from "next/headers";
import { User } from "../config/models";
import { getDb } from "../services/db";
import { serialize } from "./objects";

export const getMe = async () => {
  const { Users } = await getDb();
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  const me = serialize(await Users.findOne<User>({ code }))!;
  return me;
};
