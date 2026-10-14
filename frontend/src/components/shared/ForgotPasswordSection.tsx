"use client";

import { useState, useEffect, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  Lock,
  Mail,
  ShieldCheck,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { cn } from "@/lib/cn";

// Mật khẩu mới: tối thiểu 8 ký tự, có chữ hoa, chữ thường và số
const PASSWORD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

type Step = "email" | "otp" | "reset" | "done";

// ── Bước 1: Nhập email ──────────────────────────────────────────────────────
function StepEmail({
  onNext,
}: {
  onNext: (email: string) => void;
}) {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError("Vui lòng nhập địa chỉ email hợp lệ.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    // Pending backend: POST /api/v1/auth/forgot-password
    await new Promise((r) => setTimeout(r, 1000));
    setIsSubmitting(false);
    onNext(email.trim());
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-900/10">
          <Mail className="h-7 w-7 text-navy-900" />
        </div>
        <h1 className="text-center font-serif text-3xl text-charcoal-900">Quên mật khẩu?</h1>
        <p className="mt-3 text-center text-sm text-charcoal-600">
          Nhập địa chỉ email đã đăng ký. Chúng tôi sẽ gửi mã xác nhận 6 chữ số tới hộp thư của bạn.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
            <input
              id="forgot-email"
              type="email"
              autoComplete="email"
              required
              placeholder="Địa chỉ email của bạn"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              className={cn(
                "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-4 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                error
                  ? "border-danger-600"
                  : "border-neutral-300 focus:border-navy-700 focus:bg-white"
              )}
            />
          </div>
          {error && <p className="mt-1 text-xs text-danger-600">{error}</p>}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-navy-900 py-4 text-sm font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang gửi mã...
            </>
          ) : (
            <>
              Gửi mã xác nhận
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-charcoal-600">
        Nhớ ra rồi?{" "}
        <Link
          href="/login"
          className="font-semibold text-charcoal-900 underline underline-offset-4"
        >
          Quay lại đăng nhập
        </Link>
      </p>
    </div>
  );
}

// ── Bước 2: Nhập OTP ────────────────────────────────────────────────────────
function StepOTP({
  email,
  onNext,
  onBack,
}: {
  email: string;
  onNext: () => void;
  onBack: () => void;
}) {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [countdown, setCountdown] = useState(60);
  const canResend = countdown <= 0;

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  function handleOtpChange(index: number, value: string) {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[index] = value;
    setOtp(next);
    setError("");
    // Auto-focus next input
    if (value && index < 5) {
      const el = document.getElementById(`otp-${index + 1}`);
      el?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      const el = document.getElementById(`otp-${index - 1}`);
      el?.focus();
    }
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const code = otp.join("");
    if (code.length !== 6) {
      setError("Vui lòng nhập đầy đủ mã 6 chữ số.");
      return;
    }
    setError("");
    setIsSubmitting(true);
    // Pending backend: POST /api/v1/auth/verify-otp
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    onNext();
  }

  async function handleResend() {
    setCountdown(60);
    setOtp(["", "", "", "", "", ""]);
    // Pending backend: POST /api/v1/auth/forgot-password (resend)
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-900/10">
          <KeyRound className="h-7 w-7 text-navy-900" />
        </div>
        <h1 className="text-center font-serif text-3xl text-charcoal-900">Nhập mã xác nhận</h1>
        <p className="mt-3 text-center text-sm text-charcoal-600">
          Mã 6 chữ số đã được gửi tới{" "}
          <strong className="text-charcoal-900">{email}</strong>.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        {/* OTP Input Grid */}
        <div className="flex justify-center gap-3">
          {otp.map((digit, i) => (
            <input
              key={i}
              id={`otp-${i}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleOtpChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              className={cn(
                "h-14 w-12 rounded-lg border text-center text-xl font-bold text-charcoal-900 outline-none transition-all",
                digit ? "border-navy-900 bg-navy-900/5 text-navy-900" : "border-neutral-300 bg-neutral-100",
                error ? "border-danger-600" : "focus:border-navy-700 focus:bg-white"
              )}
            />
          ))}
        </div>
        {error && <p className="mt-3 text-center text-xs text-danger-600">{error}</p>}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-pill bg-navy-900 py-4 text-sm font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang xác minh...
            </>
          ) : (
            <>
              Xác nhận mã
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>

      <div className="mt-5 text-center text-sm text-charcoal-600">
        Không nhận được mã?{" "}
        {canResend ? (
          <button
            type="button"
            onClick={handleResend}
            className="font-semibold text-charcoal-900 underline underline-offset-4"
          >
            Gửi lại mã
          </button>
        ) : (
          <span className="text-charcoal-600">
            Gửi lại sau <strong className="tabular-nums text-navy-900">{countdown}s</strong>
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={onBack}
        className="mx-auto mt-4 flex items-center gap-1.5 text-sm text-charcoal-600 hover:text-charcoal-900"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Đổi email
      </button>
    </div>
  );
}

// ── Bước 3: Đặt mật khẩu mới ────────────────────────────────────────────────
function StepReset({ onDone }: { onDone: () => void }) {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [showCf, setShowCf] = useState(false);
  const [errors, setErrors] = useState<{ password?: string; confirm?: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const errs: typeof errors = {};
    if (!password || !PASSWORD_REGEX.test(password)) {
      errs.password = "Mật khẩu cần ít nhất 8 ký tự, có chữ hoa, chữ thường và số.";
    }
    if (password !== confirm) {
      errs.confirm = "Xác nhận mật khẩu không khớp.";
    }
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setIsSubmitting(true);
    // Pending backend: POST /api/v1/auth/reset-password
    await new Promise((r) => setTimeout(r, 900));
    setIsSubmitting(false);
    onDone();
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-navy-900/10">
          <Lock className="h-7 w-7 text-navy-900" />
        </div>
        <h1 className="text-center font-serif text-3xl text-charcoal-900">Đặt mật khẩu mới</h1>
        <p className="mt-3 text-center text-sm text-charcoal-600">
          Mật khẩu mới cần tối thiểu 8 ký tự, gồm chữ hoa, chữ thường và số.
        </p>
      </div>

      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        {/* Mật khẩu mới */}
        <div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
            <input
              id="new-password"
              type={showPw ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Mật khẩu mới"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (errors.password) setErrors((prev) => ({ ...prev, password: undefined }));
              }}
              className={cn(
                "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-12 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                errors.password
                  ? "border-danger-600"
                  : "border-neutral-300 focus:border-navy-700 focus:bg-white"
              )}
            />
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600/60 hover:text-charcoal-900"
              aria-label={showPw ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-xs text-danger-600">{errors.password}</p>
          )}
        </div>

        {/* Xác nhận mật khẩu mới */}
        <div>
          <div className="relative">
            <Lock className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-charcoal-600/50" />
            <input
              id="confirm-new-password"
              type={showCf ? "text" : "password"}
              autoComplete="new-password"
              required
              placeholder="Xác nhận mật khẩu mới"
              value={confirm}
              onChange={(e) => {
                setConfirm(e.target.value);
                if (errors.confirm) setErrors((prev) => ({ ...prev, confirm: undefined }));
              }}
              className={cn(
                "w-full rounded-lg border bg-neutral-100 py-4 pl-11 pr-12 text-sm text-charcoal-900 outline-none transition-colors placeholder:text-charcoal-600/70",
                errors.confirm
                  ? "border-danger-600"
                  : "border-neutral-300 focus:border-navy-700 focus:bg-white"
              )}
            />
            <button
              type="button"
              onClick={() => setShowCf((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-charcoal-600/60 hover:text-charcoal-900"
              aria-label={showCf ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
            >
              {showCf ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {errors.confirm && (
            <p className="mt-1 text-xs text-danger-600">{errors.confirm}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center gap-2 rounded-pill bg-navy-900 py-4 text-sm font-medium text-white transition-colors hover:bg-navy-700 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
              Đang cập nhật...
            </>
          ) : (
            <>
              Cập nhật mật khẩu
              <ArrowRight className="h-4 w-4" />
            </>
          )}
        </button>
      </form>
    </div>
  );
}

// ── Bước 4: Hoàn thành ──────────────────────────────────────────────────────
function StepDone() {
  return (
    <div className="w-full max-w-md text-center">
      <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-600/10">
        <CheckCircle2 className="h-9 w-9 text-success-600" />
      </div>
      <h1 className="mt-5 font-serif text-3xl text-charcoal-900">Đặt lại mật khẩu thành công!</h1>
      <p className="mt-3 text-sm text-charcoal-600">
        Mật khẩu mới của bạn đã được cập nhật. Hãy đăng nhập lại để tiếp tục.
      </p>
      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-2 rounded-pill bg-navy-900 px-8 py-3.5 text-sm font-medium text-white transition-colors hover:bg-navy-700"
      >
        Đến trang Đăng nhập
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}

// ── Stepper indicator ────────────────────────────────────────────────────────
const STEPS = ["Xác minh email", "Nhập mã OTP", "Mật khẩu mới"];

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="mb-10 flex items-center justify-center gap-0">
      {STEPS.map((label, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div
                className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors",
                  done
                    ? "bg-navy-900 text-white"
                    : active
                    ? "border-2 border-navy-900 bg-white text-navy-900"
                    : "border-2 border-neutral-300 bg-white text-charcoal-600"
                )}
              >
                {done ? <CheckCircle2 className="h-4 w-4" /> : i + 1}
              </div>
              <span
                className={cn(
                  "mt-1 hidden text-xs sm:block",
                  active ? "font-semibold text-navy-900" : "text-charcoal-600"
                )}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={cn(
                  "mx-2 mb-4 h-px w-12 sm:w-16 transition-colors",
                  done ? "bg-navy-900" : "bg-neutral-300"
                )}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── Main ForgotPasswordSection ───────────────────────────────────────────────
export function ForgotPasswordSection() {
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");

  const stepIndex = { email: 0, otp: 1, reset: 2, done: 3 }[step];

  return (
    <div className="grid min-h-screen w-full lg:grid-cols-2">
      {/* Left panel — brand visual */}
      <div className="relative hidden overflow-hidden bg-navy-900 lg:block">
        <div className="absolute inset-0 bg-navy-900" />
        {/* Abstract decorative pattern */}
        <div className="absolute inset-0 opacity-10">
          {Array.from({ length: 20 }).map((_, i) => (
            <div
              key={i}
              className="absolute rounded-full border border-white"
              style={{
                width: `${60 + i * 30}px`,
                height: `${60 + i * 30}px`,
                left: "50%",
                top: "50%",
                transform: "translate(-50%, -50%)",
                opacity: 1 - i * 0.045,
              }}
            />
          ))}
        </div>

        <div className="relative flex h-full flex-col items-center justify-center p-12 text-white text-center">
          <FadeIn duration={600}>
            <div className="liquid-glass inline-flex w-fit items-center gap-2 rounded-pill px-4 py-2 text-sm mb-8">
              <ShieldCheck className="h-4 w-4 text-gold-600" />
              <span>Bảo mật tuyệt đối</span>
            </div>
          </FadeIn>
          <h2 className="font-serif text-4xl xl:text-5xl font-normal leading-tight">
            Khôi phục<br />quyền truy cập
          </h2>
          <FadeIn delay={600} duration={800}>
            <p className="mt-4 text-sm leading-relaxed text-neutral-300 max-w-sm">
              Quy trình đặt lại mật khẩu an toàn 2 bước sử dụng mã OTP gửi qua email — không bên thứ ba nào có thể can thiệp.
            </p>
          </FadeIn>
        </div>
      </div>

      {/* Right panel */}
      <div className="relative flex items-center justify-center bg-white px-6 py-14">
        <Link
          href="/login"
          className="absolute left-6 top-6 inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-charcoal-900"
        >
          <ArrowLeft className="h-4 w-4" />
          Về đăng nhập
        </Link>

        <FadeIn duration={700} className="w-full flex flex-col items-center">
          {step !== "done" && <StepIndicator current={stepIndex} />}

          {step === "email" && (
            <StepEmail
              onNext={(e) => {
                setEmail(e);
                setStep("otp");
              }}
            />
          )}
          {step === "otp" && (
            <StepOTP
              email={email}
              onNext={() => setStep("reset")}
              onBack={() => setStep("email")}
            />
          )}
          {step === "reset" && <StepReset onDone={() => setStep("done")} />}
          {step === "done" && <StepDone />}
        </FadeIn>
      </div>
    </div>
  );
}
