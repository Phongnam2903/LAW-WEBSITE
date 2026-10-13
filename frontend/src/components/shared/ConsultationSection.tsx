"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  FileText,
  Lock,
  MapPin,
  Phone,
  Scale,
  Send,
  ShieldCheck,
  Upload,
  User,
  Video,
} from "lucide-react";
import { FadeIn } from "@/components/ui/FadeIn";
import { AnimatedHeading } from "@/components/ui/AnimatedHeading";
import { cn } from "@/lib/cn";

// Danh sách các lĩnh vực pháp lý theo đặc tả Phase 1 & 2
const PRACTICE_AREAS = [
  { id: "corporate", label: "Doanh nghiệp & Đầu tư", icon: "🏢" },
  { id: "dispute", label: "Tranh tụng & Trọng tài", icon: "⚖️" },
  { id: "real_estate", label: "Đất đai & Bất động sản", icon: "🏡" },
  { id: "criminal", label: "Hình sự & Tố tụng", icon: "🛡️" },
  { id: "family", label: "Hôn nhân & Gia đình", icon: "👨‍👩‍👧" },
  { id: "intellectual", label: "Sở hữu trí tuệ", icon: "💡" },
  { id: "labor", label: "Lao động & Việc làm", icon: "💼" },
  { id: "other", label: "Lĩnh vực khác", icon: "📋" },
];

// Hình thức tư vấn
const CONSULTATION_METHODS = [
  {
    id: "office",
    title: "Tại Văn phòng",
    description: "Gặp trực tiếp luật sư tại trụ sở VietLex",
    icon: MapPin,
  },
  {
    id: "online",
    title: "Trực tuyến (Video Call)",
    description: "Tư vấn từ xa qua Google Meet / Zoom bảo mật",
    icon: Video,
  },
  {
    id: "phone",
    title: "Điện thoại khẩn cấp",
    description: "Luật sư gọi lại trực tiếp trao đổi sơ bộ",
    icon: Phone,
  },
];

// Mức độ ưu tiên
const URGENCY_LEVELS = [
  { id: "normal", label: "Tiêu chuẩn", badge: "Phản hồi trong 24h", color: "text-charcoal-600" },
  { id: "high", label: "Ưu tiên cao", badge: "Phản hồi trong 4h", color: "text-warning-600" },
  { id: "emergency", label: "Khẩn cấp 24/7", badge: "Liên hệ ngay lập tức", color: "text-danger-600" },
];

interface FormData {
  fullName: string;
  phone: string;
  email: string;
  practiceArea: string;
  consultationMethod: string;
  urgency: string;
  preferredDate: string;
  preferredTime: string;
  issueDescription: string;
  consent: boolean;
}

export function ConsultationSection() {
  const [formData, setFormData] = useState<FormData>({
    fullName: "",
    phone: "",
    email: "",
    practiceArea: "corporate",
    consultationMethod: "office",
    urgency: "normal",
    preferredDate: "",
    preferredTime: "09:00",
    issueDescription: "",
    consent: false,
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [ticketId, setTicketId] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  function handleChange(
    field: keyof FormData,
    value: string | boolean
  ) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0]);
    }
  }

  function validate(): boolean {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Vui lòng nhập họ và tên của bạn.";
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại liên hệ.";
    } else if (!/^[0-9+\s\-()]{9,15}$/.test(formData.phone.trim())) {
      newErrors.phone = "Số điện thoại không hợp lệ.";
    }

    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      newErrors.email = "Địa chỉ email không đúng định dạng.";
    }

    if (!formData.issueDescription.trim()) {
      newErrors.issueDescription = "Vui lòng mô tả ngắn gọn nội dung vụ việc cần tư vấn.";
    } else if (formData.issueDescription.trim().length < 15) {
      newErrors.issueDescription = "Vui lòng nhập chi tiết hơn (tối thiểu 15 ký tự).";
    }

    if (!formData.consent) {
      newErrors.consent = "Bạn cần xác nhận đồng ý với điều khoản bảo mật thông tin.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    // Giả lập gửi thông tin lead tới backend (FR-LEAD-001)
    await new Promise((resolve) => setTimeout(resolve, 1200));

    // Sinh mã yêu cầu ngẫu nhiên
    const randomId = "VLX-" + new Date().getFullYear() + Math.floor(100000 + Math.random() * 900000);
    setTicketId(randomId);
    setIsSubmitting(false);
    setIsSubmitted(true);
  }

  return (
    <div className="min-h-screen bg-neutral-100 text-charcoal-900">
      {/* Top Navigation */}
      <header className="border-b border-neutral-300 bg-white sticky top-0 z-30 shadow-xs">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium text-charcoal-600 transition-colors hover:text-navy-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Trang chủ</span>
            </Link>
            <span className="text-neutral-300">|</span>
            <span className="font-serif text-xl font-bold tracking-tight text-navy-900">
              VietLex Law
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-charcoal-600">
              <Phone className="h-3.5 w-3.5 text-gold-600" />
              <span>Hotline 24/7: </span>
              <a href="tel:19001234" className="text-navy-900 hover:text-gold-600 font-mono">
                1900 1234
              </a>
            </div>
            <Link
              href="/login"
              className="rounded-lg border border-neutral-300 px-4 py-1.5 text-xs font-medium text-navy-900 transition-colors hover:bg-neutral-100"
            >
              Cổng luật sư
            </Link>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-12">
          {/* Left Panel: Giá trị cốt lõi & Cam kết bảo mật */}
          <div className="lg:col-span-5 flex flex-col justify-between">
            <div className="space-y-6">
              <FadeIn duration={600}>
                <div className="inline-flex items-center gap-2 rounded-pill bg-navy-900/5 px-3 py-1.5 text-xs font-semibold text-navy-900">
                  <Scale className="h-3.5 w-3.5 text-gold-600" />
                  <span>Dịch vụ Tư vấn Pháp lý Trực tiếp & Từ xa</span>
                </div>

                <AnimatedHeading
                  text={"Đặt Lịch Tư Vấn\nVụ Việc Của Bạn"}
                  className="mt-4 font-serif text-3xl font-medium tracking-tight text-navy-900 sm:text-4xl"
                />

                <p className="mt-3 text-sm leading-relaxed text-charcoal-600">
                  Mỗi hồ sơ pháp lý đều cần sự cẩn trọng và chiến lược chính xác ngay từ bước đầu.
                  Đội ngũ luật sư chuyên trách của VietLex sẵn sàng lắng nghe, đánh giá rủi ro và đưa
                  ra giải pháp tối ưu nhất cho bạn.
                </p>
              </FadeIn>

              {/* Cam kết thương hiệu */}
              <FadeIn delay={200} duration={700} className="space-y-4 pt-2">
                <div className="flex gap-3 rounded-xl border border-neutral-300 bg-white p-4 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-600">
                    <Lock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900">Bảo mật tuyệt đối</h2>
                    <p className="mt-0.5 text-xs text-charcoal-600">
                      Mọi thông tin tiếp nhận được bảo vệ bởi đặc quyền bảo mật luật sư - thân chủ theo Luật Luật sư Việt Nam.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-neutral-300 bg-white p-4 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-600">
                    <Clock className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900">Phản hồi nhanh chóng</h2>
                    <p className="mt-0.5 text-xs text-charcoal-600">
                      Luật sư chuyên môn trong lĩnh vực tương ứng sẽ liên hệ xác nhận và chuẩn bị nội dung trong vòng 2 - 4 giờ làm việc.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-xl border border-neutral-300 bg-white p-4 shadow-xs">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-navy-900 text-gold-600">
                    <ShieldCheck className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-sm font-semibold text-navy-900">Đánh giá khách quan & Minh bạch</h2>
                    <p className="mt-0.5 text-xs text-charcoal-600">
                      Phân tích rõ cơ hội pháp lý, khả năng giải quyết và chi phí minh bạch trước khi ký hợp đồng dịch vụ.
                    </p>
                  </div>
                </div>
              </FadeIn>
            </div>

            {/* Thông tin văn phòng & hỗ trợ */}
            <FadeIn delay={400} duration={800} className="mt-8 rounded-xl bg-navy-900 p-6 text-white">
              <h2 className="text-sm font-semibold tracking-wide text-gold-600 uppercase">
                Trụ sở văn phòng chính
              </h2>
              <div className="mt-3 space-y-2 text-xs text-neutral-300">
                <p className="flex items-center gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-gold-600" />
                  <span>Tầng 18, Tòa nhà VietLex Center, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh</span>
                </p>
                <p className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-gold-600" />
                  <span>Điện thoại: (028) 3822 9999 | Hotline: 1900 1234</span>
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 shrink-0 text-gold-600" />
                  <span>Thứ Hai - Thứ Bảy: 08:00 - 17:30 (Trực cấp cứu pháp lý 24/7)</span>
                </p>
              </div>
            </FadeIn>
          </div>

          {/* Right Panel: Form đặt lịch tư vấn tương tác */}
          <div className="lg:col-span-7">
            <FadeIn delay={150} duration={700}>
              <div className="rounded-2xl border border-neutral-300 bg-white p-6 shadow-sm sm:p-8">
                {isSubmitted ? (
                  /* Màn hình thành công */
                  <div className="py-8 text-center">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-600/10 text-success-600">
                      <CheckCircle2 className="h-10 w-10" />
                    </div>

                    <h2 className="mt-5 font-serif text-2xl font-semibold text-navy-900">
                      Tiếp Nhận Hồ Sơ Thành Công!
                    </h2>
                    <p className="mt-2 text-sm text-charcoal-600">
                      Yêu cầu tư vấn của Quý khách đã được chuyển tới Ban Thư ký & Luật sư chuyên trách.
                    </p>

                    <div className="mx-auto mt-6 max-w-md rounded-xl border border-neutral-300 bg-neutral-100 p-4 text-left">
                      <div className="flex items-center justify-between border-b border-neutral-300/60 pb-3">
                        <span className="text-xs text-charcoal-600">Mã phiếu tiếp nhận:</span>
                        <span className="font-mono text-sm font-bold text-navy-900">{ticketId}</span>
                      </div>
                      <div className="space-y-1.5 pt-3 text-xs text-charcoal-600">
                        <p>
                          <strong className="text-navy-900">Họ tên:</strong> {formData.fullName}
                        </p>
                        <p>
                          <strong className="text-navy-900">Số điện thoại:</strong> {formData.phone}
                        </p>
                        <p>
                          <strong className="text-navy-900">Lĩnh vực:</strong>{" "}
                          {PRACTICE_AREAS.find((p) => p.id === formData.practiceArea)?.label}
                        </p>
                        <p>
                          <strong className="text-navy-900">Hình thức:</strong>{" "}
                          {CONSULTATION_METHODS.find((m) => m.id === formData.consultationMethod)?.title}
                        </p>
                        {formData.preferredDate && (
                          <p>
                            <strong className="text-navy-900">Thời gian hẹn:</strong>{" "}
                            {formData.preferredDate} ({formData.preferredTime})
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-8 flex flex-wrap justify-center gap-4">
                      <button
                        type="button"
                        onClick={() => {
                          setIsSubmitted(false);
                          setFormData({
                            fullName: "",
                            phone: "",
                            email: "",
                            practiceArea: "corporate",
                            consultationMethod: "office",
                            urgency: "normal",
                            preferredDate: "",
                            preferredTime: "09:00",
                            issueDescription: "",
                            consent: false,
                          });
                          setSelectedFile(null);
                        }}
                        className="rounded-lg border border-neutral-300 px-6 py-2.5 text-xs font-semibold text-navy-900 transition-colors hover:bg-neutral-100"
                      >
                        Đặt lịch mới
                      </button>
                      <Link
                        href="/"
                        className="rounded-lg bg-navy-900 px-6 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-navy-700"
                      >
                        Quay về Trang chủ
                      </Link>
                    </div>
                  </div>
                ) : (
                  /* Form thu thập thông tin Lead */
                  <form onSubmit={handleSubmit} noValidate className="space-y-6">
                    <div>
                      <h2 className="font-serif text-xl font-semibold text-navy-900">
                        Thông tin Đăng ký Tư vấn
                      </h2>
                      <p className="mt-1 text-xs text-charcoal-600">
                        Vui lòng cung cấp thông tin trung thực để luật sư có thể chuẩn bị nghiên cứu hồ sơ chu đáo nhất.
                      </p>
                    </div>

                    {/* Bước 1: Thông tin liên lạc */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-300 pb-2 text-xs font-bold uppercase tracking-wider text-navy-900">
                        <User className="h-4 w-4 text-gold-600" />
                        <span>1. Người yêu cầu tư vấn</span>
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-navy-900">
                            Họ và tên <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="text"
                            required
                            placeholder="Nguyễn Văn A"
                            value={formData.fullName}
                            onChange={(e) => handleChange("fullName", e.target.value)}
                            className={cn(
                              "mt-1.5 w-full rounded-lg border bg-neutral-100 px-3.5 py-2.5 text-xs text-charcoal-900 outline-none transition-colors focus:bg-white",
                              errors.fullName ? "border-danger-600" : "border-neutral-300 focus:border-navy-700"
                            )}
                          />
                          {errors.fullName && (
                            <p className="mt-1 text-2xs text-danger-600">{errors.fullName}</p>
                          )}
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-navy-900">
                            Số điện thoại <span className="text-danger-600">*</span>
                          </label>
                          <input
                            type="tel"
                            required
                            placeholder="0912 345 678"
                            value={formData.phone}
                            onChange={(e) => handleChange("phone", e.target.value)}
                            className={cn(
                              "mt-1.5 w-full rounded-lg border bg-neutral-100 px-3.5 py-2.5 text-xs text-charcoal-900 outline-none transition-colors focus:bg-white",
                              errors.phone ? "border-danger-600" : "border-neutral-300 focus:border-navy-700"
                            )}
                          />
                          {errors.phone && (
                            <p className="mt-1 text-2xs text-danger-600">{errors.phone}</p>
                          )}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-navy-900">
                          Địa chỉ Email <span className="text-charcoal-600 text-2xs font-normal">(để nhận văn bản/trích yếu tư vấn)</span>
                        </label>
                        <input
                          type="email"
                          placeholder="nguyenvana@example.com"
                          value={formData.email}
                          onChange={(e) => handleChange("email", e.target.value)}
                          className={cn(
                            "mt-1.5 w-full rounded-lg border bg-neutral-100 px-3.5 py-2.5 text-xs text-charcoal-900 outline-none transition-colors focus:bg-white",
                            errors.email ? "border-danger-600" : "border-neutral-300 focus:border-navy-700"
                          )}
                        />
                        {errors.email && (
                          <p className="mt-1 text-2xs text-danger-600">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    {/* Bước 2: Lĩnh vực vụ việc & Mức độ ưu tiên */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-300 pb-2 text-xs font-bold uppercase tracking-wider text-navy-900">
                        <Scale className="h-4 w-4 text-gold-600" />
                        <span>2. Lĩnh vực & Mức độ khẩn cấp</span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-navy-900 mb-2">
                          Chọn lĩnh vực vụ việc liên quan
                        </label>
                        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
                          {PRACTICE_AREAS.map((area) => {
                            const isSelected = formData.practiceArea === area.id;
                            return (
                              <button
                                key={area.id}
                                type="button"
                                onClick={() => handleChange("practiceArea", area.id)}
                                className={cn(
                                  "flex flex-col items-start rounded-lg border p-2.5 text-left transition-all",
                                  isSelected
                                    ? "border-navy-900 bg-navy-900 text-white shadow-xs"
                                    : "border-neutral-300 bg-neutral-100/60 text-charcoal-900 hover:border-neutral-300 hover:bg-neutral-100"
                                )}
                              >
                                <span className="text-base">{area.icon}</span>
                                <span className="mt-1.5 text-xs font-medium leading-tight">
                                  {area.label}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-navy-900 mb-1.5">
                          Mức độ ưu tiên / Thời gian xử lý mong muốn
                        </label>
                        <div className="grid gap-2 sm:grid-cols-3">
                          {URGENCY_LEVELS.map((u) => {
                            const isSelected = formData.urgency === u.id;
                            return (
                              <button
                                key={u.id}
                                type="button"
                                onClick={() => handleChange("urgency", u.id)}
                                className={cn(
                                  "rounded-lg border px-3 py-2 text-left transition-all",
                                  isSelected
                                    ? "border-navy-900 bg-navy-900/5 ring-1 ring-navy-900"
                                    : "border-neutral-300 bg-white hover:bg-neutral-100/50"
                                )}
                              >
                                <div className="text-xs font-semibold text-navy-900">{u.label}</div>
                                <div className={cn("text-2xs font-medium", u.color)}>{u.badge}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Bước 3: Hình thức & Lịch hẹn */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-300 pb-2 text-xs font-bold uppercase tracking-wider text-navy-900">
                        <Calendar className="h-4 w-4 text-gold-600" />
                        <span>3. Hình thức làm việc & Thời gian hẹn</span>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-3">
                        {CONSULTATION_METHODS.map((method) => {
                          const Icon = method.icon;
                          const isSelected = formData.consultationMethod === method.id;
                          return (
                            <button
                              key={method.id}
                              type="button"
                              onClick={() => handleChange("consultationMethod", method.id)}
                              className={cn(
                                "flex flex-col rounded-lg border p-3 text-left transition-all",
                                isSelected
                                  ? "border-navy-900 bg-navy-900 text-white"
                                  : "border-neutral-300 bg-white text-charcoal-900 hover:bg-neutral-100/60"
                              )}
                            >
                              <Icon className={cn("h-4 w-4", isSelected ? "text-gold-600" : "text-navy-900")} />
                              <span className="mt-2 text-xs font-semibold">{method.title}</span>
                              <span
                                className={cn(
                                  "mt-0.5 text-2xs leading-snug",
                                  isSelected ? "text-neutral-300" : "text-charcoal-600"
                                )}
                              >
                                {method.description}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      <div className="grid gap-4 sm:grid-cols-2">
                        <div>
                          <label className="block text-xs font-medium text-navy-900">
                            Ngày hẹn mong muốn (tùy chọn)
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={formData.preferredDate}
                            onChange={(e) => handleChange("preferredDate", e.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3.5 py-2 text-xs text-charcoal-900 outline-none focus:border-navy-700 focus:bg-white"
                          />
                        </div>

                        <div>
                          <label className="block text-xs font-medium text-navy-900">
                            Khung giờ mong muốn
                          </label>
                          <select
                            value={formData.preferredTime}
                            onChange={(e) => handleChange("preferredTime", e.target.value)}
                            className="mt-1.5 w-full rounded-lg border border-neutral-300 bg-neutral-100 px-3.5 py-2 text-xs text-charcoal-900 outline-none focus:border-navy-700 focus:bg-white"
                          >
                            <option value="08:30">Buổi sáng: 08:30 - 10:00</option>
                            <option value="10:00">Buổi sáng: 10:00 - 11:30</option>
                            <option value="14:00">Buổi chiều: 14:00 - 15:30</option>
                            <option value="16:00">Buổi chiều: 16:00 - 17:30</option>
                            <option value="flexible">Linh hoạt theo lịch luật sư</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Bước 4: Nội dung vụ việc & Đính kèm */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 border-b border-neutral-300 pb-2 text-xs font-bold uppercase tracking-wider text-navy-900">
                        <FileText className="h-4 w-4 text-gold-600" />
                        <span>4. Mô tả vụ việc & Hồ sơ sơ bộ</span>
                      </div>

                      <div>
                        <label className="block text-xs font-medium text-navy-900">
                          Tóm tắt nội dung câu hỏi / Tình trạng pháp lý vụ việc{" "}
                          <span className="text-danger-600">*</span>
                        </label>
                        <textarea
                          rows={4}
                          required
                          placeholder="Vui lòng cung cấp tóm tắt: Bối cảnh sự việc, các bên liên quan, tình trạng tranh chấp hiện tại và mục tiêu mong muốn đạt được..."
                          value={formData.issueDescription}
                          onChange={(e) => handleChange("issueDescription", e.target.value)}
                          className={cn(
                            "mt-1.5 w-full rounded-lg border bg-neutral-100 p-3.5 text-xs text-charcoal-900 outline-none transition-colors focus:bg-white",
                            errors.issueDescription
                              ? "border-danger-600"
                              : "border-neutral-300 focus:border-navy-700"
                          )}
                        />
                        {errors.issueDescription && (
                          <p className="mt-1 text-2xs text-danger-600">{errors.issueDescription}</p>
                        )}
                      </div>

                      {/* File upload zone */}
                      <div>
                        <label className="block text-xs font-medium text-navy-900 mb-1.5">
                          Đính kèm tài liệu sơ bộ (Hợp đồng, đơn thư, thông báo...)
                        </label>
                        <label className="flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-neutral-300 bg-neutral-100/50 p-4 transition-colors hover:border-navy-700 hover:bg-neutral-100">
                          <Upload className="h-6 w-6 text-charcoal-600" />
                          <span className="mt-1.5 text-xs font-medium text-navy-900">
                            {selectedFile ? selectedFile.name : "Nhấn để chọn tệp hoặc kéo thả tệp vào đây"}
                          </span>
                          <span className="mt-0.5 text-2xs text-charcoal-600">
                            {selectedFile
                              ? `${(selectedFile.size / 1024 / 1024).toFixed(2)} MB`
                              : "Hỗ trợ PDF, DOCX, JPG, PNG (tối đa 25MB)"}
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            accept=".pdf,.docx,.doc,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Điều khoản & Cam kết bảo mật */}
                    <div className="pt-2">
                      <label className="flex items-start gap-2.5 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={formData.consent}
                          onChange={(e) => handleChange("consent", e.target.checked)}
                          className="mt-0.5 h-4 w-4 rounded border-neutral-300 text-navy-900 focus:ring-navy-700"
                        />
                        <span className="text-xs leading-relaxed text-charcoal-600">
                          Tôi cam kết các thông tin cung cấp trên là đúng sự thật và đồng ý để VietLex Law
                          liên hệ hỗ trợ tư vấn theo{" "}
                          <a href="#" className="font-medium text-navy-900 underline hover:text-gold-600">
                            Chính sách bảo mật quyền riêng tư
                          </a>
                          .
                        </span>
                      </label>
                      {errors.consent && (
                        <p className="mt-1 text-2xs text-danger-600">{errors.consent}</p>
                      )}
                    </div>

                    {/* Nút gửi form */}
                    <div className="pt-4">
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-navy-900 px-6 py-3.5 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-navy-700 active:scale-[0.99] disabled:opacity-50"
                      >
                        {isSubmitting ? (
                          <>
                            <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            <span>Đang mã hóa & gửi thông tin...</span>
                          </>
                        ) : (
                          <>
                            <Send className="h-4 w-4 text-gold-600" />
                            <span>Gửi yêu cầu tư vấn bảo mật</span>
                          </>
                        )}
                      </button>

                      <p className="mt-2.5 text-center text-2xs text-charcoal-600 flex items-center justify-center gap-1.5">
                        <Lock className="h-3 w-3 text-gold-600" />
                        <span>Hệ thống bảo vệ dữ liệu đạt chuẩn mã hóa AES-256 SSL.</span>
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </FadeIn>
          </div>
        </div>
      </main>
    </div>
  );
}
