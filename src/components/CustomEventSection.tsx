// Halaman lengkap Booking Acara & Kelas Kopi Loka Coffee.
// Berisi: hero, paket (dinamis dari API), form booking interaktif, FAQ, dan kontak.
import { useState, useEffect } from "react";
import {
  CalendarClock,
  Users,
  Coffee,
  PhoneCall,
  ChevronDown,
  CheckCircle2,
  Star,
  Clock,
  MapPin,
  Sparkles,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { toast } from "sonner";

const API_BASE_URL = `${import.meta.env.VITE_API_URL}/api`;

// ─── Types ────────────────────────────────────────────────────────────────────

interface BookingPackage {
  id: number;
  name: string;
  label: string;
  description: string;
  duration_hour: string;
  min_person: number;
  max_person: number;
  price_per_pax: string;
  is_popular: boolean;
  is_active: boolean;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const faqs = [
  {
    q: "Apakah harus memesan jauh-jauh hari?",
    a: "Kami menyarankan pemesanan minimal 3 hari kerja sebelum acara. Untuk gathering korporat atau lebih dari 20 orang, disarankan pesan 1–2 minggu sebelumnya agar persiapan lebih matang.",
  },
  {
    q: "Apakah bisa menyesuaikan paket sesuai budget?",
    a: "Tentu! Tim kami terbuka untuk berdiskusi dan menyusun paket custom sesuai kebutuhan dan budget kamu. Hubungi kami dan ceritakan konsepmu.",
  },
  {
    q: "Di mana lokasi Loka Coffee?",
    a: "Loka Coffee berlokasi di pusat kota. Detail alamat lengkap akan dikirim setelah konfirmasi booking berhasil.",
  },
  {
    q: "Apakah tersedia untuk hari Minggu dan hari libur?",
    a: "Ya, kami menerima booking weekend dan hari libur nasional. Tarif weekday dan weekend mungkin berbeda — silakan tanyakan kepada tim kami.",
  },
  {
    q: "Bagaimana cara pembayaran?",
    a: "Kami menerima transfer bank, QRIS, dan OVO/GoPay. DP 50% diperlukan untuk konfirmasi booking.",
  },
];

const TIME_SLOTS = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00",
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Format angka ke Rupiah */
const formatRupiah = (value: string | number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(Number(value));

/** Pilih icon berdasarkan nama paket */
const packageIcon = (name: string) => {
  const n = name.toLowerCase();
  if (n.includes("latte") || n.includes("art")) return <Star size={28} className="text-primary" />;
  if (n.includes("gathering") || n.includes("private")) return <Users size={28} className="text-primary" />;
  if (n.includes("pairing")) return <Sparkles size={28} className="text-primary" />;
  return <Coffee size={28} className="text-primary" />;
};

// ─── Sub-components ───────────────────────────────────────────────────────────

const PackageCard = ({
  pkg,
  selected,
  onSelect,
}: {
  pkg: BookingPackage;
  selected: boolean;
  onSelect: () => void;
}) => {
  const features = pkg.description
    .split("\n")
    .map((f) => f.replace(/^[•\-]\s*/, "").trim())
    .filter(Boolean);

  return (
    <div
      onClick={onSelect}
      className={`relative cursor-pointer rounded-2xl border-2 bg-card p-6 transition-all duration-200 hover:shadow-lg ${
        selected
          ? "border-primary shadow-md shadow-primary/20 scale-[1.02]"
          : "border-border hover:border-primary/50"
      }`}
    >
      {pkg.is_popular && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-bold text-primary-foreground shadow">
          Paling Diminati
        </span>
      )}
      <div className="flex items-start justify-between gap-2">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10 shadow-sm">
          {packageIcon(pkg.name)}
        </div>
        <span className="rounded-full bg-muted px-2.5 py-0.5 text-xs font-semibold text-foreground">
          {pkg.label}
        </span>
      </div>

      <h3 className="mt-4 font-display text-lg font-bold text-foreground">{pkg.name}</h3>

      <div className="mt-2 flex flex-wrap gap-x-3 gap-y-1">
        {Number(pkg.duration_hour) > 0 && (
          <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
            <Clock size={12} /> {pkg.duration_hour} jam
          </span>
        )}
        <span className="flex items-center gap-1 font-body text-xs text-muted-foreground">
          <Users size={12} /> {pkg.min_person}–{pkg.max_person} orang
        </span>
      </div>

      <p className="mt-3 font-display text-xl font-bold text-primary">
        {formatRupiah(pkg.price_per_pax)}
        <span className="text-xs font-normal text-muted-foreground"> /orang</span>
      </p>

      <ul className="mt-4 space-y-2">
        {features.map((f, i) => (
          <li key={i} className="flex items-start gap-2">
            <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-primary" />
            <span className="font-body text-xs text-foreground">{f}</span>
          </li>
        ))}
      </ul>

      {selected && (
        <div className="mt-4 flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2">
          <CheckCircle2 size={14} className="text-primary" />
          <span className="font-body text-xs font-semibold text-primary">Paket dipilih</span>
        </div>
      )}
    </div>
  );
};

const FaqItem = ({ q, a }: { q: string; a: string }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-border last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between gap-4 py-4 text-left font-body text-sm font-semibold text-foreground transition-colors hover:text-primary"
      >
        {q}
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-200 ${
            open ? "rotate-180 text-primary" : ""
          }`}
        />
      </button>
      {open && (
        <p className="pb-4 font-body text-sm leading-relaxed text-muted-foreground">{a}</p>
      )}
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

const CustomEventSection = () => {
  const [packages, setPackages] = useState<BookingPackage[]>([]);
  const [packagesLoading, setPackagesLoading] = useState(true);
  const [selectedPkg, setSelectedPkg] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    date: "",
    time: "10:00",
    num_persons: 1,
    notes: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Fetch packages from API
  useEffect(() => {
    fetch(`${API_BASE_URL}/bookings/packages`)
      .then((r) => r.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          setPackages(data.data.filter((p: BookingPackage) => p.is_active));
        }
      })
      .catch(() => toast.error("Gagal memuat paket. Coba muat ulang halaman."))
      .finally(() => setPackagesLoading(false));
  }, []);

  const selectedPackage = packages.find((p) => p.id === selectedPkg) ?? null;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: name === "num_persons" ? Number(value) : value });
    setError(null);
    setFieldErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedPkg || !selectedPackage) {
      toast.error("Silakan pilih paket terlebih dahulu.");
      return;
    }

    // Validate num_persons against package constraints
    if (form.num_persons < selectedPackage.min_person || form.num_persons > selectedPackage.max_person) {
      toast.error(
        `Jumlah peserta harus antara ${selectedPackage.min_person}–${selectedPackage.max_person} orang untuk paket ini.`
      );
      setFieldErrors((prev) => ({ ...prev, num_persons: `Harus antara ${selectedPackage.min_person}–${selectedPackage.max_person} orang` }));
      return;
    }

    setIsLoading(true);
    setError(null);
    setFieldErrors({});

    try {
      const bookingData = {
        package_id: selectedPkg,       // integer DB ID
        customer_name: form.name,
        customer_email: form.email,
        customer_phone: form.phone,
        booking_date: form.date,
        booking_time: form.time,
        num_persons: form.num_persons,
        notes: form.notes || undefined,
      };

      const response = await fetch(`${API_BASE_URL}/bookings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bookingData),
      });

      const result = await response.json();

      if (!response.ok) {
        // Handle Laravel validation errors (422)
        if (response.status === 422 && result.errors) {
          const errs: Record<string, string> = {};
          for (const [key, messages] of Object.entries(result.errors)) {
            errs[key] = (messages as string[])[0];
          }
          setFieldErrors(errs);
          setError(result.message || "Validasi gagal. Periksa kembali data Anda.");
          toast.error(result.message || "Validasi gagal.");
          return;
        }
        throw new Error(result.message || `HTTP ${response.status}`);
      }

      // Success
      setSubmitted(true);
      setForm({ name: "", phone: "", email: "", date: "", time: "10:00", num_persons: 1, notes: "" });
      setSelectedPkg(null);
      toast.success("✅ Booking berhasil dikirim! Kami akan menghubungi Anda dalam 1×24 jam.");
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Terjadi kesalahan saat mengirim booking.";
      setError(msg);
      toast.error(msg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="custom-event" className="bg-background">
      {/* ── Hero Banner ─────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-primary/10 via-background to-amber-50/40 dark:to-amber-950/20 section-padding">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
          <div className="absolute -bottom-16 right-0 h-72 w-72 rounded-full bg-amber-300/20 blur-3xl" />
        </div>
        <div className="section-container relative text-center">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 font-body text-xs font-semibold uppercase tracking-widest text-primary">
            <CalendarClock size={13} /> Booking Eksklusif
          </span>
          <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-foreground md:text-5xl">
            Booking Acara &amp; Kelas Kopi
            <br />
            <span className="text-primary">Sesuai Kebutuhanmu</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl font-body text-base leading-relaxed text-muted-foreground">
            Dari workshop barista privat hingga gathering korporat — Loka Coffee siap menjadi
            ruang terbaik untuk momen spesialmu bersama orang-orang terpenting.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-6">
            {[
              { icon: <Clock size={14} />, text: "Weekday & Weekend" },
              { icon: <Users size={14} />, text: "5–30 Orang" },
              { icon: <MapPin size={14} />, text: "Lokasi Strategis" },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-1.5 font-body text-sm text-muted-foreground">
                <span className="text-primary">{icon}</span>
                {text}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Packages ────────────────────────────────────────────── */}
      <section className="section-padding bg-muted/30">
        <div className="section-container">
          <div className="text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
              Pilih Paketmu
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              Paket yang Tersedia
            </h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              Klik kartu untuk memilih paket, lalu isi form booking di bawah.
            </p>
          </div>

          {packagesLoading ? (
            <div className="mt-10 flex justify-center">
              <Loader2 size={32} className="animate-spin text-primary" />
            </div>
          ) : packages.length === 0 ? (
            <p className="mt-10 text-center font-body text-sm text-muted-foreground">
              Belum ada paket tersedia. Silakan hubungi kami langsung.
            </p>
          ) : (
            <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {packages.map((pkg) => (
                <PackageCard
                  key={pkg.id}
                  pkg={pkg}
                  selected={selectedPkg === pkg.id}
                  onSelect={() => setSelectedPkg(selectedPkg === pkg.id ? null : pkg.id)}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── Booking Form ─────────────────────────────────────────── */}
      <section className="section-padding bg-background">
        <div className="section-container max-w-2xl">
          <div className="text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
              Form Booking
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              Isi Detail Booking
            </h2>
          </div>

          {submitted ? (
            <div className="mt-10 flex flex-col items-center gap-4 rounded-2xl border border-primary/30 bg-primary/5 p-10 text-center">
              <CheckCircle2 size={48} className="text-primary" />
              <h3 className="font-display text-2xl font-bold text-foreground">
                Booking Terkirim! 🎉
              </h3>
              <p className="font-body text-sm text-muted-foreground">
                Tim Loka Coffee akan menghubungi kamu dalam 1×24 jam untuk konfirmasi jadwal
                dan detail pembayaran.
              </p>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", phone: "", email: "", date: "", time: "10:00", num_persons: 1, notes: "" });
                  setSelectedPkg(null);
                  setError(null);
                  setFieldErrors({});
                }}
                className="mt-2 rounded-full border border-primary px-6 py-2 font-body text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
              >
                Booking Lagi
              </button>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 space-y-5 rounded-2xl border border-border bg-card p-6 shadow-sm md:p-8"
            >
              {/* Error Alert */}
              {error && (
                <div className="flex items-start gap-3 rounded-xl bg-destructive/10 px-4 py-3">
                  <AlertCircle size={16} className="mt-0.5 shrink-0 text-destructive" />
                  <div className="text-sm text-destructive">{error}</div>
                </div>
              )}

              {/* Paket terpilih */}
              {selectedPackage ? (
                <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-3">
                  <CheckCircle2 size={16} className="text-primary" />
                  <span className="font-body text-sm font-semibold text-primary">
                    Paket: {selectedPackage.name} — {formatRupiah(selectedPackage.price_per_pax)}/orang
                  </span>
                </div>
              ) : (
                <p className="rounded-xl bg-amber-50 dark:bg-amber-950/30 px-4 py-3 font-body text-sm text-amber-700 dark:text-amber-400">
                  ⚠️ Pilih paket dari kartu di atas sebelum melanjutkan.
                </p>
              )}

              {/* Nama & Telepon */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                    Nama Lengkap <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    name="name"
                    value={form.name}
                    onChange={handleChange}
                    placeholder="cth. Budi Santoso"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {fieldErrors.customer_name && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.customer_name}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                    No. WhatsApp <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    name="phone"
                    value={form.phone}
                    onChange={handleChange}
                    placeholder="cth. 0812-3456-7890"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {fieldErrors.customer_phone && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.customer_phone}</p>
                  )}
                </div>
              </div>

              {/* Email & Tanggal */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                    Email <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="email@kamu.com"
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {fieldErrors.customer_email && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.customer_email}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                    Tanggal yang Diinginkan <span className="text-primary">*</span>
                  </label>
                  <input
                    required
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={handleChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {fieldErrors.booking_date && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.booking_date}</p>
                  )}
                </div>
              </div>

              {/* Waktu & Jumlah Peserta */}
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                    Waktu Mulai <span className="text-primary">*</span>
                  </label>
                  <select
                    required
                    name="time"
                    value={form.time}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  >
                    {TIME_SLOTS.map((t) => (
                      <option key={t} value={t}>{t} WIB</option>
                    ))}
                  </select>
                  {fieldErrors.booking_time && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.booking_time}</p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                    Jumlah Peserta <span className="text-primary">*</span>
                    {selectedPackage && (
                      <span className="ml-1 font-normal text-muted-foreground">
                        ({selectedPackage.min_person}–{selectedPackage.max_person} orang)
                      </span>
                    )}
                  </label>
                  <input
                    required
                    type="number"
                    name="num_persons"
                    value={form.num_persons}
                    onChange={handleChange}
                    min={selectedPackage?.min_person ?? 1}
                    max={selectedPackage?.max_person ?? 100}
                    className="w-full rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                  />
                  {fieldErrors.num_persons && (
                    <p className="mt-1 text-xs text-destructive">{fieldErrors.num_persons}</p>
                  )}
                  {selectedPackage && form.num_persons > 0 && (
                    <p className="mt-1 text-xs text-muted-foreground">
                      Total estimasi: {formatRupiah(Number(selectedPackage.price_per_pax) * form.num_persons)}
                    </p>
                  )}
                </div>
              </div>

              {/* Catatan */}
              <div>
                <label className="mb-1.5 block font-body text-sm font-semibold text-foreground">
                  Catatan / Permintaan Khusus
                </label>
                <textarea
                  name="notes"
                  value={form.notes}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Ceritakan kebutuhan spesifik, tema acara, alergi makanan, dll."
                  className="w-full resize-none rounded-xl border border-border bg-background px-4 py-2.5 font-body text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !selectedPkg}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 font-body text-sm font-bold text-primary-foreground transition-all hover:scale-[1.02] hover:shadow-lg hover:shadow-primary/30 active:scale-[0.98] disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                {isLoading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    Mengirim Booking...
                  </>
                ) : (
                  <>
                    <PhoneCall size={16} />
                    Kirim Booking &amp; Kami Akan Hubungi Kamu
                  </>
                )}
              </button>

              <p className="text-center font-body text-xs text-muted-foreground">
                Dengan mengirim form ini, kamu setuju untuk dihubungi oleh tim Loka Coffee.
              </p>
            </form>
          )}
        </div>
      </section>

      {/* ── FAQ ──────────────────────────────────────────────────── */}
      <section className="section-padding bg-muted/30">
        <div className="section-container max-w-2xl">
          <div className="text-center">
            <p className="font-body text-xs font-semibold uppercase tracking-widest text-primary">
              FAQ
            </p>
            <h2 className="mt-2 font-display text-3xl font-bold text-foreground">
              Pertanyaan Umum
            </h2>
          </div>
          <div className="mt-8 rounded-2xl border border-border bg-card p-6 shadow-sm">
            {faqs.map((faq) => (
              <FaqItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Contact strip ────────────────────────────────────────── */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="section-container flex flex-col items-center gap-4 text-center md:flex-row md:justify-between md:text-left">
          <div>
            <h3 className="font-display text-xl font-bold">Masih ada pertanyaan?</h3>
            <p className="mt-1 font-body text-sm opacity-80">
              Hubungi kami langsung via WhatsApp atau email — kami siap bantu!
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            <a
              href="https://wa.me/6281234567890?text=Halo%20Loka%20Coffee%2C%20saya%20ingin%20tanya%20tentang%20booking"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-primary-foreground px-5 py-2.5 font-body text-sm font-bold text-primary transition-transform hover:scale-105"
            >
              <PhoneCall size={14} /> Chat WhatsApp
            </a>
            <a
              href="mailto:events@lokacoffee.id"
              className="inline-flex items-center gap-2 rounded-full border border-primary-foreground/50 px-5 py-2.5 font-body text-sm font-semibold text-primary-foreground transition-all hover:bg-primary-foreground/10"
            >
              Email Kami
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomEventSection;
