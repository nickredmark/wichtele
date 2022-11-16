import { cookies } from "next/headers";
import { createContext, useContext } from "react";
import { User } from "../../config/models";

export const DataContext = createContext<{
  me: User;
  users: User[];
  refetch: () => Promise<void>;
} | null>(null);

export const useData = () => useContext(DataContext)!;

export const getData = async (): Promise<{ me: User; users: User[] }> => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  if (!code) {
    throw new Error("No code");
  }
  const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    headers: {
      cookie: `code=${code}`,
    },
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  const data = await res.json();
  return data;
};
