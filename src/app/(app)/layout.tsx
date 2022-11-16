import { ReactNode, useCallback, useState } from "react";
import { SetCode } from "../../components/set-code";
import { DataContext, getData } from "./data";
import { Navigation } from "./navigation";

const RootLayout = async ({ children }: { children: ReactNode }) => {
  try {
    const initialData = await getData();
    const [data, setData] = useState(initialData);
    const refetch = useCallback(async () => {
      const data = await getData();
      setData(data);
    }, []);

    return (
      <DataContext.Provider
        value={{
          ...data,
          refetch,
        }}
      >
        <main>
          <Navigation me={data.me} users={data.users} />
          {children}
        </main>
      </DataContext.Provider>
    );
  } catch (e) {
    console.error(e);
    return <SetCode />;
  }
};

export default RootLayout;
