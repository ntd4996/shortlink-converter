import { useEffect, useState } from "react";
import { Link } from "@remix-run/react";

export default function Navigation() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  return (
    <nav className="fixed top-0 z-50 w-full bg-white p-4 shadow dark:bg-gray-800">
      <div className="container mx-auto flex items-center justify-between">
        <Link to="/" className="text-xl font-bold">
          URL Shortener
        </Link>
        <button
          onClick={toggleMenu}
          className="block md:hidden focus:outline-none"
        >
          <svg
            className="h-6 w-6 text-gray-800 dark:text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
        <div className="hidden md:flex space-x-4">
          <Link
            to="/"
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            Trang chủ
          </Link>
          <Link
            to="/dashboard"
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            Quản lý
          </Link>
          <Link
            to="/buymeacoffee"
            className="px-4 py-2 text-gray-800 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
          >
            Mua cà phê
          </Link>
        </div>
      </div>
      {/* Mobile Menu */}
      <div
        className={`fixed inset-0 z-40 transform bg-gray-800 transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } md:hidden`}
      >
        <div className="absolute top-0 right-0 p-4">
          <button
            onClick={toggleMenu}
            className="text-white focus:outline-none"
          >
            <svg
              className="h-6 w-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          <Link
            to="/"
            className="text-xl text-white hover:underline"
            onClick={toggleMenu}
          >
            Trang chủ
          </Link>
          <Link
            to="/dashboard"
            className="text-xl text-white hover:underline"
            onClick={toggleMenu}
          >
            Quản lý
          </Link>
          <Link
            to="/buymeacoffee"
            className="text-xl text-white hover:underline"
            onClick={toggleMenu}
          >
            Mua cà phê
          </Link>
        </div>
      </div>
    </nav>
  );
}
