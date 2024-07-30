import React from "react";
import Image from "next/image";
import Router from "next/router";
import { toast } from "react-hot-toast";

export default function Register() {

  const [data, setData] = React.useState({
    email: "",
    nama: "",
    phone: "",
    password: "",
    confPassword: "",
    role: "admin",
  });

  async function handlerRegister(e: any) {
    e.preventDefault();
    try {
      const request = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/user`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      const response = await request.json();
      if (response.message === "success register data") {
        toast.success("Registrasi berhasil");
        setTimeout(() => {
          Router.push('/login')
        }, 1500)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  }

  function handleChange(e: any) {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  }

  return (
    <>
      <div className="flex h-screen flex-1">
        <div className="overflow-y-auto flex flex-1 flex-col justify-center px-4 py-12 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
          <div className="mx-auto w-full max-w-sm lg:w-96">
            <div>
              <h2 className="mt-8 text-2xl font-bold leading-9 tracking-tight text-gray-900">
                Registrasi Akun
              </h2>
            </div>
            <div className="mt-10">
              <div>
                <form className="space-y-6" onSubmit={handlerRegister}>
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Alamat Email
                    </label>
                    <div className="mt-2">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        placeholder="Contoh: yosriazal@gmail.com"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="nama"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nama Lengkap
                    </label>
                    <div className="mt-2">
                      <input
                        id="nama"
                        name="nama"
                        type="text"
                        autoComplete="name"
                        required
                        placeholder="Contoh: Yosrizal Fadli"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Nomor Telepone
                    </label>
                    <div className="mt-2">
                      <input
                        id="phone"
                        name="phone"
                        type="text"
                        required
                        placeholder="Contoh: 081212345678"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="•••••••••••"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="confPassword"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Konfirmasi Password
                    </label>
                    <div className="mt-2">
                      <input
                        id="confPassword"
                        name="confPassword"
                        type="password"
                        autoComplete="current-password"
                        required
                        placeholder="•••••••••••"
                        onChange={handleChange}
                        className="block w-full rounded-md border-0 py-1.5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Register
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        <div className="relative hidden w-0 flex-1 lg:block">
          <Image
            className="absolute inset-0 h-full w-full object-cover"
            src="/images/banner.png"
            alt="Banner"
            width={1080}
            height={1920}
            fetchPriority="low"
            priority={true}
            loading="eager"
          />
        </div>
      </div>
    </>
  );
}
