"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowLeft,
  FiCheck,
  FiMapPin,
  FiPhone,
} from "react-icons/fi";
import { PiCarProfileBold } from "react-icons/pi";
import { supabase } from "@/lib/supabase";

type VehicleStatus = "available" | "reserved" | "sold" | "hidden";

type Vehicle = {
  id: string;
  name: string;
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

type VehicleMedia = {
  id: string;
  vehicle_id: string;
  media_type: "image" | "video";
  url: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
};

const whatsappNumber = "22961565488";
const callNumber = "+2349031447030";
const callLink = `tel:${callNumber}`;

function money(value: number | string | null, currency?: string | null) {
  if (value === null || value === "" || Number.isNaN(Number(value))) {
    return "Price on request";
  }

  try {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: currency || "NGN",
      maximumFractionDigits: 0,
    }).format(Number(value));
  } catch {
    return `${currency || "NGN"} ${Number(value).toLocaleString()}`;
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
          <linearGradient id="detailLogoGold" x1="0" x2="1">
            <stop offset="0%" stopColor="#8B621E" />
            <stop offset="50%" stopColor="#E0BD6C" />
            <stop offset="100%" stopColor="#A67522" />
          </linearGradient>
        </defs>

        <path
          d="M25 19 L31 7 L38 18 L45 3 L52 18 L59 7 L65 19"
          fill="none"
          stroke="url(#detailLogoGold)"
          strokeWidth="2.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="31" cy="6" r="2" fill="#C79C45" />
        <circle cx="45" cy="2.5" r="2" fill="#C79C45" />
        <circle cx="59" cy="6" r="2" fill="#C79C45" />
        <path
          d="M12 70 L23 26 L45 51 L67 26 L78 70 H64 L59 47 L45 65 L31 47 L26 70 Z"
          fill="url(#detailLogoGold)"
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

export default function CarDetailPage() {
  const params = useParams<{ id: string }>();
  const vehicleId = Array.isArray(params?.id) ? params.id[0] : params?.id;

  const [vehicle, setVehicle] = useState<Vehicle | null>(null);
  const [media, setMedia] = useState<VehicleMedia[]>([]);
  const [activeImage, setActiveImage] = useState("");
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    if (!vehicleId) return;

    let active = true;

    async function loadVehicle() {
      setLoading(true);
      setNotFound(false);
      setLoadError("");

      const [vehicleResult, mediaResult] = await Promise.all([
        supabase
          .from("vehicles")
          .select("*")
          .eq("id", vehicleId)
          .neq("status", "hidden")
          .maybeSingle(),
        supabase
          .from("vehicle_media")
          .select("*")
          .eq("vehicle_id", vehicleId)
          .order("sort_order", { ascending: true }),
      ]);

      if (!active) return;

      if (vehicleResult.error) {
        console.error(vehicleResult.error);
        setLoadError("We could not load this vehicle.");
        setLoading(false);
        return;
      }

      if (!vehicleResult.data) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      const loadedVehicle = vehicleResult.data as Vehicle;
      const loadedMedia = mediaResult.error ? [] : ((mediaResult.data || []) as VehicleMedia[]);

      setVehicle(loadedVehicle);
      setMedia(loadedMedia);

      const firstImage =
        loadedVehicle.cover_image_url ||
        loadedMedia.find((item) => item.media_type === "image")?.url ||
        "";

      setActiveImage(firstImage);
      setLoading(false);
    }

    loadVehicle();

    return () => {
      active = false;
    };
  }, [vehicleId]);

  const imageUrls = useMemo(() => {
    const urls = [
      vehicle?.cover_image_url,
      ...media.filter((item) => item.media_type === "image").map((item) => item.url),
    ].filter(Boolean) as string[];

    return [...new Set(urls)];
  }, [vehicle, media]);

  const videoUrl =
    vehicle?.video_url ||
    media.find((item) => item.media_type === "video")?.url ||
    "";

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5EFE6] px-5 py-20 text-[#211A13]">
        <div className="mx-auto max-w-[1450px]">
          <div className="h-6 w-40 animate-pulse bg-[#DDD3C5]" />
          <div className="mt-8 grid gap-8 lg:grid-cols-[1.15fr_.85fr]">
            <div className="aspect-[4/3] animate-pulse bg-[#DDD3C5]" />
            <div className="space-y-5">
              <div className="h-4 w-24 animate-pulse bg-[#DDD3C5]" />
              <div className="h-14 w-3/4 animate-pulse bg-[#DDD3C5]" />
              <div className="h-8 w-1/2 animate-pulse bg-[#E5DDD2]" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (loadError) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFE6] px-5 text-center">
        <div className="max-w-lg border border-red-200 bg-red-50 p-8 text-red-700">
          {loadError}
        </div>
      </main>
    );
  }

  if (notFound || !vehicle) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#F5EFE6] px-5 text-center text-[#211A13]">
        <div>
          <PiCarProfileBold className="mx-auto text-7xl text-[#B88932]/30" />
          <h1 className="font-display mt-5 text-4xl">Vehicle not found.</h1>
          <p className="mt-3 text-sm text-[#746653]">
            This vehicle may have been removed or hidden from the public inventory.
          </p>
          <Link
            href="/inventory"
            className="mt-7 inline-flex min-h-12 items-center gap-2 bg-[#211810] px-6 text-xs font-bold uppercase tracking-[0.1em] text-white"
          >
            <FiArrowLeft />
            Back to inventory
          </Link>
        </div>
      </main>
    );
  }

  const title = `${vehicle.year ? `${vehicle.year} ` : ""}${vehicle.brand} ${vehicle.model}`;
  const whatsappMessage =
    vehicle.status === "sold"
      ? `Hello MMADUABUCHI MOTORS, I saw the ${title} on your website. Do you have a similar vehicle available?`
      : `Hello MMADUABUCHI MOTORS, I'm interested in the ${title}. Please tell me more about availability and inspection.`;

  const specs = [
    ["Year", vehicle.year],
    ["Mileage", vehicle.mileage !== null ? `${Number(vehicle.mileage).toLocaleString()} km` : null],
    ["Condition", vehicle.condition],
    ["Transmission", vehicle.transmission],
    ["Fuel", vehicle.fuel_type],
    ["Colour", vehicle.color],
    ["Location", vehicle.location],
    ["Status", vehicle.status],
  ].filter(([, value]) => value !== null && value !== undefined && value !== "");

  return (
    <main className="min-h-screen bg-[#F5EFE6] text-[#211A13]">
      <header className="border-b border-[#B88A3B]/20 bg-[#F8F4ED]/95 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1500px] items-center justify-between gap-4 px-5 py-4 md:px-8 lg:px-10">
          <Link href="/">
            <BrandLogo />
          </Link>

          <div className="flex items-center gap-2">
            <a
              href={callLink}
              className="hidden min-h-11 items-center gap-2 border border-[#B88A3B]/35 px-4 text-xs font-semibold text-[#704C16] sm:flex"
            >
              <FiPhone />
              Call
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`}
              target="_blank"
              rel="noreferrer"
              className="flex min-h-11 items-center gap-2 bg-[#25D366] px-4 text-xs font-semibold text-black"
            >
              <FaWhatsapp />
              WhatsApp
            </a>
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-[1500px] px-5 pb-20 pt-8 md:px-8 lg:px-10">
        <Link
          href="/inventory"
          className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-[#80591D]"
        >
          <FiArrowLeft />
          Back to inventory
        </Link>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1.12fr_.88fr] lg:items-start">
          <div className="min-w-0">
            <div className="relative overflow-hidden border border-[#B88A3B]/15 bg-[#E5DCCE]">
              {activeImage ? (
                <img
                  src={activeImage}
                  alt={title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center">
                  <PiCarProfileBold className="text-8xl text-[#B88932]/30" />
                </div>
              )}

              {vehicle.status !== "available" && (
                <span
                  className={`absolute right-5 top-5 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.16em] text-white ${
                    vehicle.status === "sold" ? "bg-red-700" : "bg-[#9B6C22]"
                  }`}
                >
                  {vehicle.status}
                </span>
              )}
            </div>

            {imageUrls.length > 1 && (
              <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-5 md:grid-cols-6">
                {imageUrls.map((url, index) => (
                  <button
                    type="button"
                    key={url}
                    onClick={() => setActiveImage(url)}
                    className={`aspect-square overflow-hidden border-2 ${
                      activeImage === url
                        ? "border-[#B88932]"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                    aria-label={`View image ${index + 1}`}
                  >
                    <img
                      src={url}
                      alt={`${title} thumbnail ${index + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            {videoUrl && (
              <div className="mt-8">
                <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.3em] text-[#A6772B]">
                  Vehicle video
                </p>
                <video
                  src={videoUrl}
                  controls
                  playsInline
                  className="max-h-[760px] w-full bg-black object-contain"
                />
              </div>
            )}
          </div>

          <aside className="lg:sticky lg:top-6">
            <div className="border border-[#B88A3B]/15 bg-[#FAF8F3] p-6 sm:p-8">
              <div className="flex flex-wrap gap-2">
                {vehicle.featured && (
                  <span className="bg-[#B88932] px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-white">
                    Featured
                  </span>
                )}
                {vehicle.condition && (
                  <span className="border border-[#B88A3B]/30 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-[#80591D]">
                    {vehicle.condition}
                  </span>
                )}
              </div>

              <p className="mt-6 text-[10px] font-bold uppercase tracking-[0.25em] text-[#A6772B]">
                {vehicle.brand}
              </p>

              <h1 className="font-display mt-2 text-4xl leading-[0.95] sm:text-5xl">
                {vehicle.year ? `${vehicle.year} ` : ""}
                {vehicle.model}
              </h1>

              {vehicle.location && (
                <p className="mt-4 flex items-center gap-2 text-sm text-[#746653]">
                  <FiMapPin className="text-[#B88932]" />
                  {vehicle.location}
                </p>
              )}

              <p className="mt-7 text-2xl font-semibold text-[#6D4B17]">
                {money(vehicle.price, vehicle.currency)}
              </p>

              <div className="mt-8 grid grid-cols-2 border-l border-t border-[#B69A70]/25">
                {specs.map(([label, value]) => (
                  <div
                    key={String(label)}
                    className="min-h-[92px] border-b border-r border-[#B69A70]/25 p-4"
                  >
                    <p className="text-[9px] font-bold uppercase tracking-[0.14em] text-[#9A8A74]">
                      {label}
                    </p>
                    <p className="mt-2 text-sm font-semibold capitalize text-[#352C22]">
                      {String(value)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-8 space-y-3">
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                    whatsappMessage
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className="flex min-h-14 w-full items-center justify-center gap-3 bg-[#25D366] px-5 text-xs font-bold uppercase tracking-[0.1em] text-black"
                >
                  <FaWhatsapp className="text-lg" />
                  {vehicle.status === "sold"
                    ? "Ask for a similar vehicle"
                    : "Enquire on WhatsApp"}
                </a>

                <a
                  href={callLink}
                  className="flex min-h-14 w-full items-center justify-center gap-3 border border-[#B88932]/45 px-5 text-xs font-bold uppercase tracking-[0.1em] text-[#6D4B17]"
                >
                  <FiPhone />
                  Call +234 903 144 7030
                </a>
              </div>

              <div className="mt-7 border-t border-[#B69A70]/25 pt-6">
                <p className="flex gap-2 text-xs leading-6 text-[#746653]">
                  <FiCheck className="mt-1 shrink-0 text-[#B88932]" />
                  Contact the dealership to confirm current availability,
                  specifications, inspection arrangements and final price.
                </p>
              </div>
            </div>
          </aside>
        </div>

        <div className="mt-16 border-t border-[#B69A70]/25 pt-10">
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#A6772B]">
            About this vehicle
          </p>

          <div className="mt-5 grid gap-8 lg:grid-cols-[.65fr_1.35fr]">
            <h2 className="font-display text-4xl">
              {vehicle.name || `${vehicle.brand} ${vehicle.model}`}
            </h2>

            <p className="whitespace-pre-line text-sm leading-8 text-[#675B4B]">
              {vehicle.description ||
                "Contact MMADUABUCHI MOTORS for full vehicle details, specifications and inspection information."}
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#211810] px-5 py-16 text-center text-white md:px-8">
        <p className="text-[10px] font-bold uppercase tracking-[0.35em] text-[#D6B36A]">
          MMADUABUCHI MOTORS
        </p>
        <h2 className="font-display mx-auto mt-4 max-w-3xl text-4xl sm:text-5xl">
          Want to inspect this vehicle?
        </h2>
        <p className="mx-auto mt-5 max-w-lg text-sm leading-7 text-[#BBAA93]">
          Contact us directly to arrange inspection or ask about similar
          vehicles in Cotonou, Lagos or Onitsha.
        </p>
      </section>
    </main>
  );
}
