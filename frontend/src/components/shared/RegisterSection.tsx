"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  ShieldCheck,
  User,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { cn } from "@/lib/cn";

const REGISTER_VIDEO_URL =
  "https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260403_050628_c4e32401-fab4-4a27-b7a8-6e9291cd5959.mp4";

// Mật khẩu: tối thiểu 8 ký tự, có chữ hoa, chữ thường và số
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;
const PHONE_REGEX = /^[0-9+\s\-()]{9,15}$/;

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  password: string;
  confirmPassword: string;
  consent: boolean;
}

interface Errors {
  fullName?: string;
  phone?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  consent?: string;
}

function PasswordStrengthBar({ password }: { password: string }) {
  const checks = [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^a-zA-Z0-9]/.test(password),
  ];
  const score = checks.filter(Boolean).length;

  const levels = [
    { label: "Rất yếu", color: "bg-danger-600", width: "w-1/5" },
    { label: "Yếu", color: "bg-warning-600", width: "w-2/5" },
    { label: "Trung bình", color: "bg-warning-600", width: "w-3/5" },
    { label: "Mạnh", color: "bg-success-600", width: "w-4/5" },
    { label: "Rất mạnh", color: "bg-success-600", width: "w-full" },
  ];

  if (!password) return null;
  const level = levels[Math.max(0, score - 1)];

  return (
    <div className="mt-2">
      <div className="h-1 w-full rounded-full bg-neutral-200">
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            level.color,
            level.width
          )}
        />
      </div>
      <p className="mt-1 text-right text-xs text-charcoal-600">
        Độ mạnh: <span className="font-semibold">{level.label}</span>
      </p>
    </div>
  );
}

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

export function RegisterSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    password: "",
    confirmPassword: "",
    consent: false,
  });
  const [errors, setErrors] = useState<Errors>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  function handleChange(field: keyof FormData, value: string | boolean) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof Errors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function validate(): boolean {
    const e: Errors = {};

    if (!formData.fullName.trim()) {
      e.fullName = "Vui lòng nhập họ và tên.";
    }
    if (!formData.phone.trim()) {
      e.phone = "Vui lòng nhập số điện thoại.";
    } else if (!PHONE_REGEX.test(formData.phone.trim())) {
      e.phone = "Số điện thoại không hợp lệ.";
    }
    if (!formData.email.trim()) {
      e.email = "Vui lòng nhập địa chỉ email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      e.email = "Địa chỉ email không đúng định dạng.";
    }
    if (!formData.password) {
      e.password = "Vui lòng nhập mật khẩu.";
    } else if (!PASSWORD_REGEX.test(formData.password)) {
      e.password = "Mật khẩu cần ít nhất 8 ký tự, có chữ hoa, chữ thường và số.";
    }
    if (!formData.confirmPassword) {
      e.confirmPassword = "Vui lòng xác nhận lại mật khẩu.";
    } else if (formData.password !== formData.confirmPassword) {
      e.confirmPassword = "Xác nhận mật khẩu không khớp.";
    }
    if (!formData.consent) {
      e.consent = "Bạn cần đồng ý với điều khoản sử dụng và chính sách bảo mật.";
    }

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setIsSubmitting(true);
    // Pending backend: POST /api/v1/auth/register
    await new Promise((r) => setTimeout(r, 1200));
    setIsSubmitting(false);
    setIsSuccess(true);
  }

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left panel — brand visual */}
      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        >
          <source src={REGISTER_VIDEO_URL} type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-linear-to-t from-navy-900 via-navy-900/30 to-transparent" />

        <div className="relative flex h-full flex-col justify-between p-12 text-white">
          <div>
            <FadeIn duration={600}>
              <div className="liquid-glass inline-flex w-fit items-center gap-2 rounded-pill px-4 py-2 text-sm">
                <ShieldCheck className="h-4 w-4 text-gold-600" />
                <span>Nền tảng pháp lý tin cậy</span>
              </div>
            </FadeIn>
          </div>

          <div>
            <AnimatedHeading
              text={"Bắt đầu hành trình\nBảo vệ quyền lợi"}
              className="text-5xl font-normal xl:text-6xl"
            />
            <FadeIn delay={1200} duration={800}>
              <div className="mt-8 space-y-3">
                {[
                  "Theo dõi tiến trình hồ sơ tư vấn trực tuyến",
                  "Nhận thông báo cập nhật vụ việc tức thì",
                  "Kết nối trực tiếp với luật sư phụ trách",
                ].map((feat) => (
                  <div key={feat} className="flex items-center gap-3 text-sm text-neutral-300">
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-gold-600" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </FadeIn>
          </div>
        </div>
      </div>

      {/* Right panel — registration form */}
      <div className="relative flex items-center justify-center bg-white px-6 py-14">
        {/* Back link */}
        <Link
          href="/"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-charcoal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Về trang chủ
        </Link>

        <FadeIn duration={700} className="w-full max-w-md">
          {isSuccess ? (
            /* ── Success state ── */
            <div className="text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-600/10">
                <CheckCircle2 className="h-9 w-9 text-success-600" />
              </div>
              <h1 className="mt-5 font-serif text-3xl text-charcoal-900">
                Đăng ký thành công!
              </h1>
              <p className="mt-3 text-sm text-charcoal-600">
                Tài khoản của bạn đã được tạo. Vui lòng kiểm tra email{" "}
                <strong className="text-charcoal-900">{formData.email}</strong> để xác thực tài khoản trước khi đăng nhập.
              </p>
              <Link
                href="/login"
                className="mt-8 inline-flex items-center gap-2 rounded-pill bg-navy-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-navy-700"
              >
                Đến trang Đăng nhập
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            /* ── Form ── */
            <>
              <div className="mb-8 text-center">
                <h1 className="font-serif text-4xl text-charcoal-900">Tạo tài khoản</h1>
                <p className="mt-3 text-sm text-charcoal-600">
                  Đã có tài khoản?{" "}
                  <Link
                    href="/login"
                    className="font-semibold text-charcoal-900 underline underline-offset-4"
                  >
                    Đăng nhập ngay
                  </Link>
                </p>
              </div>

              <form onSubmit={handleSubmit} noValidate className="space-y-4">
                {/* Họ và tên */}
                <div>
                  <div className="relative">
                    <User className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
                    <input
                      id="fullName"
                      type="text"
                      autoComplete="name"
                      required
                      placeholder="Họ và tên"
                      value={formData.fullName}
                      onChange={(e) => handleChange("fullName", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-4 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                        errors.fullName
                          ? "border-danger-600 focus:border-danger-600"
                          : "border-neutral-300 focus:border-navy-700 focus:bg-white"
                      )}
                    />
                  </div>
                  {errors.fullName && (
                    <p className="mt-1 text-xs text-danger-600">{errors.fullName}</p>
                  )}
                </div>

                {/* Số điện thoại */}
                <div>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
                    <input
                      id="phone"
                      type="tel"
                      autoComplete="tel"
                      required
                      placeholder="Số điện thoại"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-4 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                        errors.phone
                          ? "border-danger-600 focus:border-danger-600"
                          : "border-neutral-300 focus:border-navy-700 focus:bg-white"
                      )}
                    />
                  </div>
                  {errors.phone && (
                    <p className="mt-1 text-xs text-danger-600">{errors.phone}</p>
                  )}
                </div>

                {/* Email */}
                <div>
                  <div className="relative">
                    <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
                    <input
                      id="email"
                      type="email"
                      autoComplete="email"
                      required
                      placeholder="Địa chỉ email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-4 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                        errors.email
                          ? "border-danger-600 focus:border-danger-600"
                          : "border-neutral-300 focus:border-navy-700 focus:bg-white"
                      )}
                    />
                  </div>
                  {errors.email && (
                    <p className="mt-1 text-xs text-danger-600">{errors.email}</p>
                  )}
                </div>

                {/* Mật khẩu */}
                <div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
                    <input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Mật khẩu"
                      value={formData.password}
                      onChange={(e) => handleChange("password", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-12 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                        errors.password
                          ? "border-danger-600 focus:border-danger-600"
                          : "border-neutral-300 focus:border-navy-700 focus:bg-white"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600/60 hover:text-charcoal-900"
                      aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  <PasswordStrengthBar password={formData.password} />
                  {errors.password && (
                    <p className="mt-1 text-xs text-danger-600">{errors.password}</p>
                  )}
                </div>

                {/* Xác nhận mật khẩu */}
                <div>
                  <div className="relative">
                    <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
                    <input
                      id="confirmPassword"
                      type={showConfirm ? "text" : "password"}
                      autoComplete="new-password"
                      required
                      placeholder="Xác nhận mật khẩu"
                      value={formData.confirmPassword}
                      onChange={(e) => handleChange("confirmPassword", e.target.value)}
                      className={cn(
                        "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-12 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                        errors.confirmPassword
                          ? "border-danger-600 focus:border-danger-600"
                          : "border-neutral-300 focus:border-navy-700 focus:bg-white"
                      )}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirm((v) => !v)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600/60 hover:text-charcoal-900"
                      aria-label={showConfirm ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    >
                      {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="mt-1 text-xs text-danger-600">{errors.confirmPassword}</p>
                  )}
                </div>

                {/* Điều khoản */}
                <div className="pt-1">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={formData.consent}
                      onChange={(e) => handleChange("consent", e.target.checked)}
                      className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-navy-900"
                    />
                    <span className="text-xs leading-relaxed text-charcoal-600">
                      Tôi đồng ý với{" "}
                      <a href="#" className="font-medium text-charcoal-900 underline underline-offset-2">
                        Điều khoản sử dụng
                      </a>{" "}
                      và{" "}
                      <a href="#" className="font-medium text-charcoal-900 underline underline-offset-2">
                        Chính sách bảo mật
                      </a>{" "}
                      của VietLex Law.
                    </span>
                  </label>
                  {errors.consent && (
                    <p className="mt-1 text-xs text-danger-600">{errors.consent}</p>
                  )}
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-pill bg-navy-900 py-4 text-sm font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                      Đang tạo tài khoản...
                    </>
                  ) : (
                    <>
                      Tạo tài khoản
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              {/* Divider */}
              <div className="my-6 flex items-center gap-4 text-xs font-semibold tracking-wide text-charcoal-600">
                <span className="h-px flex-1 bg-neutral-300" />
                HOẶC
                <span className="h-px flex-1 bg-neutral-300" />
              </div>

              {/* Google OAuth placeholder */}
              <button
                type="button"
                className="flex w-full items-center justify-center gap-3 rounded-pill border border-neutral-300 bg-white py-3.5 text-sm font-medium text-charcoal-900 transition-colors hover:bg-neutral-100"
              >
                <GoogleIcon />
                Đăng ký với Google
              </button>
            </>
          )}
        </FadeIn>
      </div>
    </div>
  );
}
