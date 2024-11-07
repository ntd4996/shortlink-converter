import { Link } from "@remix-run/react";
import { motion } from "framer-motion";
import AnimatedBackground from "~/components/AnimatedBackground";

export default function BuyMeACoffee() {
  return (
    <div className="relative min-h-[calc(100vh-72px)]">
      <AnimatedBackground />
      <div className="relative z-10 flex min-h-[calc(100vh-72px)] items-center justify-center  p-8">
        <div className="max-w-lg rounded-lg bg-gray-800 p-8 shadow-lg">
          <div className="flex flex-col items-center">
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <a
                href="https://github.com/ntd4996"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col items-center"
              >
                <div className="relative mb-4">
                  <div className="absolute -inset-0.5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 opacity-75 blur-sm group-hover:opacity-100 transition duration-300"></div>
                  <motion.img
                    src="/datnt.png"
                    alt="datnt"
                    className="relative h-20 w-20 rounded-full border-2 border-white/20 object-cover"
                    whileHover={{ rotate: 360 }}
                    transition={{ duration: 0.5 }}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <motion.span
                    className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-xl font-semibold text-transparent"
                    whileHover={{ scale: 1.1 }}
                  >
                    @datnt
                  </motion.span>
                  <motion.svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-blue-400"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 9l4-4 4 4m0 6l-4 4-4-4"
                    />
                  </motion.svg>
                </div>
                <motion.p
                  className="mt-2 text-sm text-gray-400"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  Developer & Designer
                </motion.p>
              </a>
            </motion.div>
            <h1 className="mb-4 text-3xl font-bold text-white mt-4">
              Ủng hộ tôi một ly cà phê
            </h1>
            <p className="mb-6 text-center text-gray-300">
              Nếu bạn thích công việc của tôi và muốn ủng hộ, hãy mua cho tôi
              một ly cà phê! Sự ủng hộ của bạn là động lực để tôi tiếp tục phát
              triển và cải thiện sản phẩm.
            </p>
            <a
              href="https://www.buymeacoffee.com/ntd4996"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src="https://img.buymeacoffee.com/button-api/?text=Buy me a coffee&emoji=&slug=datnt&button_colour=FF5F5F&font_colour=ffffff&font_family=Cookie&outline_colour=000000&coffee_colour=FFDD00"
                alt="Buy me a coffee"
              />
            </a>
            <Link to="/" className="text-blue-400 hover:underline mt-4">
              Quay lại trang chủ
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
