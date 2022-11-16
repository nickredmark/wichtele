import { cookies } from "next/headers";
import { FaArrowLeft } from "react-icons/fa";
import { Column } from "../../../components/column";
import { User } from "../../../config/models";
import { getDb } from "../../../services/db";
import { serialize } from "../../../utils/objects";
import { EditProfile } from "./edit-profile";

export const getData = async () => {
  const nextCookies = cookies();
  const code = nextCookies.get("code")?.value;
  const { Users } = await getDb();
  const me = serialize(await Users.findOne<User>({ code }))!;

  return me;
};

const Profile = async () => {
  const me = await getData();

  return (
    <Column paper={false}>
      <h2 className="nav-header flex items-stretch space-x-1">
        <a href="/" className="p-1 sm:hidden">
          <FaArrowLeft />
        </a>
        <span>Account</span>
      </h2>
      <EditProfile me={me} />
      <div className="p-2 flex flex-col space-y-1">
        <a href="/logout" className="link">
          Log out
        </a>
      </div>
    </Column>
  );
};

export default Profile;
