import { cookies } from "next/headers";
import { ReactNode } from "react";
import { DataProvider } from "../../components/data";
import { SetCode } from "../../components/set-code";
import { Data } from "../../config/models";
import { Navigation } from "./navigation";

const getData = async (): Promise<Data> => {
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

const RootLayout = async ({ children }: { children: ReactNode }) => {
  try {
    const data = await getData();

    return (
      <DataProvider data={data}>
        <main>
          <Navigation />
          {children}
        </main>
      </DataProvider>
    );
  } catch (e) {
    console.error(e);
    return <SetCode />;
  }
};

export default RootLayout;
