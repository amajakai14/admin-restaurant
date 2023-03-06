import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import type { TNavbar } from "../../components/Navbar";
import Navbar from "../../components/Navbar";

const linkList: TNavbar = [
  { uri: "/", text: "Home" },
  { uri: "admin/menulist", text: "Add Course/Menu" },
  { uri: "admin/courseonmenu", text: "manage course" },
  { uri: "admin/staff", text: "manage staff" },
  { uri: "admin/table", text: "manage table" },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Admin</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <CheckAdminSession />
        <Navbar linkList={linkList} />
        <div className="container flex flex-col items-center justify-center gap-12 p-2 "></div>
      </main>
    </>
  );
};

export default Home;

const CheckAdminSession = () => {
  const { data: sessionData, status } = useSession();
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      void router.push("/");
    }
  }, [sessionData, status, router]);
  if (status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }

  if (sessionData?.user?.role !== "ADMIN") {
    void router.push("/");
  }
  return <></>;
};
