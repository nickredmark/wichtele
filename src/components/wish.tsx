import { FC, PropsWithChildren } from "react";

export const WishComponent: FC<PropsWithChildren> = ({ children }) => (
  <div className="bg-white border border-rose-300 rounded-lg p-2">
    {children}
  </div>
);
