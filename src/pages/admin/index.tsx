import React from "react";
import Sidebar from "@/components/Sidebar";
import { guard } from "@/libs/middleware";
import { GetServerSidePropsContext } from "next";
import { Guard } from "@/libs/middleware";
import { RadioGroup, Radio } from "@headlessui/react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";
import { getData } from "@/libs/getdata";

interface Stats {
  name: string;
  value: number;
  unit?: string;
}

export async function getServerSideProps(context: GetServerSidePropsContext) {
  const [isLogin, token]: Guard = guard(context);
  if (!isLogin)
    return {
      redirect: {
        destination: "/login",
      },
    };
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [
    dataProfile,
    dataMobil,
    dataKota,
    dataJurusan,
    dataTransaksi,
    dataPaket,
    dataUser,
  ] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
    getData(token, `${backendUrl}/mobil`),
    getData(token, `${backendUrl}/kota`),
    getData(token, `${backendUrl}/jurusan`),
    getData(token, `${backendUrl}/transaksi/admin`),
    getData(token, `${backendUrl}/paket`),
    getData(token, `${backendUrl}/user`),
  ]);
  const stats: Stats[] = [
    { name: "Mobil", value: dataMobil?.data?.length || 0 },
    { name: "Kota", value: dataKota?.data?.length || 0, unit: "kota" },
    { name: "Jurusan", value: dataJurusan?.data?.length || 0, unit: "tujuan" },
    { name: "Transaksi", value: dataTransaksi?.data?.length || 0 },
    { name: "Paket", value: dataPaket?.data?.length || 0, unit: "paket" },
    { name: "User", value: dataUser.length || 0, unit: "account" },
  ];
  return { props: { stats, profile: dataProfile || null } };
}

export default function Index({
  stats,
  profile,
}: {
  stats: Stats[];
  profile: any | null;
}) {
  return (
    <Sidebar profile={profile}>
      <div className="w-full grid gap-4 sm:grid-cols-2 lg:grid-cols-4 2xl:grid-cols-5">
        {stats.map((stat: Stats, index: number) => (
          <div
            key={index}
            className="group relative flex cursor-pointer rounded-lg border border-gray-200 bg-white p-4 shadow-sm focus:outline-none data-[checked]:border-transparent data-[focus]:ring-2 data-[focus]:ring-indigo-500"
          >
            <div className="w-full flex flex-col gap-2">
              <p className="block text-lg font-normal text-gray-900 my-auto">
                {stat.name}
              </p>
              <p className="font-medium text-5xl text-right w-full text-gray-900">
                {stat.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </Sidebar>
  );
}
