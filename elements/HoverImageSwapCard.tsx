"use client";

import React, { useEffect, useState } from "react";
import {
  Text,
  ColorPickerPopup,
  Dimensions,
  Typography,
  NumberControl,
  ImageGallery,
} from "@/components/builder/controls";

function getTypographyStyles(value: any) {
  if (!value || typeof value !== "object") return {};
  const styles: React.CSSProperties = {};
  if (value.fontFamily) styles.fontFamily = value.fontFamily;
  if (value.fontSize) styles.fontSize = `${value.fontSize}${value.fontSizeUnit || "px"}`;
  if (value.fontWeight) styles.fontWeight = value.fontWeight;
  if (value.textTransform) styles.textTransform = value.textTransform as any;
  if (value.fontStyle) styles.fontStyle = value.fontStyle;
  if (value.textDecoration) styles.textDecoration = value.textDecoration;
  if (value.lineHeight && value.lineHeight > 0)
    styles.lineHeight = `${value.lineHeight}${value.lineHeightUnit || "px"}`;
  if (value.letterSpacing !== undefined && value.letterSpacing !== 0)
    styles.letterSpacing = `${value.letterSpacing}${value.letterSpacingUnit || "px"}`;
  return styles;
}

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

/* ── Hover Image Swap Card Component ── */
function HoverImageSwapCardFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const title: string = s.content?.title || "Basic Background remove";
  const price: string = s.content?.price || "$0.49";
  const normalImage: string = s.content?.normalImage || "";
  const hoverImage: string = s.content?.hoverImage || "";

  // Styling values
  const containerBg: string = s.style?.containerBg || "#ffffff";
  const titleColor: string = s.style?.titleColor || "#1f2937";
  const priceColor: string = s.style?.priceColor || "#006699";

  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 300);

  // States
  const [active, setActive] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute active image height
  let activeImageHeight = heightObj.desktop;
  if (windowWidth <= 768) {
    activeImageHeight = heightObj.mobile;
  } else if (windowWidth <= 1024) {
    activeImageHeight = heightObj.tablet;
  }

  // Typography
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const priceTyp = getTypographyStyles(s.style?.priceTypography || {});

  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Placeholders
  const placeholderNormal = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80";
  const placeholderHover = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80&monochrome=1";

  const imgNormal = normalImage || placeholderNormal;
  const imgHover = hoverImage || placeholderHover;

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
      {/* Box container */}
      <div
        className="w-full overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.05)] border border-black/5 flex flex-col box-border transition-all duration-300 hover:shadow-[0_15px_40px_rgba(0,0,0,0.08)]"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* State triggers for desktop (hover) and mobile (tap/click) */}
        <div
          className="relative w-full overflow-hidden select-none cursor-pointer"
          style={{ height: `${activeImageHeight}px` }}
          onMouseEnter={() => setActive(true)}
          onMouseLeave={() => setActive(false)}
          onClick={() => setActive(!active)}
        >
          {/* Default Image 1 */}
          <img
            src={imgNormal}
            alt={title}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 block"
            style={{ opacity: active ? 0 : 1 }}
          />

          {/* Hover Image 2 */}
          <img
            src={imgHover}
            alt={`${title} (revealed)`}
            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-300 block"
            style={{ opacity: active ? 1 : 0 }}
          />
        </div>

        {/* Text descriptions below */}
        <div className="flex flex-col items-center justify-center p-[24px_16px] text-center box-border gap-2">
          {/* Service Title */}
          <h4
            className="text-[16px] font-bold m-0 leading-snug"
            style={{
              color: titleColor,
              ...titleTyp,
            }}
          >
            {title}
          </h4>

          {/* Service Price */}
          <span
            className="text-[20px] font-extrabold leading-none"
            style={{
              color: priceColor,
              ...priceTyp,
            }}
          >
            {price}
          </span>
        </div>
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const hoverImageSwapCardElement = {
  type: "colorexperts-hover-image-swap-card",
  category: "colorexperts",
  label: "Hover & Swap Card",
  icon: "solar:refresh-square-bold-duotone",

  schema: {
    content: {
      title: "Basic Background remove",
      price: "$0.49",
      normalImage: "",
      hoverImage: "",
    },

    style: {
      containerBg: "#ffffff",
      titleColor: "#1f2937",
      priceColor: "#006699",
      imageHeight: 300,
      titleTypography: { fontSize: 16, fontSizeUnit: "px", fontWeight: "700" },
      priceTypography: { fontSize: 20, fontSizeUnit: "px", fontWeight: "800" },
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
      section: "Image Options",
      controls: [
        {
          name: "normalImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Normal Image 1" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "hoverImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Hover Image 2" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Text Content",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Title Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "price",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Price Value" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Theme Colors",
      controls: [
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Content Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color" value={value ?? "#1f2937"} onChange={onChange} />
          ),
        },
        {
          name: "priceColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Price Color" value={value ?? "#006699"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Image Height Setting",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Service Image Height (px)"
              value={value ?? 300}
              onChange={onChange}
              min={120}
              max={600}
              step={10}
              showSlider
              grid={2}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography Settings",
      controls: [
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "priceTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Price Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <HoverImageSwapCardFrontend element={element} />,
};

export default hoverImageSwapCardElement;
