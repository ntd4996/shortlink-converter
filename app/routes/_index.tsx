import { json, type ActionFunction } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { db } from "~/utils/db.server";
import { generateShortCode } from "~/utils/shortcode.server";
import AnimatedBackground from "~/components/AnimatedBackground";

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();
  const url = formData.get("url");

  if (!url || typeof url !== "string") {
    return json({ error: "URL không hợp lệ" }, { status: 400 });
  }

  try {
    // Validate URL
    new URL(url);

    const shortCode = generateShortCode();
    await db.shortUrl.create({
      data: {
        originalUrl: url,
        shortCode,
      },
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

// Thêm variants cho các animations
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
    },
  },
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

const titleVariants = {
  hidden: { scale: 0.8, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      stiffness: 100,
    },
  },
};

const features = [
  {
    title: "Nhanh chóng",
    description: "Rút gọn URL của bạn chỉ trong vài giây",
    icon: "⚡",
    color: "from-blue-400 to-blue-600",
    gradient: "group-hover:from-blue-600 group-hover:to-blue-800",
  },
  {
    title: "An toàn",
    description: "Bảo mật và đáng tin cậy",
    icon: "🔒",
    color: "from-purple-400 to-purple-600",
    gradient: "group-hover:from-purple-600 group-hover:to-purple-800",
  },
  {
    title: "Dễ sử dụng",
    description: "Giao diện thân thiện, dễ dàng sử dụng",
    icon: "✨",
    color: "from-pink-400 to-pink-600",
    gradient: "group-hover:from-pink-600 group-hover:to-pink-800",
  },
  {
    title: "Thống kê",
    description: "Theo dõi lượt click và phân tích dữ liệu",
    icon: "📊",
    color: "from-green-400 to-green-600",
    gradient: "group-hover:from-green-600 group-hover:to-green-800",
  },
  {
    title: "Tùy chỉnh",
    description: "Tạo URL ngắn theo ý muốn của bạn",
    icon: "🎨",
    color: "from-yellow-400 to-yellow-600",
    gradient: "group-hover:from-yellow-600 group-hover:to-yellow-800",
  },
  {
    title: "Chia sẻ",
    description: "Dễ dàng chia sẻ trên mọi nền tảng",
    icon: "🔗",
    color: "from-red-400 to-red-600",
    gradient: "group-hover:from-red-600 group-hover:to-red-800",
  },
];

export default function Index() {
  const actionData = useActionData<typeof action>();
  const [copied, setCopied] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [isValidUrl, setIsValidUrl] = useState(true);
  const [particles, setParticles] = useState<Array<{ id: number }>>([]);

  useEffect(() => {
    // Khởi tạo particles sau khi component mount
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
    }
  };

  const handleCopy = async () => {
    if (actionData?.shortUrl) {
      await navigator.clipboard.writeText(actionData.shortUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={containerVariants}
      className="relative min-h-screen bg-gradient-to-b from-gray-900 via-gray-900 to-gray-800 text-white"
    >
      <AnimatedBackground />

      <div className="relative">
        <div className="container mx-auto px-4 py-16 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <motion.div
            variants={titleVariants}
            className="text-center"
            whileHover={{ scale: 1.02 }}
          >
            <h1 className="relative bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-5xl font-extrabold text-transparent sm:text-6xl lg:text-7xl">
              URL Shortener
              <motion.span
                className="absolute -right-8 top-0 text-3xl"
                animate={{
                  rotate: [0, 14, -8, 14, 0],
                  scale: [1, 1.2, 1, 1.2, 1],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                ✨
              </motion.span>
            </h1>
            <motion.div
              className="mx-auto mt-4 h-1 max-w-md bg-gradient-to-r from-blue-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: "100%" }}
              transition={{ delay: 0.5, duration: 1 }}
            />
          </motion.div>

          {/* Form Section */}
          <motion.div
            variants={itemVariants}
            className="mx-auto mt-16 max-w-3xl"
            whileHover={{ y: -5 }}
          >
            <div className="rounded-2xl backdrop-blur-xl bg-white/10 p-8 shadow-2xl ring-1 ring-white/20">
              <Form method="post" className="space-y-6" onSubmit={handleSubmit}>
                <div className="relative">
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
                    className={`w-full rounded-xl border p-4 text-lg transition-all duration-200 focus:ring-2 focus:ring-blue-500 dark:bg-gray-700
                      ${
                        !isValidUrl && inputValue
                          ? "border-red-500 bg-red-50 dark:bg-red-900/10"
                          : "border-gray-300 dark:border-gray-600"
                      }`}
                    required
                  />
                  <AnimatePresence>
                    {!isValidUrl && inputValue && (
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="absolute -bottom-6 left-0 text-sm text-red-500"
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
                        className="absolute right-4 top-1/2 -translate-y-1/2"
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
                  disabled={!isValidUrl || !inputValue}
                  className={`w-full rounded-xl px-6 py-4 text-lg font-medium text-white shadow-lg transition-all duration-200
                    ${
                      !isValidUrl || !inputValue
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    }`}
                >
                  Rút gọn URL
                </motion.button>
              </Form>
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            variants={containerVariants}
            className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                variants={itemVariants}
                whileHover={{
                  y: -10,
                  scale: 1.02,
                  transition: { type: "spring", stiffness: 300 },
                }}
                className="group relative rounded-xl backdrop-blur-xl bg-white/10 p-6 shadow-xl ring-1 ring-white/20"
              >
                {/* Glow effect */}
                <motion.div
                  className={`absolute inset-0 -z-10 rounded-xl bg-gradient-to-r ${feature.color} opacity-0 blur-xl transition-opacity group-hover:opacity-10`}
                  animate={{
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                  }}
                />

                <div
                  className={`mb-4 inline-block rounded-lg bg-gradient-to-r ${feature.color} p-3`}
                >
                  <motion.span
                    className="text-2xl"
                    animate={{
                      rotate: [0, 10, -10, 10, 0],
                      scale: [1, 1.1, 1, 1.1, 1],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      delay: index * 0.2,
                    }}
                  >
                    {feature.icon}
                  </motion.span>
                </div>
                <h3 className="text-xl font-semibold text-white">
                  {feature.title}
                </h3>
                <p className="mt-2 text-gray-300">{feature.description}</p>

                {/* Hover gradient border */}
                <motion.div
                  className={`absolute inset-0 -z-20 rounded-xl bg-gradient-to-r ${feature.gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-20`}
                />
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* Success Animation */}
      <AnimatePresence>
        {actionData?.success && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          >
            <motion.div
              className="rounded-xl bg-white p-6 text-center"
              animate={{
                scale: [1, 1.1, 1],
              }}
              transition={{
                duration: 0.3,
              }}
            >
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 1,
                  ease: "easeOut",
                }}
                className="mx-auto mb-4 text-4xl"
              >
                ✅
              </motion.div>
              <h3 className="text-xl font-semibold">URL đã được rút gọn!</h3>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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

      {/* Result Section */}
      {actionData?.shortUrl && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="mx-auto mt-8 max-w-3xl"
        >
          <div className="rounded-xl backdrop-blur-xl bg-white/10 p-8 shadow-2xl ring-1 ring-white/20">
            <motion.h2
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mb-4 text-2xl font-semibold text-white"
            >
              URL đã rút gọn
            </motion.h2>
            <div className="flex items-center gap-4">
              <motion.input
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                type="text"
                readOnly
                value={actionData.shortUrl}
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
                <div className="flex items-center gap-2">
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
                              x: (i % 2 ? 1 : -1) * (Math.random() * 20 + 10),
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
      )}
    </motion.div>
  );
}
