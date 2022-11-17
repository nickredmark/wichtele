import { get } from "lodash";
import chBe from "../../locales/ch-be/common.json";
import en from "../../locales/en/common.json";
import { useData } from "../components/data";

export const LOCALES: Record<string, Record<string, string>> = {
  ["ch-be"]: chBe,
  en,
};

const t = (locale: keyof typeof LOCALES, path: string) =>
  get(LOCALES[locale], path);

export const useI18n = () => {
  const { me } = useData();
  return { t: (path: string) => t(me.language, path) };
};
