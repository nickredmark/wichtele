import { FC, useMemo } from "react";

export const Elf: FC = () => {
  const number = useMemo(() => Math.floor(Math.random() * 3), []);

  return (
    <div className="h-full w-full flex flex-col justify-center items-center">
      <img src={`/pics/${number}.png`} className="h-1/2" />
    </div>
  );
};
