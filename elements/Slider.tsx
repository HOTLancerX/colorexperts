"use client";

import React, { useEffect, useCallback, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";
import {
  Text,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  NumberControl,
  ImageGallery,
} from "@/components/builder/controls";

const TABLET_MAX = 1024;
const MOBILE_MAX = 768;

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

interface SlideItem {
  id: string;
  image: string;
}

/* ── Frontend Component ── */
function SliderFrontend({ element }: { element: any }) {
  const s = element.schema;
  const slides: SlideItem[] = s.content?.slidesList || [];

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Syncing carousels using embla
  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi || !thumbApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi, thumbApi]
  );

  const onSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    const index = mainApi.selectedScrollSnap();
    setSelectedIndex(index);
    thumbApi.scrollTo(index);
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", onSelect);
    mainApi.on("reInit", onSelect);
    onSelect();
    return () => {
      mainApi.off("select", onSelect);
      mainApi.off("reInit", onSelect);
    };
  }, [mainApi, onSelect]);

  // Fullscreen Keyboard Controls
  useEffect(() => {
    if (!isFullscreen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      } else if (e.key === "ArrowRight") {
        setSelectedIndex((prev) => (prev + 1) % slides.length);
        if (mainApi) mainApi.scrollTo((selectedIndex + 1) % slides.length);
      } else if (e.key === "ArrowLeft") {
        setSelectedIndex((prev) => (prev - 1 + slides.length) % slides.length);
        if (mainApi) mainApi.scrollTo((selectedIndex - 1 + slides.length) % slides.length);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isFullscreen, selectedIndex, slides.length, mainApi]);

  // Screen Width monitoring for responsive sizes
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Heights configuration
  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 450);
  let activeImageHeight = heightObj.desktop;
  if (windowWidth <= MOBILE_MAX) {
    activeImageHeight = heightObj.mobile;
  } else if (windowWidth <= TABLET_MAX) {
    activeImageHeight = heightObj.tablet;
  }

  // Spacing & bounds
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Colors
  const containerBg = s.style?.containerBg || "transparent";
  const mainBg = s.style?.mainBg || "#ffffff";
  const thumbBg = s.style?.thumbBg || "#f8fafc";
  const activeBorderColor = s.style?.activeBorderColor || "#3b82f6";
  const arrowColor = s.style?.arrowColor || "#6366f1";
  const separatorColor = s.style?.separatorColor || "#e2e8f0";

  if (slides.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 font-semibold border border-dashed border-gray-300 rounded-2xl">
        Please configure slide images in the builder content panel.
      </div>
    );
  }

  const placeholderImage =
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80";

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
      <div
        className="w-full rounded-2xl overflow-hidden border border-black/5 flex flex-col box-border shadow-[0_12px_36px_rgba(0,0,0,0.03)]"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* TOP SECTION: Main Slider viewport */}
        <div
          className="relative w-full overflow-hidden flex items-center justify-center transition-colors duration-300"
          style={{
            height: `${activeImageHeight}px`,
            backgroundColor: mainBg,
          }}
        >
          {/* Zoom Fullscreen trigger button */}
          <button
            type="button"
            onClick={() => setIsFullscreen(true)}
            className="absolute z-1000 top-4 right-4 w-10 h-10 rounded-full border-none bg-white/80 hover:bg-white text-slate-700 shadow-md cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            title="View Fullscreen"
          >
            <Icon icon="solar:maximize-linear" width="22" />
          </button>

          {/* Left/Right Arrows */}
          <button
            type="button"
            onClick={() => mainApi && mainApi.scrollPrev()}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border-none bg-white/70 hover:bg-white/95 rounded-full shadow cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            style={{ color: arrowColor }}
          >
            <Icon icon="solar:alt-arrow-left-linear" width="24" />
          </button>
          <button
            type="button"
            onClick={() => mainApi && mainApi.scrollNext()}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-10 h-10 border-none bg-white/70 hover:bg-white/95 rounded-full shadow cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            style={{ color: arrowColor }}
          >
            <Icon icon="solar:alt-arrow-right-linear" width="24" />
          </button>

          {/* Embla Viewport container */}
          <div className="w-full h-full overflow-hidden" ref={mainRef}>
            <div className="flex h-full">
              {slides.map((slide, idx) => (
                <div
                  key={slide.id || idx}
                  className="relative min-w-0 flex-[0_0_100%] h-full flex items-center justify-center p-6 box-border"
                >
                  <img
                    src={slide.image || placeholderImage}
                    alt={`Slide #${idx + 1}`}
                    className="block max-w-full max-h-full object-contain pointer-events-none select-none"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center",
                    }}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Separator line */}
        <div style={{ height: "1px", backgroundColor: separatorColor, width: "100%" }} />

        {/* BOTTOM SECTION: Syncing thumbnails scrollbar carousel */}
        <div
          className="w-full py-4 px-6 box-border transition-colors duration-300"
          style={{
            backgroundColor: thumbBg,
          }}
        >
          <div className="w-full overflow-hidden" ref={thumbRef}>
            <div className="flex gap-3">
              {slides.map((slide, idx) => {
                const isActive = idx === selectedIndex;
                return (
                  <button
                    key={slide.id || idx}
                    type="button"
                    onClick={() => onThumbClick(idx)}
                    className="relative shrink-0 w-20 h-20 rounded-xl overflow-hidden bg-white border border-gray-100 flex items-center justify-center p-1 box-border cursor-pointer transition-all focus:outline-none"
                    style={{
                      borderColor: isActive ? activeBorderColor : "rgba(0,0,0,0.06)",
                      borderWidth: isActive ? "2.5px" : "1px",
                      boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.1)" : "none",
                    }}
                  >
                    <img
                      src={slide.image || placeholderImage}
                      alt={`Thumbnail #${idx + 1}`}
                      className="max-w-full max-h-full object-contain pointer-events-none select-none rounded-lg"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "contain",
                      }}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* FULLSCREEN LIGHTBOX PORTAL OVERLAY */}
        {isFullscreen && (
          <div
            className="fixed inset-0 z-9999 bg-white flex flex-col justify-between p-6 box-border select-none animate-fadeIn"
            style={{ touchAction: "none" }}
          >
            {/* Close fullscreen Button top-right */}
            <button
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="absolute top-6 right-6 z-10000 w-12 h-12 border-none bg-transparent hover:bg-slate-100/80 text-slate-800 rounded-full cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            >
              <Icon icon="ic:sharp-close" width="32" />
            </button>

            {/* Left & Right Screen Arrows */}
            <button
              type="button"
              onClick={() => {
                const prevIdx = (selectedIndex - 1 + slides.length) % slides.length;
                setSelectedIndex(prevIdx);
                if (mainApi) mainApi.scrollTo(prevIdx);
              }}
              className="absolute left-6 top-1/2 -translate-y-1/2 z-10000 w-14 h-14 border-none bg-slate-100/50 hover:bg-slate-100 text-slate-800 rounded-full shadow-sm cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            >
              <Icon icon="solar:alt-arrow-left-linear" width="30" />
            </button>
            <button
              type="button"
              onClick={() => {
                const nextIdx = (selectedIndex + 1) % slides.length;
                setSelectedIndex(nextIdx);
                if (mainApi) mainApi.scrollTo(nextIdx);
              }}
              className="absolute right-6 top-1/2 -translate-y-1/2 z-10000 w-14 h-14 border-none bg-slate-100/50 hover:bg-slate-100 text-slate-800 rounded-full shadow-sm cursor-pointer flex items-center justify-center transition-all hover:scale-105"
            >
              <Icon icon="solar:alt-arrow-right-linear" width="30" />
            </button>

            {/* Central large active image panel */}
            <div className="flex-1 w-full flex items-center justify-center py-10">
              <img
                src={slides[selectedIndex]?.image || placeholderImage}
                alt={`Zoom Slide #${selectedIndex + 1}`}
                className="max-w-[85%] max-h-[75vh] object-contain pointer-events-none"
                style={{
                  objectFit: "contain",
                  objectPosition: "center",
                }}
              />
            </div>

            {/* Fullscreen bottom thumbnails bar */}
            <div className="w-full flex justify-center py-4 bg-transparent">
              <div className="flex items-center gap-3 overflow-x-auto max-w-[90%] pb-2 no-scrollbar scroll-smooth">
                {slides.map((slide, idx) => {
                  const isActive = idx === selectedIndex;
                  return (
                    <button
                      key={slide.id || idx}
                      type="button"
                      onClick={() => {
                        setSelectedIndex(idx);
                        if (mainApi) mainApi.scrollTo(idx);
                      }}
                      className="relative shrink-0 w-16 h-16 rounded-xl overflow-hidden bg-white border flex items-center justify-center p-1 cursor-pointer transition-all focus:outline-none"
                      style={{
                        borderColor: isActive ? activeBorderColor : "rgba(0,0,0,0.06)",
                        borderWidth: isActive ? "2.5px" : "1px",
                        boxShadow: isActive ? "0 4px 12px rgba(59, 130, 246, 0.08)" : "none",
                      }}
                    >
                      <img
                        src={slide.image || placeholderImage}
                        alt={`Zoom Thumb #${idx + 1}`}
                        className="max-w-full max-h-full object-contain pointer-events-none rounded-lg"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "contain",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const sliderElement = {
  type: "slider-color",
  category: "colorexperts",
  label: "Slider Box",
  icon: "solar:gallery-wide-bold-duotone",

  schema: {
    content: {
      slidesList: [
        {
          id: "slide1",
          image: "https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "slide2",
          image: "https://images.unsplash.com/photo-1486218119243-13883505764c?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "slide3",
          image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "slide4",
          image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "slide5",
          image: "https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "slide6",
          image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=600&q=80",
        },
        {
          id: "slide7",
          image: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&w=600&q=80",
        },
      ],
    },

    style: {
      containerBg: "transparent",
      mainBg: "#ffffff",
      thumbBg: "#f8fafc",
      activeBorderColor: "#3b82f6",
      arrowColor: "#6366f1",
      separatorColor: "#e2e8f0",
      imageHeight: 450,
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
      section: "Slides Setup",
      controls: [
        {
          name: "slidesList",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Slide #${idx + 1}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Slide
                      </button>
                    </div>

                    <ImageGallery
                      label="Slide Image"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], image: v };
                        onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newSlide = {
                    id: `sl_${Date.now()}`,
                    image: "",
                  };
                  onChange([...(value || []), newSlide]);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-bold cursor-pointer transition-colors"
              >
                + Add Slide Image
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Colors & Backgrounds",
      controls: [
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Full Outer Container Background" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "mainBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Top Section Backdrop Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "thumbBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Bottom Thumbnail Background Color" value={value ?? "#f8fafc"} onChange={onChange} />
          ),
        },
        {
          name: "activeBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Thumbnail Border Color" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "arrowColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Navigation Arrows Color" value={value ?? "#6366f1"} onChange={onChange} />
          ),
        },
        {
          name: "separatorColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Separator Divider Color" value={value ?? "#e2e8f0"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Dimensions Settings",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Slider Height (px)"
              value={value ?? 450}
              onChange={onChange}
              min={150}
              max={800}
              step={10}
              showSlider
              grid={2}
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

  render: (element: any) => <SliderFrontend element={element} />,
};

export default sliderElement;
