import { Link } from "@remix-run/react";

export default function Navigation() {
  return (
    <nav className="fixed top-0 z-10 w-full bg-white p-4 shadow dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          URL Shortener
        </Link>
        <div className="flex gap-4">
          <Link
            to="/"
            className="rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Trang chủ
          </Link>
          <Link
            to="/dashboard"
            className="rounded px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            Quản lý
          </Link>
        </div>
      </div>
    </nav>
  );
}
