import { type NextPage } from "next";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import type { TNavbar } from "../../components/Navbar";
import Navbar from "../../components/Navbar";
import StaffList from "../../components/staff/StaffList";
import StaffRegisterForm from "../../components/staff/StaffRegisterform";
import { api } from "../../utils/api";

export type TStaff = {
  id: string;
  name: string | null;
  email: string | null;
};

const linkList: TNavbar = [
  { uri: "/", text: "Home" },
  { uri: "/admin", text: "Admin" },
  { uri: "/admin/courseonmenu", text: "manage course" },
];
const Index: NextPage = () => {
  return (
    <>
      <Head>
        <title>Staff</title>
        <meta name="description" content="Restaurant Management" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="min-h-screen bg-slate-50">
        <Navbar linkList={linkList} />
        <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
          <div className="flex flex-col items-center gap-2">
            <Staff />
            <p className="text-center text-2xl text-white">Menu List</p>
          </div>
        </div>
      </main>
    </>
  );
};

export default Index;

const Staff = () => {
  const { data: sessionData, status } = useSession();
  const [refetchStaff, setRefetchStaff] = useState(false);
  const router = useRouter();
  const fetchData = api.user.getStaff.useQuery();
  useEffect(() => {
    if (status == "unauthenticated") {
      router.push("/admin");
    }
    fetchData.refetch();
  }, [sessionData, status, refetchStaff, router, fetchData]);
  if (status === "loading" || fetchData.status === "loading") {
    return <p className="text-2xl text-white">Loading...</p>;
  }
  let staffList: TStaff[] | undefined;
  if (fetchData.status === "error") {
    staffList = undefined;
  }
  staffList = fetchData.data?.result;
  return (
    <>
      <StaffRegisterForm
        refetchStaff={refetchStaff}
        setRefetchStaff={setRefetchStaff}
      />
      <StaffList staffList={staffList} />
    </>
  );
};
