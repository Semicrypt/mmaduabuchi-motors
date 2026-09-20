"use client";

import { ChangeEvent, FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { FaWhatsapp } from "react-icons/fa";
import {
  FiArrowLeft,
  FiCheck,
  FiChevronDown,
  FiChevronLeft,
  FiChevronRight,
  FiEdit3,
  FiEye,
  FiImage,
  FiLogOut,
  FiPlus,
  FiRefreshCw,
  FiSearch,
  FiStar,
  FiTrash2,
  FiUploadCloud,
  FiVideo,
  FiX,
} from "react-icons/fi";
import { supabase } from "@/lib/supabase";

type VehicleStatus = "available" | "reserved" | "sold" | "hidden";

type VehicleMedia = {
  id: string;
  vehicle_id: string;
  media_type: "image" | "video";
  url: string;
  storage_path: string;
  sort_order: number;
  created_at: string;
};

type Vehicle = {
  id: string;
  name: string;
  brand: string;
  model: string;
  year: number | null;
  price: number | null;
  currency: string;
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
  updated_at: string;
  vehicle_media?: VehicleMedia[];
};

type FormState = {
  name: string;
  brand: string;
  model: string;
  year: string;
  price: string;
  currency: string;
  mileage: string;
  transmission: string;
  color: string;
  fuel_type: string;
  condition: string;
  location: string;
  description: string;
  status: VehicleStatus;
  featured: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  brand: "",
  model: "",
  year: "",
  price: "",
  currency: "NGN",
  mileage: "",
  transmission: "Automatic",
  color: "",
  fuel_type: "Petrol",
  condition: "Foreign Used",
  location: "Cotonou",
  description: "",
  status: "available",
  featured: false,
};

const MAX_IMAGES = 15;
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

const BRANDS = [
  "Lexus",
  "Mercedes-Benz",
  "Mercedes-AMG",
  "Toyota",
  "Range Rover",
  "BMW",
  "Porsche",
  "Honda",
  "Ford",
  "Other",
];

const LOCATIONS = ["Cotonou", "Lagos", "Onitsha"];
const CONDITIONS = ["Brand New", "Foreign Used", "Nigerian Used"];
const TRANSMISSIONS = ["Automatic", "Manual"];
const FUELS = ["Petrol", "Diesel", "Hybrid", "Electric"];

function money(value: number | null, currency: string) {
  if (value === null || Number.isNaN(Number(value))) return "Price on request";

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

function safeFileName(name: string) {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9._-]/g, "")
    .replace(/-+/g, "-");
}

function statusClasses(status: VehicleStatus) {
  switch (status) {
    case "available":
      return "bg-emerald-50 text-emerald-700 border-emerald-200";
    case "reserved":
      return "bg-amber-50 text-amber-700 border-amber-200";
    case "sold":
      return "bg-red-50 text-red-700 border-red-200";
    case "hidden":
      return "bg-slate-100 text-slate-600 border-slate-200";
  }
}

export default function AdminDashboardPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | VehicleStatus>("all");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const [editorOpen, setEditorOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const loadVehicles = useCallback(async () => {
    const { data, error: loadError } = await supabase
      .from("vehicles")
      .select("*, vehicle_media(*)")
      .order("created_at", { ascending: false });

    if (loadError) throw loadError;

    const normalized = ((data || []) as Vehicle[]).map((vehicle) => ({
      ...vehicle,
      vehicle_media: [...(vehicle.vehicle_media || [])].sort(
        (a, b) => a.sort_order - b.sort_order
      ),
    }));

    setVehicles(normalized);
  }, []);

  useEffect(() => {
    let mounted = true;

    async function boot() {
      try {
        const { data } = await supabase.auth.getSession();
        const session = data.session;

        if (!session) {
          router.replace("/admin/login");
          return;
        }

        const { data: adminRow, error: adminError } = await supabase
          .from("admin_users")
          .select("user_id")
          .eq("user_id", session.user.id)
          .maybeSingle();

        if (adminError) throw adminError;

        if (!adminRow) {
          await supabase.auth.signOut();
          router.replace("/admin/login");
          return;
        }

        await loadVehicles();
      } catch (err) {
        if (mounted) {
          setError(err instanceof Error ? err.message : "Unable to load admin dashboard.");
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    boot();

    return () => {
      mounted = false;
    };
  }, [loadVehicles, router]);

  const stats = useMemo(() => {
    return {
      total: vehicles.length,
      available: vehicles.filter((vehicle) => vehicle.status === "available").length,
      reserved: vehicles.filter((vehicle) => vehicle.status === "reserved").length,
      sold: vehicles.filter((vehicle) => vehicle.status === "sold").length,
    };
  }, [vehicles]);

  const visibleVehicles = useMemo(() => {
    const query = search.trim().toLowerCase();

    return vehicles.filter((vehicle) => {
      const statusMatches = statusFilter === "all" || vehicle.status === statusFilter;
      const searchMatches =
        !query ||
        [vehicle.name, vehicle.brand, vehicle.model, vehicle.location, vehicle.condition]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(query);

      return statusMatches && searchMatches;
    });
  }, [vehicles, search, statusFilter]);

  function resetEditor() {
    setEditingVehicle(null);
    setForm(EMPTY_FORM);
    setImageFiles([]);
    setVideoFile(null);
    setError("");
    setMessage("");
  }

  function openNewVehicle() {
    resetEditor();
    setEditorOpen(true);
  }

  function openEditVehicle(vehicle: Vehicle) {
    setEditingVehicle(vehicle);
    setImageFiles([]);
    setVideoFile(null);
    setError("");
    setMessage("");
    setForm({
      name: vehicle.name || "",
      brand: vehicle.brand || "",
      model: vehicle.model || "",
      year: vehicle.year?.toString() || "",
      price: vehicle.price?.toString() || "",
      currency: vehicle.currency || "NGN",
      mileage: vehicle.mileage?.toString() || "",
      transmission: vehicle.transmission || "Automatic",
      color: vehicle.color || "",
      fuel_type: vehicle.fuel_type || "Petrol",
      condition: vehicle.condition || "Foreign Used",
      location: vehicle.location || "Cotonou",
      description: vehicle.description || "",
      status: vehicle.status,
      featured: vehicle.featured,
    });
    setEditorOpen(true);
  }

  function updateForm<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function handleImages(event: ChangeEvent<HTMLInputElement>) {
    const selected = Array.from(event.target.files || []);
    const currentCount = editingVehicle?.vehicle_media?.filter((m) => m.media_type === "image").length || 0;

    if (currentCount + selected.length > MAX_IMAGES) {
      setError(`A vehicle can have up to ${MAX_IMAGES} photos.`);
      event.target.value = "";
      return;
    }

    const invalid = selected.find(
      (file) =>
        !["image/jpeg", "image/png", "image/webp"].includes(file.type) ||
        file.size > MAX_IMAGE_BYTES
    );

    if (invalid) {
      setError("Images must be JPG, PNG or WebP and no larger than 10 MB each.");
      event.target.value = "";
      return;
    }

    setError("");
    setImageFiles(selected);
  }

  function handleVideo(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0] || null;

    if (!file) {
      setVideoFile(null);
      return;
    }

    if (!["video/mp4", "video/quicktime"].includes(file.type) || file.size > MAX_VIDEO_BYTES) {
      setError("Video must be MP4/MOV and no larger than 50 MB for the preview setup.");
      event.target.value = "";
      return;
    }

    setError("");
    setVideoFile(file);
  }

  async function uploadSelectedMedia(vehicleId: string, currentVehicle?: Vehicle | null) {
    let coverUrl = currentVehicle?.cover_image_url || null;
    let videoUrl = currentVehicle?.video_url || null;
    const existingMedia = currentVehicle?.vehicle_media || [];
    let nextSort = existingMedia.length
      ? Math.max(...existingMedia.map((item) => item.sort_order)) + 1
      : 0;

    if (imageFiles.length) {
      setUploading(true);

      for (let index = 0; index < imageFiles.length; index += 1) {
        const file = imageFiles[index];
        const path = `${vehicleId}/${Date.now()}-${index}-${safeFileName(file.name)}`;

        const { data: uploaded, error: uploadError } = await supabase.storage
          .from("vehicle-media")
          .upload(path, file, {
            cacheControl: "3600",
            upsert: false,
            contentType: file.type,
          });

        if (uploadError) throw uploadError;

        const { data: publicUrlData } = supabase.storage
          .from("vehicle-media")
          .getPublicUrl(uploaded.path);

        const url = publicUrlData.publicUrl;

        const { error: mediaError } = await supabase.from("vehicle_media").insert({
          vehicle_id: vehicleId,
          media_type: "image",
          url,
          storage_path: uploaded.path,
          sort_order: nextSort,
        });

        if (mediaError) throw mediaError;

        if (!coverUrl) coverUrl = url;
        nextSort += 1;
      }
    }

    if (videoFile) {
      setUploading(true);
      const path = `${vehicleId}/${Date.now()}-video-${safeFileName(videoFile.name)}`;

      const { data: uploaded, error: uploadError } = await supabase.storage
        .from("vehicle-media")
        .upload(path, videoFile, {
          cacheControl: "3600",
          upsert: false,
          contentType: videoFile.type,
        });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from("vehicle-media")
        .getPublicUrl(uploaded.path);

      videoUrl = publicUrlData.publicUrl;

      const { error: mediaError } = await supabase.from("vehicle_media").insert({
        vehicle_id: vehicleId,
        media_type: "video",
        url: videoUrl,
        storage_path: uploaded.path,
        sort_order: nextSort,
      });

      if (mediaError) throw mediaError;
    }

    const { error: vehicleMediaUpdateError } = await supabase
      .from("vehicles")
      .update({
        cover_image_url: coverUrl,
        video_url: videoUrl,
      })
      .eq("id", vehicleId);

    if (vehicleMediaUpdateError) throw vehicleMediaUpdateError;
  }

  async function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setMessage("");

    if (!form.name.trim() || !form.brand.trim() || !form.model.trim()) {
      setError("Vehicle name, brand and model are required.");
      return;
    }

    setSaving(true);

    try {
      const payload = {
        name: form.name.trim(),
        brand: form.brand.trim(),
        model: form.model.trim(),
        year: form.year ? Number(form.year) : null,
        price: form.price ? Number(form.price) : null,
        currency: form.currency || "NGN",
        mileage: form.mileage ? Number(form.mileage) : null,
        transmission: form.transmission || null,
        color: form.color.trim() || null,
        fuel_type: form.fuel_type || null,
        condition: form.condition || null,
        location: form.location || null,
        description: form.description.trim() || null,
        status: form.status,
        featured: form.featured,
      };

      let vehicleId = editingVehicle?.id || "";

      if (editingVehicle) {
        const { error: updateError } = await supabase
          .from("vehicles")
          .update(payload)
          .eq("id", editingVehicle.id);

        if (updateError) throw updateError;
      } else {
        const { data: created, error: insertError } = await supabase
          .from("vehicles")
          .insert(payload)
          .select("id")
          .single();

        if (insertError) throw insertError;
        vehicleId = created.id;
      }

      await uploadSelectedMedia(vehicleId, editingVehicle);
      await loadVehicles();

      setMessage(editingVehicle ? "Vehicle updated successfully." : "Vehicle published successfully.");
      setTimeout(() => {
        setEditorOpen(false);
        resetEditor();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save vehicle.");
    } finally {
      setUploading(false);
      setSaving(false);
    }
  }

  async function setStatus(vehicle: Vehicle, status: VehicleStatus) {
    try {
      setError("");
      const { error: updateError } = await supabase
        .from("vehicles")
        .update({ status })
        .eq("id", vehicle.id);

      if (updateError) throw updateError;
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to change status.");
    }
  }

  async function moveImage(
    vehicle: Vehicle,
    media: VehicleMedia,
    direction: "left" | "right"
  ) {
    try {
      setError("");

      const images = (vehicle.vehicle_media || [])
        .filter((item) => item.media_type === "image")
        .sort((a, b) => a.sort_order - b.sort_order);

      const currentIndex = images.findIndex((item) => item.id === media.id);
      const targetIndex = direction === "left" ? currentIndex - 1 : currentIndex + 1;

      if (
        currentIndex === -1 ||
        targetIndex < 0 ||
        targetIndex >= images.length
      ) {
        return;
      }

      const current = images[currentIndex];
      const target = images[targetIndex];

      const { error: currentError } = await supabase
        .from("vehicle_media")
        .update({ sort_order: target.sort_order })
        .eq("id", current.id);

      if (currentError) throw currentError;

      const { error: targetError } = await supabase
        .from("vehicle_media")
        .update({ sort_order: current.sort_order })
        .eq("id", target.id);

      if (targetError) throw targetError;

      const reorderedMedia = (vehicle.vehicle_media || []).map((item) => {
        if (item.id === current.id) {
          return { ...item, sort_order: target.sort_order };
        }

        if (item.id === target.id) {
          return { ...item, sort_order: current.sort_order };
        }

        return item;
      });

      const nextVehicle = {
        ...vehicle,
        vehicle_media: reorderedMedia,
      };

      setEditingVehicle(nextVehicle);

      setVehicles((currentVehicles) =>
        currentVehicles.map((item) =>
          item.id === vehicle.id ? nextVehicle : item
        )
      );

      await loadVehicles();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Unable to reorder vehicle photos."
      );
    }
  }

  async function setCover(vehicle: Vehicle, media: VehicleMedia) {
    try {
      const { error: updateError } = await supabase
        .from("vehicles")
        .update({ cover_image_url: media.url })
        .eq("id", vehicle.id);

      if (updateError) throw updateError;
      await loadVehicles();

      setEditingVehicle((current) =>
        current ? { ...current, cover_image_url: media.url } : current
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to set cover photo.");
    }
  }

  async function removeMedia(vehicle: Vehicle, media: VehicleMedia) {
    if (!window.confirm("Remove this media file?")) return;

    try {
      setError("");

      const { error: storageError } = await supabase.storage
        .from("vehicle-media")
        .remove([media.storage_path]);

      if (storageError) throw storageError;

      const { error: deleteError } = await supabase
        .from("vehicle_media")
        .delete()
        .eq("id", media.id);

      if (deleteError) throw deleteError;

      const remainingMedia = (vehicle.vehicle_media || []).filter((item) => item.id !== media.id);
      const nextImage = remainingMedia.find((item) => item.media_type === "image");
      const nextVideo = remainingMedia.find((item) => item.media_type === "video");

      const updatePayload: Record<string, string | null> = {};
      if (vehicle.cover_image_url === media.url) {
        updatePayload.cover_image_url = nextImage?.url || null;
      }
      if (vehicle.video_url === media.url) {
        updatePayload.video_url = nextVideo?.url || null;
      }

      if (Object.keys(updatePayload).length) {
        const { error: updateError } = await supabase
          .from("vehicles")
          .update(updatePayload)
          .eq("id", vehicle.id);

        if (updateError) throw updateError;
      }

      const nextVehicle: Vehicle = {
        ...vehicle,
        vehicle_media: remainingMedia,
        cover_image_url:
          vehicle.cover_image_url === media.url
            ? nextImage?.url || null
            : vehicle.cover_image_url,
        video_url:
          vehicle.video_url === media.url
            ? nextVideo?.url || null
            : vehicle.video_url,
      };

      setEditingVehicle(nextVehicle);
      setVehicles((current) =>
        current.map((item) => (item.id === vehicle.id ? nextVehicle : item))
      );
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to remove media.");
    }
  }

  async function deleteVehicle(vehicle: Vehicle) {
    if (!window.confirm(`Delete ${vehicle.name}? This permanently removes the vehicle and its uploaded media.`)) {
      return;
    }

    try {
      setError("");
      const paths = (vehicle.vehicle_media || []).map((item) => item.storage_path);

      if (paths.length) {
        const { error: storageError } = await supabase.storage
          .from("vehicle-media")
          .remove(paths);

        if (storageError) throw storageError;
      }

      const { error: deleteError } = await supabase
        .from("vehicles")
        .delete()
        .eq("id", vehicle.id);

      if (deleteError) throw deleteError;
      await loadVehicles();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete vehicle.");
    }
  }

  async function logout() {
    await supabase.auth.signOut();
    router.replace("/admin/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#17110C] text-white">
        <div className="text-center">
          <div className="mx-auto mb-4 h-9 w-9 animate-spin rounded-full border-2 border-[#D6B36A] border-t-transparent" />
          <p className="text-sm text-white/50">Loading inventory…</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F3EEE6] text-[#211A13]">
      <header className="sticky top-0 z-40 border-b border-[#9D7C45]/15 bg-[#17110C]/95 text-white backdrop-blur-xl">
        <div className="mx-auto flex min-h-[76px] max-w-[1500px] items-center justify-between gap-4 px-5 md:px-8 lg:px-10">
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.34em] text-[#D6B36A]">
              MMADUABUCHI MOTORS
            </p>
            <h1 className="mt-1 text-lg font-semibold sm:text-xl">Inventory Admin</h1>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="/"
              target="_blank"
              className="hidden min-h-11 items-center gap-2 border border-white/15 px-4 text-xs font-semibold text-white/80 transition hover:border-[#D6B36A] hover:text-white sm:flex"
            >
              <FiEye /> View website
            </a>

            <button
              type="button"
              onClick={logout}
              className="flex h-11 w-11 items-center justify-center border border-white/15 text-white/80 transition hover:border-red-300 hover:text-red-300 sm:w-auto sm:gap-2 sm:px-4"
              aria-label="Sign out"
            >
              <FiLogOut /> <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1500px] px-5 py-8 md:px-8 lg:px-10 lg:py-10">
        <div className="mb-8 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#A6772B]">
              Dashboard
            </p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl">Vehicle Inventory</h2>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#776955]">
              Add stock, update vehicle details, upload photos and videos, mark cars sold or hide them from the public website.
            </p>
          </div>

          <button
            type="button"
            onClick={openNewVehicle}
            className="flex min-h-12 items-center justify-center gap-2 bg-gradient-to-r from-[#9D6D20] to-[#D2A548] px-6 text-sm font-bold text-white shadow-[0_12px_30px_rgba(144,96,24,0.2)]"
          >
            <FiPlus /> Add Vehicle
          </button>
        </div>

        {error && !editorOpen && (
          <div className="mb-6 flex items-start justify-between gap-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            <span>{error}</span>
            <button type="button" onClick={() => setError("")} aria-label="Dismiss error">
              <FiX />
            </button>
          </div>
        )}

        <section className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            ["Total Cars", stats.total],
            ["Available", stats.available],
            ["Reserved", stats.reserved],
            ["Sold", stats.sold],
          ].map(([label, value]) => (
            <div key={String(label)} className="border border-[#9D7C45]/15 bg-[#FBF8F2] p-5 sm:p-6">
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8C795E]">
                {label}
              </p>
              <p className="mt-3 font-serif text-4xl text-[#2B2116]">{value}</p>
            </div>
          ))}
        </section>

        <section className="mb-6 flex flex-col gap-3 border border-[#9D7C45]/15 bg-[#FBF8F2] p-4 md:flex-row md:items-center md:justify-between">
          <div className="flex min-h-12 flex-1 items-center gap-3 border border-[#B89A68]/30 bg-white px-4">
            <FiSearch className="shrink-0 text-[#A6772B]" />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search model, brand, location…"
              className="w-full bg-transparent text-base outline-none placeholder:text-[#A89B88]"
            />
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <label className="relative min-w-[170px]">
              <select
                value={statusFilter}
                onChange={(event) => setStatusFilter(event.target.value as "all" | VehicleStatus)}
                className="min-h-12 w-full appearance-none border border-[#B89A68]/30 bg-white px-4 pr-10 text-sm outline-none"
              >
                <option value="all">All statuses</option>
                <option value="available">Available</option>
                <option value="reserved">Reserved</option>
                <option value="sold">Sold</option>
                <option value="hidden">Hidden</option>
              </select>
              <FiChevronDown className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2" />
            </label>

            <button
              type="button"
              onClick={() => loadVehicles().catch((err) => setError(err.message))}
              className="flex min-h-12 items-center justify-center gap-2 border border-[#B89A68]/30 bg-white px-4 text-sm font-semibold"
            >
              <FiRefreshCw /> Refresh
            </button>
          </div>
        </section>

        {visibleVehicles.length === 0 ? (
          <section className="border border-dashed border-[#B89A68]/40 bg-[#FBF8F2] px-6 py-16 text-center">
            <FiImage className="mx-auto text-3xl text-[#B28A49]" />
            <h3 className="mt-4 font-serif text-2xl">No vehicles found</h3>
            <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-[#7A6B57]">
              Add the first vehicle or change the current search/filter.
            </p>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {visibleVehicles.map((vehicle) => (
              <motion.article
                key={vehicle.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                className="overflow-hidden border border-[#9D7C45]/15 bg-[#FBF8F2]"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-[#DED6CA]">
                  {vehicle.cover_image_url ? (
                    <img
                      src={vehicle.cover_image_url}
                      alt={vehicle.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center text-[#A59071]">
                      <FiImage className="text-4xl" />
                    </div>
                  )}

                  <div className="absolute left-4 top-4 flex flex-wrap gap-2">
                    <span className={`border px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] ${statusClasses(vehicle.status)}`}>
                      {vehicle.status}
                    </span>

                    {vehicle.featured && (
                      <span className="flex items-center gap-1 border border-[#D0A64F] bg-[#FFF5D8] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.14em] text-[#8B621E]">
                        <FiStar /> Featured
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-5">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-[#A6772B]">
                        {vehicle.brand}
                      </p>
                      <h3 className="mt-1 truncate font-serif text-2xl">{vehicle.name}</h3>
                      <p className="mt-1 text-sm text-[#7B6C58]">
                        {[vehicle.year, vehicle.condition, vehicle.location].filter(Boolean).join(" · ")}
                      </p>
                    </div>

                    <p className="shrink-0 text-right text-sm font-bold text-[#4B3820]">
                      {money(vehicle.price, vehicle.currency)}
                    </p>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => openEditVehicle(vehicle)}
                      className="flex min-h-11 items-center justify-center gap-2 border border-[#A98C5A]/30 bg-white text-xs font-semibold"
                    >
                      <FiEdit3 /> Edit
                    </button>

                    <label className="relative">
                      <select
                        value={vehicle.status}
                        onChange={(event) => setStatus(vehicle, event.target.value as VehicleStatus)}
                        className="min-h-11 w-full appearance-none border border-[#A98C5A]/30 bg-white px-3 pr-8 text-xs font-semibold outline-none"
                      >
                        <option value="available">Available</option>
                        <option value="reserved">Reserved</option>
                        <option value="sold">Sold</option>
                        <option value="hidden">Hidden</option>
                      </select>
                      <FiChevronDown className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs" />
                    </label>
                  </div>

                  <button
                    type="button"
                    onClick={() => deleteVehicle(vehicle)}
                    className="mt-2 flex min-h-10 w-full items-center justify-center gap-2 text-xs font-semibold text-red-600 transition hover:bg-red-50"
                  >
                    <FiTrash2 /> Delete vehicle
                  </button>
                </div>
              </motion.article>
            ))}
          </section>
        )}
      </div>

      {editorOpen && (
        <div className="fixed inset-0 z-[100] overflow-y-auto bg-black/55 p-0 backdrop-blur-sm sm:p-5">
          <div className="ml-auto min-h-screen w-full max-w-4xl bg-[#F7F2EA] shadow-2xl sm:min-h-0">
            <div className="sticky top-0 z-20 flex items-center justify-between border-b border-[#9D7C45]/15 bg-[#1B140E] px-5 py-4 text-white sm:px-7">
              <div>
                <p className="text-[9px] font-semibold uppercase tracking-[0.3em] text-[#D6B36A]">
                  Inventory editor
                </p>
                <h2 className="mt-1 font-serif text-2xl">
                  {editingVehicle ? "Edit Vehicle" : "Add Vehicle"}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEditorOpen(false);
                  resetEditor();
                }}
                className="flex h-11 w-11 items-center justify-center border border-white/15"
                aria-label="Close editor"
              >
                <FiX />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-8 p-5 sm:p-7">
              {error && (
                <div className="border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {error}
                </div>
              )}

              {message && (
                <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                  <FiCheck /> {message}
                </div>
              )}

              <section>
                <p className="mb-4 text-[10px] font-bold uppercase tracking-[0.26em] text-[#A6772B]">
                  Vehicle details
                </p>

                <div className="grid gap-4 md:grid-cols-2">
                  <Field label="Listing name" required>
                    <input
                      value={form.name}
                      onChange={(event) => updateForm("name", event.target.value)}
                      required
                      placeholder="2024 Lexus RX 350"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Brand" required>
                    <input
                      list="brand-options"
                      value={form.brand}
                      onChange={(event) => updateForm("brand", event.target.value)}
                      required
                      placeholder="Lexus"
                      className="admin-input"
                    />
                    <datalist id="brand-options">
                      {BRANDS.map((brand) => (
                        <option key={brand} value={brand} />
                      ))}
                    </datalist>
                  </Field>

                  <Field label="Model" required>
                    <input
                      value={form.model}
                      onChange={(event) => updateForm("model", event.target.value)}
                      required
                      placeholder="RX 350"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Year">
                    <input
                      type="number"
                      min="1980"
                      max="2100"
                      value={form.year}
                      onChange={(event) => updateForm("year", event.target.value)}
                      placeholder="2024"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Price">
                    <div className="grid grid-cols-[95px_1fr]">
                      <select
                        value={form.currency}
                        onChange={(event) => updateForm("currency", event.target.value)}
                        className="admin-input border-r-0"
                      >
                        <option value="NGN">NGN</option>
                        <option value="XOF">XOF</option>
                        <option value="USD">USD</option>
                      </select>
                      <input
                        type="number"
                        min="0"
                        value={form.price}
                        onChange={(event) => updateForm("price", event.target.value)}
                        placeholder="85000000"
                        className="admin-input"
                      />
                    </div>
                  </Field>

                  <Field label="Mileage (km)">
                    <input
                      type="number"
                      min="0"
                      value={form.mileage}
                      onChange={(event) => updateForm("mileage", event.target.value)}
                      placeholder="12500"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Condition">
                    <select
                      value={form.condition}
                      onChange={(event) => updateForm("condition", event.target.value)}
                      className="admin-input"
                    >
                      {CONDITIONS.map((condition) => (
                        <option key={condition}>{condition}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Location">
                    <select
                      value={form.location}
                      onChange={(event) => updateForm("location", event.target.value)}
                      className="admin-input"
                    >
                      {LOCATIONS.map((location) => (
                        <option key={location}>{location}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Transmission">
                    <select
                      value={form.transmission}
                      onChange={(event) => updateForm("transmission", event.target.value)}
                      className="admin-input"
                    >
                      {TRANSMISSIONS.map((transmission) => (
                        <option key={transmission}>{transmission}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Fuel type">
                    <select
                      value={form.fuel_type}
                      onChange={(event) => updateForm("fuel_type", event.target.value)}
                      className="admin-input"
                    >
                      {FUELS.map((fuel) => (
                        <option key={fuel}>{fuel}</option>
                      ))}
                    </select>
                  </Field>

                  <Field label="Colour">
                    <input
                      value={form.color}
                      onChange={(event) => updateForm("color", event.target.value)}
                      placeholder="Black"
                      className="admin-input"
                    />
                  </Field>

                  <Field label="Status">
                    <select
                      value={form.status}
                      onChange={(event) => updateForm("status", event.target.value as VehicleStatus)}
                      className="admin-input"
                    >
                      <option value="available">Available</option>
                      <option value="reserved">Reserved</option>
                      <option value="sold">Sold</option>
                      <option value="hidden">Hidden</option>
                    </select>
                  </Field>
                </div>

                <Field label="Description" className="mt-4">
                  <textarea
                    value={form.description}
                    onChange={(event) => updateForm("description", event.target.value)}
                    rows={5}
                    placeholder="Vehicle details, notable features, inspection information…"
                    className="admin-input resize-y py-3"
                  />
                </Field>

                <label className="mt-4 flex min-h-12 cursor-pointer items-center gap-3 border border-[#B79864]/30 bg-white px-4">
                  <input
                    type="checkbox"
                    checked={form.featured}
                    onChange={(event) => updateForm("featured", event.target.checked)}
                    className="h-4 w-4 accent-[#B88932]"
                  />
                  <FiStar className="text-[#A6772B]" />
                  <span className="text-sm font-semibold">Feature this vehicle on the homepage</span>
                </label>
              </section>

              <section className="border-t border-[#9D7C45]/15 pt-7">
                <div className="mb-4 flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#A6772B]">
                      Photos
                    </p>
                    <p className="mt-1 text-xs text-[#80715D]">Up to 15 JPG, PNG or WebP files · 10 MB each.</p>
                  </div>
                </div>

                {editingVehicle?.vehicle_media?.some(
                  (media) => media.media_type === "image"
                ) && (
                  <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                    {editingVehicle.vehicle_media
                      .filter((media) => media.media_type === "image")
                      .sort((a, b) => a.sort_order - b.sort_order)
                      .map((media, index, images) => (
                        <div
                          key={media.id}
                          className="relative overflow-hidden border border-[#B79864]/20 bg-white"
                        >
                          <div className="relative">
                            <img
                              src={media.url}
                              alt={`Vehicle photo ${index + 1}`}
                              className="aspect-[4/3] w-full object-cover"
                            />

                            <span className="absolute left-2 top-2 bg-black/65 px-2 py-1 text-[9px] font-bold text-white backdrop-blur-sm">
                              {index + 1}
                            </span>

                            {editingVehicle.cover_image_url === media.url && (
                              <span className="absolute right-2 top-2 bg-[#D6B36A] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-[#211A13]">
                                Cover
                              </span>
                            )}
                          </div>

                          <div className="grid grid-cols-2 border-t border-[#B79864]/20">
                            <button
                              type="button"
                              disabled={index === 0}
                              onClick={() =>
                                moveImage(editingVehicle, media, "left")
                              }
                              className="flex min-h-9 items-center justify-center gap-1 text-[10px] font-semibold text-[#76551F] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Move photo ${index + 1} left`}
                            >
                              <FiChevronLeft />
                              Left
                            </button>

                            <button
                              type="button"
                              disabled={index === images.length - 1}
                              onClick={() =>
                                moveImage(editingVehicle, media, "right")
                              }
                              className="flex min-h-9 items-center justify-center gap-1 border-l border-[#B79864]/20 text-[10px] font-semibold text-[#76551F] disabled:cursor-not-allowed disabled:opacity-30"
                              aria-label={`Move photo ${index + 1} right`}
                            >
                              Right
                              <FiChevronRight />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 border-t border-[#B79864]/20">
                            <button
                              type="button"
                              onClick={() => setCover(editingVehicle, media)}
                              className={`min-h-9 text-[10px] font-semibold ${
                                editingVehicle.cover_image_url === media.url
                                  ? "bg-[#D6B36A] text-[#211A13]"
                                  : "bg-white text-[#76551F]"
                              }`}
                            >
                              {editingVehicle.cover_image_url === media.url
                                ? "Cover photo"
                                : "Set cover"}
                            </button>

                            <button
                              type="button"
                              onClick={() => removeMedia(editingVehicle, media)}
                              className="min-h-9 border-l border-[#B79864]/20 text-[10px] font-semibold text-red-600"
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      ))}
                  </div>
                )}

                <label className="flex min-h-[120px] cursor-pointer flex-col items-center justify-center border border-dashed border-[#B08A4C]/50 bg-white px-5 text-center transition hover:bg-[#FFF9ED]">
                  <FiUploadCloud className="text-3xl text-[#B88932]" />
                  <span className="mt-3 text-sm font-semibold">Choose vehicle photos</span>
                  <span className="mt-1 text-xs text-[#8A7A65]">
                    {imageFiles.length ? `${imageFiles.length} selected` : "Tap to browse files"}
                  </span>
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handleImages}
                    className="hidden"
                  />
                </label>
              </section>

              <section className="border-t border-[#9D7C45]/15 pt-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.26em] text-[#A6772B]">
                  Walkaround video
                </p>
                <p className="mt-1 text-xs text-[#80715D]">
                  Optional MP4/MOV · maximum 50 MB during the Supabase preview stage.
                </p>

                {editingVehicle?.video_url && (
                  <div className="mt-4 flex items-center justify-between gap-4 border border-[#B79864]/20 bg-white p-4">
                    <div className="flex min-w-0 items-center gap-3">
                      <FiVideo className="shrink-0 text-xl text-[#A6772B]" />
                      <span className="truncate text-sm font-semibold">Current showroom video</span>
                    </div>
                    {editingVehicle.vehicle_media
                      ?.filter((media) => media.media_type === "video")
                      .slice(0, 1)
                      .map((media) => (
                        <button
                          key={media.id}
                          type="button"
                          onClick={() => removeMedia(editingVehicle, media)}
                          className="shrink-0 text-xs font-semibold text-red-600"
                        >
                          Remove
                        </button>
                      ))}
                  </div>
                )}

                <label className="mt-4 flex min-h-[96px] cursor-pointer items-center justify-center gap-3 border border-dashed border-[#B08A4C]/50 bg-white px-5 text-center transition hover:bg-[#FFF9ED]">
                  <FiVideo className="text-2xl text-[#B88932]" />
                  <div className="text-left">
                    <div className="text-sm font-semibold">{videoFile ? videoFile.name : "Choose walkaround video"}</div>
                    <div className="mt-1 text-xs text-[#8A7A65]">MP4 or MOV</div>
                  </div>
                  <input
                    type="file"
                    accept="video/mp4,video/quicktime"
                    onChange={handleVideo}
                    className="hidden"
                  />
                </label>
              </section>

              <div className="sticky bottom-0 -mx-5 flex flex-col-reverse gap-3 border-t border-[#9D7C45]/15 bg-[#F7F2EA]/95 px-5 py-4 backdrop-blur sm:-mx-7 sm:flex-row sm:justify-end sm:px-7">
                <button
                  type="button"
                  onClick={() => {
                    setEditorOpen(false);
                    resetEditor();
                  }}
                  className="min-h-12 border border-[#A98C5A]/30 bg-white px-6 text-sm font-semibold"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving || uploading}
                  className="min-h-12 bg-gradient-to-r from-[#98681C] to-[#D2A548] px-7 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading
                    ? "Uploading media…"
                    : saving
                    ? "Saving…"
                    : editingVehicle
                    ? "Save Changes"
                    : "Publish Vehicle"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx global>{`
        .admin-input {
          min-height: 48px;
          width: 100%;
          border: 1px solid rgba(183, 152, 100, 0.32);
          background: white;
          padding-left: 14px;
          padding-right: 14px;
          font-size: 16px;
          outline: none;
        }
        .admin-input:focus {
          border-color: #b88932;
          box-shadow: 0 0 0 2px rgba(184, 137, 50, 0.12);
        }
      `}</style>
    </main>
  );
}

function Field({
  label,
  required,
  className = "",
  children,
}: {
  label: string;
  required?: boolean;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="mb-2 block text-[10px] font-bold uppercase tracking-[0.16em] text-[#73634F]">
        {label}
        {required ? " *" : ""}
      </span>
      {children}
    </label>
  );
}
