"use client";

import {
  createContext,
  FC,
  PropsWithChildren,
  useCallback,
  useContext,
  useState
} from "react";
import { Data, User } from "../config/models";
import { getData } from "../services/api";

const DataContext = createContext<{
  me: User;
  users: User[];
  refetch: () => Promise<void>;
} | null>(null);

export const useData = () => useContext(DataContext)!;

export const DataProvider: FC<PropsWithChildren<{ data: Data }>> = ({
  data: initialData,
  children,
}) => {
  const [data, setData] = useState(initialData);

  const refetch = useCallback(async () => {
    const data = await getData();
    setData(data);
  }, []);

  return (
    <DataContext.Provider value={{ ...data, refetch }}>
      {children}
    </DataContext.Provider>
  );
};
