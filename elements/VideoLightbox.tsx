"use client";

import React, { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  ColorPickerPopup,
  Dimensions,
  NumberControl,
  ImageGallery,
  IconPicker,
} from "@/components/builder/controls";

function getDimensionsStyles(obj: any, property: "margin" | "padding") {
  if (!obj || typeof obj !== "object") return {};
  const u = obj.unit || "px";
  if (u === "auto") return { [property]: "auto" };
  const t = obj.top === "" || obj.top === undefined ? 0 : obj.top;
  const r = obj.right === "" || obj.right === undefined ? 0 : obj.right;
  const b = obj.bottom === "" || obj.bottom === undefined ? 0 : obj.bottom;
  const l = obj.left === "" || obj.left === undefined ? 0 : obj.left;
  if (t === 0 && r === 0 && b === 0 && l === 0) return {};
  return { [property]: `${t}${u} ${r}${u} ${b}${u} ${l}${u}` };
}

function resolveResponsiveValue<T>(val: any, fallback: T): { desktop: T; tablet: T; mobile: T } {
  if (val === null || val === undefined) {
    return { desktop: fallback, tablet: fallback, mobile: fallback };
  }
  if (typeof val === "object" && !Array.isArray(val)) {
    const desktop = val.desktop !== undefined && val.desktop !== "" ? val.desktop : fallback;
    const tablet = val.tablet !== undefined && val.tablet !== "" ? val.tablet : desktop;
    const mobile = val.mobile !== undefined && val.mobile !== "" ? val.mobile : tablet;
    return { desktop, tablet, mobile };
  }
  return { desktop: val, tablet: val, mobile: val };
}

// Extractor helper for YouTube video IDs
function getYoutubeId(url: string) {
  if (!url) return "";
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : url;
}

/* ── Video Lightbox Element Component ── */
function VideoLightboxFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const thumbnailImage: string = s.content?.thumbnailImage || "";
  const playIcon: string = s.content?.playIcon || "solar:play-bold";
  const youtubeUrl: string = s.content?.youtubeUrl || "";

  // Styling values
  const overlayBg: string = s.style?.overlayBg || "rgba(0, 0, 0, 0.35)";
  const iconColor: string = s.style?.iconColor || "#ffffff";
  const iconBgColor: string = s.style?.iconBgColor || "#006699";
  const iconHoverScale: number = s.style?.iconHoverScale ?? 1.1;

  const heightObj = resolveResponsiveValue(s.style?.boxHeight, 350);

  // States
  const [isOpen, setIsOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute active image height
  let activeHeight = heightObj.desktop;
  if (windowWidth <= 768) {
    activeHeight = heightObj.mobile;
  } else if (windowWidth <= 1024) {
    activeHeight = heightObj.tablet;
  }

  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const videoId = getYoutubeId(youtubeUrl);

  const placeholderThumb = "https://images.unsplash.com/photo-1611162617213-7d7a39e9b1d7?auto=format&fit=crop&w=800&q=80";
  const thumbSrc = thumbnailImage || placeholderThumb;

  return (
    <div
      style={{
        width: "100%",
        display: "flex",
        justifyContent: "center",
        boxSizing: "border-box",
        ...marginStyle,
      }}
    >
      {/* Thumbnail Frame */}
      <div
        onClick={() => videoId && setIsOpen(true)}
        className="w-full overflow-hidden flex flex-col box-border relative group cursor-pointer"
        style={{
          height: `${activeHeight}px`,
          ...paddingStyle,
        }}
      >
        {/* Background Image */}
        <img
          src={thumbSrc}
          alt="Video Playback Thumbnail"
          className="absolute inset-0 w-full h-full object-cover block transition-transform duration-500 group-hover:scale-105"
        />

        {/* Dynamic Dark mask Overlay */}
        <div
          className="absolute inset-0 z-10 transition-opacity duration-300 group-hover:opacity-90"
          style={{ backgroundColor: overlayBg }}
        />

        {/* Centered Play Button */}
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div
            className="w-[72px] h-[72px] rounded-full flex items-center justify-center shadow-lg transition-transform duration-300 ease-out"
            style={{
              backgroundColor: iconBgColor,
              color: iconColor,
              // Apply dynamic scaling on hover using inline style overrides dynamically
              transform: `scale(${isOpen ? 1 : 1})`,
            }}
            // Standard CSS scale hover effect
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = `scale(${iconHoverScale})`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1)";
            }}
          >
            <Icon icon={playIcon} width="32" className="ml-1" />
          </div>
        </div>

        {/* Small decorative edit icons layout top right */}
        <div className="absolute top-4 right-4 z-20 bg-black/40 rounded-r-full px-3 py-1.5 flex items-center gap-1.5 text-white/80 opacity-60">
          <Icon icon="solar:pen-tool-linear" width="14" />
          <Icon icon="solar:crop-minimalistic-linear" width="14" />
          <Icon icon="solar:palette-linear" width="14" />
        </div>
      </div>

      {/* Lightbox Pop-up Modal */}
      {isOpen && videoId && (
        <div
          className="fixed inset-0 bg-black/85 flex items-center justify-center z-9999 p-4 animate-fade-in"
          onClick={() => setIsOpen(false)}
        >
          {/* Close button top right */}
          <button
            className="absolute top-6 right-6 text-white/70 hover:text-white bg-transparent border-none cursor-pointer p-2 z-10000 focus:outline-none"
            onClick={() => setIsOpen(false)}
            aria-label="Close video player"
          >
            <Icon icon="solar:close-circle-bold" width="36" />
          </button>

          {/* Iframe content container */}
          <div
            className="w-full max-w-[850px] aspect-video rounded-xl overflow-hidden shadow-2xl bg-black relative"
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
              title="Video Player Lightbox"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              className="w-full h-full block"
            />
          </div>
        </div>
      )}
    </div>
  );
}

/* ── Element Registry Definition ── */
const videoLightboxElement = {
  type: "colorexperts-video-lightbox",
  category: "colorexperts",
  label: "Video Lightbox",
  icon: "solar:video-frame-play-horizontal-bold-duotone",

  schema: {
    content: {
      thumbnailImage: "",
      playIcon: "solar:play-bold",
      youtubeUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    },

    style: {
      overlayBg: "rgba(0, 0, 0, 0.35)",
      iconColor: "#ffffff",
      iconBgColor: "#006699",
      iconHoverScale: 1.12,
      boxHeight: 350,
    },

    advanced: {
      margin: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
      padding: { top: 0, right: 0, bottom: 0, left: 0, unit: "px" },
    },
  },

  controls: [
    // ═══════════════════ CONTENT TAB ════════════════
    {
      tab: "Content",
      section: "Video Source Options",
      controls: [
        {
          name: "youtubeUrl",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="YouTube Video Link or ID" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "thumbnailImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Background Thumbnail Image" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "playIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Overlay Play Icon" value={value ?? "solar:play-bold"} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Box Theme Colors",
      controls: [
        {
          name: "overlayBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Thumbnail Overlay mask" value={value ?? "rgba(0,0,0,0.35)"} onChange={onChange} />
          ),
        },
        {
          name: "iconBgColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Play Button circle color" value={value ?? "#006699"} onChange={onChange} />
          ),
        },
        {
          name: "iconColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Play Icon glyph color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Box Dimension Layout",
      controls: [
        {
          name: "boxHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Thumbnail Height (px)"
              value={value ?? 350}
              onChange={onChange}
              min={150}
              max={650}
              step={10}
              showSlider
              grid={2}
            />
          ),
        },
        {
          name: "iconHoverScale",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Play Button hover scale factor"
              value={value ?? 1.1}
              onChange={onChange}
              min={1}
              max={1.5}
              step={0.02}
            />
          ),
        },
      ],
    },

    // ═══════════════════ ADVANCED TAB ═══════════════
    {
      tab: "Advanced",
      section: "Spacing Bounds",
      controls: [
        {
          name: "margin",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="margin" value={value} onChange={onChange} />
          ),
        },
        {
          name: "padding",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Dimensions type="padding" value={value} onChange={onChange} />
          ),
        },
      ],
    },
  ],

  render: (element: any) => <VideoLightboxFrontend element={element} />,
};

export default videoLightboxElement;
