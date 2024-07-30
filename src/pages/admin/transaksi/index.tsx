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
  const [dataProfile, dataTransaksi] = await Promise.all([
    getData(token, `${backendUrl}/user/profile`),
    getData(token, `${backendUrl}/transaksi/admin`),
  ]);
  return {
    props: {
      token,
      data: dataTransaksi.data || null,
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
  const [idTransaksi, setIdTransaksi] = React.useState(null);

  async function handlerDelete(e: any) {
    e.preventDefault();
    setOpen(false);
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/transaksi/${idTransaksi}`,
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
        toast.success("Berhasil menghapus data transaksi");
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

  function handlerDeleteModal(e: any, id: any) {
    e.preventDefault();
    setOpen(true);
    setIdTransaksi(id);
  }

  return (
    <>
      <Sidebar profile={profile}>
        <Table
          title="Transaksi"
          description="Management data transaksi pada aplikasi Yogi Travel."
          link="/admin/transaksi/add"
          data={data}
          buttonOff={true}
        >
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6"
                >
                  ID Transaksi
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Jurusan
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Nama Penumpang
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  No.telp
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Jenis Kelamin
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Status Pembayaran
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Bukti Pembayaran
                </th>
                <th
                  scope="col"
                  className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                >
                  Tanggal Pemesanan
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
                data.map((transaksi: any) => (
                  <tr key={transaksi.id}>
                    <td className="whitespace-nowrap pl-6 pr-3 py-4 text-sm text-gray-500">
                      {transaksi.id}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.jurusan.nama.split("-")[0]}{" - "}
                      {transaksi.jurusan.nama.split("-")[1]}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.user.nama}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                      {transaksi.user.telp}
                    </td>
                    <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-xs">
                      {transaksi.user.jk}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm">
                      {transaksi.ispaid ? (
                        <span className="text-green-600">
                          Sudah dikonfirmasi
                        </span>
                      ) : (
                        <span className="text-red-600">Belum dikonfirmasi</span>
                      )}
                    </td>
                    <td className="whitespace-nowrap px-3 py-4 text-sm text-blue-500 underline text-wrap">
                      <Link href={transaksi.bukti_bayar}>
                        Lihat Bukti Pembayaran
                      </Link>
                    </td>
                    <td className="whitespace-normal px-3 py-4 text-sm text-gray-500 max-w-xs">
                      {new Date(transaksi.createdAt).toLocaleString("id-ID", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "numeric",
                        minute: "numeric",
                        second: "numeric",
                      })}
                    </td>
                    <td className="min-w-max relative whitespace-nowrap py-4 text-sm font-medium sm:pr-6 flex gap-4">
                      <Link
                        href={`/admin/transaksi/${transaksi.id}`}
                        className="text-indigo-600 hover:text-indigo-900"
                      >
                        Edit<span className="sr-only">{transaksi.id}</span>
                      </Link>
                      <button
                        className="text-rose-600"
                        onClick={(e) =>
                          handlerDeleteModal(e, parseInt(transaksi.id))
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
                    Yakin ingin menghapus data Transaksi dengan id {idTransaksi}
                  </DialogTitle>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Menghapus data membuat data transaksi yang sudah tersimpan
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
