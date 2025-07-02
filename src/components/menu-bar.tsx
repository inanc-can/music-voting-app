"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface MenuBarProps {
  className?: string;
}

const menuItems = [
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        {...props}
      >
        <title>msg</title>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path d="M9,1.75C4.996,1.75,1.75,4.996,1.75,9c0,1.319,.358,2.552,.973,3.617,.43,.806-.053,2.712-.973,3.633,1.25,.068,2.897-.497,3.633-.973,.489,.282,1.264,.656,2.279,.848,.433,.082,.881,.125,1.338,.125,4.004,0,7.25-3.246,7.25-7.25S13.004,1.75,9,1.75Z"></path>
        </g>
      </svg>
    ),
    label: "Messages",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        {...props}
      >
        <title>envelope</title>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path d="M1.75,5.75l6.767,3.733c.301,.166,.665,.166,.966,0l6.767-3.733"></path>
          <rect
            x="1.75"
            y="3.25"
            width="14.5"
            height="11.5"
            rx="2"
            ry="2"
            transform="translate(18 18) rotate(180)"
          ></rect>
        </g>
      </svg>
    ),
    label: "Mail",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        {...props}
      >
        <title>hashtag</title>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <line x1="3.75" y1="6.25" x2="15.25" y2="6.25"></line>
          <line x1="2.75" y1="11.75" x2="14.25" y2="11.75"></line>
          <line x1="7.633" y1="2.75" x2="5.289" y2="15.25"></line>
          <line x1="12.711" y1="2.75" x2="10.367" y2="15.25"></line>
        </g>
      </svg>
    ),
    label: "Explore",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        {...props}
      >
        <title>upload-4</title>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path d="M15.25,11.75v1.5c0,1.105-.895,2-2,2H4.75c-1.105,0-2-.895-2-2v-1.5"></path>
          <polyline points="12.5 6.25 9 2.75 5.5 6.25"></polyline>
          <line x1="9" y1="2.75" x2="9" y2="10.25"></line>
        </g>
      </svg>
    ),
    label: "Share",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        {...props}
      >
        <title>feather-plus</title>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <path d="M13.974,9.731c-.474,3.691-3.724,4.113-6.974,3.519"></path>
          <path d="M3.75,16.25S5.062,4.729,16.25,3.75c-.56,.976-.573,2.605-.946,4.239-.524,2.011-2.335,2.261-4.554,2.261"></path>
          <line x1="4.25" y1="1.75" x2="4.25" y2="6.75"></line>
          <line x1="6.75" y1="4.25" x2="1.75" y2="4.25"></line>
        </g>
      </svg>
    ),
    label: "Write",
  },
  {
    icon: (props: React.SVGProps<SVGSVGElement>) => (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="18"
        height="18"
        viewBox="0 0 18 18"
        {...props}
      >
        <title>menu</title>
        <g
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
          stroke="currentColor"
        >
          <line x1="2.25" y1="9" x2="15.75" y2="9"></line>
          <line x1="2.25" y1="3.75" x2="15.75" y2="3.75"></line>
          <line x1="2.25" y1="14.25" x2="15.75" y2="14.25"></line>
        </g>
      </svg>
    ),
    label: "Menu",
  },
];

export function MenuBar({ className }: MenuBarProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ left: 0, width: 0 });
  const tooltipRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeIndex !== null && menuRef.current && tooltipRef.current) {
      const menuItem = menuRef.current.children[activeIndex] as HTMLElement;
      const menuRect = menuRef.current.getBoundingClientRect();
      const itemRect = menuItem.getBoundingClientRect();
      const tooltipRect = tooltipRef.current.getBoundingClientRect();

      const left =
        itemRect.left -
        menuRect.left +
        (itemRect.width - tooltipRect.width) / 2;

      setTooltipPosition({
        left: Math.max(0, Math.min(left, menuRect.width - tooltipRect.width)),
        width: tooltipRect.width,
      });
    }
  }, [activeIndex]);

  return (
    <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
      <AnimatePresence>
        {activeIndex !== null && (
          <motion.div
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="absolute left-0 right-0"
            style={{
              top: "-31px",
              pointerEvents: "none",
              zIndex: 50,
            }}
          >
            <motion.div
              ref={tooltipRef}
              className="h-7 px-3 bg-[#131316] rounded-lg shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.20)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.20)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.24)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.24)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.24)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.05)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.12)] justify-center items-center inline-flex overflow-hidden"
              initial={{ x: tooltipPosition.left }}
              animate={{ x: tooltipPosition.left }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              style={{ width: "auto" }}
            >
              <p className="text-white/80 text-[13px] font-medium font-['Geist'] leading-tight whitespace-nowrap">
                {menuItems[activeIndex].label}
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div
        ref={menuRef}
        className="h-10 px-1.5 bg-transparent rounded-[99px] shadow-[0px_32px_64px_-16px_rgba(0,0,0,0.40)] shadow-[0px_16px_32px_-8px_rgba(0,0,0,0.40)] shadow-[0px_8px_16px_-4px_rgba(0,0,0,0.48)] shadow-[0px_4px_8px_-2px_rgba(0,0,0,0.48)] shadow-[0px_2px_4px_-1px_rgba(0,0,0,0.48)] shadow-[0px_0px_0px_1px_rgba(0,0,0,1.00)] shadow-[inset_0px_0px_0px_1px_rgba(255,255,255,0.08)] shadow-[inset_0px_1px_0px_0px_rgba(255,255,255,0.20)] justify-center items-center gap-[3px] inline-flex overflow-hidden z-10"
      >
        {menuItems.map((item, index) => (
          <button
            key={index}
            className="w-8 h-8 px-3 py-1 rounded-[99px] justify-center items-center gap-2 flex hover:bg-[hsla(0,0%,100%,0.08)] transition-colors"
            onMouseEnter={() => setActiveIndex(index)}
            onMouseLeave={() => setActiveIndex(null)}
          >
            <div className="justify-center items-center flex">
              <div className="w-[18px] h-[18px] flex justify-center items-center overflow-hidden">
                <item.icon className="w-full h-full text-[#fafafb]" />
              </div>
            </div>
            <span className="sr-only">{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
