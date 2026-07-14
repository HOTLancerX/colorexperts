"use client";

import React, { useEffect, useState, useCallback } from "react";
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
  Url,
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

const TABLET_MAX = 1024;
const MOBILE_MAX = 768;

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

interface CardItem {
  id: string;
  title: string;
  description: string;
  image: string;
  bgColor: string;
  pricePrefix: string;
  priceValue: string;
  priceSuffix: string;
  btnLink: any;
}

/* ── Frontend Component ── */
function BoxSliderFrontend({ element }: { element: any }) {
  const s = element.schema;
  const cards: CardItem[] = s.content?.cardsList || [];
  const titleText = s.content?.titleText || "Photo-Editing Services";

  // Embla Carousel hook
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    align: "start",
  });

  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(true);

  // Screen Width monitoring for responsive columns
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const slidesToShow = resolveResponsiveValue(s.style?.slidesToShow, 4);
  let activeSlidesToShow = slidesToShow.desktop;
  if (windowWidth <= MOBILE_MAX) {
    activeSlidesToShow = slidesToShow.mobile;
  } else if (windowWidth <= TABLET_MAX) {
    activeSlidesToShow = slidesToShow.tablet;
  }

  const slideBasis = `${100 / activeSlidesToShow}%`;

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setCanPrev(emblaApi.canScrollPrev());
    setCanNext(emblaApi.canScrollNext());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi, onSelect]);

  // Spacing & colors
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const containerBg = s.style?.containerBg || "transparent";
  const titleColor = s.style?.titleColor || "#1e293b";
  const arrowColor = s.style?.arrowColor || "#312e81";
  const arrowBg = s.style?.arrowBg || "#ffffff";
  const arrowHoverBg = s.style?.arrowHoverBg || "#eff6ff";
  
  const cardBg = s.style?.cardBg || "#ffffff";
  const cardTitleColor = s.style?.cardTitleColor || "#1e293b";
  const cardDescColor = s.style?.cardDescColor || "#64748b";
  const priceColor = s.style?.priceColor || "#3b82f6";
  const priceTextColor = s.style?.priceTextColor || "#94a3b8";
  
  const ctaBtnBg = s.style?.ctaBtnBg || "#3b82f6";
  const ctaBtnHoverBg = s.style?.ctaBtnHoverBg || "#2563eb";
  const ctaIconColor = s.style?.ctaIconColor || "#ffffff";

  // Typographies
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const cardTitleTyp = getTypographyStyles(s.style?.cardTitleTypography || {});

  // Hover states tracking for individual cards
  const [hoveredCardId, setHoveredCardId] = useState<string | null>(null);

  if (cards.length === 0) {
    return (
      <div className="p-8 text-center text-gray-400 font-semibold border border-dashed border-gray-300 rounded-2xl">
        Please configure cards in the builder content panel.
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
        className="w-full max-w-[1200px] flex flex-col box-border gap-6 px-4"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* Header bar layout */}
        <div className="flex items-center justify-between w-full">
          <h2
            className="text-3xl font-extrabold m-0 leading-tight tracking-tight"
            style={{ color: titleColor, ...titleTyp }}
          >
            {titleText}
          </h2>

          {/* Navigation arrow buttons */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => emblaApi && emblaApi.scrollPrev()}
              className="w-11 h-11 rounded-full border-none shadow-sm cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: arrowBg,
                color: arrowColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = arrowHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = arrowBg;
              }}
            >
              <Icon icon="solar:alt-arrow-left-linear" width="22" />
            </button>
            <button
              type="button"
              onClick={() => emblaApi && emblaApi.scrollNext()}
              className="w-11 h-11 rounded-full border-none shadow-sm cursor-pointer flex items-center justify-center transition-all duration-200 hover:-translate-y-0.5"
              style={{
                backgroundColor: arrowBg,
                color: arrowColor,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = arrowHoverBg;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = arrowBg;
              }}
            >
              <Icon icon="solar:alt-arrow-right-linear" width="22" />
            </button>
          </div>
        </div>

        {/* Carousel slide container */}
        <div className="w-full overflow-hidden" ref={emblaRef}>
          <div className="flex -ml-6 pb-8">
            {cards.map((card, idx) => {
              const isHovered = card.id === hoveredCardId;
              const linkUrl = card.btnLink?.url || "#";
              const linkTarget = card.btnLink?.target || "_self";
              const linkNofollow = card.btnLink?.nofollow;

              return (
                <div
                  key={card.id || idx}
                  className="min-w-0 pl-6 box-border shrink-0"
                  style={{
                    flex: `0 0 ${slideBasis}`,
                  }}
                >
                  <a
                    href={linkUrl}
                    target={linkTarget}
                    rel={linkNofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                    onMouseEnter={() => setHoveredCardId(card.id)}
                    onMouseLeave={() => setHoveredCardId(null)}
                    className="relative flex w-full rounded-xl border border-black/5 no-underline flex-col box-border shadow-[0_8px_24px_rgba(0,0,0,0.02)] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.06)] hover:-translate-y-1"
                    style={{
                      backgroundColor: cardBg,
                      height: "100%",
                      minHeight: "350px",
                    }}
                  >
                    {/* Top colored panel with grid layout */}
                    <div
                      className="w-full h-48 rounded-t-[22px] overflow-hidden flex items-center justify-center p-6 box-border transition-opacity duration-300"
                      style={{
                        backgroundColor: card.bgColor || "#a78bfa",
                        backgroundImage:
                          "linear-gradient(to right, rgba(255, 255, 255, 0.16) 1px, transparent 1px), linear-gradient(to bottom, rgba(255, 255, 255, 0.16) 1px, transparent 1px)",
                        backgroundSize: "20px 20px",
                        backgroundPosition: "center",
                      }}
                    >
                      <img
                        src={card.image || placeholderImage}
                        alt={card.title}
                        className="max-w-full max-h-full object-contain pointer-events-none transition-transform duration-500 scale-100"
                        style={{
                          transform: isHovered ? "scale(1.06)" : "scale(1)",
                        }}
                      />
                    </div>

                    {/* Bottom description / details section */}
                    <div className="flex-1 flex flex-col items-center justify-between p-2 pb-9 text-center box-border gap-2">
                      <div className="flex flex-col items-center gap-2">
                        <h3
                          className="text-[20px] font-bold m-0 leading-snug line-clamp-2"
                          style={{ color: cardTitleColor, ...cardTitleTyp }}
                        >
                          {card.title}
                        </h3>
                        <p
                          className="text-[13.5px] leading-relaxed m-0 line-clamp-3"
                          style={{ color: cardDescColor }}
                        >
                          {card.description}
                        </p>
                      </div>

                      {/* Pricing block */}
                      <div className="flex items-center gap-1 text-[13.5px] font-medium" style={{ color: priceTextColor }}>
                        <span>{card.pricePrefix || "Starting at"}</span>
                        <span className="font-extrabold text-[15.5px] tracking-tight" style={{ color: priceColor }}>
                          {card.priceValue || "$1.19"}
                        </span>
                        <span>{card.priceSuffix || "per image"}</span>
                      </div>
                    </div>

                    {/* Absolute Bottom circular arrow button overlapping */}
                    <div
                      className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-12 h-12 rounded-full flex items-center justify-center shadow-lg transition-colors duration-250 cursor-pointer"
                      style={{
                        backgroundColor: isHovered ? ctaBtnHoverBg : ctaBtnBg,
                        boxShadow: isHovered 
                          ? "0 6px 20px rgba(37, 99, 235, 0.35)" 
                          : "0 4px 15px rgba(59, 130, 246, 0.25)",
                      }}
                    >
                      <Icon
                        icon="solar:alt-arrow-right-linear"
                        width="20"
                        style={{ color: ctaIconColor }}
                      />
                    </div>
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const boxSliderElement = {
  type: "box-slider",
  category: "colorexperts",
  label: "Box Slider",
  icon: "solar:slider-minimalistic-horizontal-bold-duotone",

  schema: {
    content: {
      titleText: "Photo-Editing Services",
      cardsList: [
        {
          id: "card1",
          title: "Image Masking",
          description: "There are many variations of passages",
          pricePrefix: "Starting at",
          priceValue: "$1.19",
          priceSuffix: "per image",
          image: "https://images.unsplash.com/photo-1608256246200-53e635b5b65f?auto=format&fit=crop&w=300&q=80",
          bgColor: "#a78bfa",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "card2",
          title: "Clipping Path",
          description: "There are many variations of passages",
          pricePrefix: "Starting at",
          priceValue: "$1.19",
          priceSuffix: "per image",
          image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=300&q=80",
          bgColor: "#f87171",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "card3",
          title: "Multi-clipping Path",
          description: "There are many variations of passages",
          pricePrefix: "Starting at",
          priceValue: "$1.19",
          priceSuffix: "per image",
          image: "https://images.unsplash.com/photo-1485965120184-e220f721d03e?auto=format&fit=crop&w=300&q=80",
          bgColor: "#fbbf24",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "card4",
          title: "Background",
          description: "There are many variations of passages",
          pricePrefix: "Starting at",
          priceValue: "$1.19",
          priceSuffix: "per image",
          image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=300&q=80",
          bgColor: "#60a5fa",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
      ],
    },

    style: {
      containerBg: "transparent",
      titleColor: "#1e293b",
      arrowColor: "#312e81",
      arrowBg: "#ffffff",
      arrowHoverBg: "#eff6ff",
      cardBg: "#ffffff",
      cardTitleColor: "#1e293b",
      cardDescColor: "#64748b",
      priceColor: "#3b82f6",
      priceTextColor: "#94a3b8",
      ctaBtnBg: "#3b82f6",
      ctaBtnHoverBg: "#2563eb",
      ctaIconColor: "#ffffff",
      titleTypography: { fontSize: 30, fontSizeUnit: "px", fontWeight: "800" },
      cardTitleTypography: { fontSize: 20, fontSizeUnit: "px", fontWeight: "700" },
      slidesToShow: { desktop: 4, tablet: 2, mobile: 1 },
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
          name: "titleText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Slider Header Title" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Carousel Cards Setup",
      controls: [
        {
          name: "cardsList",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Card Item #${idx + 1}: ${item.title || ""}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Card
                      </button>
                    </div>

                    <Text
                      label="Card Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], title: v };
                        onChange(u);
                      }}
                    />

                    <Text
                      label="Description Line"
                      value={item.description || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], description: v };
                        onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Product Image"
                      value={item.image || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], image: v };
                        onChange(u);
                      }}
                    />

                    <ColorPickerPopup
                      label="Top Image Backdrop Color"
                      value={item.bgColor || "#60a5fa"}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], bgColor: v };
                        onChange(u);
                      }}
                    />

                    <div className="grid grid-cols-3 gap-2">
                      <Text
                        label="Price Prefix"
                        value={item.pricePrefix || "Starting at"}
                        onChange={(v: string) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], pricePrefix: v };
                          onChange(u);
                        }}
                      />
                      <Text
                        label="Price Value"
                        value={item.priceValue || "$1.19"}
                        onChange={(v: string) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], priceValue: v };
                          onChange(u);
                        }}
                      />
                      <Text
                        label="Price Suffix"
                        value={item.priceSuffix || "per image"}
                        onChange={(v: string) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], priceSuffix: v };
                          onChange(u);
                        }}
                      />
                    </div>

                    <Url
                      label="Card CTA Destination Link"
                      value={item.btnLink}
                      onChange={(v: any) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], btnLink: v };
                        onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newCard = {
                    id: `cs_${Date.now()}`,
                    title: "New Clipping Service",
                    description: "High quality manual paths",
                    pricePrefix: "Starting at",
                    priceValue: "$1.00",
                    priceSuffix: "per image",
                    image: "",
                    bgColor: "#38bdf8",
                    btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                  };
                  onChange([...(value || []), newCard]);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-bold cursor-pointer transition-colors"
              >
                + Add Service Card
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Header Settings",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Title Color" value={value ?? "#1e293b"} onChange={onChange} />
          ),
        },
        {
          name: "arrowColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Arrow Icon Color" value={value ?? "#312e81"} onChange={onChange} />
          ),
        },
        {
          name: "arrowBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Arrow Button Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Card Theme Colors",
      controls: [
        {
          name: "cardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Body Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "cardTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Title Text Color" value={value ?? "#1e293b"} onChange={onChange} />
          ),
        },
        {
          name: "cardDescColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Description Text Color" value={value ?? "#64748b"} onChange={onChange} />
          ),
        },
        {
          name: "priceColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Bold Price Value Color" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "priceTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Price Helper Text Color" value={value ?? "#94a3b8"} onChange={onChange} />
          ),
        },
        {
          name: "ctaBtnBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="CTA Button Background" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "ctaBtnHoverBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="CTA Button Hover Background" value={value ?? "#2563eb"} onChange={onChange} />
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
          name: "cardTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Card Title Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Carousel Display Settings",
      controls: [
        {
          name: "slidesToShow",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Cards on Display per Screen"
              value={value ?? 4}
              onChange={onChange}
              min={1}
              max={6}
              step={1}
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

  render: (element: any) => <BoxSliderFrontend element={element} />,
};

export default boxSliderElement;
