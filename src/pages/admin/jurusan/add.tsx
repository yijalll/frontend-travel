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
  const [dataProfile, dataMobil, dataKota] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
    getData(token, `${backendUrl}/mobil`),
    getData(token, `${backendUrl}/kota`),
  ]);
  console.log({ dataKota: dataKota.data });
  return {
    props: {
      token,
      dataServer: {
        mobil: dataMobil.data || [],
        kota: dataKota.data || [],
      },
      profile: dataProfile || null,
    },
  };
}

export default function TambahJurusan({
  token,
  dataServer,
  profile,
}: {
  token: string;
  dataServer: any;
  profile: any | null;
}) {
  const router = useRouter();
  const [data, setData] = React.useState({
    kota_id: dataServer.kota.length > 0 ? dataServer.kota[0].id : null,
    mobil_id: dataServer.mobil.length > 0 ? dataServer.mobil[0].id : null,
    tanggal: "",
    jam: "",
    harga: 0,
  });

  async function handlerSubmit(e: any) {
    e.preventDefault();
    try {
      let formattedDate = null;
      if (data.tanggal) {
        const originalDate = new Date(data.tanggal);
        const day = String(originalDate.getDate()).padStart(2, "0");
        const month = String(originalDate.getMonth() + 1).padStart(2, "0");
        const year = originalDate.getFullYear();
        formattedDate = `${day}-${month}-${year}`;
      }
      const nama = dataServer.kota.filter((kota: any) => kota.id === Number(data.kota_id))[0].nama_kota;
      const body = JSON.stringify({
        ...data,
        tanggal: formattedDate,
        harga: Number(data.harga),
        nama: `Jambi - ${nama}`,
      });
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/jurusan`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body,
        }
      );
      const response = await request.json();
      console.log({ response });
      if (response.message === "success post data") {
        toast.success("Berhasil menambah data jurusan");
        setTimeout(() => {
          router.push("/admin/jurusan");
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
      <h1 className="font-semibold text-lg">Tambah Data Jurusan</h1>
      <div className="mt-10 space-y-8 pb-12 sm:space-y-0 sm:divide-gray-900/10 sm:pb-0">
        <form onSubmit={handlerSubmit}>
          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="kota_id"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama Kota
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                title="kota_id"
                id="kota_id"
                name="kota_id"
                autoComplete="country-name"
                onChange={handleChange}
                value={data.kota_id}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {dataServer.kota.length > 0 ? (
                  dataServer.kota.map((kota: any) => {
                    return (
                      <option key={kota.id} value={kota.id}>
                        {kota.nama_kota}
                      </option>
                    );
                  })
                ) : (
                  <option>Tidak ada data kota</option>
                )}
              </select>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="mobil_id"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Nama Mobil
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <select
                title="mobil_id"
                id="mobil_id"
                name="mobil_id"
                autoComplete="country-name"
                onChange={handleChange}
                value={data.mobil_id}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              >
                {dataServer.mobil.length > 0 ? (
                  dataServer.mobil.map((mobil: any) => {
                    return (
                      <option key={mobil.id} value={mobil.id}>
                        {mobil.nama_mobil}
                      </option>
                    );
                  })
                ) : (
                  <option>Tidak ada data mobil</option>
                )}
              </select>
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="tanggal"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Tanggal
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="date"
                id="tanggal"
                name="tanggal"
                onChange={handleChange}
                value={data.tanggal}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="jam"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Jam
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="time"
                id="jam"
                name="jam"
                onChange={handleChange}
                value={data.jam}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <label
              htmlFor="harga"
              className="block text-md font-normal leading-6 text-gray-900 sm:pt-1.5"
            >
              Harga
            </label>
            <div className="mt-2 sm:col-span-2 sm:mt-0">
              <input
                type="number"
                name="harga"
                id="harga"
                value={data.harga}
                autoComplete="family-name"
                onChange={handleChange}
                required
                className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6"
              />
            </div>
          </div>

          <div className="sm:grid sm:grid-cols-3 sm:items-start sm:gap-4 sm:py-3">
            <div className="block text-sm font-normal leading-6 text-gray-900 sm:pt-1.5"></div>
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
