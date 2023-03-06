import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import AddCourse from "../../components/menus/AddCourse";
import AddMenu from "../../components/menus/AddMenu";
import type { TNavbar } from "../../components/Navbar";
import Navbar from "../../components/Navbar";

const linkList: TNavbar = [
  { uri: "/", text: "Home" },
  { uri: "/admin", text: "Admin" },
  { uri: "/admin/courseonmenu", text: "manage course" },
];

const MenuList: NextPage = () => {
  return (
    <>
      <Head>
        <title>menulist</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <Navbar linkList={linkList} />
        <div className="container flex flex-col items-center justify-center gap-12 p-2 ">
          <div className="flex flex-col items-center gap-2">
            <AddMenuAndCourse />
            <p className="text-center text-2xl text-white">Menu List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default MenuList;

const AddMenuAndCourse = () => {
  const { data: sessionData, status } = useSession();
  const [displayCourse, setDisplayCourse] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (status == "unauthenticated") {
      void router.push("/admin");
    }
  }, [router, sessionData, status]);

  if (status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }

  return (
    <>
      <div className="md:flex md:justify-center md:gap-2">
        <div className="flex justify-center text-sm md:hidden">
          <button
            className={`rounded-l-md bg-slate-100 p-2 hover:bg-sky-300 ${
              displayCourse ? "bg-slate-200" : "bg-sky-400"
            }`}
            onClick={() => setDisplayCourse((val) => !val)}
          >
            <span className={`${displayCourse ? "invisible" : "visible"}`}>
              Menu
            </span>
          </button>
          <button
            className={`rounded-r-md bg-slate-100 p-2 hover:bg-sky-300 ${
              !displayCourse ? "bg-slate-200" : "bg-sky-400"
            }`}
            onClick={() => setDisplayCourse((val) => !val)}
          >
            <span className={`${displayCourse ? "visible" : "invisible"}`}>
              Course
            </span>
          </button>
        </div>
        <div className={`${!displayCourse ? "" : "hidden"} md:block`}>
          <AddMenu />
        </div>
        <div className={`${displayCourse ? "" : "hidden"} md:block`}>
          <AddCourse />
        </div>
      </div>
    </>
  );
};
