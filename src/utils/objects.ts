export const objectKeys = <T extends object>(o: T) =>
  Object.keys(o) as (keyof T)[];

export const serialize = <T>(o: T): T => JSON.parse(JSON.stringify(o));
