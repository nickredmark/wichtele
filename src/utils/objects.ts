export const objectKeys = <T extends object>(o: T) =>
  Object.keys(o) as (keyof T)[];
