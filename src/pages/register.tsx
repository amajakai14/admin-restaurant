import type { NextPage } from "next";
import Head from "next/head";
import Layout from "../components/Layout";
import RegisterForm from "../components/RegisterForm";

const Register: NextPage = () => {
  return (
    <>
      <Head>
        <title>Register page</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <RegisterForm />
      </Layout>
    </>
  );
};

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const session = await getServerAuthSession({
//     req: context.req,
//     res: context.res,
//   });

//   if (session) {
//     return {
//       redirect: {
//         destination: "/",
//         permanent: false,
//       },
//     };
//   }

//   return { props: {} };
// };

export default Register;
