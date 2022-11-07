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

  return db;
};
