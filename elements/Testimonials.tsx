"use client";

import React, { useEffect, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
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

interface TestimonialCard {
  id: string;
  name: string;
  role: string;
  avatar: string;
  quote: string;
  rating: number;
  footerBg: string;
  quoteImage?: string;
}

/* ── Frontend Component ── */
function TestimonialsFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cards: TestimonialCard[] = s.content?.cardsList || [];
  const subtitleText = s.content?.subtitleText || "feedback";
  const titleText = s.content?.titleText || "Explore Clients Feedbacks";

  // Embla Carousel hook
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
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

  // Screen Width monitoring for responsive columns
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slidesToShow = resolveResponsiveValue(s.style?.slidesToShow, 3);
  let activeSlidesToShow = slidesToShow.desktop;
  if (windowWidth <= MOBILE_MAX) {
    activeSlidesToShow = slidesToShow.mobile;
  } else if (windowWidth <= TABLET_MAX) {
    activeSlidesToShow = slidesToShow.tablet;
  }

  const slideBasis = `${100 / activeSlidesToShow}%`;

  // Spacing & colors
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const containerBg = s.style?.containerBg || "transparent";
  const subtitleColor = s.style?.subtitleColor || "#4f46e5";
  const titleColor = s.style?.titleColor || "#1e293b";
  
  const cardBg = s.style?.cardBg || "#ffffff";
  const quoteTextColor = s.style?.quoteTextColor || "#4b5563";
  const clientNameColor = s.style?.clientNameColor || "#312e81";
  const clientRoleColor = s.style?.clientRoleColor || "#94a3b8";
  
  const activeDotColor = s.style?.activeDotColor || "#3b82f6";
  const inactiveDotColor = s.style?.inactiveDotColor || "#cbd5e1";

  // Typographies
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const quoteTyp = getTypographyStyles(s.style?.quoteTypography || {});

  if (cards.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 font-semibold border border-dashed border-gray-300 rounded-2xl">
        Please configure testimonials in the builder content panel.
      </div>
    );
  }

  const placeholderAvatar =
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80";

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
      {/* Import Dancing Script for cursive subtitle */}
      <link
        href="https://fonts.googleapis.com/css2?family=Dancing+Script:wght@700&display=swap"
        rel="stylesheet"
      />

      <div
        className="w-full flex flex-col items-center box-border gap-4"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* Header Title Section */}
        <div className="flex flex-col items-center text-center gap-1.5 mb-6">
          <span
            className="text-xl font-bold tracking-wide italic"
            style={{
              color: subtitleColor,
              fontFamily: "'Dancing Script', cursive, sans-serif",
            }}
          >
            {subtitleText}
          </span>
          <h2
            className="text-3.5xl font-extrabold m-0 leading-tight tracking-tight text-slate-800"
            style={{ color: titleColor, ...titleTyp }}
          >
            {titleText}
          </h2>
        </div>

        {/* Carousel slide track container */}
        <div className="w-full overflow-visible" ref={emblaRef}>
          <div className="flex -ml-6 pb-6 pt-10 overflow-visible">
            {cards.map((card, idx) => {
              const rating = card.rating || 5;

              return (
                <div
                  key={card.id || idx}
                  className="min-w-0 pl-6 box-border shrink-0 overflow-visible"
                  style={{
                    flex: `0 0 ${slideBasis}`,
                  }}
                >
                  {/* Card Container Box */}
                  <div
                    className="relative w-full rounded-2xl border border-black/5 bg-white flex flex-col justify-between box-border shadow-[0_8px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.05)] hover:-translate-y-1 overflow-visible"
                    style={{
                      backgroundColor: cardBg,
                      minHeight: "260px",
                    }}
                  >
                    {/* Overlapping top-left client profile headshot */}
                    <div className="absolute top-0 left-6 -translate-y-1/2 w-16 h-16 rounded-full border-[3px] border-white overflow-hidden shadow-md bg-slate-100 z-10">
                      <img
                        src={card.avatar || placeholderAvatar}
                        alt={card.name}
                        className="w-full h-full object-cover pointer-events-none"
                      />
                    </div>

                    {/* Overlapping top-right decorative quote image */}
                    <div className="absolute top-4 right-6 z-10">
                      {card.quoteImage ? (
                        <img
                          src={card.quoteImage}
                          alt="Quote icon"
                          className="w-11 h-9 object-contain"
                        />
                      ) : (
                        <Icon icon="fluent:comment-quote-20-regular" width="40" className="text-blue-400/80" />
                      )}
                    </div>

                    {/* Card message body */}
                    <div className="pt-12 px-6 pb-6 flex-1 flex flex-col justify-center">
                      <p
                        className="text-[14.5px] leading-relaxed m-0 text-slate-600 font-medium"
                        style={{ color: quoteTextColor, ...quoteTyp }}
                      >
                        {card.quote}
                      </p>
                    </div>

                    {/* Footer colored panel section */}
                    <div
                      className="w-full py-4 px-6 rounded-b-2xl border-t border-black/2 flex items-center justify-between box-border"
                      style={{
                        backgroundColor: card.footerBg || "#f3f6ff",
                      }}
                    >
                      {/* Name & Title */}
                      <div className="flex flex-col text-left gap-0.5 max-w-[65%]">
                        <span
                          className="text-[14.5px] font-bold tracking-tight text-indigo-950 truncate"
                          style={{ color: clientNameColor }}
                        >
                          {card.name}
                        </span>
                        <span
                          className="text-[12px] font-medium text-slate-400 truncate"
                          style={{ color: clientRoleColor }}
                        >
                          {card.role}
                        </span>
                      </div>

                      {/* Golden Star Rating */}
                      <div className="flex items-center gap-0.5 shrink-0">
                        {Array.from({ length: 5 }).map((_, starIdx) => {
                          const isFilled = starIdx < rating;
                          return (
                            <Icon
                              key={starIdx}
                              icon={isFilled ? "solar:star-bold" : "solar:star-linear"}
                              width="15"
                              className={isFilled ? "text-amber-400" : "text-slate-300"}
                            />
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Navigation Dot Indicators */}
        {scrollSnaps.length > 1 && (
          <div className="flex items-center justify-center gap-2 mt-4">
            {scrollSnaps.map((_, index) => {
              const isActive = index === selectedIndex;
              return (
                <button
                  key={index}
                  type="button"
                  onClick={() => emblaApi && emblaApi.scrollTo(index)}
                  className="w-2.5 h-2.5 rounded-full border-none cursor-pointer transition-all duration-300 p-0 focus:outline-none"
                  style={{
                    backgroundColor: isActive ? activeDotColor : inactiveDotColor,
                    transform: isActive ? "scale(1.15)" : "scale(1)",
                  }}
                  aria-label={`Go to slide page ${index + 1}`}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const testimonialsElement = {
  type: "testimonials-color",
  category: "colorexperts",
  label: "Testimonials",
  icon: "solar:chat-square-like-bold-duotone",

  schema: {
    content: {
      subtitleText: "feedback",
      titleText: "Explore Clients Feedbacks",
      cardsList: [
        {
          id: "t1",
          name: "Anna Jackson",
          role: "company of client",
          avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&h=120&q=80",
          quote: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo, vel?",
          rating: 5,
          footerBg: "#f3f6ff", // lavender/blue
          quoteImage: "",
        },
        {
          id: "t2",
          name: "Michael Smith",
          role: "company of client",
          avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&h=120&q=80",
          quote: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo, vel?",
          rating: 5,
          footerBg: "#f2faf5", // light green/teal
          quoteImage: "",
        },
        {
          id: "t3",
          name: "Sarah Jenkins",
          role: "company of client",
          avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&h=120&q=80",
          quote: "Lorem ipsum dolor, sit amet consectetur adipisicing elit. Explicabo, vel?",
          rating: 5,
          footerBg: "#fff5f5", // light pink/orange
          quoteImage: "",
        },
      ],
    },

    style: {
      containerBg: "transparent",
      subtitleColor: "#4f46e5",
      titleColor: "#1e293b",
      cardBg: "#ffffff",
      quoteTextColor: "#4b5563",
      clientNameColor: "#312e81",
      clientRoleColor: "#94a3b8",
      activeDotColor: "#3b82f6",
      inactiveDotColor: "#cbd5e1",
      slidesToShow: { desktop: 3, tablet: 2, mobile: 1 },
      titleTypography: { fontSize: 36, fontSizeUnit: "px", fontWeight: "800" },
      quoteTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "500" },
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
          name: "subtitleText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Feedback Subtitle text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "titleText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Main Title header text" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Client Feedbacks Setup",
      controls: [
        {
          name: "cardsList",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Feedback #${idx + 1}: ${item.name || ""}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Testimonial
                      </button>
                    </div>

                    <Text
                      label="Client Name"
                      value={item.name || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], name: v };
                        onChange(u);
                      }}
                    />

                    <Text
                      label="Client Designation / Company"
                      value={item.role || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], role: v };
                        onChange(u);
                      }}
                    />

                    <Textarea
                      label="Testimonial Quote Text"
                      value={item.quote || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], quote: v };
                        onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Quote"
                      value={item.quoteImage || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], quoteImage: v };
                        onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Client Avatar Headshot"
                      value={item.avatar || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], avatar: v };
                        onChange(u);
                      }}
                    />

                    <ColorPickerPopup
                      label="Footer Backdrop Color"
                      value={item.footerBg || "#f3f6ff"}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], footerBg: v };
                        onChange(u);
                      }}
                    />

                    <NumberControl
                      label="Rating Stars (1-5)"
                      value={item.rating ?? 5}
                      onChange={(v: number) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], rating: v };
                        onChange(u);
                      }}
                      min={1}
                      max={5}
                      step={1}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newCard = {
                    id: `tc_${Date.now()}`,
                    name: "Anna Jackson",
                    role: "company of client",
                    avatar: "",
                    quote: "Great quality edit and fast turnaround time!",
                    rating: 5,
                    footerBg: "#f3f6ff",
                    quoteImage: "",
                  };
                  onChange([...(value || []), newCard]);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-bold cursor-pointer transition-colors"
              >
                + Add Client Review
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
          name: "subtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Feedback Subtitle Color" value={value ?? "#4f46e5"} onChange={onChange} />
          ),
        },
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Title Color" value={value ?? "#1e293b"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Card Theme Details",
      controls: [
        {
          name: "cardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Body Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "quoteTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Quote Content Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "clientNameColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Client Name Color" value={value ?? "#312e81"} onChange={onChange} />
          ),
        },
        {
          name: "clientRoleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Client Company/Role Color" value={value ?? "#94a3b8"} onChange={onChange} />
          ),
        },
        {
          name: "activeDotColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Navigation Dot Color" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "inactiveDotColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Dot Color" value={value ?? "#cbd5e1"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Carousel Columns settings",
      controls: [
        {
          name: "slidesToShow",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Cards on Display per Screen"
              value={value ?? 3}
              onChange={onChange}
              min={1}
              max={5}
              step={1}
              showSlider
              grid={2}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography Details",
      controls: [
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Header Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "quoteTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Quote Text Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <TestimonialsFrontend element={element} />,
};

export default testimonialsElement;
