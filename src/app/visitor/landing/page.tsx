"use client";

import { useEffect } from "react";
import { motion, stagger, useAnimate } from "motion/react";

import Floating, {
  FloatingElement,
} from "@/components/fancy/parallax-floating";
import image0 from "@/components/fancy/images/image0.jpeg";
import image1 from "@/components/fancy/images/image1.jpeg";
import image2 from "@/components/fancy/images/image2.jpeg";
import image3 from "@/components/fancy/images/image3.jpeg";
import image4 from "@/components/fancy/images/image4.jpeg";
import image5 from "@/components/fancy/images/image5.jpeg";
import image6 from "@/components/fancy/images/image6.jpeg";
import image7 from "@/components/fancy/images/image7.jpeg";

export default function Preview() {
  const [scope, animate] = useAnimate();

  const exampleImages = [
    image0,
    image1,
    image2,
    image3,
    image4,
    image5,
    image6,
    image7,
  ];

  useEffect(() => {
    animate(
      "img",
      { opacity: [0, 1] },
      { duration: 0.5, delay: stagger(0.15) }
    );
  }, []);

  return (
    <div
      className="flex min-w-screen min-h-screen justify-center items-center bg-black overflow-hidden"
      ref={scope}
    >
      <motion.div
        className="z-50 text-center space-y-4 items-center flex flex-col"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.88, delay: 1.5 }}
      >
        <p className="text-5xl md:text-7xl z-50 text-white font-calendas italic">
          party
        </p>
        <p className="text-xs z-50 hover:scale-110 transition-transform bg-white text-black rounded-full py-2 w-20 cursor-pointer">
          Join
        </p>
      </motion.div>

      <Floating sensitivity={-1} className="overflow-hidden">
        <FloatingElement depth={0.5} className="top-[8%] left-[11%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[0].src}
            className="w-20 h-20 md:w-24 md:h-24 lg:w-48 lg:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[10%] left-[32%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[1].src}
            className="w-28 h-28 md:w-28 md:h-28 lg:w-48 lg:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[2%] left-[53%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[2].src}
            className="w-28 h-40 md:w-40 md:h-52 lg:w-48 lg:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[0%] left-[83%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[3].src}
            className="w-32 h-32 md:w-32 md:h-32 lg:w-48 lg:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={1} className="top-[40%] left-[2%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[4].src}
            className="w-28 h-28 md:w-36 md:h-36 lg:w-48 lg:h-60 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={2} className="top-[70%] left-[77%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[7].src}
            className="w-28 h-28 md:w-40 md:h-48 lg:w-48 lg:h-60   object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>

        <FloatingElement depth={4} className="top-[73%] left-[15%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[5].src}
            className="w-40 md:w-52 h-full object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
        <FloatingElement depth={1} className="top-[80%] left-[50%]">
          <motion.img
            initial={{ opacity: 0 }}
            src={exampleImages[6].src}
            className="w-32 h-32 md:w-32 md:h-32 object-cover hover:scale-105 duration-200 cursor-pointer transition-transform"
          />
        </FloatingElement>
      </Floating>
    </div>
  );
}
