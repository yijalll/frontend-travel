import Link from "next/link";

export default function Table({
  children,
  title,
  description,
  link,
  data,
  buttonOff,
}: {
  children: any;
  title: string;
  description: string;
  link: string;
  data: any[]|null;
  buttonOff?: boolean;
}) {
  return (
    <>
      <div className="sm:flex sm:items-center">
        <div className="sm:flex-auto">
          <h1 className="text-base font-semibold leading-6 text-gray-900">
            {title}
          </h1>
          <p className="mt-2 text-sm text-gray-700">{description}</p>
        </div>
        {!buttonOff && (
          <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none">
            <Link
              href={link}
              className="block rounded-md bg-indigo-600 px-3 py-2 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
              Tambah {title}
            </Link>
          </div>
        )}
      </div>
      <div className="mt-8 flow-root">
        <div className="-mx-4 -my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="inline-block min-w-full py-2 align-middle sm:px-6 lg:px-8">
            {!data || data.length === 0 ? (
              <p>Data {title} tidak ada</p>
            ) : (
              <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 sm:rounded-lg">
                {children}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
