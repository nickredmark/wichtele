import { MongoClient } from "mongodb";

export const getDb = async () => {
  const client = new MongoClient(process.env.DB_URL!, {
    auth: {
      username: process.env.DB_USERNAME,
      password: process.env.DB_PASSWORD,
    },
  });
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  const Users = db.collection("users");
  const Groups = db.collection("groups");
  const Wishes = db.collection("wishes");
  const Comments = db.collection("comments");

  return { Users, Groups, Wishes, Comments };
};
