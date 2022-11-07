import { objectKeys } from "../utils/objects";

export const CONSTANTS = {
  GROUPS_ID: process.env.GROUPS_ID!,
  PEOPLE_ID: process.env.PEOPLE_ID!,
  WISHES_ID: process.env.WISHES_ID!,
  COMMENTS_ID: process.env.COMMENTS_ID!,
};

const undefinedConstants = objectKeys(CONSTANTS).filter(
  (key) => CONSTANTS[key] === undefined
);

if (undefinedConstants.length) {
  throw new Error(
    `The following environment variables are not defined: ${undefinedConstants}`
  );
}
