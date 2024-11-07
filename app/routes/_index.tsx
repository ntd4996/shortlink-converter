import { json, type ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { generateShortCode } from "~/utils/shortcode.server";
import AnimatedBackground from "~/components/AnimatedBackground";
import ShortUrl from "~/models/ShortUrl";
import connectDB from "~/utils/mongo.server";

export const action: ActionFunction = async ({ request }) => {
  await connectDB();

  const formData = await request.formData();
  const url = formData.get("url");

  if (!url || typeof url !== "string") {
    return json({ error: "URL không hợp lệ" }, { status: 400 });
  }

  try {
    new URL(url);

    const shortCode = generateShortCode();
    await ShortUrl.create({
      originalUrl: url,
      shortCode,
    });

    return json({
      shortUrl: `${process.env.APP_URL}/${shortCode}`,
      success: true,
    });
  } catch (error) {
    console.error("Error creating short URL:", error);
    if (error instanceof Error && error.message.includes("URL")) {
      return json({ error: "URL không hợp lệ" }, { status: 400 });
    }
    return json({ error: "Có lỗi xảy ra" }, { status: 500 });
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      bounce: 0.4,
    },
  },
};

export default function Index() {
  const actionData = useActionData<typeof action>();
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number }>>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setParticles(Array.from({ length: 20 }, (_, i) => ({ id: i })));
  }, []);

  const validateUrl = (value: string) => {
    try {
      new URL(value);
      return true;
    } catch {
      return false;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInputValue(value);
    if (value) {
      setIsValidUrl(validateUrl(value));
    } else {
      setIsValidUrl(true);
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    if (!isValidUrl) {
      e.preventDefault();
    } else {
      setIsSubmitting(true);
    }
  };

  useEffect(() => {
    if (actionData) {
      setIsSubmitting(false);
    }
  }, [actionData]);

  const handleCopy = async () => {
    if (actionData?.shortUrl) {
      await navigator.clipboard.writeText(actionData.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div className="relative min-h-[calc(100vh-72px)]">
      <AnimatedBackground />

      <div className="relative z-10">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div variants={itemVariants} className="text-center">
            <h1 className="bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              URL Shortener
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-lg text-gray-300">
              Rút gọn đường link của bạn một cách dễ dàng và nhanh chóng.
            </p>
          </motion.div>

          {/* Form và Result Section */}
          <div className="mx-auto mt-16 grid max-w-6xl gap-8 md:grid-cols-2">
            {/* Form Section */}
            <motion.div variants={itemVariants}>
              <div className="rounded-2xl backdrop-blur-xl bg-white/10 p-8 shadow-2xl ring-1 ring-white/20">
                <Form
                  method="post"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-4"
                >
                  <div className="relative ">
                    <motion.h2
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="mb-4 text-2xl font-semibold text-white"
                    >
                      Nhập URL cần rút gọn...
                    </motion.h2>
                    <motion.input
                      animate={
                        !isValidUrl && inputValue
                          ? { x: [0, -10, 10, -10, 10, 0] }
                          : {}
                      }
                      transition={{ type: "spring", duration: 0.5 }}
                      name="url"
                      type="url"
                      value={inputValue}
                      onChange={handleInputChange}
                      placeholder="Nhập URL cần rút gọn..."
                      className={`w-full rounded-xl border p-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 bg-gray-700
                        ${
                          !isValidUrl && inputValue
                            ? "border-red-500   bg-red-900/10"
                            : "border-gray-600"
                        }`}
                      required
                    />
                    <AnimatePresence>
                      {!isValidUrl && inputValue && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="mt-1 text-sm text-red-500"
                        >
                          URL không hợp lệ. Vui lòng nhập đúng định dạng (vd:
                          https://example.com)
                        </motion.div>
                      )}
                    </AnimatePresence>
                    <AnimatePresence>
                      {isValidUrl && inputValue && validateUrl(inputValue) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                          className="absolute right-4 top-[66px] -translate-y-1/2"
                        >
                          <svg
                            className="h-6 w-6 text-green-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={!isValidUrl || !inputValue || isSubmitting}
                    className={`w-full rounded-xl px-6 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200
                      ${
                        !isValidUrl || !inputValue || isSubmitting
                          ? "bg-gray-400 cursor-not-allowed"
                          : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      }`}
                  >
                    <div className="flex items-center justify-center gap-2">
                      {isSubmitting ? (
                        <>
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                          >
                            <svg
                              className="h-5 w-5"
                              viewBox="0 0 24 24"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                d="M12 4.75V6.25"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M17.1266 6.87347L16.0659 7.93413"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M19.25 12L17.75 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M17.1266 17.1265L16.0659 16.0659"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M12 19.25V17.75"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.9342 16.0659L6.87354 17.1265"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M6.25 12L4.75 12"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                              <path
                                d="M7.9342 7.93413L6.87354 6.87347"
                                stroke="currentColor"
                                strokeWidth="1.5"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              />
                            </svg>
                          </motion.div>
                          <span>Đang xử lý...</span>
                        </>
                      ) : (
                        "Rút gọn URL"
                      )}
                    </div>
                  </motion.button>
                </Form>
              </div>
            </motion.div>

            {/* Result Section */}
            <AnimatePresence>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
              >
                <div className="rounded-xl backdrop-blur-xl bg-white/10 p-8 shadow-2xl ring-1 ring-white/20 h-full">
                  <motion.h2
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mb-4 text-2xl font-semibold text-white"
                  >
                    URL đã rút gọn
                  </motion.h2>
                  <div className="flex flex-col gap-4">
                    <motion.input
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      type="text"
                      readOnly
                      value={actionData?.shortUrl}
                      placeholder="URL sau khi rút gọn"
                      className="w-full rounded-xl border border-white/20 bg-white/5 p-4 text-lg text-white"
                    />
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleCopy}
                      className={`relative whitespace-nowrap rounded-xl px-6 py-4 text-lg font-medium transition-all duration-200
                          ${
                            copied
                              ? "bg-green-500 text-white"
                              : "bg-white/10 text-white hover:bg-white/20"
                          }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        {copied ? (
                          <>
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ type: "spring", damping: 10 }}
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M5 13l4 4L19 7"
                                />
                              </svg>
                            </motion.div>
                            <span>Đã copy!</span>
                            {/* Success particles */}
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -inset-1"
                            >
                              {[...Array(6)].map((_, i) => (
                                <motion.span
                                  key={i}
                                  className="absolute h-2 w-2 rounded-full bg-green-300"
                                  initial={{ opacity: 1, scale: 0 }}
                                  animate={{
                                    opacity: 0,
                                    scale: 1,
                                    x:
                                      (i % 2 ? 1 : -1) *
                                      (Math.random() * 20 + 10),
                                    y: -Math.random() * 20 - 10,
                                  }}
                                  transition={{
                                    duration: 0.5,
                                    ease: "easeOut",
                                    delay: i * 0.1,
                                  }}
                                />
                              ))}
                            </motion.div>
                          </>
                        ) : (
                          <>
                            <motion.div
                              initial={{ rotate: 0 }}
                              whileHover={{ rotate: 360 }}
                              transition={{ duration: 0.5 }}
                            >
                              <svg
                                className="h-5 w-5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3"
                                />
                              </svg>
                            </motion.div>
                            <span>Copy</span>
                          </>
                        )}
                      </div>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Features Section */}

          {/* Author Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-24 text-center"
          >
            <motion.div whileHover={{ scale: 1.05 }} className="inline-block">
              <a
                href="https://github.com/ntd4496"
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

            {/* Social Links */}
            <motion.div
              className="mt-4 flex justify-center gap-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <motion.a
                href="https://github.com/ntd4996"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    fillRule="evenodd"
                    d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </motion.a>
              <motion.a
                href="https://facebook.com/ntd4996"
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.2, y: -2 }}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg
                  className="h-6 w-6"
                  fill="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </motion.a>
            </motion.div>
          </motion.div>

          {/* Copyright */}
          <motion.p
            className="mt-8 text-center text-sm text-gray-500"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            © 2024 URL Shortener by datnt. All rights reserved.
          </motion.p>
        </div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute h-1 w-1 rounded-full bg-white/20"
            initial={{
              x:
                Math.random() *
                (typeof window !== "undefined" ? window.innerWidth : 1000),
              y:
                Math.random() *
                (typeof window !== "undefined" ? window.innerHeight : 1000),
            }}
            animate={{
              y: [null, -1000],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 20,
              repeat: Infinity,
              delay: Math.random() * 10,
            }}
          />
        ))}
      </div>
    </motion.div>
  );
}
