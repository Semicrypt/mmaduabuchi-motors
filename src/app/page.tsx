"use client";

import { useState } from "react";
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

const vehicles = [
  {
    brand: "Lexus",
    model: "RX 350",
    type: "Luxury SUV",
    image: images.lexus,
  },
  {
    brand: "Mercedes-AMG",
    model: "GLE 53 Coupe",
    type: "Performance SUV",
    image: images.mercedes,
  },
  {
    brand: "Toyota",
    model: "Land Cruiser",
    type: "Premium SUV",
    image: images.landCruiser,
  },
  {
    brand: "Range Rover",
    model: "Range Rover Sport",
    type: "Luxury SUV",
    image: images.rangeRover,
  },
  {
    brand: "Mercedes-AMG",
    model: "G-Class",
    type: "Luxury Performance",
    image: images.gWagon,
  },
  {
    brand: "Toyota",
    model: "Hilux GR",
    type: "Premium Pickup",
    image: images.hilux,
  },
];

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
  ["Inventory", "#inventory"],
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
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 90 82"
        className="h-[54px] w-[60px] shrink-0 md:h-[62px] md:w-[68px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="logoGold" x1="0" x2="1">
            <stop offset="0%" stopColor="#8B621E" />
            <stop offset="50%" stopColor="#E0BD6C" />
            <stop offset="100%" stopColor="#A67522" />
          </linearGradient>
        </defs>

        {/* Crown */}
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

        {/* M */}
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

      <div>
        <div
          className={`font-display text-[18px] font-semibold tracking-[0.07em] md:text-[23px] ${
            light ? "text-white" : "text-[#241A0F]"
          }`}
        >
          MMADUABUCHI
        </div>

        <div
          className={`mt-[-2px] text-[9px] font-semibold tracking-[0.55em] ${
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

  return (
    <main className="overflow-x-hidden bg-[#F6F0E6] text-[#211A13]">
      {/* TOP BAR */}
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
      <header className="fixed left-0 top-0 z-[60] w-full border-b border-[#5B421F]/10 bg-[#F7F1E7]/90 shadow-[0_8px_30px_rgba(83,58,23,0.06)] backdrop-blur-xl lg:top-9">
        <nav className="mx-auto flex h-[82px] max-w-[1600px] items-center justify-between px-5 md:px-8 lg:px-10">
          <a href="#home">
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
            className="flex h-11 w-11 items-center justify-center border border-[#B88A3B]/30 text-xl lg:hidden"
          >
            {menuOpen ? <FiX /> : <FiMenu />}
          </button>
        </nav>

        {/* MOBILE MENU */}
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

              <div className="grid grid-cols-2 gap-3 pt-2">
                <a
                  href={callLink}
                  className="flex items-center justify-center gap-2 border border-[#B88A3B] px-4 py-4 text-sm font-semibold text-[#76501B]"
                >
                  <FiPhone />
                  Call Us
                </a>

                <a
                  href={whatsappLink}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 bg-[#B88A3B] px-4 py-4 text-sm font-semibold text-white"
                >
                  <FaWhatsapp />
                  WhatsApp
                </a>
              </div>

              <a
                href={callLink}
                className="text-center text-xs font-semibold text-[#7C694D]"
              >
                +234 903 144 7030
              </a>
            </div>
          </div>
        )}
      </header>

      {/* HERO */}
      <section
        id="home"
        className="relative min-h-[820px] overflow-hidden bg-[#EEE5D8] pt-[120px] lg:pt-[155px]"
      >
        {/* BACKGROUND */}
        <div className="absolute inset-0">
          <div className="absolute right-[-5%] top-[8%] h-[440px] w-[62%] bg-gradient-to-br from-[#CDAE7D]/40 via-[#C6AD89]/20 to-[#765632]/15 blur-[2px]" />

          <div className="absolute right-[2%] top-[17%] h-[330px] w-[46%] border-l border-t border-[#8C6B40]/20 bg-[#8F704C]/10 backdrop-blur-[2px]" />

          <div className="absolute right-[8%] top-[22%] h-[42px] w-[33%] bg-[#34291D]/80" />

          <div className="absolute right-[13%] top-[23.8%] text-[13px] font-bold tracking-[0.16em] text-[#D6B36A]/70">
            MMADUABUCHI MOTORS
          </div>

          <div className="absolute bottom-[150px] left-0 h-[3px] w-full rotate-[-2deg] bg-gradient-to-r from-transparent via-[#C99330]/50 to-transparent blur-sm" />

          <div className="road-streak road-streak-one" />
          <div className="road-streak road-streak-two" />

          <div className="absolute bottom-0 left-0 right-0 h-[230px] bg-gradient-to-t from-[#D9D0C5] via-[#EBE4DA]/70 to-transparent" />
        </div>

        {/* HERO CONTENT */}
        <div className="relative z-10 mx-auto grid min-h-[660px] max-w-[1600px] items-center px-5 pb-16 md:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:px-10">
          <motion.div
            initial={{ opacity: 0, x: -35 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-20 pt-12 lg:pt-0"
          >
            <p className="mb-5 text-[10px] font-semibold uppercase tracking-[0.48em] text-[#A6772B] md:text-xs">
              Luxury &nbsp; | &nbsp; Performance &nbsp; | &nbsp; Reliability
            </p>

            <h1 className="font-display text-[62px] font-semibold uppercase leading-[0.82] tracking-[-0.055em] text-[#211A13] sm:text-7xl md:text-[95px] lg:text-[106px]">
              Drive
              <br />
              <span className="gold-text">Distinction</span>
            </h1>

            <p className="mt-7 max-w-[470px] text-[15px] leading-7 text-[#594F43] md:text-base">
              Premium vehicles for people who expect more. Explore top brands
              including Lexus, Mercedes-Benz, Toyota, Range Rover, Hilux and
              more.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#inventory"
                className="flex items-center gap-4 rounded-sm bg-gradient-to-r from-[#A8751F] to-[#D0A342] px-7 py-4 text-[13px] font-semibold text-white shadow-[0_15px_35px_rgba(159,111,31,0.23)] transition hover:-translate-y-1"
              >
                Explore Our Cars
                <FiArrowRight />
              </a>

              <a
                href="#showroom"
                className="flex items-center gap-3 rounded-sm border border-[#A47A39]/50 bg-white/45 px-6 py-4 text-[13px] font-semibold text-[#211A13] backdrop-blur-md transition hover:bg-white"
              >
                <span className="flex h-7 w-7 items-center justify-center rounded-full border border-[#211A13]">
                  <FiPlay className="ml-0.5 text-xs" />
                </span>
                Watch Showroom
              </a>

              <a
                href={callLink}
                className="flex items-center gap-3 rounded-sm border border-[#A47A39]/50 bg-white/45 px-6 py-4 text-[13px] font-semibold text-[#211A13] backdrop-blur-md transition hover:bg-white"
              >
                <FiPhone />
                Call Us
              </a>
            </div>

            {/* TRUST */}
            <div className="mt-12 grid max-w-[570px] grid-cols-3 border-t border-[#B29361]/35 pt-7">
              <div className="pr-4">
                <PiCarProfileBold className="mb-2 text-2xl text-[#B38332]" />

                <div className="text-lg font-semibold">Premium</div>

                <div className="text-[11px] text-[#776A59]">
                  Vehicle Selection
                </div>
              </div>

              <div className="border-l border-[#B29361]/40 px-5">
                <FiShield className="mb-2 text-2xl text-[#B38332]" />

                <div className="text-lg font-semibold">Direct</div>

                <div className="text-[11px] text-[#776A59]">
                  Personal Enquiries
                </div>
              </div>

              <div className="border-l border-[#B29361]/40 pl-5">
                <FiMapPin className="mb-2 text-2xl text-[#B38332]" />

                <div className="text-lg font-semibold">3 Locations</div>

                <div className="text-[11px] text-[#776A59]">
                  Benin & Nigeria
                </div>
              </div>
            </div>
          </motion.div>

          {/* HERO CAR */}
          <div className="relative mt-10 flex min-h-[430px] items-center justify-center lg:mt-0 lg:min-h-[620px]">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{
                duration: 5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              className="relative z-10 w-full"
            >
              <div className="absolute bottom-[4%] left-[12%] right-[5%] h-[55px] rounded-[50%] bg-black/30 blur-2xl" />

              <img
                src={images.lexus}
                alt="Lexus RX luxury SUV"
                className="hero-car relative z-10 mx-auto w-full max-w-[850px]"
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
          className="absolute bottom-7 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-1 text-[#6C5A40]"
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
                className="flex min-w-[190px] items-center justify-center px-8 py-7 md:min-w-[230px]"
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

      {/* FEATURED COLLECTIONS */}
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
            className="collection-card group relative min-h-[520px] overflow-hidden"
          >
            <img
              src={collection.image}
              alt={collection.model}
              className="absolute inset-0 h-full w-full object-cover transition duration-1000 group-hover:scale-105"
            />

            <div className="absolute inset-0 bg-gradient-to-r from-[#17110B]/85 via-[#17110B]/35 to-transparent" />

            <div className="absolute inset-0 bg-gradient-to-t from-[#17110B]/90 via-transparent to-[#17110B]/10" />

            <div className="relative z-10 flex h-full min-h-[520px] flex-col justify-between p-8 text-white md:p-10">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.32em] text-[#E1BF79]">
                  {collection.eyebrow}
                </p>

                <h2 className="font-display mt-4 max-w-[310px] text-4xl uppercase leading-[0.98]">
                  {collection.title}
                </h2>
              </div>

              <div>
                <h3 className="text-lg font-semibold">{collection.model}</h3>

                <p className="mt-1 text-sm text-white/65">
                  {collection.description}
                </p>

                <a
                  href="#inventory"
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
      <section id="inventory" className="bg-[#F4EEE5] py-24 lg:py-32">
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-10">
          <div className="mb-14 flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
            <div>
              <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6772B]">
                Explore the collection
              </p>

              <h2 className="font-display text-5xl leading-none tracking-[-0.04em] md:text-7xl">
                Popular Models
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#796B59]">
              Browse some of the vehicle categories and models MMADUABUCHI
              MOTORS can showcase. Actual inventory and availability will be
              updated with current stock.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {vehicles.map((vehicle, index) => {
              const carMessage = `Hello MMADUABUCHI MOTORS, I'm interested in the ${vehicle.brand} ${vehicle.model}. Please tell me more about availability.`;

              return (
                <motion.article
                  key={vehicle.model}
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
                  <div className="relative aspect-[4/3] overflow-hidden bg-[#E8E0D5]">
                    <img
                      src={vehicle.image}
                      alt={`${vehicle.brand} ${vehicle.model}`}
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.06]"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />

                    <span className="absolute left-5 top-5 border border-white/35 bg-black/20 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-md">
                      {vehicle.type}
                    </span>
                  </div>

                  <div className="p-6">
                    <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#A6772B]">
                      {vehicle.brand}
                    </p>

                    <div className="mt-2 flex items-end justify-between gap-4">
                      <h3 className="font-display text-3xl">{vehicle.model}</h3>

                      <a
                        href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                          carMessage
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        aria-label={`Ask about ${vehicle.model}`}
                        className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#20180F] text-white transition group-hover:bg-[#B88932]"
                      >
                        <FiArrowRight />
                      </a>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* VIDEO SHOWROOM */}
      <section
        id="showroom"
        className="overflow-hidden bg-[#1B140E] py-24 text-white lg:py-32"
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-10">
          <div className="grid gap-12 lg:grid-cols-[0.72fr_1.28fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D6B36A]">
                Video showroom
              </p>

              <h2 className="font-display mt-5 text-5xl leading-[0.94] md:text-7xl">
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

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-24">
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

                <div className="pointer-events-none absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-6 pt-24">
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
      <section id="about" className="bg-[#F8F4ED] py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1500px] gap-14 px-5 md:px-8 lg:grid-cols-2 lg:px-10">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6772B]">
              MMADUABUCHI MOTORS
            </p>

            <h2 className="font-display mt-5 max-w-2xl text-5xl leading-[0.98] md:text-7xl">
              Luxury Meets
              <br />
              Opportunity.
            </h2>
          </div>

          <div className="max-w-xl lg:pt-10">
            <p className="text-lg leading-8 text-[#564B3D]">
              MMADUABUCHI MOTORS connects clients with carefully selected
              automobiles across Benin Republic and Nigeria.
            </p>

            <p className="mt-6 text-sm leading-7 text-[#7B6B58]">
              From reliable Toyota models to premium Lexus SUVs, Mercedes-AMG
              performance vehicles, Range Rover, Hilux and other sought-after
              automobiles, clients can enquire directly and arrange inspections.
            </p>

            <div className="mt-8 flex flex-wrap gap-6">
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
        className="bg-[#C59B50] py-24 text-[#21180E] lg:py-28"
      >
        <div className="mx-auto max-w-[1500px] px-5 md:px-8 lg:px-10">
          <div className="mb-14">
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#5B4015]">
              Our offices
            </p>

            <h2 className="font-display mt-4 text-5xl md:text-7xl">
              Three Locations.
              <span className="block text-[#664717]">One Standard.</span>
            </h2>
          </div>

          <div className="grid border-l border-t border-[#74521C]/30 md:grid-cols-3">
            {locations.map((location) => (
              <article
                key={location.city}
                className="group min-h-[300px] border-b border-r border-[#74521C]/30 p-7 transition hover:bg-[#D5B36D] md:p-9"
              >
                <FiMapPin className="text-2xl" />

                <div className="mt-20">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-[#74531F]">
                    {location.label}
                  </p>

                  <h3 className="font-display mt-2 text-4xl">
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
      <section className="bg-[#F5EFE6] px-5 py-20 md:px-8 lg:px-10 lg:py-28">
        <div className="relative mx-auto max-w-[1500px] overflow-hidden bg-[#211810] px-6 py-20 text-center text-white md:py-28">
          <div className="absolute left-1/2 top-1/2 h-[480px] w-[700px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#B88932]/15 blur-[130px]" />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative"
          >
            <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#D6B36A]">
              Your next vehicle
            </p>

            <h2 className="font-display mx-auto mt-5 max-w-4xl text-5xl leading-[0.95] md:text-7xl">
              Ready To Find
              <br />
              The Right Car?
            </h2>

            <p className="mx-auto mt-6 max-w-lg text-sm leading-7 text-[#BBA78B]">
              Talk directly with MMADUABUCHI MOTORS about models,
              specifications, vehicle inspection and availability.
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a
                href={whatsappLink}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-3 rounded-sm bg-[#25D366] px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-black transition hover:-translate-y-1"
              >
                <FaWhatsapp className="text-lg" />
                Chat on WhatsApp
              </a>

              <a
                href={callLink}
                className="inline-flex items-center gap-3 rounded-sm border border-[#D6B36A]/40 bg-white/5 px-7 py-4 text-xs font-bold uppercase tracking-[0.12em] text-white transition hover:-translate-y-1 hover:bg-[#D6B36A] hover:text-[#211810]"
              >
                <FiPhone />
                Call Us
              </a>
            </div>

            <a
              href={callLink}
              className="mt-5 inline-block text-xs tracking-[0.15em] text-[#D8C19A] transition hover:text-white"
            >
              +234 903 144 7030
            </a>
          </motion.div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#17110C] px-5 pb-8 pt-16 text-white md:px-8 lg:px-10">
        <div className="mx-auto max-w-[1500px]">
          <div className="grid gap-12 border-b border-[#D6B36A]/15 pb-14 md:grid-cols-2 lg:grid-cols-4">
            <div className="lg:col-span-2">
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

          <div className="flex flex-col gap-4 pt-7 text-[10px] uppercase tracking-[0.16em] text-[#786956] sm:flex-row sm:items-center sm:justify-between">
            <p>
              © {new Date().getFullYear()} MMADUABUCHI MOTORS
            </p>

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
        className="fixed bottom-5 right-5 z-[80] flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-xl text-black shadow-[0_15px_40px_rgba(37,211,102,0.35)]"
      >
        <FaWhatsapp />
      </motion.a>
    </main>
  );
}