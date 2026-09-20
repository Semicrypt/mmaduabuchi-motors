"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaFacebookF, FaWhatsapp } from "react-icons/fa";
import {
  FiArrowRight,
  FiChevronDown,
  FiMapPin,
  FiMenu,
  FiPhone,
  FiPlay,
  FiShield,
  FiX,
} from "react-icons/fi";
import { PiCarProfileBold } from "react-icons/pi";
import { supabase } from "@/lib/supabase";

/* -------------------------------------------------------------------------- */
/*                                  CONTACT                                   */
/* -------------------------------------------------------------------------- */

const whatsappNumber = "22961565488";
const callNumber = "+2349031447030";

const whatsappLink = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
  "Hello MMADUABUCHI MOTORS, I would like to enquire about your vehicles."
)}`;

const callLink = `tel:${callNumber}`;

/* -------------------------------------------------------------------------- */
/*                                   IMAGES                                   */
/* -------------------------------------------------------------------------- */

const images = {
  lexus:
    "https://imgcdn.zigwheels.my/large/gallery/color/37/445/lexus-rx-color-425486.jpg",

  mercedes:
    "https://images.unsplash.com/photo-1751941710410-f8167da82750?auto=format&fit=crop&q=85&w=1800",

  landCruiser:
    "https://media.zigcdn.com/media/model/2025/Mar/front-1-4-left-1354290586_930x620.jpg",

  rangeRover:
    "https://images.unsplash.com/photo-1663405413652-b36c2476f78b?auto=format&fit=crop&q=85&w=1800",

  gWagon:
    "https://images.unsplash.com/photo-1648413653819-7c0fd93e8e6a?auto=format&fit=crop&q=85&w=1800",

  hilux:
    "https://images.unsplash.com/photo-1758393605683-e28bb39d8917?auto=format&fit=crop&q=85&w=1800",
};

/* -------------------------------------------------------------------------- */
/*                                    DATA                                    */
/* -------------------------------------------------------------------------- */

const brands = [
  "LEXUS",
  "MERCEDES-BENZ",
  "AMG",
  "TOYOTA",
  "RANGE ROVER",
  "BMW",
  "PORSCHE",
  "HILUX",
];

const collections = [
  {
    eyebrow: "PERFORMANCE",
    title: "Performance Has A New Home",
    model: "Mercedes-AMG",
    description: "Power. Presence. Prestige.",
    image: images.mercedes,
    button: "View AMG Collection",
  },
  {
    eyebrow: "LEGENDARY",
    title: "Built For Greater Journeys",
    model: "Toyota Land Cruiser",
    description: "Capability meets premium comfort.",
    image: images.landCruiser,
    button: "Explore SUVs",
  },
  {
    eyebrow: "COMMAND",
    title: "Command Every Road",
    model: "Range Rover",
    description: "Luxury without limits.",
    image: images.rangeRover,
    button: "View Range Rover",
  },
];

type PublicVehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number | null;
  price: number | null;
  currency: string | null;
  mileage: number | null;
  transmission: string | null;
  fuel_type: string | null;
  color: string | null;
  condition: string | null;
  location: string | null;
  description: string | null;
  status: "available" | "reserved" | "sold" | "hidden";
  featured: boolean;
  cover_image_url: string | null;
  video_url: string | null;
  created_at: string;
};

function formatPrice(price: number | null, currency?: string | null) {
  if (price === null) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 0,
    }).format(Number(price));
  } catch {
    return `${currency || "NGN"} ${Number(price).toLocaleString()}`;
  }
}

const locations = [
  {
    city: "Cotonou",
    label: "Head Office",
    address: "Park Royale Mivvo, Cotonou, Benin Republic",
  },
  {
    city: "Lagos",
    label: "Lagos Office",
    address:
      "Ajayi Farm Ltd, KM 19 Agege Motor Road, opposite Pavillon Hotel, Ikeja, Lagos.",
  },
  {
    city: "Onitsha",
    label: "Onitsha Office",
    address:
      "No. 1 Igwebuike Odu Street, Omagba Phase 1, 3rd Gate, Onitsha, Anambra State.",
  },
];

const navLinks = [
  ["Home", "#home"],
  ["Inventory", "/inventory"],
  ["Brands", "#brands"],
  ["About", "#about"],
  ["Locations", "#locations"],
  ["Showroom", "#showroom"],
];

/* -------------------------------------------------------------------------- */
/*                                    LOGO                                    */
/* -------------------------------------------------------------------------- */

function BrandLogo({ light = false }: { light?: boolean }) {
  return (
    <div className="flex min-w-0 items-center gap-2.5 md:gap-3">
      <svg
        viewBox="0 0 90 82"
        className="h-[48px] w-[52px] shrink-0 sm:h-[54px] sm:w-[60px] md:h-[62px] md:w-[68px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGold" x1="0" x2="1">
            <stop offset="0%" stopColor="#8B621E" />
            <stop offset="50%" stopColor="#E0BD6C" />
            <stop offset="100%" stopColor="#A67522" />
          </linearGradient>
        </defs>

        <path
          d="M25 19 L31 7 L38 18 L45 3 L52 18 L59 7 L65 19"
          fill="none"
          stroke="url(#logoGold)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle cx="31" cy="6" r="2" fill="#C79C45" />
        <circle cx="45" cy="2.5" r="2" fill="#C79C45" />
        <circle cx="59" cy="6" r="2" fill="#C79C45" />

        <path
          d="M12 70 L23 26 L45 51 L67 26 L78 70 H64 L59 47 L45 65 L31 47 L26 70 Z"
          fill="url(#logoGold)"
        />

        <path
          d="M25 69 L34 35 L45 48 L56 35 L65 69 H55 L51 52 L45 60 L39 52 L35 69 Z"
          fill="#F1DA9C"
          opacity="0.55"
        />
      </svg>

      <div className="min-w-0">
        <div
          className={`font-display whitespace-nowrap text-[16px] font-semibold tracking-[0.05em] sm:text-[18px] md:text-[23px] ${
            light ? "text-white" : "text-[#241A0F]"
          }`}
        >
          MMADUABUCHI
        </div>

        <div
          className={`mt-[-2px] whitespace-nowrap text-[7px] font-semibold tracking-[0.45em] sm:text-[9px] sm:tracking-[0.55em] ${
            light ? "text-[#D6B36A]" : "text-[#79551A]"
          }`}
        >
          MOTORS
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/*                                    PAGE                                    */
/* -------------------------------------------------------------------------- */

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [vehicles, setVehicles] = useState<PublicVehicle[]>([]);
  const [vehiclesLoading, setVehiclesLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadVehicles() {
      const { data, error } = await supabase
        .from("vehicles")
        .select("*")
        .neq("status", "hidden")
        .order("featured", { ascending: false })
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Failed to load vehicles:", error);
      } else if (mounted) {
        setVehicles((data || []) as PublicVehicle[]);
      }

      if (mounted) {
        setVehiclesLoading(false);
      }
    }

    loadVehicles();

    return () => {
      mounted = false;
    };
  }, []);

  const featuredVehicles = vehicles.filter(
    (vehicle) => vehicle.featured
  );

  const homepageVehicles =
    featuredVehicles.length > 0
      ? featuredVehicles.slice(0, 6)
      : vehicles.slice(0, 6);

  return (
    <main className="w-full overflow-x-hidden bg-[#F6F0E6] text-[#211A13]">
      {/* MOBILE TRUST / ADDRESS PANEL */}
      <div className="relative z-[75] w-full border-b border-[#D6B36A]/20 bg-[#2B2116] text-white lg:hidden">
        <a
          href="#locations"
          className="grid grid-cols-[86px_1fr] gap-3 border-b border-white/10 px-4 py-2.5"
        >
          <span className="flex items-start gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#D6B36A]">
            <FiMapPin className="mt-0.5 shrink-0" />
            Cotonou HQ
          </span>

          <span className="text-[9px] leading-[1.45] text-white/85">
            Park Royale Mivvo, Cotonou, Benin Republic
          </span>
        </a>

        <a
          href="#locations"
          className="grid grid-cols-[86px_1fr] gap-3 border-b border-white/10 px-4 py-2.5"
        >
          <span className="flex items-start gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#D6B36A]">
            <FiMapPin className="mt-0.5 shrink-0" />
            Lagos
          </span>

          <span className="text-[9px] leading-[1.45] text-white/85">
            Ajayi Farm Ltd, KM 19 Agege Motor Road, opposite Pavillon Hotel,
            Ikeja, Lagos
          </span>
        </a>

        <a
          href="#locations"
          className="grid grid-cols-[86px_1fr] gap-3 px-4 py-2.5"
        >
          <span className="flex items-start gap-1.5 text-[8px] font-bold uppercase tracking-[0.14em] text-[#D6B36A]">
            <FiMapPin className="mt-0.5 shrink-0" />
            Onitsha
          </span>

          <span className="text-[9px] leading-[1.45] text-white/85">
            No. 1 Igwebuike Odu Street, Omagba Phase 1, 3rd Gate, Onitsha,
            Anambra State
          </span>
        </a>
      </div>

      {/* DESKTOP TOP BAR */}
      <div className="fixed left-0 top-0 z-[70] hidden h-9 w-full bg-[#2B2116] text-white lg:block">
        <div className="mx-auto flex h-full max-w-[1600px] items-center justify-between px-10">
          <div className="flex items-center gap-8 text-[11px] text-white/75">
            <span className="flex items-center gap-2">
              <FiMapPin className="text-[#D6B36A]" />
              Cotonou (HQ)
            </span>

            <span>Lagos Office</span>

            <span className="flex items-center gap-2">
              <FiMapPin className="text-[#D6B36A]" />
              Onitsha Office
            </span>
          </div>

          <div className="flex items-center gap-5 text-[10px] uppercase tracking-[0.12em] text-white/60">
            <span>Premium Cars</span>
            <span className="text-[#B88A3B]">•</span>
            <span>Personal Service</span>
            <span className="text-[#B88A3B]">•</span>
            <span>Benin & Nigeria</span>

            <a
              href={callLink}
              className="ml-2 flex items-center gap-2 text-white/75 transition hover:text-[#D6B36A]"
            >
              <FiPhone />
              +234 903 144 7030
            </a>

            <a
              href="https://www.facebook.com/princehenry.nwachukeu"
              target="_blank"
              rel="noreferrer"
              aria-label="Facebook"
              className="transition hover:text-[#D6B36A]"
            >
              <FaFacebookF />
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              aria-label="WhatsApp"
              className="transition hover:text-[#D6B36A]"
            >
              <FaWhatsapp />
            </a>
          </div>
        </div>
      </div>

      {/* NAVBAR */}
      <header className="sticky left-0 top-0 z-[60] w-full border-b border-[#5B421F]/10 bg-[#F7F1E7]/95 shadow-[0_8px_30px_rgba(83,58,23,0.06)] backdrop-blur-xl lg:fixed lg:top-9">
        <nav className="mx-auto flex h-[88px] w-full max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-5 md:h-[82px] md:px-8 lg:px-10">
          <a href="#home" className="min-w-0">
            <BrandLogo />
          </a>

          <div className="hidden items-center gap-8 lg:flex">
            {navLinks.map(([name, href]) => (
              <a
                key={name}
                href={href}
                className="nav-link text-[13px] font-medium text-[#54493B]"
              >
                {name}
              </a>
            ))}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            <a
              href={callLink}
              className="flex items-center gap-2 rounded-md border border-[#A8751F]/40 bg-white/40 px-5 py-3 text-[13px] font-semibold text-[#6B4A19] transition hover:-translate-y-0.5 hover:bg-white"
            >
              <FiPhone />
              Call Us
            </a>

            <a
              href={whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded-md bg-gradient-to-r from-[#A8751F] to-[#D1A445] px-6 py-3 text-[13px] font-semibold text-white shadow-[0_10px_25px_rgba(151,105,28,0.2)] transition hover:-translate-y-0.5"
            >
              <FaWhatsapp className="text-lg" />
              Chat on WhatsApp
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen((open) => !open)}
            aria-label="Toggle navigation menu"
            className="flex h-11 w-11 shrink-0 items-center justify-center border border-[#B88A3B]/30 text-xl lg:hidden"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>

        {menuOpen && (
          <div className="border-t border-[#B88A3B]/20 bg-[#F6F0E6] px-5 py-6 lg:hidden">
            <div className="flex flex-col gap-5">
              {navLinks.map(([name, href]) => (
                <a
                  key={name}
                  href={href}
                  onClick={() => setMenuOpen(false)}
                  className="text-sm font-semibold"
                >
                  {name}
                </a>
              ))}

              <div className="grid grid-cols-1 gap-3 min-[390px]:grid-cols-2">
                <a
                  href={callLink}
                  className="flex min-h-12 items-center justify-center gap-2 border border-[#B88A3B] px-4 font-semibold text-[#76501B]"
                >
                  <FiPhone />
                  Call Us
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-12 items-center justify-center gap-2 bg-[#B88A3B] px-4 font-semibold text-white"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative overflow-hidden bg-[#EEE5D8] pt-3 sm:pt-4 lg:min-h-[820px] lg:pt-[155px]"
      >
        {/* DESKTOP SHOWROOM DECOR */}
        <div className="pointer-events-none absolute inset-0 hidden lg:block">
          <div className="absolute right-[-5%] top-[8%] h-[440px] w-[62%] bg-gradient-to-br from-[#CDAE7D]/40 via-[#C6AD89]/20 to-[#765632]/15 blur-[2px]" />

          <div className="absolute right-[2%] top-[17%] h-[330px] w-[46%] border-l border-t border-[#8C6B40]/20 bg-[#8F704C]/10 backdrop-blur-[2px]" />

          <div className="absolute right-[8%] top-[22%] h-[42px] w-[33%] bg-[#34291D]/80" />

          <div className="absolute right-[13%] top-[23.8%] text-[13px] font-bold tracking-[0.16em] text-[#D6B36A]/70">
            MMADUABUCHI MOTORS
          </div>
        </div>

        {/* MOBILE BACKGROUND */}
        <div className="pointer-events-none absolute inset-0 lg:hidden">
          <div className="absolute -right-28 top-20 h-[360px] w-[360px] rounded-full bg-[#D0B37C]/20 blur-[80px]" />

          <div className="absolute -left-24 top-[400px] h-[300px] w-[300px] rounded-full bg-white/60 blur-[90px]" />
        </div>

        <div className="pointer-events-none absolute bottom-[150px] left-0 hidden h-[3px] w-full rotate-[-2deg] bg-gradient-to-r from-transparent via-[#C99330]/50 to-transparent blur-sm lg:block" />

        <div className="road-streak road-streak-one hidden lg:block" />
        <div className="road-streak road-streak-two hidden lg:block" />

        <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-[180px] bg-gradient-to-t from-[#D9D0C5]/80 via-[#EBE4DA]/30 to-transparent lg:h-[230px]" />

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1600px] grid-cols-1 px-5 pb-14 sm:px-6 md:px-8 lg:min-h-[660px] lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-10 lg:pb-16">
          {/* TEXT */}
          <motion.div
            initial={{ opacity: 0, x: -25 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 min-w-0 pt-10 sm:pt-12 lg:pt-0"
          >
            {/* MOBILE-SAFE EYEBROW */}
            <div className="mb-5 flex flex-wrap items-center gap-x-3 gap-y-2 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#A6772B] sm:text-[10px] sm:tracking-[0.38em] md:text-xs">
              <span>Luxury</span>
              <span className="text-[#B88A3B]/55">|</span>
              <span>Performance</span>
              <span className="text-[#B88A3B]/55">|</span>
              <span>Reliability</span>
            </div>

            {/* MOBILE-SAFE HEADLINE */}
            <h1 className="font-display max-w-full font-semibold uppercase leading-[0.86] tracking-[-0.045em] text-[#211A13]">
              <span className="block text-[56px] sm:text-[68px] md:text-[82px] lg:text-[106px]">
                Drive
              </span>

              <span className="gold-text block text-[43px] min-[370px]:text-[47px] min-[410px]:text-[51px] sm:text-[62px] md:text-[76px] lg:text-[106px]">
                Distinction
              </span>
            </h1>

            <p className="mt-7 max-w-[470px] text-[15px] leading-7 text-[#594F43] md:text-base">
              Premium vehicles for people who expect more. Explore top brands
              including Lexus, Mercedes-Benz, Toyota, Range Rover, Hilux and
              more.
            </p>

            {/* BUTTONS - STACKED ON MOBILE */}
            <div className="mt-8 grid w-full max-w-[470px] grid-cols-1 gap-3 sm:grid-cols-2 lg:flex lg:max-w-none lg:flex-wrap">
              <a
                href="/inventory"
                className="flex min-h-[58px] w-full items-center justify-center gap-4 rounded-sm bg-gradient-to-r from-[#A8751F] to-[#D0A342] px-6 text-[13px] font-semibold text-white shadow-[0_15px_35px_rgba(159,111,31,0.23)] transition hover:-translate-y-1 sm:col-span-2 lg:w-auto"
              >
                Explore Our Cars
                <FiArrowRight />
              </a>

              <a
                href="#showroom"
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-sm border border-[#A47A39]/50 bg-white/45 px-5 text-[13px] font-semibold text-[#211A13] backdrop-blur-md transition hover:bg-white lg:w-auto"
              >
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[#211A13]">
                  <FiPlay className="ml-0.5 text-xs" />
                </span>

                Watch Showroom
              </a>

              <a
                href={callLink}
                className="flex min-h-[56px] w-full items-center justify-center gap-3 rounded-sm border border-[#A47A39]/50 bg-white/45 px-5 text-[13px] font-semibold text-[#211A13] backdrop-blur-md transition hover:bg-white lg:w-auto"
              >
                <FiPhone />
                Call Us
              </a>
            </div>

            {/* TRUST - STACKED MOBILE */}
            <div className="mt-10 grid max-w-[570px] grid-cols-1 overflow-hidden border-y border-[#B29361]/35 sm:grid-cols-3 sm:border-y-0 sm:border-t sm:pt-7">
              <div className="flex items-center gap-4 border-b border-[#B29361]/25 py-5 sm:block sm:border-b-0 sm:py-0 sm:pr-4">
                <PiCarProfileBold className="shrink-0 text-2xl text-[#B38332] sm:mb-2" />

                <div>
                  <div className="text-base font-semibold sm:text-lg">
                    Premium
                  </div>

                  <div className="text-[11px] text-[#776A59]">
                    Vehicle Selection
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 border-b border-[#B29361]/25 py-5 sm:block sm:border-b-0 sm:border-l sm:border-[#B29361]/40 sm:px-5 sm:py-0">
                <FiShield className="shrink-0 text-2xl text-[#B38332] sm:mb-2" />

                <div>
                  <div className="text-base font-semibold sm:text-lg">
                    Direct
                  </div>

                  <div className="text-[11px] text-[#776A59]">
                    Personal Enquiries
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 py-5 sm:block sm:border-l sm:border-[#B29361]/40 sm:py-0 sm:pl-5">
                <FiMapPin className="shrink-0 text-2xl text-[#B38332] sm:mb-2" />

                <div>
                  <div className="text-base font-semibold sm:text-lg">
                    3 Locations
                  </div>

                  <div className="text-[11px] text-[#776A59]">
                    Benin & Nigeria
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO CAR */}
          <div className="relative mt-5 flex min-h-[330px] w-full min-w-0 items-center justify-center sm:min-h-[400px] md:min-h-[470px] lg:mt-0 lg:min-h-[620px]">
            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full min-w-0"
            >
              <div className="absolute bottom-[5%] left-[10%] right-[10%] h-[38px] rounded-[50%] bg-black/25 blur-2xl md:h-[55px]" />

              <img
                src={images.lexus}
                alt="Lexus RX luxury SUV"
                className="hero-car relative z-10 mx-auto block h-auto w-full max-w-[520px] object-contain sm:max-w-[620px] lg:max-w-[850px]"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="absolute bottom-10 right-0 hidden text-right lg:block"
            >
              <div className="mb-3 flex items-center justify-end gap-4">
                <span className="h-px w-10 bg-[#B88A3B]" />

                <span className="text-xs tracking-[0.18em] text-[#665845]">
                  LEXUS RX
                </span>
              </div>

              <p className="text-[10px] uppercase tracking-[0.25em] text-[#9A876A]">
                Refined Power
              </p>
            </motion.div>
          </div>
        </div>

        <a
          href="#brands"
          className="relative z-30 mx-auto mb-8 flex w-fit flex-col items-center gap-1 text-[#6C5A40] lg:absolute lg:bottom-7 lg:left-1/2 lg:mb-0 lg:-translate-x-1/2"
        >
          <span className="text-[9px] uppercase tracking-[0.25em]">
            Discover
          </span>

          <motion.span
            animate={{ y: [0, 6, 0] }}
            transition={{ duration: 1.6, repeat: Infinity }}
          >
            <FiChevronDown />
          </motion.span>
        </a>
      </section>

      {/* BRAND STRIP */}
      <section
        id="brands"
        className="relative z-20 border-y border-[#A87E3C]/20 bg-[#F8F5EF]"
      >
        <div className="brand-marquee overflow-hidden">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{
              duration: 24,
              repeat: Infinity,
              ease: "linear",
            }}
            className="flex w-max items-center"
          >
            {[...brands, ...brands].map((brand, index) => (
              <div
                key={`${brand}-${index}`}
                className="flex min-w-[150px] items-center justify-center px-6 py-6 sm:min-w-[190px] md:min-w-[230px] md:px-8 md:py-7"
              >
                <span
                  className={`brand-name ${
                    brand === "AMG" ? "font-black italic" : ""
                  }`}
                >
                  {brand}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* FEATURE COLLECTIONS */}
      <section className="grid lg:grid-cols-3">
        {collections.map((collection, index) => (
          <motion.article
            key={collection.title}
            initial={{ opacity: 0, y: 35 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.7,
              delay: index * 0.12,
            }}
            className="collection-card group relative min-h-[470px] overflow-hidden sm:min-h-[520px]"
          >
            <img
              src={collection.image}
              alt={collection.model}
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#17110B]/85 via-[#17110B]/35 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17110B]/90 via-transparent to-[#17110B]/10" />

            <div className="relative z-10 flex min-h-[470px] flex-col justify-between p-6 text-white sm:min-h-[520px] sm:p-8 md:p-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#E1BF79]">
                  {collection.eyebrow}
                </p>

                <h2 className="font-display mt-4 max-w-[310px] text-3xl uppercase leading-[0.98] sm:text-4xl">
                  {collection.title}
                </h2>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{collection.model}</h3>

                <p className="mt-1 text-sm text-white/65">
                  {collection.description}
                </p>

                <a
                  href="/inventory"
                  className="mt-6 inline-flex items-center gap-4 bg-[#B88932] px-5 py-3 text-xs font-semibold transition hover:bg-[#D6B36A]"
                >
                  {collection.button}
                  <FiArrowRight />
                </a>
              </div>
            </div>
          </motion.article>
        ))}
      </section>

      {/* INVENTORY */}
      <section id="inventory" className="bg-[#F4EEE5] py-20 lg:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-10">
          <div className="mb-12 flex flex-col justify-between gap-6 lg:mb-14 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6772B]">
                Explore the collection
              </p>

              <h2 className="font-display text-4xl leading-none tracking-[-0.04em] sm:text-5xl md:text-7xl">
                Popular Models
              </h2>
            </div>

            <div className="flex max-w-md flex-col items-start gap-5 lg:items-end">
              <p className="text-sm leading-7 text-[#796B59] lg:text-right">
                Discover selected vehicles currently featured by MMADUABUCHI
                MOTORS. Browse the full inventory for every listed vehicle.
              </p>

              <a
                href="/inventory"
                className="inline-flex min-h-[48px] items-center gap-3 border border-[#A8751F]/35 bg-white/40 px-5 text-xs font-bold uppercase tracking-[0.12em] text-[#76501B] transition hover:bg-[#211810] hover:text-white"
              >
                View All Inventory
                <FiArrowRight />
              </a>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehiclesLoading &&
              Array.from({ length: 3 }).map((_, index) => (
                <div
                  key={index}
                  className="vehicle-card overflow-hidden bg-[#FAF8F3]"
                >
                  <div className="aspect-[4/3] animate-pulse bg-[#DDD3C5]" />

                  <div className="space-y-3 p-6">
                    <div className="h-3 w-24 animate-pulse bg-[#DDD3C5]" />
                    <div className="h-8 w-2/3 animate-pulse bg-[#DDD3C5]" />
                  </div>
                </div>
              ))}

            {!vehiclesLoading && homepageVehicles.length === 0 && (
              <div className="col-span-full border border-[#B88932]/20 bg-[#FAF8F3] px-6 py-16 text-center">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A6772B]">
                  Inventory
                </p>

                <h3 className="font-display mt-3 text-3xl">
                  New vehicles coming soon.
                </h3>

                <p className="mx-auto mt-4 max-w-md text-sm leading-7 text-[#796B59]">
                  Contact MMADUABUCHI MOTORS for currently available vehicles.
                </p>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-6 inline-flex items-center gap-2 bg-[#B88932] px-6 py-3 text-sm font-semibold text-white"
                >
                  <FaWhatsapp />
                  Ask on WhatsApp
                </a>
              </div>
            )}

            {!vehiclesLoading &&
              homepageVehicles.map((vehicle, index) => {
                const message = `Hello MMADUABUCHI MOTORS, I'm interested in the ${
                  vehicle.year ? `${vehicle.year} ` : ""
                }${vehicle.brand} ${
                  vehicle.model
                }. Please tell me more about availability.`;

                return (
                  <motion.article
                    key={vehicle.id}
                    initial={{ opacity: 0, y: 35 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{
                      duration: 0.55,
                      delay: index * 0.06,
                    }}
                    whileHover={{ y: -6 }}
                    className="vehicle-card group overflow-hidden bg-[#FAF8F3]"
                  >
                    <a
                      href={`/cars/${vehicle.id}`}
                      className="relative block aspect-[4/3] overflow-hidden bg-[#E8E0D5]"
                      aria-label={`View ${vehicle.brand} ${vehicle.model}`}
                    >
                      {vehicle.cover_image_url ? (
                        <img
                          src={vehicle.cover_image_url}
                          alt={`${vehicle.brand} ${vehicle.model}`}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center">
                          <PiCarProfileBold className="text-7xl text-[#B88932]/30" />
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />

                      <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                        {vehicle.condition && (
                          <span className="border border-white/30 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                            {vehicle.condition}
                          </span>
                        )}

                        {vehicle.featured && (
                          <span className="bg-[#B88932] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                            Featured
                          </span>
                        )}
                      </div>

                      {vehicle.status !== "available" && (
                        <span
                          className={`absolute right-4 top-4 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white ${
                            vehicle.status === "sold"
                              ? "bg-red-700"
                              : "bg-[#9B6C22]"
                          }`}
                        >
                          {vehicle.status}
                        </span>
                      )}

                      {vehicle.location && (
                        <div className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white">
                          <FiMapPin />
                          {vehicle.location}
                        </div>
                      )}
                    </a>

                    <div className="p-6">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A6772B]">
                        {vehicle.brand}
                      </p>

                      <div className="mt-2 flex items-start justify-between gap-4">
                        <a
                          href={`/cars/${vehicle.id}`}
                          className="block transition hover:text-[#8A611F]"
                        >
                          <h3 className="font-display text-2xl sm:text-3xl">
                            {vehicle.year ? `${vehicle.year} ` : ""}
                            {vehicle.model}
                          </h3>
                        </a>

                        <a
                          href={`/cars/${vehicle.id}`}
                          aria-label={`View ${vehicle.brand} ${vehicle.model}`}
                          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#20180F] text-white transition hover:bg-[#B88932]"
                        >
                          <FiArrowRight />
                        </a>
                      </div>

                      <p className="mt-4 text-lg font-semibold text-[#6D4B17]">
                        {formatPrice(vehicle.price, vehicle.currency)}
                      </p>

                      <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#B69A70]/20 pt-5">
                        {vehicle.mileage !== null && (
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.15em] text-[#9A8A74]">
                              Mileage
                            </p>

                            <p className="mt-1 text-xs font-semibold">
                              {Number(vehicle.mileage).toLocaleString()} km
                            </p>
                          </div>
                        )}

                        {vehicle.transmission && (
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.15em] text-[#9A8A74]">
                              Transmission
                            </p>

                            <p className="mt-1 text-xs font-semibold">
                              {vehicle.transmission}
                            </p>
                          </div>
                        )}

                        {vehicle.fuel_type && (
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.15em] text-[#9A8A74]">
                              Fuel
                            </p>

                            <p className="mt-1 text-xs font-semibold">
                              {vehicle.fuel_type}
                            </p>
                          </div>
                        )}

                        {vehicle.color && (
                          <div>
                            <p className="text-[9px] uppercase tracking-[0.15em] text-[#9A8A74]">
                              Colour
                            </p>

                            <p className="mt-1 text-xs font-semibold">
                              {vehicle.color}
                            </p>
                          </div>
                        )}
                      </div>

                      <div className="mt-6 flex gap-3">
                        <a
                          href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                            message
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className={`flex flex-1 items-center justify-center gap-2 px-4 py-3 text-xs font-bold uppercase tracking-[0.1em] ${
                            vehicle.status === "sold"
                              ? "pointer-events-none bg-[#D8D0C5] text-[#8E8375]"
                              : "bg-[#B88932] text-white transition hover:bg-[#9D7229]"
                          }`}
                        >
                          <FaWhatsapp />
                          {vehicle.status === "sold" ? "Sold" : "Enquire"}
                        </a>

                        <a
                          href={callLink}
                          className="flex h-11 w-11 items-center justify-center border border-[#B88932]/35 text-[#80591D] transition hover:bg-[#211810] hover:text-white"
                          aria-label="Call MMADUABUCHI MOTORS"
                        >
                          <FiPhone />
                        </a>
                      </div>
                    </div>
                  </motion.article>
                );
              })}
          </div>

          {!vehiclesLoading &&
            vehicles.length > homepageVehicles.length && (
              <div className="mt-10 text-center">
                <a
                  href="/inventory"
                  className="inline-flex min-h-[52px] items-center justify-center gap-3 bg-[#211810] px-7 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:bg-[#B88932]"
                >
                  Browse Full Inventory
                  <FiArrowRight />
                </a>
              </div>
            )}
        </div>
      </section>

      {/* VIDEO SHOWROOM */}
      <section
        id="showroom"
        className="overflow-hidden bg-[#1B140E] py-20 text-white lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-10">
          <div className="grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:gap-12">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D6B36A]">
                Video showroom
              </p>

              <h2 className="font-display mt-5 text-4xl leading-[0.94] sm:text-5xl md:text-7xl">
                See The Cars
                <br />
                <span className="text-[#D6B36A]">In Motion.</span>
              </h2>

              <p className="mt-6 max-w-md text-sm leading-7 text-[#B8A58D]">
                Walk around the vehicles, inspect the styling, interior details
                and road presence before making an enquiry.
              </p>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div
                whileHover={{ y: -5 }}
                className="relative overflow-hidden border border-[#D6B36A]/20"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="aspect-[9/12] w-full object-cover"
                >
                  <source
                    src="/videos/mercedes-gle53.mp4"
                    type="video/mp4"
                  />
                </video>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-24 sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B36A]">
                    Performance
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Mercedes-AMG GLE
                  </h3>
                </div>
              </motion.div>

              <motion.div
                whileHover={{ y: -5 }}
                className="relative overflow-hidden border border-[#D6B36A]/20"
              >
                <video
                  autoPlay
                  muted
                  loop
                  playsInline
                  controls
                  className="aspect-[9/12] w-full object-cover"
                >
                  <source
                    src="/videos/mercedes-gclass.mp4"
                    type="video/mp4"
                  />
                </video>

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-5 pt-24 sm:p-6">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#D6B36A]">
                    Iconic Luxury
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Mercedes G-Class
                  </h3>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="about" className="bg-[#F8F4ED] py-20 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-10 px-5 md:px-8 lg:grid-cols-2 lg:gap-14 lg:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6772B]">
              MMADUABUCHI MOTORS
            </p>

            <h2 className="font-display mt-5 max-w-2xl text-4xl leading-[0.98] sm:text-5xl md:text-7xl">
              Luxury Meets
              <br />
              Opportunity.
            </h2>
          </div>

          <div className="max-w-xl lg:pt-10">
            <p className="text-base leading-8 text-[#564B3D] sm:text-lg">
              MMADUABUCHI MOTORS connects clients with carefully selected
              automobiles across Benin Republic and Nigeria.
            </p>

            <p className="mt-6 text-sm leading-7 text-[#7B6B58]">
              From reliable Toyota models to premium Lexus SUVs, Mercedes-AMG
              performance vehicles, Range Rover, Hilux and other sought-after
              automobiles, clients can enquire directly and arrange inspections.
            </p>

            <div className="mt-8 flex flex-col items-start gap-5 sm:flex-row sm:flex-wrap">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 border-b border-[#9C7029] pb-2 text-sm font-semibold text-[#80591D]"
              >
                Speak with MMADUABUCHI MOTORS
                <FiArrowRight />
              </a>

              <a
                href={callLink}
                className="inline-flex items-center gap-3 border-b border-[#9C7029] pb-2 text-sm font-semibold text-[#80591D]"
              >
                <FiPhone />
                Call +234 903 144 7030
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* LOCATIONS */}
      <section
        id="locations"
        className="bg-[#C59B50] py-20 text-[#21180E] lg:py-28"
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-10">
          <div className="mb-12 lg:mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B4015]">
              Our offices
            </p>

            <h2 className="font-display mt-4 text-4xl sm:text-5xl md:text-7xl">
              Three Locations.
              <span className="block text-[#664717]">One Standard.</span>
            </h2>
          </div>

          <div className="grid border-l border-t border-[#74521C]/30 md:grid-cols-3">
            {locations.map((location) => (
              <article
                key={location.city}
                className="group min-h-[250px] border-b border-r border-[#74521C]/30 p-6 transition hover:bg-[#D5B36D] sm:p-7 md:min-h-[300px] md:p-9"
              >
                <FiMapPin className="text-2xl" />

                <div className="mt-12 md:mt-20">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#74531F]">
                    {location.label}
                  </p>

                  <h3 className="font-display mt-2 text-3xl md:text-4xl">
                    {location.city}
                  </h3>

                  <p className="mt-4 max-w-xs text-sm leading-6 text-[#5B431F]">
                    {location.address}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CONTACT CTA */}
      <section className="bg-[#F5EFE6] px-5 py-16 md:px-8 lg:px-10 lg:py-28">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden bg-[#211810] px-5 py-16 text-center text-white sm:px-6 sm:py-20 md:py-28">
          <div className="absolute left-1/2 top-1/2 h-[400px] w-[550px] max-w-full -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B88932]/15 blur-[130px] md:h-[480px] md:w-[700px]" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D6B36A]">
              Your next vehicle
            </p>

            <h2 className="font-display mx-auto mt-5 max-w-4xl text-4xl leading-[0.95] sm:text-5xl md:text-7xl">
              Ready To Find
              <br />
              The Right Car?
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#BBA78B]">
              Talk directly with MMADUABUCHI MOTORS about models,
              specifications, vehicle inspection and availability.
            </p>

            <div className="mx-auto mt-8 grid max-w-md grid-cols-1 gap-3 sm:grid-cols-2">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-sm bg-[#25D366] px-6 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:-translate-y-1"
              >
                <FaWhatsapp className="text-lg" />
                WhatsApp
              </a>

              <a
                href={callLink}
                className="inline-flex min-h-[56px] items-center justify-center gap-3 rounded-sm border border-[#D6B36A]/40 bg-white/5 px-6 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-1 hover:bg-[#D6B36A] hover:text-[#211810]"
              >
                <FiPhone />
                Call Us
              </a>
            </div>

            <a
              href={callLink}
              className="mt-5 inline-block text-xs tracking-[0.12em] text-[#D8C19A] transition hover:text-white"
            >
              +234 903 144 7030
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#17110C] px-5 pb-8 pt-14 text-white md:px-8 lg:px-10 lg:pt-16">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-10 border-b border-[#D6B36A]/15 pb-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-12 lg:pb-14">
            <div className="sm:col-span-2">
              <BrandLogo light />

              <p className="mt-6 max-w-sm text-sm leading-7 text-[#998873]">
                Premium automobiles across Cotonou, Lagos and Onitsha.
              </p>
            </div>

            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D6B36A]">
                Contact
              </p>

              <div className="space-y-4">
                <a
                  href={callLink}
                  className="flex items-center gap-3 text-sm text-[#D6C7B5] transition hover:text-white"
                >
                  <FiPhone />
                  +234 903 144 7030
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 text-sm text-[#D6C7B5] transition hover:text-white"
                >
                  <FaWhatsapp className="text-[#25D366]" />
                  +229 61 56 54 88
                </a>
              </div>
            </div>

            <div>
              <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#D6B36A]">
                Social
              </p>

              <div className="flex gap-3">
                <a
                  href="https://www.facebook.com/princehenry.nwachukeu"
                  target="_blank"
                  rel="noreferrer"
                  aria-label="Facebook"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-[#D6B36A] hover:bg-[#D6B36A] hover:text-black"
                >
                  <FaFacebookF />
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  aria-label="WhatsApp"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-[#D6B36A] hover:bg-[#D6B36A] hover:text-black"
                >
                  <FaWhatsapp />
                </a>

                <a
                  href={callLink}
                  aria-label="Call MMADUABUCHI MOTORS"
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-white/15 transition hover:border-[#D6B36A] hover:bg-[#D6B36A] hover:text-black"
                >
                  <FiPhone />
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-7 text-[9px] uppercase tracking-[0.14em] text-[#786956] sm:flex-row sm:items-center sm:justify-between sm:text-[10px]">
            <p>© {new Date().getFullYear()} MMADUABUCHI MOTORS</p>
            <p>Cotonou · Lagos · Onitsha</p>
          </div>
        </div>
      </footer>

      {/* FLOATING WHATSAPP */}
      <motion.a
        href={whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Contact MMADUABUCHI MOTORS on WhatsApp"
        animate={{ y: [0, -5, 0] }}
        transition={{
          duration: 2.4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="fixed bottom-5 right-4 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-xl text-black shadow-[0_15px_40px_rgba(37,211,102,0.35)] sm:right-5"
      >
        <FaWhatsapp />
      </motion.a>
    </main>
  );
}