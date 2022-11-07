import { cookies } from "next/headers";
import { ReactNode } from "react";
import { User } from "../config/models";
import { CodeForm } from "./code";

export const getData = async (): Promise<User | null> => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  if (!code) {
    return null;
  }

  const res = await fetch(process.env.NEXT_PUBLIC_API_URL!, {
    headers: {
      cookie: `code=${code}`,
    },
  });

  return await res.json();
};

const RootLayout = async ({ children }: { children: ReactNode }) => {
  const me = await getData();

  if (!me) {
    return (
      <html>
        <body>
          <CodeForm />
        </body>
      </html>
    );
  }

  return (
    <html>
      <body>
        <h1>Hallo, {me.name}</h1>
        {children}
      </body>
    </html>
  );
};

export default RootLayout;
