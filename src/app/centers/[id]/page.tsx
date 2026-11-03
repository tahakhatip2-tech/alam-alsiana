"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { MaintenanceCenter, INITIAL_MAINTENANCE_CENTERS } from "@/lib/centers-data";
import {
  Wrench,
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  MessageSquare,
  ArrowRight,
  Navigation,
  Send,
  Loader2,
  CheckCircle2,
  Sparkles,
  Smartphone,
  Cpu,
  Layers,
  Check,
  Calendar,
  AlertCircle,
  Share2,
  Package,
} from "lucide-react";

export default function CenterDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const centerId = params?.id as string;

  const [center, setCenter] = useState<MaintenanceCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [copySuccess, setCopySuccess] = useState(false);

  // Booking Form State
  const [deviceModel, setDeviceModel] = useState("");
  const [selectedService, setSelectedService] = useState("");
  const [faultDesc, setFaultDesc] = useState("");
  const [imei, setImei] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [clientNotes, setClientNotes] = useState("");
  const [submittingBooking, setSubmittingBooking] = useState(false);
  const [bookingSuccess, setBookingSuccess] = useState(false);

  useEffect(() => {
    if (!centerId) return;

    const fetchCenter = async () => {
      try {
        const res = await fetch(`/api/centers/${centerId}`);
        const json = await res.json();
        if (json.success && json.data) {
          setCenter(json.data);
        } else {
          const fallback = INITIAL_MAINTENANCE_CENTERS.find((c) => c.id === centerId);
          setCenter(fallback || null);
        }
      } catch {
        const fallback = INITIAL_MAINTENANCE_CENTERS.find((c) => c.id === centerId);
        setCenter(fallback || null);
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [centerId]);

  const handleStartChat = async () => {
    if (!center) return;
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "start",
          itemId: center.id,
          itemTitle: `طلب صيانة واستفسار - ${center.name}`,
          itemPrice: 0,
          itemImage: center.logo,
          itemCity: center.city,
        }),
      });
      const data = await res.json();
      if (data.chatId) {
        router.push(`/chat?active=${data.chatId}`);
      } else {
        router.push("/chat");
      }
    } catch {
      router.push("/chat");
    }
  };

  const handleShare = () => {
    if (typeof window !== "undefined") {
      navigator.clipboard.writeText(window.location.href);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2500);
    }
  };

  const handleSelectServiceForBooking = (serviceTitle: string) => {
    setSelectedService(serviceTitle);
    const formElement = document.getElementById("booking-section");
    if (formElement) {
      formElement.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleSubmitBooking = (e: React.FormEvent) => {
    e.preventDefault();
    if (!center || !deviceModel.trim()) return;

    setSubmittingBooking(true);

    const waMessage =
      `*طلب صيانة وفحص جهاز جديد*\n` +
      `━━━━━━━━━━━━━━━━━\n` +
      `*المركز:* ${center.name}\n` +
      `*المهندس المشرف:* ${center.ownerName}\n` +
      `*نوع وموديل الجهاز:* ${deviceModel.trim()}\n` +
      (selectedService ? `*الخدمة المطلوبة:* ${selectedService}\n` : "") +
      (faultDesc.trim() ? `*وصف العطل:* ${faultDesc.trim()}\n` : "") +
      (imei.trim() ? `*رقم الـ IMEI:* ${imei.trim()}\n` : "") +
      (clientPhone.trim() ? `*هاتف العميل:* ${clientPhone.trim()}\n` : "") +
      (clientNotes.trim() ? `*ملاحظات:* ${clientNotes.trim()}\n` : "") +
      `━━━━━━━━━━━━━━━━━\n` +
      `_تم إرسال هذا الطلب الموثق عبر تطبيق عالم الصيانة_`;

    const waUrl = `https://wa.me/962${center.whatsapp.replace(/^0/, "")}?text=${encodeURIComponent(waMessage)}`;

    setTimeout(() => {
      setSubmittingBooking(false);
      setBookingSuccess(true);
      window.open(waUrl, "_blank");
    }, 400);
  };

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <Loader2 className="w-10 h-10 animate-spin text-[#FFC400]" />
        <p className="text-neutral-400 font-bold text-sm">جارِ تحميل بيانات ورشة الصيانة...</p>
      </div>
    );
  }

  if (!center) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-20 h-20 rounded-3xl bg-neutral-900 border border-neutral-800 flex items-center justify-center mx-auto text-neutral-500">
          <AlertCircle className="w-10 h-10 text-rose-500" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-black text-white">مركز الصيانة غير موجود أو تم إيقافه</h1>
          <p className="text-neutral-400 text-sm">تأكد من صحة الرابط أو تصفح باقي الورش المعتمدة في الأردن.</p>
        </div>
        <Link
          href="/centers"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-black text-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع إلى دليل المراكز</span>
        </Link>
      </div>
    );
  }

  const defaultWaText = encodeURIComponent(
    `مرحباً ${center.name} (${center.ownerName})، أود الاستفسار عن فحص وصيانة جهاز لدي عبر تطبيق عالم الصيانة.`
  );

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-8 flex-1 w-full pb-28">
      {/* ── Breadcrumb & Navigation Bar ── */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <Link
          href="/centers"
          className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-neutral-400 hover:text-[#FFC400] transition-colors"
        >
          <ArrowRight className="w-4 h-4" />
          <span>العودة إلى دليل مراكز الصيانة</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="px-3.5 py-1.5 rounded-xl border border-neutral-800 bg-[#161616] hover:border-[#FFC400] text-neutral-300 hover:text-[#FFC400] text-xs font-bold flex items-center gap-1.5 transition-all"
            title="مشاركة رابط المركز"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{copySuccess ? "تم نسخ الرابط!" : "مشاركة"}</span>
          </button>

          <span className="text-[11px] px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>مركز معتمد</span>
          </span>
        </div>
      </div>

      {/* ── Hero Showcase Section ── */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-[#181818] via-[#111111] to-[#0A0A0A] border border-[#2B2B2B] shadow-2xl">
        {/* Cover Background */}
        <div className="relative h-56 sm:h-80 w-full overflow-hidden bg-neutral-900">
          <img
            src={center.coverImage || "/centers/gardens-cover.jpg"}
            alt={center.name}
            className="w-full h-full object-cover filter brightness-70"
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/centers/gardens-cover.jpg";
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0E0E0E] via-black/40 to-black/60" />

          {/* Top Badges */}
          <div className="absolute top-4 right-4 flex items-center gap-2 flex-wrap">
            <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-[#FFC400]/50 text-[#FFC400] text-xs font-black flex items-center gap-1.5 shadow-lg">
              <ShieldCheck className="w-4 h-4" />
              <span>معتمد PRO</span>
            </span>

            {center.isOpenNow ? (
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-emerald-500/50 text-emerald-400 text-xs font-bold flex items-center gap-1.5 shadow-lg">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>مفتوح الآن ({center.workingHours})</span>
              </span>
            ) : (
              <span className="px-3 py-1 rounded-full bg-black/80 backdrop-blur-md border border-neutral-700 text-neutral-400 text-xs font-bold shadow-lg flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5" />
                <span>مغلق حالياً ({center.workingHours})</span>
              </span>
            )}
          </div>

          {/* Top Rating */}
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-amber-400/50 text-amber-300 text-xs font-mono font-bold flex items-center gap-1.5 shadow-lg">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-black">{center.rating}</span>
              <span className="text-neutral-400 text-[10px]">({center.reviewCount} مراجعة موثقة)</span>
            </span>
          </div>
        </div>

        {/* Hero Identity & Quick Actions Bar */}
        <div className="px-5 sm:px-8 pb-8 pt-4 -mt-16 sm:-mt-20 relative z-10 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            {/* Logo and Titles */}
            <div className="flex items-end gap-4 sm:gap-6">
              <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl overflow-hidden border-4 border-[#FFC400] bg-black shadow-[0_10px_35px_rgba(255,196,0,0.3)] shrink-0">
                <img
                  src={center.logo || "/centers/gardens-logo.jpg"}
                  alt={center.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = "/centers/gardens-logo.jpg";
                  }}
                />
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-400">
                  <MapPin className="w-3.5 h-3.5 text-[#FFC400]" />
                  <span>{center.city} • {center.area}</span>
                </div>
                <h1 className="text-xl sm:text-3xl font-black text-white leading-tight">
                  {center.name}
                </h1>
                <p className="text-xs sm:text-sm text-neutral-300 font-semibold flex items-center gap-1.5">
                  <span>بإشراف المهندس:</span>
                  <span className="text-[#FFC400] font-bold">{center.ownerName}</span>
                  <span className="text-neutral-500 font-normal">({center.leadTechTitle})</span>
                </p>
              </div>
            </div>

            {/* Hero Fast Action Buttons */}
            <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
              <button
                onClick={() => {
                  const el = document.getElementById("booking-section");
                  el?.scrollIntoView({ behavior: "smooth" });
                }}
                className="px-5 py-3 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/15 hover:bg-[#FFC400] hover:text-black font-black text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] hover:scale-105 active:scale-95"
              >
                <Wrench className="w-4 h-4" />
                <span>حجز موعد صيانة</span>
              </button>

              <button
                onClick={handleStartChat}
                className="px-4 py-3 rounded-2xl border-2 border-neutral-700 hover:border-[#FFC400] text-neutral-200 hover:text-[#FFC400] bg-neutral-900/80 font-bold text-xs sm:text-sm flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4 text-[#FFC400]" />
                <span>دردشة فورية</span>
              </button>

              <a
                href={`https://wa.me/962${center.whatsapp.replace(/^0/, "")}?text=${defaultWaText}`}
                target="_blank"
                rel="noreferrer"
                className="px-4 py-3 rounded-2xl border-2 border-emerald-500 text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500 hover:text-black font-bold text-xs sm:text-sm flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(16,185,129,0.2)]"
              >
                <MessageCircle className="w-4 h-4" />
                <span>واتساب</span>
              </a>

              <a
                href={`tel:${center.phone}`}
                className="p-3 rounded-2xl border-2 border-neutral-700 text-neutral-300 hover:border-blue-400 hover:text-blue-400 bg-neutral-900/80 font-bold flex items-center justify-center transition-all"
                title="اتصال هاتفي"
              >
                <Phone className="w-4 h-4" />
              </a>

              {center.googleMapsUrl && (
                <a
                  href={center.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 rounded-2xl border-2 border-neutral-700 text-neutral-300 hover:border-amber-400 hover:text-amber-400 bg-neutral-900/80 font-bold flex items-center justify-center transition-all"
                  title="الموقع على خرائط جوجل"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ── Main Two-Column Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* ── Right Column: Rich Info & Services (2 cols) ── */}
        <div className="lg:col-span-2 space-y-8">
          {/* 1. About and Bio */}
          <section className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#FFC400] font-black text-sm">
              <Sparkles className="w-4 h-4" />
              <h2>نبذة عن المركز والمهندس المشرف</h2>
            </div>
            <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-line font-medium">
              {center.bio}
            </p>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-3 border-t border-neutral-800/80">
              <div className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
                <span className="text-[10px] text-neutral-400 block font-bold">المدينة والمنطقة</span>
                <span className="text-xs font-black text-white">{center.city}</span>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
                <span className="text-[10px] text-neutral-400 block font-bold">ساعات العمل</span>
                <span className="text-xs font-bold text-white">{center.workingHours}</span>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
                <span className="text-[10px] text-neutral-400 block font-bold">التقييم العام</span>
                <span className="text-xs font-mono font-black text-amber-400">{center.rating} ★ ممتاز</span>
              </div>
              <div className="bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
                <span className="text-[10px] text-neutral-400 block font-bold">بوردات تشليح متاحة</span>
                <span className="text-xs font-mono font-black text-emerald-400">{center.availableStockSnippet.boardsCount} بوردة</span>
              </div>
            </div>
          </section>

          {/* 2. Micro-soldering Specialties */}
          <section className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FFC400] font-black text-sm">
                <Cpu className="w-4 h-4" />
                <h2>التخصصات الدقيقة والخبرات</h2>
              </div>
              <span className="text-[11px] text-neutral-400 font-bold">
                {center.specialties.length} تخصصات معتمدة
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {center.specialties.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-gradient-to-r from-neutral-900 to-black border border-neutral-800 flex items-center gap-3 hover:border-[#FFC400]/40 transition-colors"
                >
                  <div className="w-8 h-8 rounded-xl bg-[#FFC400]/10 border border-[#FFC400]/30 text-[#FFC400] flex items-center justify-center shrink-0">
                    <Wrench className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-white text-xs">{spec}</h3>
                    <p className="text-[10px] text-neutral-400">فحص مخبري احترافي وكفالة تشغيلية</p>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 3. Services & Pricing Catalog */}
          <section className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-7 space-y-5 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FFC400] font-black text-sm">
                <Layers className="w-4 h-4" />
                <h2>خدمات وأسعار الصيانة المعتمدة ({center.services.length})</h2>
              </div>
              <span className="text-[11px] text-emerald-400 font-mono font-bold bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/20">
                أسعار دينار أردني (JOD)
              </span>
            </div>

            <div className="space-y-3">
              {center.services.map((srv, idx) => (
                <div
                  key={idx}
                  className="p-4 rounded-2xl bg-[#171717] border border-neutral-800 hover:border-[#FFC400]/50 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="space-y-1 max-w-lg">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#FFC400]" />
                      <h3 className="font-bold text-white text-sm group-hover:text-[#FFC400] transition-colors">
                        {srv.title}
                      </h3>
                    </div>
                    <p className="text-neutral-400 text-xs leading-relaxed pr-4">
                      {srv.description}
                    </p>
                    {srv.estimatedTime && (
                      <span className="inline-flex items-center gap-1 text-[11px] text-neutral-500 font-bold pr-4">
                        <Clock className="w-3 h-3 text-[#FFC400]" />
                        <span>وقت الإنجاز المتوقع: {srv.estimatedTime}</span>
                      </span>
                    )}
                  </div>

                  <div className="flex items-center sm:flex-col items-end justify-between sm:justify-center gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-neutral-800">
                    {srv.priceStartingFrom ? (
                      <div className="text-right">
                        <span className="text-[10px] text-neutral-400 block font-bold">يبدأ من</span>
                        <span className="text-base font-black text-emerald-400 font-mono">
                          {srv.priceStartingFrom} د.أ
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-neutral-400 font-bold">حسب الفحص</span>
                    )}

                    <button
                      onClick={() => handleSelectServiceForBooking(srv.title)}
                      className="px-3.5 py-1.5 rounded-xl border border-[#FFC400] text-[#FFC400] bg-[#FFC400]/10 hover:bg-[#FFC400] hover:text-black font-bold text-xs transition-all shadow-[0_0_10px_rgba(255,196,0,0.15)] flex items-center gap-1"
                    >
                      <span>طلب الخدمة</span>
                      <ArrowRight className="w-3 h-3 rotate-180" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* 4. Guarantees & Features Checklist */}
          <section className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 text-[#FFC400] font-black text-sm">
              <ShieldCheck className="w-4 h-4" />
              <h2>ضمانات ومزايا الورشة للعميل</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {center.features.map((feat, idx) => (
                <div
                  key={idx}
                  className="p-3.5 rounded-2xl bg-neutral-900/60 border border-neutral-800 flex items-center gap-2.5 text-xs text-neutral-200 font-bold"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </div>
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          </section>

          {/* 5. Spare Parts & Market Donor Boards */}
          <section className="bg-[#121212] border border-[#262626] rounded-3xl p-6 sm:p-7 space-y-4 shadow-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#FFC400] font-black text-sm">
                <Package className="w-4 h-4" />
                <h2>قطع الغيار وبوردات التشليح المتوفرة بالورشة</h2>
              </div>
              <Link
                href="/market"
                className="text-xs text-[#FFC400] hover:underline font-bold flex items-center gap-1"
              >
                <span>تصفح كل السوق</span>
                <ArrowRight className="w-3 h-3 rotate-180" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400 font-bold block">بوردات تشليح جاهزة لنقل الآيسيات</span>
                <span className="text-2xl font-black text-[#FFC400] font-mono">
                  {center.availableStockSnippet.boardsCount} بوردة
                </span>
                <p className="text-[11px] text-neutral-500">متوفرة للتسليم الفوري أو نقل القطع داخل المركز</p>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-neutral-800 space-y-1">
                <span className="text-xs text-neutral-400 font-bold block">هواتف مفحوصة معروضة للبيع</span>
                <span className="text-2xl font-black text-emerald-400 font-mono">
                  {center.availableStockSnippet.phonesForSaleCount} أجهزة
                </span>
                <p className="text-[11px] text-neutral-500">مفحوصة بكفالة ورشة وتوثيق IMEI</p>
              </div>
            </div>
          </section>
        </div>

        {/* ── Left Column: Sticky Repair Request Form & Contact (1 col) ── */}
        <div className="space-y-6 lg:sticky lg:top-24">
          {/* Repair Booking Form */}
          <div
            id="booking-section"
            className="bg-[#121212] border-2 border-[#FFC400]/40 rounded-3xl p-6 shadow-2xl space-y-5"
          >
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 text-xs text-[#FFC400] font-black">
                <Wrench className="w-4 h-4" />
                <span>حجز موعد صيانة فوري</span>
              </div>
              <h2 className="text-lg font-black text-white">طلب فحص وصيانة جهازك</h2>
              <p className="text-xs text-neutral-400">
                أدخل بيانات جهازك ليصل إشعار فوري للمهندس عبر واتساب والنظام.
              </p>
            </div>

            {bookingSuccess && (
              <div className="p-3.5 rounded-2xl bg-emerald-500/15 border border-emerald-500 text-emerald-400 text-xs font-bold flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>تم إعداد طلبك وفتح محادثة الواتساب مع المركز بنجاح!</span>
              </div>
            )}

            <form onSubmit={handleSubmitBooking} className="space-y-3.5">
              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  نوع وموديل الجهاز <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Smartphone className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    required
                    value={deviceModel}
                    onChange={(e) => setDeviceModel(e.target.value)}
                    placeholder="مثال: iPhone 14 Pro Max / S23 Ultra"
                    className="w-full bg-[#181818] border border-neutral-800 focus:border-[#FFC400] rounded-xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>

              {selectedService && (
                <div>
                  <label className="block text-xs font-bold text-neutral-300 mb-1">
                    الخدمة المحددة:
                  </label>
                  <div className="flex items-center justify-between p-2 rounded-xl bg-[#1C1C1C] border border-[#FFC400]/40 text-xs text-[#FFC400] font-bold">
                    <span>{selectedService}</span>
                    <button
                      type="button"
                      onClick={() => setSelectedService("")}
                      className="text-neutral-500 hover:text-white text-xs px-1"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  وصف العطل أو المشكلة <span className="text-rose-500">*</span>
                </label>
                <textarea
                  required
                  rows={2}
                  value={faultDesc}
                  onChange={(e) => setFaultDesc(e.target.value)}
                  placeholder="مثال: الجهاز طافي تماماً بعد السقوط، شورت باور، أو الشاشة مكسورة وبحاجة باغة..."
                  className="w-full bg-[#181818] border border-neutral-800 focus:border-[#FFC400] rounded-xl p-3 text-xs text-white placeholder-neutral-500 outline-none transition-colors resize-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  رقم هاتف للتواصل
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-neutral-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="tel"
                    value={clientPhone}
                    onChange={(e) => setClientPhone(e.target.value)}
                    placeholder="07XXXXXXXX"
                    className="w-full bg-[#181818] border border-neutral-800 focus:border-[#FFC400] rounded-xl pr-9 pl-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-neutral-300 mb-1">
                  رقم السيريال أو IMEI <span className="text-neutral-500 text-[10px]">(اختياري)</span>
                </label>
                <input
                  type="text"
                  value={imei}
                  onChange={(e) => setImei(e.target.value)}
                  placeholder="15 رقم لتتبع الجهاز في الخزنة"
                  className="w-full bg-[#181818] border border-neutral-800 focus:border-[#FFC400] rounded-xl px-3 py-2.5 text-xs text-white placeholder-neutral-500 outline-none transition-colors"
                />
              </div>

              <button
                type="submit"
                disabled={submittingBooking || !deviceModel.trim()}
                className="w-full py-3 rounded-2xl border-2 border-[#FFC400] text-[#FFC400] bg-[#FFC400]/15 hover:bg-[#FFC400] hover:text-black font-black text-xs sm:text-sm flex items-center justify-center gap-2 transition-all shadow-[0_0_20px_rgba(255,196,0,0.25)] hover:scale-102 active:scale-98 disabled:opacity-40"
              >
                {submittingBooking ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>جارِ المعالجة...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>إرسال الطلب وحجز موعد (واتساب)</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact and Location Card */}
          <div className="bg-[#121212] border border-[#262626] rounded-3xl p-6 space-y-4 shadow-xl text-xs">
            <h3 className="font-black text-white text-sm flex items-center gap-2">
              <MapPin className="w-4 h-4 text-[#FFC400]" />
              <span>موقع ورشة الصيانة والتواصل</span>
            </h3>

            <div className="space-y-3 text-neutral-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-neutral-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block text-white">{center.city} - {center.area}</span>
                  <span className="text-neutral-400 text-[11px]">{center.address}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-neutral-500 shrink-0" />
                <div>
                  <span className="font-bold text-white">الدوام الرسمي:</span>
                  <span className="text-neutral-400 mr-1.5">{center.workingHours}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-neutral-500 shrink-0" />
                <div>
                  <span className="font-bold text-white">الهاتف:</span>
                  <span className="font-mono text-neutral-400 mr-1.5">{center.phone}</span>
                </div>
              </div>
            </div>

            <div className="pt-2 border-t border-neutral-800 space-y-2">
              {center.googleMapsUrl && (
                <a
                  href={center.googleMapsUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="w-full py-2.5 rounded-xl border border-neutral-700 hover:border-[#FFC400] text-neutral-200 hover:text-[#FFC400] bg-neutral-900/60 font-bold flex items-center justify-center gap-2 transition-all"
                >
                  <Navigation className="w-3.5 h-3.5 text-[#FFC400]" />
                  <span>فتح في خرائط Google</span>
                </a>
              )}

              <button
                onClick={handleStartChat}
                className="w-full py-2.5 rounded-xl border border-[#FFC400]/40 text-[#FFC400] bg-[#FFC400]/5 hover:bg-[#FFC400] hover:text-black font-bold flex items-center justify-center gap-2 transition-all"
              >
                <MessageSquare className="w-3.5 h-3.5" />
                <span>محادثة فورية بالتطبيق</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

