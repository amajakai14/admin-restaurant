import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect } from "react";
import CourseMatchMenuTable from "../../components/courseonmenu/CourseMatchMenu";
import type { TNavbar } from "../../components/Navbar";
import Navbar from "../../components/Navbar";
import { api } from "../../utils/api";

const linkList: TNavbar = [
  { uri: "/", text: "Home" },
  { uri: "/admin", text: "Admin" },
  { uri: "/admin/menulist", text: "Add Menu and Course" },
];

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Courses and Menus Relation</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <Navbar linkList={linkList} />
        <h1 className="p-2 text-center">Add/ Remove Menus from a course</h1>
        <div className="flex flex-col items-center justify-center p-2">
          <div className="flex flex-col items-center gap-2">
            <CourseOnMenuRelation />
            <p className="text-center text-2xl text-white">Menu List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;

const CourseOnMenuRelation = () => {
  const { data: sessionData, status } = useSession();
  const fetchData = api.course.getMenuMapping.useQuery();
  console.log(fetchData.data);
  const router = useRouter();
  useEffect(() => {
    if (status == "unauthenticated") {
      void router.push("/");
    }
  }, [router, sessionData, status]);
  if (status === "loading" || fetchData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }

  if (fetchData.status === "success") {
    return <CourseMatchMenuTable data={fetchData.data.result} />;
  }
  return <div>sth is unusual</div>;
};
