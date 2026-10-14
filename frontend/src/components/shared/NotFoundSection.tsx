"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NAV_LINKS = ["Giới thiệu", "Lĩnh vực hành nghề", "Đội ngũ luật sư", "Liên hệ"];

function Logo() {
  return (
    <div className="flex items-center">
      <div className="grid grid-cols-2 gap-0.5">
        <div className="h-2.5 w-2.5 rounded-full bg-white sm:h-3 sm:w-3" />
        <div className="h-2.5 w-2.5 rounded-full bg-white sm:h-3 sm:w-3" />
        <div className="h-2.5 w-2.5 rounded-full bg-white sm:h-3 sm:w-3" />
        <div className="h-2.5 w-2.5 rounded-full bg-white sm:h-3 sm:w-3" />
      </div>
      <span className="ml-1 text-lg font-bold text-white sm:text-xl">Luật Nghiệp Hưng</span>
    </div>
  );
}

export function NotFoundSection() {
  const textRef = useRef<HTMLDivElement>(null);
  const [scaleY, setScaleY] = useState(1);

  useEffect(() => {
    function updateScale() {
      const el = textRef.current;
      if (!el || el.offsetHeight === 0) return;
      setScaleY(window.innerHeight / el.offsetHeight);
    }
    updateScale();
    window.addEventListener("resize", updateScale);
    return () => window.removeEventListener("resize", updateScale);
  }, []);

  return (
    <div
      className="relative flex h-screen w-full flex-col overflow-hidden"
      style={{ background: "linear-gradient(180deg, #050505 0%, #1c1c1c 100%)" }}
    >
      {/* Background "404" watermark + oval */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.08]"
        style={{
          maskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
          WebkitMaskImage: "linear-gradient(to bottom, black 40%, transparent 95%)",
        }}
      >
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            ref={textRef}
            className="leading-none font-black tracking-tighter whitespace-nowrap text-white"
            style={{
              fontSize: "clamp(200px, 48vw, 800px)",
              transform: `scale(1.15, ${scaleY * 1.4})`,
            }}
          >
            404
          </div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className="h-[22vh] rounded-full bg-white sm:h-[26vh] md:h-[50vh]"
            style={{
              width: "clamp(120px, 20vw, 400px)",
              transform: `scaleY(${scaleY})`,
              transformOrigin: "center",
            }}
          />
        </div>
      </div>

      {/* Navbar */}
      <nav className="relative z-20 flex items-center justify-between px-4 py-4 sm:px-6 sm:py-5 md:px-12">
        <Logo />

        <div className="hidden items-center gap-1 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link}
              href="#"
              className="rounded-full bg-white px-4 py-1.5 text-sm font-medium text-black transition-colors hover:opacity-90"
            >
              {link}
            </a>
          ))}
        </div>
      </nav>

      {/* Bottom content */}
      <div className="relative z-30 mt-auto flex flex-col items-center px-4 pb-8 text-center sm:pb-16">
        <h1 className="mb-3 text-lg font-medium text-white sm:mb-4 sm:text-xl md:text-2xl">
          Không tìm thấy trang bạn yêu cầu.
        </h1>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-black transition-all hover:scale-105 hover:shadow-lg sm:px-8 sm:py-4 sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
          Về trang chủ
        </Link>
      </div>
    </div>
  );
}
