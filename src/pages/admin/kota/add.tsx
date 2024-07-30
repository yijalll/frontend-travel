import React from "react";
import Sidebar from "@/components/Sidebar";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import { guard, Guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { getData } from "@/libs/getdata";

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin)
    return {
      redirect: {
        destination: "/login",
      },
    };
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataProfile] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
  ]);
  return {
    props: {
      token,
      profile: dataProfile || null,
    },
  };
}

export default function TambahKota({
  token,
  profile,
}: {
  token: string;
  profile: any | null;
}) {
  const router = useRouter();

  const [data, setData] = React.useState({
    nama_kota: "",
  });

  async function handlerSubmit(e: any) {
    e.preventDefault();
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/kota`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const response = await request.json();
      if (response.message === "success post data") {
        toast.success("Berhasil menambah data kota");
        setTimeout(() => {
          router.push("/admin/kota");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <Sidebar profile={profile}>
      <h1 className="font-semibold text-lg">Tambah Data Kota</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form onSubmit={handlerSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_kota"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama Kota
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="nama_kota"
                id="nama_kota"
                autoComplete="given-name"
                onChange={handleChange}
                value={data.nama_kota}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <div className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"></div>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <button
                type="submit"
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Simpan
              </button>
            </div>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
