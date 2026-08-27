"use client";

import Link from "next/link";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";

// Temporary visual background — swap the URL when a final brand video is sourced.
const HERO_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

const NAV_LINKS = ["Giới thiệu", "Lĩnh vực hành nghề", "Đội ngũ luật sư", "Liên hệ"];

export function HeroSection() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-black">
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      >
        <source src={HERO_VIDEO_URL} type="video/mp4" />
      </video>

      <div className="relative flex h-full flex-col text-white">
        <nav className="px-6 pt-6 md:px-12 lg:px-16">
          <div className="liquid-glass flex items-center justify-between rounded-xl px-4 py-2">
            <span className="text-2xl font-semibold tracking-tight">VietLex Law</span>

            <div className="hidden items-center gap-8 md:flex">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm transition-colors hover:text-gray-300"
                >
                  {link}
                </a>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <Link
                href="/login"
                className="hidden rounded-lg border border-white/30 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-white hover:text-black sm:inline-flex"
              >
                Đăng nhập
              </Link>
              <button
                type="button"
                className="rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition-colors hover:bg-gray-100"
              >
                Đặt lịch tư vấn
              </button>
            </div>
          </div>
        </nav>

        <div className="flex flex-1 flex-col justify-end px-6 pb-12 md:px-12 lg:px-16 lg:pb-16">
          <div className="lg:grid lg:grid-cols-2 lg:items-end">
            <div>
              <AnimatedHeading
                text={"Bảo vệ quyền lợi.\nKiến tạo sự an tâm."}
                className="mb-4 text-4xl font-normal md:text-5xl lg:text-6xl xl:text-7xl"
              />

              <FadeIn delay={800} duration={1000}>
                <p className="mb-5 text-base text-gray-300 md:text-lg">
                  Đồng hành cùng cá nhân và doanh nghiệp bằng giải pháp pháp lý chuyên
                  nghiệp, minh bạch và hiệu quả.
                </p>
              </FadeIn>

              <FadeIn delay={1200} duration={1000}>
                <div className="flex flex-wrap gap-4">
                  <button
                    type="button"
                    className="rounded-lg bg-white px-8 py-3 font-medium text-black"
                  >
                    Đặt lịch tư vấn
                  </button>
                  <button
                    type="button"
                    className="liquid-glass rounded-lg border border-white/20 px-8 py-3 font-medium text-white transition-colors hover:bg-white hover:text-black"
                  >
                    Khám phá dịch vụ
                  </button>
                </div>
              </FadeIn>
            </div>

            <div className="flex items-end justify-start lg:justify-end">
              <FadeIn delay={1400} duration={1000}>
                <div className="liquid-glass rounded-xl border border-white/20 px-6 py-3">
                  <p className="text-lg font-light md:text-xl lg:text-2xl">
                    Tư vấn. Tranh tụng. Đồng hành.
                  </p>
                </div>
              </FadeIn>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
