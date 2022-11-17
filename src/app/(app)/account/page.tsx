"use client";

import Link from "next/link";
import { FaArrowLeft } from "react-icons/fa";
import { Column } from "../../../components/column";
import { useData } from "../../../components/data";
import { EditProfile } from "./edit-profile";

const Profile = () => {
  const { me } = useData();

  return (
    <Column paper={false}>
      <h2 className="nav-header flex items-stretch space-x-1">
        <Link href="/" className="p-1 sm:hidden">
          <FaArrowLeft />
        </Link>
        <span>Account</span>
      </h2>
      <EditProfile me={me} />
      <div className="p-2 flex flex-col space-y-1">
        <Link href="/logout" className="link">
          Log out
        </Link>
      </div>
    </Column>
  );
};

export default Profile;
