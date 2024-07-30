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
  const id: number = parseInt(context.params?.id as string);
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;
  const [dataProfile, dataTransaksi] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
    getData(token, `${backendUrl}/transaksi/admin`),
  ]);
  const transaksi = dataTransaksi.data.filter(
    (transaksi: any) => transaksi.id === id
  )[0];
  return {
    props: {
      token,
      id,
      transaksi,
      profile: dataProfile || null,
    },
  };
}

export default function DetailTransksi({
  token,
  id,
  transaksi,
  profile,
}: {
  token: string;
  id: number;
  transaksi: any;
  profile: any | null;
}) {
  const router = useRouter();

  const [data, setData] = React.useState({
    jurusan_id: transaksi.jurusan.id,
    user_id: transaksi.user.user_id,
    nama: transaksi.user.nama,
    telp: transaksi.user.telp,
    jk: transaksi.user.jk,
    alamat: transaksi.user.alamat,
    kontak_darurat: transaksi.user.kontak_darurat,
    ispaid: transaksi.ispaid || "",
  });

  async function handlerSubmit(e: any) {
    e.preventDefault();
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaksi/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(data),
        }
      );
      const response = await request.json();
      if (response.message === "Success update data") {
        toast.success("Berhasil mengupdate data kota");
        setTimeout(() => {
          router.push("/admin/transaksi");
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
      <h1 className="font-semibold text-lg">Detail Data Transaksi</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form onSubmit={handlerSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="id_transaksi"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              ID Transaksi
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="id_transaksi"
                id="id_transaksi"
                autoComplete="given-name"
                value={id}
                disabled
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="tanggal_pemesanan"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Tanggal Pemesanan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="tanggal_pemesanan"
                id="tanggal_pemesanan"
                autoComplete="given-name"
                value={new Date(transaksi.createdAt)
                  .toISOString()
                  .slice(0, 19)
                  .replace("T", " ")}
                disabled
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="jurusan_id"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Jurusan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="jurusan_id"
                id="jurusan_id"
                autoComplete="given-name"
                value={transaksi.jurusan.nama}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama Penumpang
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="nama"
                id="nama"
                autoComplete="given-name"
                onChange={handleChange}
                value={data.nama}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="telp"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nomor Telepone
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="telp"
                id="telp"
                autoComplete="given-name"
                value={data.telp}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kontak_darurat"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kontak Darurat
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kontak_darurat"
                id="kontak_darurat"
                autoComplete="given-name"
                value={data.kontak_darurat}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="jk"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Jenis Kelamin
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="jk"
                id="jk"
                autoComplete="given-name"
                value={data.jk}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="bukti_pembayaran"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Bukti Pembayaran
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="bukti_pembayaran"
                id="bukti_pembayaran"
                autoComplete="given-name"
                value={transaksi.bukti_bayar}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="ispaid"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Status Pembayaran
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                name="ispaid"
                id="ispaid"
                onChange={handleChange}
                value={data.ispaid ? "1" : "0"}
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                <option disabled>Pilih Status</option>
                <option value="0">Belum Dikonfirmasi</option>
                <option value="1">Sudah Dibayar</option>
              </select>
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <div className="block text-sm font-medium leading-6 text-gray-900 sm:pt-1.5"></div>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <button
                type="submit"
                className="rounded bg-indigo-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
