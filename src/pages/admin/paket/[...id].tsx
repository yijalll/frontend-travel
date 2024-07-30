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
  const [dataProfile, dataPaket] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
    getData(token, `${backendUrl}/paket`),
  ]);
  const paket = dataPaket.data.filter((paket: any) => paket.id === id)[0];
  return {
    props: {
      token,
      id,
      paket,
      profile: dataProfile || null,
    },
  };
}

export default function DetailPaket({
  token,
  id,
  paket,
  profile,
}: {
  token: string;
  id: number;
  paket: any;
  profile: any | null;
}) {
  const router = useRouter();

  const [data, setData] = React.useState({
    isi: paket.isi,
    pengirim_nama: paket.pengirim.nama,
    pengirim_telp: paket.pengirim.telp,
    pengirim_alamat: paket.pengirim.alamat,
    pengirim_provinsi: paket.pengirim.provinsi,
    pengirim_kota_kab: paket.pengirim.kota_kab,
    pengirim_kecamatan: paket.pengirim.kecamatan,
    pengirim_kelurahan: paket.pengirim.kelurahan,
    penerima_nama: paket.penerima.nama,
    penerima_telp: paket.penerima.telp,
    penerima_alamat: paket.penerima.alamat,
    penerima_provinsi: paket.penerima.provinsi,
    penerima_kota_kab: paket.penerima.kota_kab,
    penerima_kecamatan: paket.penerima.kecamatan,
    penerima_kelurahan: paket.penerima.kelurahan,
  });

  async function handlerSubmit(e: any) {
    e.preventDefault();
    try {
      const body = {
        isi: data.isi,
        pengirim: {
          nama: data.pengirim_nama,
          telp: data.pengirim_telp,
          alamat: data.pengirim_alamat,
          provinsi: data.pengirim_provinsi,
          kota_kab: data.pengirim_kota_kab,
          kecamatan: data.pengirim_kecamatan,
          kelurahan: data.pengirim_kelurahan,
        },
        penerima: {
          nama: data.penerima_nama,
          telp: data.penerima_telp,
          alamat: data.penerima_alamat,
          provinsi: data.penerima_provinsi,
          kota_kab: data.penerima_kota_kab,
          kecamatan: data.penerima_kecamatan,
          kelurahan: data.penerima_kelurahan,
        },
      };
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/paket/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        }
      );
      const response = await request.json();
      if (response.message === "success update data") {
        toast.success("Berhasil mengupdate data paket");
        setTimeout(() => {
          router.push("/admin/paket");
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
      <h1 className="font-semibold text-lg">Detail Data Paket</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form onSubmit={handlerSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="id_transaksi"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              ID Paket
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
              htmlFor="isi"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Isi Paket
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="isi"
                id="isi"
                autoComplete="given-name"
                disabled
                value={paket.isi}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <h1 className="font-semibold text-md mt-4 sm:py-3">Pengirim</h1>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="nama_pengirim"
                id="nama_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.telp}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="telp_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nomor Telepone
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="telp_pengirim"
                id="telp_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.telp}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="alamat_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Alamat
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <textarea
                name="alamat_pengirim"
                rows={5}
                cols={20}
                id="alamat_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.alamat}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="provinsi_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Provinsi
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="provinsi_pengirim"
                id="provinsi_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.provinsi}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kotakab_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kota Kabupaten
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kotakab_pengirim"
                id="kotakab_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.kota_kab}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kecamatan_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kecamatan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kecamatan_pengirim"
                id="kecamatan_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.kecamatan}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kelurahan_pengirim"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kelurahan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kelurahan_pengirim"
                id="kelurahan_pengirim"
                autoComplete="given-name"
                disabled
                value={paket.pengirim.kelurahan}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <h1 className="font-semibold text-md mt-4 sm:py-3">Penerima</h1>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="nama_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="nama_penerima"
                id="nama_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.telp}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="telp_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nomor Telepone
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="telp_penerima"
                id="telp_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.telp}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="alamat_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Alamat
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <textarea
                name="alamat_penerima"
                rows={5}
                cols={20}
                id="alamat_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.alamat}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="provinsi_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Provinsi
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="provinsi_penerima"
                id="provinsi_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.provinsi}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kotakab_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kota Kabupaten
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kotakab_penerima"
                id="kotakab_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.kota_kab}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kecamatan_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kecamatan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kecamatan_penerima"
                id="kecamatan_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.kecamatan}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kelurahan_penerima"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Kelurahan
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="text"
                name="kelurahan_penerima"
                id="kelurahan_penerima"
                autoComplete="given-name"
                disabled
                value={paket.penerima.kelurahan}
                className="block w-full bg-gray-100 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
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
                Update
              </button>
            </div>
          </div>
        </form>
      </div>
    </Sidebar>
  );
}
