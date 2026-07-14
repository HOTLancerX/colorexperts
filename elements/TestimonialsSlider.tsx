"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import useEmblaCarousel from "embla-carousel-react";
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

interface TestimonialItem {
  id: string;
  authorName: string;
  authorRole: string;
  avatarImage: string;
  avatarBorderColor?: string;
  testimony: string;
}

/* ── Individual Slide Testimonial Card Component ── */
function TestimonialCardItem({
  item,
  globalStyles,
  testimonyTyp,
}: {
  item: TestimonialItem;
  globalStyles: any;
  testimonyTyp: any;
}) {
  const authorName = item.authorName || "Client Name";
  const authorRole = item.authorRole || "Designation";
  const avatarImage = item.avatarImage || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=120&h=120&q=80";
  const avatarBorderColor = item.avatarBorderColor || globalStyles.avatarBorderColor || "#3cb878";
  const testimony = item.testimony || "Testimonial text goes here.";

  return (
    <div className="flex flex-col sm:flex-row gap-6 items-start w-full box-border">
      {/* Dynamic speech bubble shape avatar with decorative dots */}
      <div className="relative shrink-0 select-none">
        {/* Top left decorative back shape */}
        <span className="absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full bg-[#f1c40f]/20 z-0" />
        
        {/* Main teardrop Speech bubble Avatar Frame */}
        <div
          className="relative w-[110px] h-[110px] bg-white border-[3px] z-10 flex items-center justify-center p-1 overflow-hidden"
          style={{
            borderColor: avatarBorderColor,
            borderRadius: "50% 50% 0 50%", // Teardrop speech bubble pointing to top-right
          }}
        >
          <img
            src={avatarImage}
            alt={authorName}
            className="w-full h-full object-cover"
            style={{ borderRadius: "50% 50% 0 50%" }}
          />
        </div>

        {/* Floating decorative dot bottom right */}
        <span
          className="absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full border border-white z-20"
          style={{ backgroundColor: avatarBorderColor }}
        />
        <span
          className="absolute bottom-3 -right-3.5 w-2 h-2 rounded-full border border-white z-20"
          style={{ backgroundColor: "#3498db" }}
        />
      </div>

      {/* Testimony content text details */}
      <div className="flex-1 flex flex-col pt-1">
        {/* Author Name and Designation */}
        <div className="text-[15px] font-semibold mb-2.5 leading-snug">
          <span style={{ color: globalStyles.authorNameColor }}>{authorName}</span>
          {authorRole && (
            <span className="font-normal text-gray-400 text-[13.5px]">
              , {authorRole}
            </span>
          )}
        </div>

        {/* Testimonial testimony message block */}
        <p
          className="text-[14.5px] leading-relaxed m-0"
          style={{
            color: globalStyles.testimonyColor,
            ...testimonyTyp,
          }}
          dangerouslySetInnerHTML={{ __html: testimony }}
        />
      </div>
    </div>
  );
}

/* ── Testimonials Slider Main Component ── */
function TestimonialsSliderFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configuration
  const title: string = s.content?.title || "TESTIMONIALS";
  const subtitle: string = s.content?.subtitle || "Over 15,000 photo editing clients speak for us!";
  const items: TestimonialItem[] = s.content?.items || [];

  // Grid/slide layout configuration
  const colsDesktop: number = s.content?.colsDesktop ?? 2;
  const colsTablet: number = s.content?.colsTablet ?? 1;
  const colsMobile: number = s.content?.colsMobile ?? 1;
  const gap: number = s.content?.gap ?? 32;

  // Custom colors styling
  const headerColor: string = s.style?.headerColor || "#111827";
  const subtitleColor: string = s.style?.subtitleColor || "#6b7280";
  const authorNameColor: string = s.style?.authorNameColor || "#3498db";
  const testimonyColor: string = s.style?.testimonyColor || "#374151";
  const avatarBorderColor: string = s.style?.avatarBorderColor || "#3cb878";

  // Responsive screen monitoring
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute layout grid
  let activeCols = colsDesktop;
  if (windowWidth <= 768) {
    activeCols = colsMobile;
  } else if (windowWidth <= 1024) {
    activeCols = colsTablet;
  }

  // Typography
  const headerTyp = getTypographyStyles(s.style?.headerTypography || {});
  const testimonyTyp = getTypographyStyles(s.style?.testimonyTypography || {});

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

  const globalStyles = {
    authorNameColor,
    testimonyColor,
    avatarBorderColor,
  };

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <div className="flex flex-col items-center w-full mb-12">
        {/* Title Header */}
        <h2
          className="text-3xl font-extrabold tracking-wide mb-3 m-0 text-center uppercase"
          style={{
            color: headerColor,
            ...headerTyp,
          }}
        >
          {title}
        </h2>

        {/* Subtitle */}
        {subtitle && (
          <p
            className="text-base text-center max-w-2xl m-0 leading-relaxed mb-5"
            style={{ color: subtitleColor }}
          >
            {subtitle}
          </p>
        )}

        {/* Decorative dots grid dividers */}
        <div className="flex items-center gap-1.5 justify-center">
          <span className="w-2 h-2 bg-[#62b359] rounded-sm" />
          <span className="w-2 h-2 bg-[#f1c40f] rounded-sm" />
          <span className="w-2 h-2 bg-[#3498db] rounded-sm" />
          <span className="w-2 h-2 bg-[#2c3e50] rounded-sm" />
        </div>
      </div>

      {/* Embla Track */}
      <div className="w-full relative overflow-hidden" ref={emblaRef}>
        <div
          className="flex"
          style={{ marginLeft: `-${gap}px` }}
        >
          {items.map((item, idx) => (
            <div
              key={item.id || idx}
              style={{
                flex: `0 0 ${100 / activeCols}%`,
                minWidth: 0,
                paddingLeft: `${gap}px`,
                boxSizing: "border-box",
              }}
            >
              <TestimonialCardItem
                item={item}
                globalStyles={globalStyles}
                testimonyTyp={testimonyTyp}
              />
            </div>
          ))}
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
              aria-label={`Go to testimonial page ${index + 1}`}
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
const testimonialsSliderElement = {
  type: "colorexperts-testimonials-slider",
  category: "colorexperts",
  label: "Testimonials Slider",
  icon: "solar:chat-round-like-bold-duotone",

  schema: {
    content: {
      title: "TESTIMONIALS",
      subtitle: "Over 15,000 photo editing clients all over the world, some of them speak for us!",
      colsDesktop: 2,
      colsTablet: 1,
      colsMobile: 1,
      gap: 32,
      items: [
        {
          id: "t1",
          authorName: "Michael Nicholson",
          authorRole: "E-commerce, Product Seller",
          avatarImage: "",
          avatarBorderColor: "#3498db",
          testimony: "I use Color Experts on a regular basis to clip my images and place them on a <strong>white background</strong> ready for use on my website. I am always impressed by the quality of the work, which helps show my website at its best. The quick <strong>turnaround time</strong> is vital in keeping our <strong>online product catalogue</strong> fresh and up to date.",
        },
        {
          id: "t2",
          authorName: "Erik Lindqvist",
          authorRole: "Retailer, Helsingborg, Sweden",
          avatarImage: "",
          avatarBorderColor: "#3cb878",
          testimony: "Color Experts has been providing me <strong>clipping path services</strong> for a long time. The quality and <strong>turnaround time</strong> are second to none. I recommend Color Experts for superior clipping path and top-notch image manipulation services at a very <strong>reasonable cost</strong>.",
        },
      ],
    },

    style: {
      headerColor: "#111827",
      subtitleColor: "#6b7280",
      authorNameColor: "#3498db",
      testimonyColor: "#374151",
      avatarBorderColor: "#3cb878",
      headerTypography: { fontSize: 28, fontSizeUnit: "px", fontWeight: "800" },
      testimonyTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "400" },
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
      section: "Layout Columns",
      controls: [
        {
          name: "colsDesktop",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Desktop)" value={value ?? 2} onChange={onChange} min={1} max={4} />
          ),
        },
        {
          name: "colsTablet",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Tablet)" value={value ?? 1} onChange={onChange} min={1} max={3} />
          ),
        },
        {
          name: "colsMobile",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Mobile)" value={value ?? 1} onChange={onChange} min={1} max={2} />
          ),
        },
        {
          name: "gap",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Item Gap (px)" value={value ?? 32} onChange={onChange} min={0} max={64} step={4} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Testimonials list",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Testimonial #${idx + 1}: ${item.authorName || ""}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove testimony
                      </button>
                    </div>

                    <Text
                      label="Author Name"
                      value={item.authorName || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], authorName: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Author Designation / Role"
                      value={item.authorRole || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], authorRole: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Avatar Image"
                      value={item.avatarImage || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], avatarImage: v }; onChange(u);
                      }}
                    />

                    <ColorPickerPopup
                      label="Avatar Border Color"
                      value={item.avatarBorderColor || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], avatarBorderColor: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Testimony Text (supports HTML tags like <strong>)"
                      value={item.testimony || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], testimony: v }; onChange(u);
                      }}
                      rows={4}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: TestimonialItem = {
                    id: `t_${Date.now()}`,
                    authorName: "New Client",
                    authorRole: "Company CEO",
                    avatarImage: "",
                    avatarBorderColor: "",
                    testimony: "This service is highly recommended for professional clipping path needs.",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-semibold cursor-pointer transition-colors"
              >
                + Add Testimonial Slide
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
      section: "Testimonials Card Colors",
      controls: [
        {
          name: "authorNameColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Author Name Text Color" value={value ?? "#3498db"} onChange={onChange} />
          ),
        },
        {
          name: "testimonyColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Testimony Text Color" value={value ?? "#374151"} onChange={onChange} />
          ),
        },
        {
          name: "avatarBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Default Avatar Border" value={value ?? "#3cb878"} onChange={onChange} />
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
            <Typography label="Header Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "testimonyTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Testimony Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ ADVANCED TAB ═══════════════
    {
      tab: "Advanced",
      section: "Spacing bounds",
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

  render: (element: any) => <TestimonialsSliderFrontend element={element} />,
};

export default testimonialsSliderElement;
