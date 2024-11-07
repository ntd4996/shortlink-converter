import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function AnimatedBackground() {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    const handleMouseMove = (e: MouseEvent) => {
      requestAnimationFrame(() => {
        setMousePosition({
          x: e.clientX,
          y: e.clientY,
        });
      });
    };

    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    document.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("resize", handleResize);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  if (!isClient) return null;

  return (
    <div className="fixed inset-0  overflow-hidden bg-gradient-to-b from-gray-900 via-gray-900 to-black">
      {/* Smooth floating orbs */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className={`absolute rounded-full blur-[100px] opacity-40
            ${i === 0 ? "h-[400px] w-[400px] bg-blue-500/30" : ""}
            ${i === 1 ? "h-[500px] w-[500px] bg-purple-500/30" : ""}
            ${i === 2 ? "h-[600px] w-[600px] bg-pink-500/30" : ""}
          `}
          animate={{
            x: [0, 50, 0],
            y: [0, 30, 0],
            scale: [1, 1.1, 1],
          }}
          transition={{
            duration: 15 + i * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: i * 3,
          }}
          style={{
            left: `${25 + i * 30}%`,
            top: `${20 + i * 20}%`,
          }}
        />
      ))}

      {/* Subtle flowing lines */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-0.5 w-1/3 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: [-windowSize.width, windowSize.width * 2],
            opacity: [0, 0.5, 0],
          }}
          transition={{
            duration: 15,
            repeat: Infinity,
            delay: i * 5,
            ease: "easeInOut",
          }}
          style={{
            top: `${30 + i * 20}%`,
          }}
        />
      ))}

      {/* Soft glowing particles */}
      {[...Array(12)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute h-1 w-1 rounded-full bg-white/30"
          initial={{
            x: Math.random() * windowSize.width,
            y: Math.random() * windowSize.height,
          }}
          animate={{
            opacity: [0, 0.8, 0],
            scale: [0, 1.5, 0],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            delay: i * 0.5,
            ease: "easeInOut",
          }}
        />
      ))}

      {/* Improved mouse follower */}
      <motion.div
        className="pointer-events-none absolute h-[600px] w-[600px] rounded-full bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 blur-[100px]"
        animate={{
          x: mousePosition.x - 300,
          y: mousePosition.y - 300,
          scale: [1, 1.1, 1],
        }}
        transition={{
          type: "spring",
          damping: 20,
          stiffness: 100,
          mass: 0.8,
          bounce: 0.2,
        }}
      />

      {/* Secondary smaller follower */}
      <motion.div
        className="pointer-events-none absolute h-[300px] w-[300px] rounded-full bg-gradient-to-r from-cyan-500/30 to-blue-500/30 blur-[50px]"
        animate={{
          x: mousePosition.x - 150,
          y: mousePosition.y - 150,
          scale: [1.1, 0.9, 1.1],
        }}
        transition={{
          type: "spring",
          damping: 15,
          stiffness: 150,
          mass: 0.5,
          bounce: 0.3,
        }}
      />

      {/* Interactive particles near cursor */}
      <motion.div
        className="pointer-events-none absolute"
        animate={{
          x: mousePosition.x,
          y: mousePosition.y,
        }}
        transition={{
          type: "spring",
          damping: 30,
          stiffness: 200,
        }}
      >
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute h-2 w-2 rounded-full bg-white/50"
            animate={{
              x: Math.cos(i * (Math.PI / 3)) * 30,
              y: Math.sin(i * (Math.PI / 3)) * 30,
              scale: [0, 1, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: "easeInOut",
            }}
          />
        ))}
      </motion.div>

      {/* Subtle grid */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(to_right,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:100px_100px]" />

      {/* Soft gradient overlay */}
      <div className="absolute inset-0 bg-gradient-radial from-transparent via-black/50 to-black/80" />
    </div>
  );
}
