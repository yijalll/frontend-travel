import React from "react";
import Sidebar from "@/components/Sidebar";
import Table from "@/components/Table";
import Link from "next/link";
import { toast } from "react-hot-toast";
import { useRouter } from "next/router";
import {
  Dialog,
  DialogBackdrop,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { ExclamationTriangleIcon } from "@heroicons/react/24/outline";
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
  const [dataProfile, dataMobil] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
    getData(token, `${backendUrl}/mobil`),
  ]);
  return {
    props: {
      token,
      data: dataMobil.data || null,
      profile: dataProfile || null,
    },
  };
}

export default function Index({
  token,
  data,
  profile,
}: {
  token: string;
  data: any[] | null;
  profile: any[] | null;
}) {
  const router = useRouter();

  const [open, setOpen] = React.useState(false);
  const [idMobil, setIdMobil] = React.useState(null);

  async function handlerDelete(e: any) {
    e.preventDefault();
    setOpen(false);
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/mobil/${idMobil}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      const response = await request.json();
      if (response.message === "success delete data") {
        toast.success("Berhasil menghapus data mobil");
        setTimeout(() => {
          router.push("/admin/mobil");
        }, 1000);
      } else {
        toast.error(response.message);
      }
    } catch (error: any) {
      console.error("Error:", error);
    }
  }

  function handlerDeleteModal(e: any, id: any) {
    e.preventDefault();
    setOpen(true);
    setIdMobil(id);
  }

  return (
    <>
      <Sidebar profile={profile}>
        <Table
          title="Mobil"
          description="Management data mobil pada aplikasi Yogi Travel."
          link="/admin/mobil/add"
          data={data}
        >
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  ID Mobil
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Nama Mobil
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Jumlah Seat
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {data &&
                data.map((mobil: any) => (
                  <tr key={mobil.id}>
                    <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                      {mobil.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {mobil.nama_mobil}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {mobil.jumlah_seat}
                    </td>
                    <td className="min-w-max relative whitespace-nowrap py-4 text-sm font-medium sm:pr-6 flex gap-4">
                      <Link
                        href={`/admin/mobil/${mobil.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">, {mobil.name}</span>
                      </Link>
                      <button
                        className="text-rose-600"
                        onClick={(e) =>
                          handlerDeleteModal(e, parseInt(mobil.id))
                        }
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </Table>
      </Sidebar>
      <Dialog className="relative z-50" open={open} onClose={setOpen}>
        <DialogBackdrop
          transition
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in"
        />
        <div className="fixed inset-0 z-10 w-screen overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <DialogPanel
              transition
              className="relative transform overflow-hidden rounded-lg bg-white px-4 pb-4 pt-5 text-left shadow-xl transition-all data-[closed]:translate-y-4 data-[closed]:opacity-0 data-[enter]:duration-300 data-[leave]:duration-200 data-[enter]:ease-out data-[leave]:ease-in sm:my-8 sm:w-full sm:max-w-lg sm:p-6 data-[closed]:sm:translate-y-0 data-[closed]:sm:scale-95"
            >
              <div className="sm:flex sm:items-start">
                <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                  <ExclamationTriangleIcon
                    className="h-6 w-6 text-red-600"
                    aria-hidden="true"
                  />
                </div>
                <div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                  <DialogTitle
                    as="h3"
                    className="text-base font-semibold leading-6 text-gray-900"
                  >
                    Yakin ingin menghapus data Mobil dengan id {idMobil}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Menghapus data membuat data mobil yang sudah tersimpan
                      sebelumnya menghilang dan tidak bisa dikembalian seperti
                      sebelumnya!
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-5 sm:ml-10 sm:mt-4 sm:flex sm:pl-4">
                <button
                  type="button"
                  className="inline-flex w-full justify-center rounded-md bg-red-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-red-500 sm:w-auto"
                  onClick={handlerDelete}
                >
                  Hapus
                </button>
                <button
                  type="button"
                  className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:ml-3 sm:mt-0 sm:w-auto"
                  onClick={() => setOpen(false)}
                  data-autofocus
                >
                  Kembali
                </button>
              </div>
            </DialogPanel>
          </div>
        </div>
      </Dialog>
    </>
  );
}
