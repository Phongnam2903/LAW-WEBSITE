"use client";

import { type SubmitEvent } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, ShieldCheck } from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";

// Temporary visual background — swap the URL when a final brand video is sourced.
const LOGIN_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

function GoogleIcon() {
  return (
    <svg viewBox="0 0 48 48" className="h-[18px] w-[18px]" aria-hidden="true">
      <path
        fill="#EA4335"
        d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
      />
      <path
        fill="#4285F4"
        d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.9-2.26 5.36-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"
      />
      <path
        fill="#FBBC05"
        d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.55 10.78l7.98-6.19z"
      />
      <path
        fill="#34A853"
        d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
      />
    </svg>
  );
}

export function LoginSection() {
  // Auth wiring pending backend implementation — see backend/.../auth (placeholder package only).
  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={LOGIN_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/20 to-transparent" />

        <div className="relative flex h-full flex-col justify-end p-12 text-white">
          <FadeIn duration={600}>
            <div className="liquid-glass mb-6 inline-flex w-fit items-center gap-2 rounded-pill px-4 py-2 text-sm">
              <ShieldCheck className="h-4 w-4 text-gold-600" />
              <span>Dành cho đội ngũ pháp lý chuyên nghiệp</span>
            </div>
          </FadeIn>

          <AnimatedHeading
            text={"Nắm bắt vấn đề,\nHành động tức thì"}
            className="text-5xl font-normal xl:text-6xl"
          />
        </div>
      </div>

      <div className="relative flex items-center justify-center bg-white px-6 py-16">
        <Link
          href="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-charcoal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </Link>

        <FadeIn duration={700} className="w-full max-w-md">
          <div className="mb-8 text-center">
            <h1 className="font-serif text-4xl text-charcoal-900">Chào mừng trở lại!</h1>
            <p className="mt-3 text-charcoal-600">
              <span className="font-semibold text-charcoal-900">Đăng nhập</span> để tiếp tục
              theo dõi hồ sơ của bạn.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="email"
              name="email"
              autoComplete="email"
              required
              aria-label="Địa chỉ email"
              placeholder="Vd. nguyenvana@gmail.com"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-4 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70 focus:border-navy-700 focus:bg-white"
            />
            <input
              type="password"
              name="password"
              autoComplete="current-password"
              required
              aria-label="Mật khẩu"
              placeholder="Mật khẩu"
              className="w-full rounded-lg border border-neutral-300 bg-neutral-100 px-5 py-4 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70 focus:border-navy-700 focus:bg-white"
            />

            <button
              type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-pill bg-navy-900 py-4 text-sm font-medium text-white transition-colors hover:bg-navy-700"
            >
              Đăng nhập
              <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <div className="my-6 flex items-center gap-4 text-xs font-semibold tracking-wide text-charcoal-600">
            <span className="h-px flex-1 bg-neutral-300" />
            HOẶC
            <span className="h-px flex-1 bg-neutral-300" />
          </div>

          <button
            type="button"
            className="flex w-full items-center justify-center gap-3 rounded-pill border border-neutral-300 bg-white py-3.5 text-sm font-medium text-charcoal-900 transition-colors hover:bg-neutral-100"
          >
            <GoogleIcon />
            Đăng nhập với Google
          </button>

          <p className="mt-6 text-center text-sm text-charcoal-600">
            Chưa có tài khoản?{" "}
            <Link
              href="#"
              className="font-semibold text-charcoal-900 underline underline-offset-4"
            >
              Bắt đầu ngay
            </Link>
          </p>
        </FadeIn>
      </div>
    </div>
  );
}
