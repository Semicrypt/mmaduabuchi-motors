"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowLeft,
  FiArrowRight,
  FiMapPin,
  FiPhone,
  FiSearch,
} from "react-icons/fi";
import { PiCarProfileBold } from "react-icons/pi";
import { supabase } from "@/lib/supabase";

type VehicleStatus =
  | "available"
  | "reserved"
  | "sold"
  | "hidden";

type Vehicle = {
  id: string;
  brand: string;
  model: string;
  year: number | null;
  price: number | string | null;
  currency: string | null;
  mileage: number | null;
  transmission: string | null;
  color: string | null;
  fuel_type: string | null;
  condition: string | null;
  location: string | null;
  description: string | null;
  status: VehicleStatus;
  featured: boolean;
  cover_image_url: string | null;
  video_url: string | null;
  created_at: string;
};

const whatsappNumber = "22961565488";
const callNumber = "+2349031447030";
const callLink = `tel:${callNumber}`;

function formatPrice(
  value: number | string | null,
  currency?: string | null
) {
  if (
    value === null ||
    value === "" ||
    Number.isNaN(Number(value))
  ) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${currency || "NGN"} ${Number(
      value
    ).toLocaleString()}`;
  }
}

function BrandLogo() {
  return (
    <div className="flex items-center gap-2.5">
      <svg
        viewBox="0 0 90 82"
        className="h-[48px] w-[52px] shrink-0 sm:h-[56px] sm:w-[62px]"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="inventoryLogoGold"
            x1="0"
            x2="1"
          >
            <stop
              offset="0%"
              stopColor="#8B621E"
            />
            <stop
              offset="50%"
              stopColor="#E0BD6C"
            />
            <stop
              offset="100%"
              stopColor="#A67522"
            />
          </linearGradient>
        </defs>

        <path
          d="M25 19 L31 7 L38 18 L45 3 L52 18 L59 7 L65 19"
          fill="none"
          stroke="url(#inventoryLogoGold)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        <circle
          cx="31"
          cy="6"
          r="2"
          fill="#C79C45"
        />

        <circle
          cx="45"
          cy="2.5"
          r="2"
          fill="#C79C45"
        />

        <circle
          cx="59"
          cy="6"
          r="2"
          fill="#C79C45"
        />

        <path
          d="M12 70 L23 26 L45 51 L67 26 L78 70 H64 L59 47 L45 65 L31 47 L26 70 Z"
          fill="url(#inventoryLogoGold)"
        />

        <path
          d="M25 69 L34 35 L45 48 L56 35 L65 69 H55 L51 52 L45 60 L39 52 L35 69 Z"
          fill="#F1DA9C"
          opacity="0.55"
        />
      </svg>

      <div>
        <div className="font-display whitespace-nowrap text-[16px] font-semibold tracking-[0.05em] text-[#241A0F] sm:text-[19px]">
          MMADUABUCHI
        </div>

        <div className="mt-[-2px] whitespace-nowrap text-[7px] font-semibold tracking-[0.45em] text-[#79551A] sm:text-[9px] sm:tracking-[0.55em]">
          MOTORS
        </div>
      </div>
    </div>
  );
}

export default function InventoryPage() {
  const [vehicles, setVehicles] =
    useState<Vehicle[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [loadError, setLoadError] =
    useState("");

  const [search, setSearch] =
    useState("");

  const [brand, setBrand] =
    useState("all");

  const [location, setLocation] =
    useState("all");

  const [status, setStatus] =
    useState("all");

  useEffect(() => {
    let active = true;

    async function loadInventory() {
      setLoading(true);
      setLoadError("");

      const { data, error } =
        await supabase
          .from("vehicles")
          .select("*")
          .neq("status", "hidden")
          .order("featured", {
            ascending: false,
          })
          .order("created_at", {
            ascending: false,
          });

      if (!active) {
        return;
      }

      if (error) {
        console.error(
          "Inventory error:",
          error
        );

        setLoadError(
          "We could not load the inventory. Please try again."
        );

        setVehicles([]);
      } else {
        setVehicles(
          (data || []) as Vehicle[]
        );
      }

      setLoading(false);
    }

    loadInventory();

    return () => {
      active = false;
    };
  }, []);

  const brands = useMemo(() => {
    return [
      ...new Set(
        vehicles
          .map(
            (vehicle) =>
              vehicle.brand
          )
          .filter(Boolean)
      ),
    ].sort();
  }, [vehicles]);

  const locations = useMemo(() => {
    return [
      ...new Set(
        vehicles
          .map(
            (vehicle) =>
              vehicle.location
          )
          .filter(Boolean)
      ),
    ].sort() as string[];
  }, [vehicles]);

  const filteredVehicles =
    useMemo(() => {
      const query = search
        .trim()
        .toLowerCase();

      return vehicles.filter(
        (vehicle) => {
          const searchable = [
            vehicle.brand,
            vehicle.model,
            vehicle.year,
            vehicle.condition,
            vehicle.location,
            vehicle.color,
          ]
            .filter(
              (value) =>
                value !== null &&
                value !== undefined
            )
            .join(" ")
            .toLowerCase();

          const matchesSearch =
            !query ||
            searchable.includes(query);

          const matchesBrand =
            brand === "all" ||
            vehicle.brand === brand;

          const matchesLocation =
            location === "all" ||
            vehicle.location ===
              location;

          const matchesStatus =
            status === "all" ||
            vehicle.status === status;

          return (
            matchesSearch &&
            matchesBrand &&
            matchesLocation &&
            matchesStatus
          );
        }
      );
    }, [
      vehicles,
      search,
      brand,
      location,
      status,
    ]);

  function resetFilters() {
    setSearch("");
    setBrand("all");
    setLocation("all");
    setStatus("all");
  }

  return (
    <main className="min-h-screen bg-[#F5EFE6] text-[#211A13]">
      {/* HEADER */}

      <header className="border-b border-[#B88A3B]/20 bg-[#F8F4ED]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-10">
          <Link
            href="/"
            aria-label="MMADUABUCHI MOTORS home"
          >
            <BrandLogo />
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={callLink}
              className="hidden min-h-11 items-center gap-2 border border-[#B88A3B]/35 px-4 text-xs font-semibold text-[#704C16] sm:flex"
            >
              <FiPhone />
              Call Us
            </a>

            <a
              href={`https://wa.me/${whatsappNumber}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-2 bg-[#B88932] px-4 text-xs font-semibold text-white"
            >
              <FaWhatsapp />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* HERO */}

      <section className="border-b border-[#B88A3B]/15 bg-[#EDE2D1]">
        <div className="mx-auto max-w-[1500px] px-5 py-16 md:px-8 md:py-20 lg:px-10">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#8A6323]"
          >
            <FiArrowLeft />
            Back to website
          </Link>

          <div className="mt-8 grid gap-8 lg:grid-cols-[1.2fr_.8fr] lg:items-end">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.4em] text-[#A6772B]">
                Current stock
              </p>

              <h1 className="font-display mt-4 text-5xl leading-[0.93] sm:text-6xl md:text-7xl">
                Vehicle
                <br />
                Inventory.
              </h1>
            </div>

            <p className="max-w-xl text-sm leading-7 text-[#746653] lg:justify-self-end">
              Explore vehicles currently
              listed by MMADUABUCHI MOTORS
              across Cotonou, Lagos and
              Onitsha. Availability is
              managed directly from the
              dealership dashboard.
            </p>
          </div>
        </div>
      </section>

      {/* FILTERS */}

      <section className="mx-auto max-w-[1500px] px-5 py-10 md:px-8 lg:px-10">
        <div className="border border-[#B88A3B]/15 bg-[#FAF8F3] p-4 md:p-5">
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-[1.5fr_.7fr_.7fr_.7fr]">
            <label className="relative block">
              <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-[#A6772B]" />

              <input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search brand, model, year..."
                className="h-[52px] w-full border border-[#CBB895]/45 bg-white pl-11 pr-4 text-sm outline-none transition focus:border-[#B88932]"
              />
            </label>

            <select
              value={brand}
              onChange={(event) =>
                setBrand(
                  event.target.value
                )
              }
              className="h-[52px] border border-[#CBB895]/45 bg-white px-4 text-sm outline-none focus:border-[#B88932]"
            >
              <option value="all">
                All brands
              </option>

              {brands.map((item) => (
                <option
                  value={item}
                  key={item}
                >
                  {item}
                </option>
              ))}
            </select>

            <select
              value={location}
              onChange={(event) =>
                setLocation(
                  event.target.value
                )
              }
              className="h-[52px] border border-[#CBB895]/45 bg-white px-4 text-sm outline-none focus:border-[#B88932]"
            >
              <option value="all">
                All locations
              </option>

              {locations.map(
                (item) => (
                  <option
                    value={item}
                    key={item}
                  >
                    {item}
                  </option>
                )
              )}
            </select>

            <select
              value={status}
              onChange={(event) =>
                setStatus(
                  event.target.value
                )
              }
              className="h-[52px] border border-[#CBB895]/45 bg-white px-4 text-sm outline-none focus:border-[#B88932]"
            >
              <option value="all">
                All statuses
              </option>

              <option value="available">
                Available
              </option>

              <option value="reserved">
                Reserved
              </option>

              <option value="sold">
                Sold
              </option>
            </select>
          </div>
        </div>

        {/* RESULT HEADER */}

        <div className="mb-7 mt-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A6772B]">
              Browse cars
            </p>

            <h2 className="font-display mt-2 text-3xl sm:text-4xl">
              {loading
                ? "Loading inventory..."
                : `${filteredVehicles.length} vehicle${
                    filteredVehicles.length ===
                    1
                      ? ""
                      : "s"
                  }`}
            </h2>
          </div>

          {(search !== "" ||
            brand !== "all" ||
            location !== "all" ||
            status !== "all") && (
            <button
              type="button"
              onClick={resetFilters}
              className="text-xs font-bold uppercase tracking-[0.15em] text-[#80591D] underline underline-offset-4"
            >
              Clear filters
            </button>
          )}
        </div>

        {/* LOADING */}

        {loading && (
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({
              length: 6,
            }).map((_, index) => (
              <div
                key={index}
                className="overflow-hidden border border-[#B88A3B]/15 bg-[#FAF8F3]"
              >
                <div className="aspect-[4/3] animate-pulse bg-[#DED5C8]" />

                <div className="space-y-4 p-6">
                  <div className="h-3 w-24 animate-pulse bg-[#DED5C8]" />

                  <div className="h-8 w-2/3 animate-pulse bg-[#DED5C8]" />

                  <div className="h-5 w-1/3 animate-pulse bg-[#E7DFD4]" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ERROR */}

        {!loading && loadError && (
          <div className="border border-red-200 bg-red-50 px-6 py-12 text-center text-sm text-red-700">
            {loadError}
          </div>
        )}

        {/* NO RESULTS */}

        {!loading &&
          !loadError &&
          filteredVehicles.length ===
            0 && (
            <div className="border border-[#B88A3B]/20 bg-[#FAF8F3] px-6 py-20 text-center">
              <PiCarProfileBold className="mx-auto text-6xl text-[#B88932]/30" />

              <h3 className="font-display mt-5 text-3xl">
                No vehicles match your
                search.
              </h3>

              <p className="mx-auto mt-3 max-w-md text-sm leading-7 text-[#796B59]">
                Try another brand,
                location or status, or
                contact MMADUABUCHI
                MOTORS directly for
                current availability.
              </p>
            </div>
          )}

        {/* INVENTORY GRID */}

        {!loading &&
          !loadError &&
          filteredVehicles.length >
            0 && (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {filteredVehicles.map(
                (vehicle, index) => {
                  const message = `Hello MMADUABUCHI MOTORS, I'm interested in the ${
                    vehicle.year
                      ? `${vehicle.year} `
                      : ""
                  }${vehicle.brand} ${
                    vehicle.model
                  }. Please tell me more about availability.`;

                  return (
                    <motion.article
                      key={vehicle.id}
                      initial={{
                        opacity: 0,
                        y: 24,
                      }}
                      whileInView={{
                        opacity: 1,
                        y: 0,
                      }}
                      viewport={{
                        once: true,
                      }}
                      transition={{
                        duration: 0.45,
                        delay:
                          Math.min(
                            index,
                            6
                          ) * 0.04,
                      }}
                      className="group overflow-hidden border border-[#B88A3B]/15 bg-[#FAF8F3] shadow-[0_22px_60px_rgba(70,48,18,0.07)]"
                    >
                      <Link
                        href={`/cars/${vehicle.id}`}
                        className="block"
                      >
                        <div className="relative aspect-[4/3] overflow-hidden bg-[#E6DED2]">
                          {vehicle.cover_image_url ? (
                            <img
                              src={
                                vehicle.cover_image_url
                              }
                              alt={`${vehicle.brand} ${vehicle.model}`}
                              className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.05]"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <PiCarProfileBold className="text-7xl text-[#B88932]/30" />
                            </div>
                          )}

                          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                          <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                            {vehicle.featured && (
                              <span className="bg-[#B88932] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                                Featured
                              </span>
                            )}

                            {vehicle.condition && (
                              <span className="border border-white/35 bg-black/25 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white backdrop-blur">
                                {
                                  vehicle.condition
                                }
                              </span>
                            )}
                          </div>

                          {vehicle.status !==
                            "available" && (
                            <span
                              className={`absolute right-4 top-4 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white ${
                                vehicle.status ===
                                "sold"
                                  ? "bg-red-700"
                                  : "bg-[#9B6C22]"
                              }`}
                            >
                              {
                                vehicle.status
                              }
                            </span>
                          )}

                          {vehicle.location && (
                            <span className="absolute bottom-4 left-4 flex items-center gap-2 text-[10px] uppercase tracking-[0.16em] text-white">
                              <FiMapPin />

                              {
                                vehicle.location
                              }
                            </span>
                          )}
                        </div>
                      </Link>

                      <div className="p-6">
                        <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#A6772B]">
                          {
                            vehicle.brand
                          }
                        </p>

                        <Link
                          href={`/cars/${vehicle.id}`}
                          className="mt-2 block"
                        >
                          <h3 className="font-display text-2xl sm:text-3xl">
                            {vehicle.year
                              ? `${vehicle.year} `
                              : ""}

                            {
                              vehicle.model
                            }
                          </h3>
                        </Link>

                        <p className="mt-4 text-lg font-semibold text-[#6D4B17]">
                          {formatPrice(
                            vehicle.price,
                            vehicle.currency
                          )}
                        </p>

                        <div className="mt-5 grid grid-cols-2 gap-4 border-t border-[#B69A70]/20 pt-5 text-xs">
                          {vehicle.mileage !==
                            null && (
                            <div>
                              <span className="block text-[9px] uppercase tracking-[0.15em] text-[#9A8A74]">
                                Mileage
                              </span>

                              <span className="mt-1 block font-semibold">
                                {Number(
                                  vehicle.mileage
                                ).toLocaleString()}{" "}
                                km
                              </span>
                            </div>
                          )}

                          {vehicle.transmission && (
                            <div>
                              <span className="block text-[9px] uppercase tracking-[0.15em] text-[#9A8A74]">
                                Transmission
                              </span>

                              <span className="mt-1 block font-semibold">
                                {
                                  vehicle.transmission
                                }
                              </span>
                            </div>
                          )}
                        </div>

                        <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
                          <Link
                            href={`/cars/${vehicle.id}`}
                            className="flex min-h-11 items-center justify-center gap-2 bg-[#211810] px-4 text-xs font-bold uppercase tracking-[0.1em] text-white transition hover:bg-[#B88932]"
                          >
                            View details
                            <FiArrowRight />
                          </Link>

                          <a
                            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                              message
                            )}`}
                            target="_blank"
                            rel="noreferrer"
                            aria-label={`WhatsApp about ${vehicle.model}`}
                            className="flex h-11 w-11 items-center justify-center bg-[#25D366] text-black"
                          >
                            <FaWhatsapp />
                          </a>
                        </div>
                      </div>
                    </motion.article>
                  );
                }
              )}
            </div>
          )}
      </section>

      {/* CTA */}

      <section className="bg-[#211810] px-5 py-16 text-center text-white md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D6B36A]">
          Need help choosing?
        </p>

        <h2 className="font-display mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">
          Tell us the car you want.
        </h2>

        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#BBAA93]">
          Speak directly with
          MMADUABUCHI MOTORS about
          specifications, inspection,
          sourcing and availability.
        </p>

        <div className="mt-7 flex flex-wrap justify-center gap-3">
          <a
            href={`https://wa.me/${whatsappNumber}`}
            target="_blank"
            rel="noreferrer"
            className="inline-flex min-h-12 items-center gap-2 bg-[#25D366] px-6 text-xs font-bold uppercase tracking-[0.1em] text-black"
          >
            <FaWhatsapp />
            WhatsApp
          </a>

          <a
            href={callLink}
            className="inline-flex min-h-12 items-center gap-2 border border-[#D6B36A]/40 px-6 text-xs font-bold uppercase tracking-[0.1em]"
          >
            <FiPhone />
            +234 903 144 7030
          </a>
        </div>
      </section>
    </main>
  );
}