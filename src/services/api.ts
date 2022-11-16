import { Data } from "../config/models";

export const getData = async (): Promise<Data> => {
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  return data;
};
