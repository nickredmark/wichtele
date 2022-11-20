import { MongoClient } from "mongodb";

const client: MongoClient = new MongoClient(process.env.DB_URL!, {
  auth: {
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
  },
});

export const getDb = async () => {
  await client.connect();
  const db = client.db(process.env.DB_NAME);
  const Users = db.collection("users");
  const Groups = db.collection("groups");
  const Wishes = db.collection("wishes");
  const Comments = db.collection("comments");

  await Users.updateMany({}, { $set: { language: "ch-be" } });

  return { client, Users, Groups, Wishes, Comments };
};
