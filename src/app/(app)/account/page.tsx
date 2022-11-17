"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Column } from "../../../components/column";
import { useData } from "../../../components/data";
import { useI18n } from "../../../utils/i18n";
import { EditProfile } from "./edit-profile";

const Profile = () => {
  const { me } = useData();
  const { t } = useI18n();

  return (
    <Column paper={false}>
      <h2 className="nav-header flex items-stretch space-x-1">
        <Link href="/" className="p-1 sm:hidden">
          <FaArrowLeft />
        </Link>
        <span>{t("account")}</span>
      </h2>
      <EditProfile me={me} />
      <div className="p-2 flex flex-col space-y-1">
        <Link href="/logout" className="link">
          {t("log-out")}
        </Link>
      </div>
    </Column>
  );
};

export default Profile;
