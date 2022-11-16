"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

const LogoutPage = () => {
  const router = useRouter();

  useEffect(() => {
    document.cookie = `code=; Max-Age=0`;
    router.push("/");
  }, []);

  return null;
};

export default LogoutPage;
