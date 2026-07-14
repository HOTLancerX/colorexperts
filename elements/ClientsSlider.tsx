"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import {
  Text,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  Url,
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

interface ClientLogoItem {
  id: string;
  logoImage: string;
  websiteUrl?: any;
}

/* ── Testimonials Slider Main Component ── */
function ClientsSliderFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content Configuration
  const title: string = s.content?.title || "RENOWNED CLIENTS";
  const subtitle: string = s.content?.subtitle || "Be Connected with our latest articles & tutorials to get the best things";
  const items: ClientLogoItem[] = s.content?.items || [];

  // Carousel layout configuration
  const colsDesktop = s.content?.colsDesktop ?? 4;
  const colsTablet = s.content?.colsTablet ?? 3;
  const colsMobile = s.content?.colsMobile ?? 2;
  const gap = s.content?.gap ?? 32;

  // Colors Configuration
  const headerColor: string = s.style?.headerColor || "#111827";
  const subtitleColor: string = s.style?.subtitleColor || "#6b7280";

  // Screen Width monitoring for responsive columns
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute active columns
  let activeCols = colsDesktop;
  if (windowWidth <= 768) {
    activeCols = colsMobile;
  } else if (windowWidth <= 1024) {
    activeCols = colsTablet;
  }

  // Typography
  const headerTyp = getTypographyStyles(s.style?.headerTypography || {});

  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Embla setup
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    align: "start",
    slidesToScroll: 1,
  });

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);

  const onInit = useCallback((api: any) => {
    setScrollSnaps(api.scrollSnapList());
  }, []);

  const onSelect = useCallback((api: any) => {
    setSelectedIndex(api.selectedScrollSnap());
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onInit(emblaApi);
    onSelect(emblaApi);
    emblaApi.on("reInit", onInit);
    emblaApi.on("select", onSelect);
  }, [emblaApi, onInit, onSelect]);

  const placeholderLogo = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=150&h=60&q=80";

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      {/* Centered header details */}
      <div className="flex flex-col items-center w-full mb-12 select-none">
        <h2
          className="text-3xl font-extrabold tracking-wide mb-3 m-0 text-center uppercase"
          style={{
            color: headerColor,
            ...headerTyp,
          }}
        >
          {title}
        </h2>

        {subtitle && (
          <p
            className="text-base text-center max-w-2xl m-0 leading-relaxed mb-5"
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </p>
        )}

        {/* Square dots dividers */}
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 bg-[#62b359] rounded-sm" />
          <span className="w-2 h-2 bg-[#f1c40f] rounded-sm" />
          <span className="w-2 h-2 bg-[#3498db] rounded-sm" />
          <span className="w-2 h-2 bg-[#2c3e50] rounded-sm" />
        </div>
      </div>

      {/* Embla Track slider */}
      <div className="w-full relative overflow-hidden" ref={emblaRef}>
        <div
          className="flex items-center"
          style={{ marginLeft: `-${gap}px` }}
        >
          {items.map((item, idx) => {
            const logoSrc = item.logoImage || placeholderLogo;
            const linkUrl = item.websiteUrl?.url || "";
            const LogoImgElement = (
              <img
                src={logoSrc}
                alt="Client Logo"
                className="max-w-full max-h-[64px] object-contain block opacity-70 hover:opacity-100 grayscale hover:grayscale-0 transition-all duration-300 select-none cursor-pointer mx-auto"
              />
            );

            return (
              <div
                key={item.id || idx}
                style={{
                  flex: `0 0 ${100 / activeCols}%`,
                  minWidth: 0,
                  paddingLeft: `${gap}px`,
                  boxSizing: "border-box",
                }}
              >
                {linkUrl ? (
                  <a
                    href={linkUrl}
                    target={item.websiteUrl?.target || "_blank"}
                    rel={item.websiteUrl?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                    className="block focus:outline-none"
                  >
                    {LogoImgElement}
                  </a>
                ) : (
                  LogoImgElement
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* dots ring pagination indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 p-0 border-none bg-transparent"
              aria-label={`Go to slide page ${index + 1}`}
            >
              <span
                className="rounded-full transition-all duration-300"
                style={{
                  width: index === selectedIndex ? "6px" : "8px",
                  height: index === selectedIndex ? "6px" : "8px",
                  backgroundColor: index === selectedIndex ? "#e09212" : "#9ca3af",
                  outline: index === selectedIndex ? "2px solid #e09212" : "none",
                  outlineOffset: index === selectedIndex ? "3px" : "0px",
                }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Element Registry Definition ── */
const clientsSliderElement = {
  type: "colorexperts-clients-slider",
  category: "colorexperts",
  label: "Clients Slider",
  icon: "solar:users-group-rounded-bold-duotone",

  schema: {
    content: {
      title: "RENOWNED CLIENTS",
      subtitle: "Be Connected with our latest articles & tutorials to get the best things about photography, editing & creative world",
      colsDesktop: 4,
      colsTablet: 3,
      colsMobile: 2,
      gap: 32,
      items: [
        { id: "c1", logoImage: "", websiteUrl: { url: "#", target: "_blank", nofollow: false } },
        { id: "c2", logoImage: "", websiteUrl: { url: "#", target: "_blank", nofollow: false } },
        { id: "c3", logoImage: "", websiteUrl: { url: "#", target: "_blank", nofollow: false } },
        { id: "c4", logoImage: "", websiteUrl: { url: "#", target: "_blank", nofollow: false } },
      ],
    },

    style: {
      headerColor: "#111827",
      subtitleColor: "#6b7280",
      headerTypography: { fontSize: 28, fontSizeUnit: "px", fontWeight: "800" },
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
      section: "Header Settings",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Header Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "subtitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Header Subtitle" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Layout Columns Settings",
      controls: [
        {
          name: "colsDesktop",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Desktop)" value={value ?? 4} onChange={onChange} min={1} max={8} />
          ),
        },
        {
          name: "colsTablet",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Tablet)" value={value ?? 3} onChange={onChange} min={1} max={6} />
          ),
        },
        {
          name: "colsMobile",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Mobile)" value={value ?? 2} onChange={onChange} min={1} max={4} />
          ),
        },
        {
          name: "gap",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Gap between logos (px)" value={value ?? 32} onChange={onChange} min={0} max={80} step={4} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Client Logos List",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Client Logo #${idx + 1}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Logo
                      </button>
                    </div>

                    <ImageGallery
                      label="Logo Image"
                      value={item.logoImage || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], logoImage: v }; onChange(u);
                      }}
                    />

                    <Url
                      label="Link to Website URL (Optional)"
                      value={item.websiteUrl || { url: "", target: "_blank", nofollow: false }}
                      onChange={(v: any) => {
                        const u = [...value]; u[idx] = { ...u[idx], websiteUrl: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: ClientLogoItem = {
                    id: `c_${Date.now()}`,
                    logoImage: "",
                    websiteUrl: { url: "", target: "_blank", nofollow: false },
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-semibold cursor-pointer transition-colors"
              >
                + Add Client Logo
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Header Colors",
      controls: [
        {
          name: "headerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Title Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "subtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Subtitle Color" value={value ?? "#6b7280"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "headerTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Header Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <ClientsSliderFrontend element={element} />,
};

export default clientsSliderElement;
