import { FC, PropsWithChildren } from "react";

export const WishesComponent: FC<PropsWithChildren> = ({ children }) => (
  <div className="flex flex-1 flex-col overflow-y-auto justify-start p-2 space-y-2 space-y">
    {children}
  </div>
);
