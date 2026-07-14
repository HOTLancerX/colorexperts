"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
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

/* ── Before/After Comparison Image Slider Widget with overlays ── */
function BeforeAfterImageSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  height = 350,
  showIconsTag = true,
  beforeCategoryLabel = "Category:",
  beforeCategoryValue = "Background Removal",
  showBadgeTag = true,
  afterHandwritingText = "Transparent background",
}: {
  beforeImage: string;
  afterImage: string;
  beforeLabel?: string;
  afterLabel?: string;
  height?: number;
  showIconsTag?: boolean;
  beforeCategoryLabel?: string;
  beforeCategoryValue?: string;
  showBadgeTag?: boolean;
  afterHandwritingText?: string;
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

  // Placeholders
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
      className="relative w-full overflow-hidden select-none cursor-ew-resize bg-[#e2e8f0]"
      style={{ height: `${height}px` }}
    >
      {/* ── AFTER VIEW (Background) ── */}
      <img
        src={imgAfter}
        alt="After view"
        className="w-full h-full object-cover pointer-events-none block"
      />

      {/* Gold Medal Quality Badge Overlay (top-right of After image) */}
      {showBadgeTag && (
        <div
          className="absolute top-4 right-4 z-10 pointer-events-none flex flex-col items-center select-none"
          style={{ opacity: sliderPos < 90 ? 1 : 0, transition: "opacity 0.2s ease" }}
        >
          {/* Custom golden ribbon quality stamp badge */}
          <div className="w-[50px] h-[50px] rounded-full bg-[#d4af37] border-2 border-white flex flex-col items-center justify-center shadow-md relative">
            <Icon icon="solar:medal-star-bold" className="text-white" width="22" />
            <span className="text-[7px] text-white font-extrabold uppercase tracking-tight -mt-0.5 leading-none">Premium</span>
            <span className="text-[6px] text-white/95 font-bold uppercase tracking-tight leading-none">Quality</span>
            {/* Ribbon Tails */}
            <div className="absolute -bottom-2.5 left-2 w-2 h-4 bg-[#b8972e] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)] z-[-1]" />
            <div className="absolute -bottom-2.5 right-2 w-2 h-4 bg-[#b8972e] [clip-path:polygon(0_0,100%_0,100%_100%,50%_75%,0_100%)] z-[-1]" />
          </div>
        </div>
      )}

      {/* Elegant Handwriting overlay (bottom-right of After image) */}
      {afterHandwritingText && (
        <div
          className="absolute bottom-14 right-4 z-10 pointer-events-none text-right font-medium"
          style={{
            fontFamily: "'Caveat', cursive, sans-serif",
            fontSize: "24px",
            color: "#475569",
            opacity: sliderPos < 80 ? 1 : 0,
            transition: "opacity 0.2s ease",
          }}
        >
          {afterHandwritingText}
        </div>
      )}

      {/* AFTER Label Tag */}
      <div
        className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[11px] font-bold py-1.5 px-3 rounded z-10 uppercase letter-spacing-[0.5px]"
        style={{ opacity: sliderPos < 95 ? 1 : 0, transition: "opacity 0.2s ease" }}
      >
        {afterLabel}
      </div>

      {/* ── BEFORE VIEW (Clipped Overlay) ── */}
      <div
        className="absolute top-0 left-0 bottom-0 overflow-hidden z-20 pointer-events-none"
        style={{ width: `${sliderPos}%` }}
      >
        <img
          src={imgBefore}
          alt="Before view"
          className="absolute top-0 left-0 object-cover pointer-events-none block"
          style={{
            width: containerWidth || "100%",
            height: `${height}px`,
            maxWidth: "none",
          }}
        />

        {/* Vector category icons bubble (top-left of Before image) */}
        {showIconsTag && (
          <div className="absolute top-4 left-4 z-10 bg-[#0f766e]/85 rounded-r-full px-3 py-1.5 flex items-center gap-1.5 shadow-sm text-white select-none">
            <Icon icon="solar:pen-tool-linear" width="15" />
            <Icon icon="solar:crop-minimalistic-linear" width="15" />
            <Icon icon="solar:palette-linear" width="15" />
          </div>
        )}

        {/* Category path text description (bottom-left of Before image) */}
        {(beforeCategoryLabel || beforeCategoryValue) && (
          <div className="absolute bottom-14 left-4 z-10 flex flex-col font-medium leading-tight">
            {beforeCategoryLabel && (
              <span className="text-[11px] text-gray-700">{beforeCategoryLabel}</span>
            )}
            {beforeCategoryValue && (
              <span className="text-[14px] text-gray-900 font-extrabold">{beforeCategoryValue}</span>
            )}
          </div>
        )}

        {/* BEFORE Label Tag */}
        <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[11px] font-bold py-1.5 px-3 rounded z-10 uppercase letter-spacing-[0.5px]">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-30 pointer-events-none shadow"
        style={{ left: `${sliderPos}%` }}
      />

      {/* Slider Drag handle circle */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[38px] h-[38px] rounded-full bg-black/75 border-2 border-white z-40 flex items-center justify-center text-white pointer-events-none shadow-md"
        style={{ left: `${sliderPos}%` }}
      >
        <Icon icon="solar:transfer-horizontal-bold-duotone" width="18" />
      </div>
    </div>
  );
}

/* ── Service Detail Card Main Component ── */
function ServiceDetailCardFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const beforeImage: string = s.content?.beforeImage || "";
  const afterImage: string = s.content?.afterImage || "";
  const singleImage: string = s.content?.singleImage || "";

  const beforeLabel: string = s.content?.beforeLabel || "BEFORE";
  const afterLabel: string = s.content?.afterLabel || "AFTER";

  // Overlay content
  const showIconsTag: boolean = s.content?.showIconsTag ?? true;
  const beforeCategoryLabel: string = s.content?.beforeCategoryLabel || "Category:";
  const beforeCategoryValue: string = s.content?.beforeCategoryValue || "Background Removal";
  const showBadgeTag: boolean = s.content?.showBadgeTag ?? true;
  const afterHandwritingText: string = s.content?.afterHandwritingText || "Transparent background";

  // Body text detail content
  const serviceTitle: string = s.content?.serviceTitle || "Making Transparent Background";
  const serviceDescription: string = s.content?.serviceDescription || "If you own a website for your business regardless of the business size, you have to use a transparent background for the logo placement on different pages to look professional.";

  // Stats Details
  const stat1Label: string = s.content?.stat1Label || "Starts From";
  const stat1Value: string = s.content?.stat1Value || "$ 0.99";

  const stat2Label: string = s.content?.stat2Label || "Images/24Hr";
  const stat2Value: string = s.content?.stat2Value || "3000";

  // Action CTA Links
  const btn1Label: string = s.content?.btn1Label || "View Details";
  const btn1Link = s.content?.btn1Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" };

  const btn2Label: string = s.content?.btn2Label || "Get a Quote";
  const btn2Link = s.content?.btn2Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" };

  // Styling values
  const containerBg: string = s.style?.containerBg || "#ffffff";
  const titleColor: string = s.style?.titleColor || "#0f766e";
  const descriptionColor: string = s.style?.descriptionColor || "#374151";

  const statsBorderColor: string = s.style?.statsBorderColor || "#3b82f6";
  const statsLabelColor: string = s.style?.statsLabelColor || "#6b7280";
  const statsValueColor: string = s.style?.statsValueColor || "#111827";

  const btn1Bg: string = s.style?.btn1Bg || "transparent";
  const btn1Color: string = s.style?.btn1Color || "#059669";
  const btn1HoverBg: string = s.style?.btn1HoverBg || "#059669";
  const btn1HoverColor: string = s.style?.btn1HoverColor || "#ffffff";

  const btn2BgStart: string = s.style?.btn2BgStart || "#0d9488";
  const btn2BgEnd: string = s.style?.btn2BgEnd || "#14b8a6";
  const btn2TextColor: string = s.style?.btn2TextColor || "#ffffff";
  const btn2HoverBgStart: string = s.style?.btn2HoverBgStart || "#0f766e";
  const btn2HoverBgEnd: string = s.style?.btn2HoverBgEnd || "#0d9488";
  const btn2HoverTextColor: string = s.style?.btn2HoverTextColor || "#ffffff";

  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 350);

  // Hover states
  const [hoverBtn1, setHoverBtn1] = useState(false);
  const [hoverBtn2, setHoverBtn2] = useState(false);

  // Monitor screen width
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
  const serviceTitleTyp = getTypographyStyles(s.style?.serviceTitleTypography || {});
  const serviceDescriptionTyp = getTypographyStyles(s.style?.serviceDescriptionTypography || {});

  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

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
      {/* Caveat Font dynamic inject */}
      <link href="https://fonts.googleapis.com/css2?family=Caveat:wght@600&display=swap" rel="stylesheet" />

      {/* Main card panel wrapper */}
      <div
        className="w-full max-w-[500px] rounded-xl overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col box-border"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* Before After Image Display Frame */}
        {singleImage ? (
          <div
            className="w-full overflow-hidden relative"
            style={{ height: `${activeImageHeight}px` }}
          >
            <img
              src={singleImage}
              alt="Service milestone"
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
            showIconsTag={showIconsTag}
            beforeCategoryLabel={beforeCategoryLabel}
            beforeCategoryValue={beforeCategoryValue}
            showBadgeTag={showBadgeTag}
            afterHandwritingText={afterHandwritingText}
          />
        )}

        {/* Text descriptions and action panels below image */}
        <div className="flex flex-col p-[32px_24px] box-border">
          {/* Blue colored centered service title heading */}
          <h3
            className="text-xl font-extrabold tracking-wide mb-4 m-0 text-center leading-snug"
            style={{
              color: titleColor,
              ...serviceTitleTyp,
            }}
          >
            {serviceTitle}
          </h3>

          {/* Description text info */}
          <p
            className="text-[14.5px] leading-relaxed text-center m-0 mb-6"
            style={{
              color: descriptionColor,
              ...serviceDescriptionTyp,
            }}
          >
            {serviceDescription}
          </p>

          {/* Statistics Box - Starts From & Capacity limit boxes */}
          <div className="grid grid-cols-2 gap-4 w-full mb-7">
            {/* Stat Box 1 */}
            <div
              className="flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-300"
              style={{ borderColor: statsBorderColor }}
            >
              <span
                className="text-[11.5px] font-bold uppercase tracking-wider mb-1"
                style={{ color: statsLabelColor }}
              >
                {stat1Label}
              </span>
              <span
                className="text-[20px] font-extrabold"
                style={{ color: statsValueColor }}
              >
                {stat1Value}
              </span>
            </div>

            {/* Stat Box 2 */}
            <div
              className="flex flex-col items-center justify-center p-3 rounded-lg border text-center transition-all duration-300"
              style={{ borderColor: statsBorderColor }}
            >
              <span
                className="text-[11.5px] font-bold uppercase tracking-wider mb-1"
                style={{ color: statsLabelColor }}
              >
                {stat2Label}
              </span>
              <span
                className="text-[20px] font-extrabold"
                style={{ color: statsValueColor }}
              >
                {stat2Value}
              </span>
            </div>
          </div>

          {/* Action links row */}
          <div className="flex items-center gap-4 w-full">
            {btn1Label && (
              <a
                className="flex-1 inline-flex items-center justify-center py-2.5 px-4 rounded-[40px] border-2 text-[13px] font-bold tracking-[0.5px] uppercase no-underline cursor-pointer transition-all duration-250 ease-in-out box-border"
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
                className="flex-1 inline-flex items-center justify-center py-3 px-4 rounded-[40px] border-none text-[13px] font-bold tracking-[0.5px] uppercase no-underline cursor-pointer transition-all duration-250 ease-in-out hover:-translate-y-0.5 box-border shadow-md shadow-teal-500/10"
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
    </div>
  );
}

/* ── Element Registry Definition ── */
const serviceDetailCardElement = {
  type: "colorexperts-service-detail-card",
  category: "colorexperts",
  label: "Service Detail Card",
  icon: "solar:shop-2-bold-duotone",

  schema: {
    content: {
      beforeImage: "",
      afterImage: "",
      singleImage: "",
      beforeLabel: "BEFORE",
      afterLabel: "AFTER",
      showIconsTag: true,
      beforeCategoryLabel: "Category:",
      beforeCategoryValue: "Background Removal",
      showBadgeTag: true,
      afterHandwritingText: "Transparent background",
      serviceTitle: "Making Transparent Background",
      serviceDescription: "If you own a website for your business regardless of the business size, you have to use a transparent background for the logo placement on different pages to look professional. Likewise, you can use a transparent background for logo and other designs in other spots like t-shirts, letterheads, images, and videos. We flawlessly make backgrounds transparent at a budget-friendly price.",
      stat1Label: "Starts From",
      stat1Value: "$ 0.99",
      stat2Label: "Images/24Hr",
      stat2Value: "3000",
      btn1Label: "View Details",
      btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
      btn2Label: "Get a Quote",
      btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
    },

    style: {
      containerBg: "#ffffff",
      titleColor: "#006699",
      descriptionColor: "#374151",
      statsBorderColor: "#3b82f6",
      statsLabelColor: "#6b7280",
      statsValueColor: "#111827",
      imageHeight: 350,
      btn1Bg: "transparent",
      btn1Color: "#006699",
      btn1HoverBg: "#006699",
      btn1HoverColor: "#ffffff",
      btn2BgStart: "#006699",
      btn2BgEnd: "#14b8a6",
      btn2TextColor: "#ffffff",
      btn2HoverBgStart: "#0a5682",
      btn2HoverBgEnd: "#0d9488",
      btn2HoverTextColor: "#ffffff",
      serviceTitleTypography: { fontSize: 21, fontSizeUnit: "px", fontWeight: "700" },
      serviceDescriptionTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "400" },
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
      section: "Before/After Image Options",
      controls: [
        {
          name: "singleImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery
              label="Single Image (Overrides before/after comparison)"
              value={value || ""}
              onChange={onChange}
            />
          ),
        },
        {
          name: "beforeImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Before View Image" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "afterImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="After View Image" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "beforeLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Before Tag" value={value || "BEFORE"} onChange={onChange} />
          ),
        },
        {
          name: "afterLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="After Tag" value={value || "AFTER"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Image Overlay Details",
      controls: [
        {
          name: "showIconsTag",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-[13px] font-medium text-gray-300">Show edit tools tag on top-left</span>
              <input
                type="checkbox"
                checked={value ?? true}
                onChange={(e) => onChange(e.target.checked)}
                className="cursor-pointer"
              />
            </div>
          ),
        },
        {
          name: "beforeCategoryLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Before category mini label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "beforeCategoryValue",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Before category bold text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "showBadgeTag",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="flex items-center justify-between py-2 border-b border-gray-800">
              <span className="text-[13px] font-medium text-gray-300">Show premium quality medal badge</span>
              <input
                type="checkbox"
                checked={value ?? true}
                onChange={(e) => onChange(e.target.checked)}
                className="cursor-pointer"
              />
            </div>
          ),
        },
        {
          name: "afterHandwritingText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="After cursive handwriting overlay text" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Service Details Text",
      controls: [
        {
          name: "serviceTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Service Heading Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "serviceDescription",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Service Info Description" value={value || ""} onChange={onChange} rows={5} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Statistics Info Boxes",
      controls: [
        {
          name: "stat1Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Box 1 Subtext Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat1Value",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Box 1 Bold Value" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat2Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Box 2 Subtext Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat2Value",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Box 2 Bold Value" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Action CTA Buttons",
      controls: [
        {
          name: "btn1Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button 1 Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn1Link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 1 Link URL" value={value} onChange={onChange} />
          ),
        },
        {
          name: "btn2Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button 2 Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn2Link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 2 Link URL" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Card Theme Colors",
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
            <ColorPickerPopup label="Heading Title Color" value={value ?? "#0f766e"} onChange={onChange} />
          ),
        },
        {
          name: "descriptionColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Info Color" value={value ?? "#374151"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Stats Blocks Styling",
      controls: [
        {
          name: "statsBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Box Outline Border" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "statsLabelColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Box Label Color" value={value ?? "#6b7280"} onChange={onChange} />
          ),
        },
        {
          name: "statsValueColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Box Value Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Image Height setting",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Service Image Height (px)"
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
      ],
    },

    {
      tab: "Style",
      section: "Button CTA Styles",
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
            <ColorPickerPopup label="Button 1 text/outline" value={value ?? "#059669"} onChange={onChange} />
          ),
        },
        {
          name: "btn1HoverBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 hover bg" value={value ?? "#059669"} onChange={onChange} />
          ),
        },
        {
          name: "btn1HoverColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 hover text" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btn2BgStart",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 Grad Start" value={value ?? "#0d9488"} onChange={onChange} />
          ),
        },
        {
          name: "btn2BgEnd",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 Grad End" value={value ?? "#14b8a6"} onChange={onChange} />
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
          name: "serviceTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Service Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "serviceDescriptionTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <ServiceDetailCardFrontend element={element} />,
};

export default serviceDetailCardElement;
