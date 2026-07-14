"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import { Icon } from "@iconify/react";
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

/* ── Before/After Comparison Image Slider Widget ── */
function BeforeAfterImageSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  height = 320,
}: {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
}) {
  const [sliderPos, setSliderPos] = useState(50);
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState(0);
  const isDragging = useRef(false);

  useEffect(() => {
    if (!containerRef.current) return;
    const handleResize = () => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const onMouseMove = (e: React.MouseEvent) => {
    if (!isDragging.current) return;
    handleMove(e.clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    if (!isDragging.current || e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  const startDrag = () => {
    isDragging.current = true;
  };

  useEffect(() => {
    const stopDrag = () => {
      isDragging.current = false;
    };
    window.addEventListener("mouseup", stopDrag);
    window.addEventListener("touchend", stopDrag);
    return () => {
      window.removeEventListener("mouseup", stopDrag);
      window.removeEventListener("touchend", stopDrag);
    };
  }, []);

  const placeholderBefore = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80";
  const placeholderAfter = "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80&monochrome=1";

  const imgBefore = beforeImage || placeholderBefore;
  const imgAfter = afterImage || placeholderAfter;

  return (
    <div
      ref={containerRef}
      onMouseDown={startDrag}
      onTouchStart={startDrag}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      style={{
        position: "relative",
        width: "100%",
        height: `${height}px`,
        overflow: "hidden",
        userSelect: "none",
        cursor: "ew-resize",
        background: "#e2e8f0",
      }}
    >
      {/* AFTER IMAGE */}
      <img
        src={imgAfter}
        alt="After view"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          pointerEvents: "none",
          display: "block",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10px",
          right: "10px",
          backgroundColor: "rgba(30, 41, 59, 0.7)",
          color: "#ffffff",
          fontSize: "11px",
          fontWeight: 700,
          padding: "5px 10px",
          borderRadius: "4px",
          zIndex: 5,
          letterSpacing: "0.5px",
        }}
      >
        {afterLabel}
      </div>

      {/* BEFORE IMAGE (Clipped Overlay) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          bottom: 0,
          width: `${sliderPos}%`,
          overflow: "hidden",
          zIndex: 2,
          pointerEvents: "none",
        }}
      >
        <img
          src={imgBefore}
          alt="Before view"
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: containerWidth || "100%",
            height: "100%",
            maxWidth: "none",
            objectFit: "cover",
            pointerEvents: "none",
            display: "block",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: "10px",
            left: "10px",
            backgroundColor: "rgba(30, 41, 59, 0.7)",
            color: "#ffffff",
            fontSize: "11px",
            fontWeight: 700,
            padding: "5px 10px",
            borderRadius: "4px",
            zIndex: 5,
            letterSpacing: "0.5px",
          }}
        >
          {beforeLabel}
        </div>
      </div>

      {/* Vertical Slider Line */}
      <div
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: `${sliderPos}%`,
          width: "2px",
          backgroundColor: "#ffffff",
          zIndex: 3,
          pointerEvents: "none",
        }}
      />

      {/* Drag handle button */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${sliderPos}%`,
          transform: "translate(-50%, -50%)",
          width: "38px",
          height: "38px",
          borderRadius: "50%",
          backgroundColor: "#ffffff",
          border: "4px solid rgba(0, 0, 0, 0.15)",
          zIndex: 4,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: "#4b5563",
          pointerEvents: "none",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
        }}
      >
        <Icon icon="solar:transfer-horizontal-bold-duotone" width="20" />
      </div>
    </div>
  );
}

interface PriceRow {
  id: string;
  label: string;
  price: string;
}

interface CarouselCard {
  id: string;
  cardTitle: string;
  titleBarBg?: string;
  beforeImage?: string;
  afterImage?: string;
  singleImage?: string;
  beforeLabel?: string;
  afterLabel?: string;
  pricePrefix?: string;
  startPrice?: string;
  priceSuffix?: string;
  pricesList?: PriceRow[];
  btn1Label?: string;
  btn1Link?: any;
  btn2Label?: string;
  btn2Link?: any;
}

/* ── Individual Slide Card Component ── */
function PricingCardItem({
  card,
  globalStyles,
  activeImageHeight,
  cardTitleTyp,
  listTyp,
}: {
  card: CarouselCard;
  globalStyles: any;
  activeImageHeight: number;
  cardTitleTyp: any;
  listTyp: any;
}) {
  const [hoverBtn1, setHoverBtn1] = useState(false);
  const [hoverBtn2, setHoverBtn2] = useState(false);

  // Content fallbacks
  const cardTitle = card.cardTitle || "Clipping Service";
  const beforeImage = card.beforeImage || "";
  const afterImage = card.afterImage || "";
  const singleImage = card.singleImage || "";
  const beforeLabel = card.beforeLabel || "BEFORE";
  const afterLabel = card.afterLabel || "AFTER";
  
  const pricePrefix = card.pricePrefix || "Starts From";
  const startPrice = card.startPrice || "$0.49";
  const priceSuffix = card.priceSuffix || "per image";
  const pricesList = card.pricesList || [];

  const btn1Label = card.btn1Label || "";
  const btn1Link = card.btn1Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" };
  
  const btn2Label = card.btn2Label || "";
  const btn2Link = card.btn2Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" };

  // Styling values
  const containerBg = globalStyles.containerBg;
  const titleBarBg = card.titleBarBg || globalStyles.titleBarBg || "#62b359";
  const titleColor = globalStyles.titleColor;
  const listTextColor = globalStyles.listTextColor;
  const priceHighlightColor = globalStyles.priceHighlightColor;

  const btn1Bg = globalStyles.btn1Bg;
  const btn1Color = globalStyles.btn1Color;
  const btn1HoverBg = globalStyles.btn1HoverBg;
  const btn1HoverColor = globalStyles.btn1HoverColor;

  const btn2BgStart = globalStyles.btn2BgStart;
  const btn2BgEnd = globalStyles.btn2BgEnd;
  const btn2TextColor = globalStyles.btn2TextColor;
  const btn2HoverBgStart = globalStyles.btn2HoverBgStart;
  const btn2HoverBgEnd = globalStyles.btn2HoverBgEnd;
  const btn2HoverTextColor = globalStyles.btn2HoverTextColor;

  return (
    <div
      className="w-full rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col box-border"
      style={{ backgroundColor: containerBg }}
    >
      {/* Title Bar Header */}
      <div
        className="py-4.5 px-6 text-center box-border"
        style={{ backgroundColor: titleBarBg }}
      >
        <h3
          className="text-xl font-bold m-0 tracking-[0.2px] truncate"
          style={{
            color: titleColor,
            ...cardTitleTyp,
          }}
        >
          {cardTitle}
        </h3>
      </div>

      {/* Image Display Widget */}
      {singleImage ? (
        <div
          className="w-full overflow-hidden"
          style={{ height: `${activeImageHeight}px` }}
        >
          <img
            src={singleImage}
            alt={cardTitle}
            className="w-full h-full object-cover block"
          />
        </div>
      ) : (
        <BeforeAfterImageSlider
          beforeImage={beforeImage}
          afterImage={afterImage}
          beforeLabel={beforeLabel}
          afterLabel={afterLabel}
          height={activeImageHeight}
        />
      )}

      {/* Details list and buttons area */}
      <div className="flex flex-col p-[26px_20px] box-border">
        {/* Starts Price header */}
        <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
          <span>{pricePrefix}</span>
          <span
            className="text-[36px] font-extrabold leading-none"
            style={{ color: priceHighlightColor }}
          >
            {startPrice}
          </span>
          <span>{priceSuffix}</span>
        </div>

        {/* Pricing list table rows */}
        <div className="flex flex-col mb-6 w-full">
          {pricesList.map((item, idx) => (
            <div
              key={item.id || idx}
              className="flex justify-between items-center py-2.5 border-b border-gray-100 last:border-b-0 text-[14px] font-medium"
              style={{
                color: listTextColor,
                ...listTyp,
              }}
            >
              <span className="truncate mr-2">{item.label}</span>
              <span
                className="font-bold shrink-0"
                style={{ color: priceHighlightColor }}
              >
                {item.price}
              </span>
            </div>
          ))}
        </div>

        {/* Buttons Action row */}
        <div className="flex items-center gap-3 w-full">
          {btn1Label && (
            <a
              className="flex-1 inline-flex items-center justify-center py-2.5 px-3 rounded-[40px] border-2 text-[12.5px] font-bold tracking-[0.5px] uppercase no-underline cursor-pointer transition-all duration-250 ease-in-out box-border truncate"
              href={btn1Link?.url || "#"}
              target={btn1Link?.target || "_self"}
              rel={btn1Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
              onMouseEnter={() => setHoverBtn1(true)}
              onMouseLeave={() => setHoverBtn1(false)}
              style={{
                backgroundColor: hoverBtn1 ? btn1HoverBg : btn1Bg,
                borderColor: hoverBtn1 ? btn1HoverBg : btn1Color,
                color: hoverBtn1 ? btn1HoverColor : btn1Color,
              }}
            >
              {btn1Label}
            </a>
          )}

          {btn2Label && (
            <a
              className="flex-1 inline-flex items-center justify-center py-3 px-3 rounded-[40px] border-none text-[12.5px] font-bold tracking-[0.5px] uppercase no-underline cursor-pointer transition-all duration-250 ease-in-out hover:-translate-y-0.5 box-border shadow-md shadow-teal-500/10 truncate"
              href={btn2Link?.url || "#"}
              target={btn2Link?.target || "_self"}
              rel={btn2Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
              onMouseEnter={() => setHoverBtn2(true)}
              onMouseLeave={() => setHoverBtn2(false)}
              style={{
                background: hoverBtn2
                  ? `linear-gradient(135deg, ${btn2HoverBgStart}, ${btn2HoverBgEnd})`
                  : `linear-gradient(135deg, ${btn2BgStart}, ${btn2BgEnd})`,
                color: hoverBtn2 ? btn2HoverTextColor : btn2TextColor,
              }}
            >
              {btn2Label}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── Carousel Main Component ── */
function BeforeAfterPricingCarouselFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content slides
  const cards: CarouselCard[] = s.content?.cards || [];

  // Responsive column counts
  const colsDesktop = s.content?.colsDesktop ?? 3;
  const colsTablet = s.content?.colsTablet ?? 2;
  const colsMobile = s.content?.colsMobile ?? 1;
  const gap = s.content?.gap ?? 24;

  // Colors & height style definitions
  const containerBg = s.style?.containerBg || "#ffffff";
  const titleBarBg = s.style?.titleBarBg || "#62b359";
  const titleColor = s.style?.titleColor || "#ffffff";
  const listTextColor = s.style?.listTextColor || "#1f2937";
  const priceHighlightColor = s.style?.priceHighlightColor || "#111827";

  const btn1Bg = s.style?.btn1Bg || "transparent";
  const btn1Color = s.style?.btn1Color || "#3cb878";
  const btn1HoverBg = s.style?.btn1HoverBg || "#3cb878";
  const btn1HoverColor = s.style?.btn1HoverColor || "#ffffff";

  const btn2BgStart = s.style?.btn2BgStart || "#0f766e";
  const btn2BgEnd = s.style?.btn2BgEnd || "#2dd4bf";
  const btn2TextColor = s.style?.btn2TextColor || "#ffffff";
  const btn2HoverBgStart = s.style?.btn2HoverBgStart || "#0d9488";
  const btn2HoverBgEnd = s.style?.btn2HoverBgEnd || "#14b8a6";
  const btn2HoverTextColor = s.style?.btn2HoverTextColor || "#ffffff";

  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 300);

  // Screen Width monitoring
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Columns & height calculation
  let activeCols = colsDesktop;
  let activeImageHeight = heightObj.desktop;

  if (windowWidth <= 768) {
    activeCols = colsMobile;
    activeImageHeight = heightObj.mobile;
  } else if (windowWidth <= 1024) {
    activeCols = colsTablet;
    activeImageHeight = heightObj.tablet;
  }

  // Typography
  const cardTitleTyp = getTypographyStyles(s.style?.cardTitleTypography || {});
  const listTyp = getTypographyStyles(s.style?.listTypography || {});

  // Layout bounds
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
    containerBg,
    titleBarBg,
    titleColor,
    listTextColor,
    priceHighlightColor,
    btn1Bg,
    btn1Color,
    btn1HoverBg,
    btn1HoverColor,
    btn2BgStart,
    btn2BgEnd,
    btn2TextColor,
    btn2HoverBgStart,
    btn2HoverBgEnd,
    btn2HoverTextColor,
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
      <div className="w-full relative overflow-hidden" ref={emblaRef}>
        {/* Slides Track */}
        <div
          className="flex"
          style={{ marginLeft: `-${gap}px` }}
        >
          {cards.map((card, idx) => (
            <div
              key={card.id || idx}
              style={{
                flex: `0 0 ${100 / activeCols}%`,
                minWidth: 0,
                paddingLeft: `${gap}px`,
                boxSizing: "border-box",
              }}
            >
              <PricingCardItem
                card={card}
                globalStyles={globalStyles}
                activeImageHeight={activeImageHeight}
                cardTitleTyp={cardTitleTyp}
                listTyp={listTyp}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Premium pagination dots indicators */}
      {scrollSnaps.length > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          {scrollSnaps.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi && emblaApi.scrollTo(index)}
              className="w-3.5 h-3.5 rounded-full flex items-center justify-center cursor-pointer transition-all duration-300 p-0 border-none bg-transparent"
              aria-label={`Go to slide ${index + 1}`}
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
const beforeAfterPricingCarouselElement = {
  type: "before-after-pricing-carousel",
  category: "colorexperts",
  label: "Before/After Pricing Carousel",
  icon: "solar:slider-minimalistic-horizontal-bold-duotone",

  schema: {
    content: {
      colsDesktop: 3,
      colsTablet: 2,
      colsMobile: 1,
      gap: 24,
      cards: [
        {
          id: "card_1",
          cardTitle: "Pen Tablet(Wacom) Related Services",
          titleBarBg: "#f1c40f",
          beforeImage: "",
          afterImage: "",
          singleImage: "",
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          pricePrefix: "Starts From",
          startPrice: "$2.15",
          priceSuffix: "per image",
          pricesList: [
            { id: "c1_p1", label: "Color Separation", price: "$2.15" },
            { id: "c1_p2", label: "Non-Destructive Retouching", price: "$4.50" },
            { id: "c1_p3", label: "High End Retouching", price: "$8.90" },
            { id: "c1_p4", label: "Hair and Fur Masking", price: "$19.99" },
          ],
          btn1Label: "Free Trial",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get a Quote",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "card_2",
          cardTitle: "Video Editing Service",
          titleBarBg: "#3498db",
          beforeImage: "",
          afterImage: "",
          singleImage: "",
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          pricePrefix: "Starts From",
          startPrice: "$14.99",
          priceSuffix: "per hour",
          pricesList: [
            { id: "c2_p1", label: "Add Title Animation", price: "$14.99" },
            { id: "c2_p2", label: "Audion Correction", price: "$24.99" },
            { id: "c2_p3", label: "Into/Outro Animation", price: "$44.99" },
            { id: "c2_p4", label: "Custome Video Editing", price: "$49.99" },
          ],
          btn1Label: "Contact Us",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get a Quote",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "card_3",
          cardTitle: "Video Production & 3D Modeling Service",
          titleBarBg: "#62b359",
          beforeImage: "",
          afterImage: "",
          singleImage: "",
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          pricePrefix: "Starts From",
          startPrice: "$14.99",
          priceSuffix: "per hour",
          pricesList: [
            { id: "c3_p1", label: "Video Editing", price: "$14.99" },
            { id: "c3_p2", label: "3D Product Design", price: "$24.99" },
            { id: "c3_p3", label: "Motion Graphics", price: "$44.99" },
            { id: "c3_p4", label: "Custome Services", price: "$99.99" },
          ],
          btn1Label: "Contact Us",
          btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
          btn2Label: "Get a Quote",
          btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
      ],
    },

    style: {
      containerBg: "#ffffff",
      titleBarBg: "#62b359",
      titleColor: "#ffffff",
      listTextColor: "#1f2937",
      priceHighlightColor: "#111827",
      imageHeight: 280,
      btn1Bg: "transparent",
      btn1Color: "#059669",
      btn1HoverBg: "#059669",
      btn1HoverColor: "#ffffff",
      btn2BgStart: "#0d9488",
      btn2BgEnd: "#14b8a6",
      btn2TextColor: "#ffffff",
      btn2HoverBgStart: "#0f766e",
      btn2HoverBgEnd: "#0d9488",
      btn2HoverTextColor: "#ffffff",
      cardTitleTypography: { fontSize: 18, fontSizeUnit: "px", fontWeight: "700" },
      listTypography: { fontSize: 14, fontSizeUnit: "px", fontWeight: "500" },
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
      section: "Columns Layout",
      controls: [
        {
          name: "colsDesktop",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Desktop)" value={value ?? 3} onChange={onChange} min={1} max={6} />
          ),
        },
        {
          name: "colsTablet",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns (Tablet)" value={value ?? 2} onChange={onChange} min={1} max={4} />
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
            <NumberControl label="Item Gap (px)" value={value ?? 24} onChange={onChange} min={0} max={60} step={4} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Cards List Items",
      controls: [
        {
          name: "cards",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((card: any, idx: number) => (
                <Section key={card.id || idx} label={`Card #${idx + 1}: ${card.cardTitle || ""}`}>
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
                      label="Card Header Title"
                      value={card.cardTitle || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], cardTitle: v }; onChange(u);
                      }}
                    />

                    <ColorPickerPopup
                      label="Card Title Bar Color (Overrides global)"
                      value={card.titleBarBg || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], titleBarBg: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Single Image (Overrides before/after)"
                      value={card.singleImage || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], singleImage: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Before Image"
                      value={card.beforeImage || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], beforeImage: v }; onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="After Image"
                      value={card.afterImage || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], afterImage: v }; onChange(u);
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Text
                        label="Before Label"
                        value={card.beforeLabel || "BEFORE"}
                        onChange={(v: string) => {
                          const u = [...value]; u[idx] = { ...u[idx], beforeLabel: v }; onChange(u);
                        }}
                      />
                      <Text
                        label="After Label"
                        value={card.afterLabel || "AFTER"}
                        onChange={(v: string) => {
                          const u = [...value]; u[idx] = { ...u[idx], afterLabel: v }; onChange(u);
                        }}
                      />
                    </div>

                    <div className="grid grid-cols-3 gap-2">
                      <Text
                        label="Price Prefix"
                        value={card.pricePrefix || "Starts From"}
                        onChange={(v: string) => {
                          const u = [...value]; u[idx] = { ...u[idx], pricePrefix: v }; onChange(u);
                        }}
                      />
                      <Text
                        label="Start Price"
                        value={card.startPrice || "$0.00"}
                        onChange={(v: string) => {
                          const u = [...value]; u[idx] = { ...u[idx], startPrice: v }; onChange(u);
                        }}
                      />
                      <Text
                        label="Price Suffix"
                        value={card.priceSuffix || "per image"}
                        onChange={(v: string) => {
                          const u = [...value]; u[idx] = { ...u[idx], priceSuffix: v }; onChange(u);
                        }}
                      />
                    </div>

                    <Section label="Button 1 Label & Link">
                      <div className="space-y-2 pt-1">
                        <Text
                          label="Button 1 Text"
                          value={card.btn1Label || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn1Label: v }; onChange(u);
                          }}
                        />
                        <Url
                          label="Button 1 Link"
                          value={card.btn1Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" }}
                          onChange={(v: any) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn1Link: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>

                    <Section label="Button 2 Label & Link">
                      <div className="space-y-2 pt-1">
                        <Text
                          label="Button 2 Text"
                          value={card.btn2Label || ""}
                          onChange={(v: string) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn2Label: v }; onChange(u);
                          }}
                        />
                        <Url
                          label="Button 2 Link"
                          value={card.btn2Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" }}
                          onChange={(v: any) => {
                            const u = [...value]; u[idx] = { ...u[idx], btn2Link: v }; onChange(u);
                          }}
                        />
                      </div>
                    </Section>

                    <Section label="Pricing Table List">
                      <div className="space-y-2 pt-1">
                        {(card.pricesList || []).map((pItem: any, pIdx: number) => (
                          <div key={pItem.id || pIdx} className="flex gap-2 items-center bg-gray-800 p-2 rounded">
                            <Text
                              label="Path / Service Label"
                              value={pItem.label || ""}
                              onChange={(v: string) => {
                                const u = [...value];
                                const list = [...(u[idx].pricesList || [])];
                                list[pIdx] = { ...list[pIdx], label: v };
                                u[idx] = { ...u[idx], pricesList: list };
                                onChange(u);
                              }}
                            />
                            <Text
                              label="Price"
                              value={pItem.price || ""}
                              onChange={(v: string) => {
                                const u = [...value];
                                const list = [...(u[idx].pricesList || [])];
                                list[pIdx] = { ...list[pIdx], price: v };
                                u[idx] = { ...u[idx], pricesList: list };
                                onChange(u);
                              }}
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const u = [...value];
                                u[idx] = {
                                  ...u[idx],
                                  pricesList: (u[idx].pricesList || []).filter((_: any, i: number) => i !== pIdx),
                                };
                                onChange(u);
                              }}
                              className="text-[11px] text-red-400 hover:text-red-500 pt-5 cursor-pointer shrink-0"
                            >
                              Del
                            </button>
                          </div>
                        ))}
                        <button
                          type="button"
                          onClick={() => {
                            const u = [...value];
                            const list = [...(u[idx].pricesList || [])];
                            list.push({ id: `pl_${Date.now()}`, label: "New Level", price: "$0.00" });
                            u[idx] = { ...u[idx], pricesList: list };
                            onChange(u);
                          }}
                          className="w-full py-1.5 bg-gray-700 hover:bg-gray-800 text-[12px] text-white font-medium rounded cursor-pointer"
                        >
                          + Add Pricing List Row
                        </button>
                      </div>
                    </Section>
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newCard: CarouselCard = {
                    id: `card_${Date.now()}`,
                    cardTitle: `New Service Card ${(value?.length || 0) + 1}`,
                    titleBarBg: "",
                    beforeImage: "",
                    afterImage: "",
                    singleImage: "",
                    beforeLabel: "BEFORE",
                    afterLabel: "AFTER",
                    pricePrefix: "Starts From",
                    startPrice: "$0.00",
                    priceSuffix: "per image",
                    pricesList: [
                      { id: `c_p1_${Date.now()}`, label: "Basic Service", price: "$0.00" },
                    ],
                    btn1Label: "Contact Us",
                    btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                    btn2Label: "Get a Quote",
                    btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                  };
                  onChange([...(value || []), newCard]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-semibold cursor-pointer transition-colors"
              >
                + Add Pricing Card
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Cards Styling & Colors",
      controls: [
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Content Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "titleBarBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Global Title Bar Color" value={value ?? "#62b359"} onChange={onChange} />
          ),
        },
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "listTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Pricing list text color" value={value ?? "#1f2937"} onChange={onChange} />
          ),
        },
        {
          name: "priceHighlightColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Pricing highighted values" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Image Height settings",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Service Image Height (px)"
              value={value ?? 280}
              onChange={onChange}
              min={150}
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
      section: "Button Actions Styling",
      controls: [
        {
          name: "btn1Bg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 background" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "btn1Color",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 text/border color" value={value ?? "#059669"} onChange={onChange} />
          ),
        },
        {
          name: "btn1HoverBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 hover background" value={value ?? "#059669"} onChange={onChange} />
          ),
        },
        {
          name: "btn1HoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 hover text color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btn2BgStart",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 Gradient Start" value={value ?? "#0d9488"} onChange={onChange} />
          ),
        },
        {
          name: "btn2BgEnd",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 Gradient End" value={value ?? "#14b8a6"} onChange={onChange} />
          ),
        },
        {
          name: "btn2TextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 text color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btn2HoverBgStart",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 hover grad start" value={value ?? "#0f766e"} onChange={onChange} />
          ),
        },
        {
          name: "btn2HoverBgEnd",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 hover grad end" value={value ?? "#0d9488"} onChange={onChange} />
          ),
        },
        {
          name: "btn2HoverTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 hover text color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography Settings",
      controls: [
        {
          name: "cardTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Card Header Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "listTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Service List Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <BeforeAfterPricingCarouselFrontend element={element} />,
};

export default beforeAfterPricingCarouselElement;
