import React from 'react'

export default function Download() {
  return (
    <div className="py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-5xl font-bold tracking-tight text-slate-900 sm:text-6xl">
          Download Aplikasi
          <br />
          Yogi Tour & Travel
        </h2>
        <p className="mx-auto mt-6 max-w-xl text-lg leading-8 text-slate-900">
          Buat pengalaman perjalanan dan pengiriman barang anda lebih baik
          bersama Yogi Tour & Travel.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <a
            href="#"
            className="rounded-md bg-slate-900 px-3.5 py-2.5 text-sm font-semibold text-gray-200 shadow-sm hover:bg-slate-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            Download Sekarang
          </a>
        </div>
      </div>
    </div>
  );
}
