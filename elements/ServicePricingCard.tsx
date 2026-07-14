"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  Url,
  NumberControl,
  ImageGallery,
  IconPicker,
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

interface PriceItem {
  id: string;
  label: string;
  price: string;
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
      className="relative w-full overflow-hidden select-none cursor-ew-resize bg-[#e2e8f0] rounded-lg"
      style={{ height: `${height}px` }}
    >
      {/* AFTER IMAGE */}
      <img
        src={imgAfter}
        alt="After view"
        className="w-full h-full object-cover pointer-events-none block"
      />
      <div className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[11px] font-bold py-1.5 px-3 rounded z-10 uppercase letter-spacing-[0.5px]">
        {afterLabel}
      </div>

      {/* BEFORE IMAGE (Clipped Overlay) */}
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
        <div className="absolute bottom-2.5 left-2.5 bg-black/60 text-white text-[11px] font-bold py-1.5 px-3 rounded z-10 uppercase letter-spacing-[0.5px]">
          {beforeLabel}
        </div>
      </div>

      {/* Vertical Slider Line */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white z-30 pointer-events-none shadow"
        style={{ left: `${sliderPos}%` }}
      />

      {/* Drag handle button */}
      <div
        className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-[34px] h-[34px] rounded-full bg-black/85 border border-white z-40 flex items-center justify-center text-white pointer-events-none shadow"
        style={{ left: `${sliderPos}%` }}
      >
        <Icon icon="solar:transfer-horizontal-bold-duotone" width="16" />
      </div>
    </div>
  );
}

/* ── Service Pricing Card Main Component ── */
function ServicePricingCardFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const headerTitle: string = s.content?.headerTitle || "Clipping Path Services";

  // Before/After slider content
  const beforeImage: string = s.content?.beforeImage || "";
  const afterImage: string = s.content?.afterImage || "";
  const singleImage: string = s.content?.singleImage || "";
  const beforeLabel: string = s.content?.beforeLabel || "BEFORE";
  const afterLabel: string = s.content?.afterLabel || "AFTER";

  // Stats
  const stat1Title: string = s.content?.stat1Title || "0.49$";
  const stat1Sub: string = s.content?.stat1Sub || "Price starts from";
  const stat1Cap: string = s.content?.stat1Cap || "per image";

  const stat2Title: string = s.content?.stat2Title || "5000";
  const stat2Sub: string = s.content?.stat2Sub || "We can deliver";
  const stat2Cap: string = s.content?.stat2Cap || "images/day";

  const stat3Title: string = s.content?.stat3Title || "40%";
  const stat3Sub: string = s.content?.stat3Sub || "Discount Upto";
  const stat3Cap: string = s.content?.stat3Cap || "on bulk order";

  // Price Items list
  const priceItems: PriceItem[] = s.content?.priceItems || [];

  // Buttons Link and labels
  const btn1Label: string = s.content?.btn1Label || "Free Trial";
  const btn1Link = s.content?.btn1Link || { url: "#", target: "_self", nofollow: false };

  const btn2Label: string = s.content?.btn2Label || "Get A Quote";
  const btn2Link = s.content?.btn2Link || { url: "#", target: "_self", nofollow: false };

  const btn3Label: string = s.content?.btn3Label || "View Details";
  const btn3Link = s.content?.btn3Link || { url: "#", target: "_self", nofollow: false };

  // Styling values
  const cardBg: string = s.style?.cardBg || "#ffffff";
  const headerBg: string = s.style?.headerBg || "#f3f4f6";
  const headerTextColor: string = s.style?.headerTextColor || "#1e293b";

  const statsColor: string = s.style?.statsColor || "#62b359";
  const statsLabelColor: string = s.style?.statsLabelColor || "#4b5563";
  
  const itemTextColor: string = s.style?.itemTextColor || "#374151";
  const priceTextColor: string = s.style?.priceTextColor || "#111827";

  // Button style colors
  const btn1Bg: string = s.style?.btn1Bg || "#075e7a";
  const btn1TextColor: string = s.style?.btn1TextColor || "#ffffff";

  const btn2Bg: string = s.style?.btn2Bg || "#668cff";
  const btn2TextColor: string = s.style?.btn2TextColor || "#ffffff";

  const btn3Bg: string = s.style?.btn3Bg || "#004d66";
  const btn3TextColor: string = s.style?.btn3TextColor || "#ffffff";

  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 350);

  // Monitor screen width
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute active height
  let activeHeight = heightObj.desktop;
  if (windowWidth <= 768) {
    activeHeight = heightObj.mobile;
  } else if (windowWidth <= 1024) {
    activeHeight = heightObj.tablet;
  }

  // Typography
  const headerTyp = getTypographyStyles(s.style?.headerTypography || {});

  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Divide price items list into two columns for desktop layout
  const midPoint = Math.ceil(priceItems.length / 2);
  const col1Items = priceItems.slice(0, midPoint);
  const col2Items = priceItems.slice(midPoint);

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
        className="w-full max-w-[1140px] rounded-xl overflow-hidden shadow-[0_12px_45px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col box-border"
        style={{
          backgroundColor: cardBg,
          ...paddingStyle,
        }}
      >
        {/* Header grey/blue bar */}
        {headerTitle && (
          <div
            className="w-full p-4 sm:p-5 border-b border-gray-100 flex items-center"
            style={{
              backgroundColor: headerBg,
            }}
          >
            <h3
              className="text-lg font-extrabold m-0"
              style={{
                color: headerTextColor,
                ...headerTyp,
              }}
            >
              {headerTitle}
            </h3>
          </div>
        )}

        {/* Content columns container (Left Slider, Right Pricing details) */}
        <div className="flex flex-col lg:flex-row w-full p-6 sm:p-8 box-border gap-8">
          
          {/* Left panel Before/After Slider */}
          <div className="w-full lg:w-[40%] shrink-0">
            {singleImage ? (
              <div
                className="w-full overflow-hidden relative rounded-lg"
                style={{ height: `${activeHeight}px` }}
              >
                <img
                  src={singleImage}
                  alt="Service preview"
                  className="w-full h-full object-cover block"
                />
              </div>
            ) : (
              <BeforeAfterImageSlider
                beforeImage={beforeImage}
                afterImage={afterImage}
                beforeLabel={beforeLabel}
                afterLabel={afterLabel}
                height={activeHeight}
              />
            )}
          </div>

          {/* Right panel Stats + Pricing tables + CTA buttons */}
          <div className="w-full lg:w-[60%] flex flex-col justify-between gap-6">
            
            {/* Stats row grid layout */}
            <div className="grid grid-cols-3 gap-3 w-full border-b border-gray-100 pb-5">
              {/* Stat 1 */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[12px] font-medium leading-none mb-1.5" style={{ color: statsLabelColor }}>
                  {stat1Sub}
                </span>
                <span className="text-[22px] font-extrabold leading-none mb-1.5" style={{ color: statsColor }}>
                  {stat1Title}
                </span>
                <span className="text-[11.5px] text-gray-400 font-medium leading-none">
                  {stat1Cap}
                </span>
              </div>

              {/* Stat 2 */}
              <div className="flex flex-col items-center justify-center text-center border-x border-gray-100 px-2">
                <span className="text-[12px] font-medium leading-none mb-1.5" style={{ color: statsLabelColor }}>
                  {stat2Sub}
                </span>
                <span className="text-[22px] font-extrabold leading-none mb-1.5" style={{ color: statsColor }}>
                  {stat2Title}
                </span>
                <span className="text-[11.5px] text-gray-400 font-medium leading-none">
                  {stat2Cap}
                </span>
              </div>

              {/* Stat 3 */}
              <div className="flex flex-col items-center justify-center text-center">
                <span className="text-[12px] font-medium leading-none mb-1.5" style={{ color: statsLabelColor }}>
                  {stat3Sub}
                </span>
                <span className="text-[22px] font-extrabold leading-none mb-1.5" style={{ color: statsColor }}>
                  {stat3Title}
                </span>
                <span className="text-[11.5px] text-gray-400 font-medium leading-none">
                  {stat3Cap}
                </span>
              </div>
            </div>

            {/* Service item lists with prices */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 w-full">
              {/* Column 1 pricing list */}
              <div className="flex flex-col gap-3.5">
                {col1Items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between w-full border-b border-dashed border-gray-100 pb-1.5">
                    <div className="flex items-center gap-1.5 text-[13.5px] font-bold" style={{ color: itemTextColor }}>
                      {s.content?.listIcon ? (
                        <Icon icon={s.content.listIcon} className="shrink-0 text-gray-400" width="16" />
                      ) : (
                        <span className="text-gray-400 text-[11px]">&gt;</span>
                      )}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[14px] font-extrabold" style={{ color: priceTextColor }}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>

              {/* Column 2 pricing list */}
              <div className="flex flex-col gap-3.5">
                {col2Items.map((item, idx) => (
                  <div key={item.id || idx} className="flex items-center justify-between w-full border-b border-dashed border-gray-100 pb-1.5">
                    <div className="flex items-center gap-1.5 text-[13.5px] font-bold" style={{ color: itemTextColor }}>
                      {s.content?.listIcon ? (
                        <Icon icon={s.content.listIcon} className="shrink-0 text-gray-400" width="16" />
                      ) : (
                        <span className="text-gray-400 text-[11px]">&gt;</span>
                      )}
                      <span>{item.label}</span>
                    </div>
                    <span className="text-[14px] font-extrabold" style={{ color: priceTextColor }}>
                      {item.price}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action buttons row */}
            <div className="flex flex-col sm:flex-row items-center gap-4 w-full pt-4">
              {btn1Label && (
                <a
                  className="w-full sm:flex-1 inline-flex items-center justify-center py-3 px-4 rounded font-bold text-[13.5px] uppercase no-underline cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 box-border"
                  href={btn1Link?.url || "#"}
                  target={btn1Link?.target || "_self"}
                  rel={btn1Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  style={{
                    backgroundColor: btn1Bg,
                    color: btn1TextColor,
                  }}
                >
                  {btn1Label}
                </a>
              )}

              {btn2Label && (
                <a
                  className="w-full sm:flex-1 inline-flex items-center justify-center py-3 px-4 rounded font-bold text-[13.5px] uppercase no-underline cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 box-border"
                  href={btn2Link?.url || "#"}
                  target={btn2Link?.target || "_self"}
                  rel={btn2Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  style={{
                    backgroundColor: btn2Bg,
                    color: btn2TextColor,
                  }}
                >
                  {btn2Label}
                </a>
              )}

              {btn3Label && (
                <a
                  className="w-full sm:flex-1 inline-flex items-center justify-center py-3 px-4 rounded font-bold text-[13.5px] uppercase no-underline cursor-pointer transition-transform duration-200 hover:-translate-y-0.5 box-border"
                  href={btn3Link?.url || "#"}
                  target={btn3Link?.target || "_self"}
                  rel={btn3Link?.nofollow ? "nofollow noopener noreferrer" : "noopener noreferrer"}
                  style={{
                    backgroundColor: btn3Bg,
                    color: btn3TextColor,
                  }}
                >
                  {btn3Label}
                </a>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const servicePricingCardElement = {
  type: "colorexperts-service-pricing-card",
  category: "colorexperts",
  label: "Service Pricing Details",
  icon: "solar:bill-list-bold-duotone",

  schema: {
    content: {
      headerTitle: "Clipping Path Services",
      beforeImage: "",
      afterImage: "",
      singleImage: "",
      beforeLabel: "BEFORE",
      afterLabel: "AFTER",
      stat1Title: "0.49$",
      stat1Sub: "Price starts from",
      stat1Cap: "per image",
      stat2Title: "5000",
      stat2Sub: "We can deliver",
      stat2Cap: "images/day",
      stat3Title: "40%",
      stat3Sub: "Discount Upto",
      stat3Cap: "on bulk order",
      listIcon: "",
      priceItems: [
        { id: "p1", label: "Basic Clipping Path", price: "$0.49" },
        { id: "p2", label: "Simple Clipping Path", price: "$0.99" },
        { id: "p3", label: "Complex Clipping Path", price: "$3.99" },
        { id: "p4", label: "Clipping Path Flatness", price: "$0.49" },
        { id: "p5", label: "Remove Unwanted Objects", price: "$1.25" },
        { id: "p6", label: "Clipping Path With Shadows", price: "$0.99" },
        { id: "p7", label: "Medium Clipping Path", price: "$1.99" },
        { id: "p8", label: "Super Complex Clipping Path", price: "$7.99" },
        { id: "p9", label: "Extra Super Complex Clipping Path", price: "$14.99" },
      ],
      btn1Label: "Free Trial",
      btn1Link: { url: "#", target: "_self", nofollow: false },
      btn2Label: "Get A Quote",
      btn2Link: { url: "#", target: "_self", nofollow: false },
      btn3Label: "View Details",
      btn3Link: { url: "#", target: "_self", nofollow: false },
    },

    style: {
      cardBg: "#ffffff",
      headerBg: "#f8fafc",
      headerTextColor: "#1e293b",
      statsColor: "#62b359",
      statsLabelColor: "#4b5563",
      itemTextColor: "#374151",
      priceTextColor: "#111827",
      imageHeight: 350,
      btn1Bg: "#075e7a",
      btn1TextColor: "#ffffff",
      btn2Bg: "#668cff",
      btn2TextColor: "#ffffff",
      btn3Bg: "#004d66",
      btn3TextColor: "#ffffff",
      headerTypography: { fontSize: 18, fontSizeUnit: "px", fontWeight: "800" },
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
          name: "headerTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Header Title" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

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
      section: "Statistics Grid Details",
      controls: [
        {
          name: "stat1Title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 1 Value (Bold Green)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat1Sub",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 1 Subtitle" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat1Cap",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 1 Caption (Grey)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat2Title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 2 Value (Bold Green)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat2Sub",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 2 Subtitle" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat2Cap",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 2 Caption (Grey)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat3Title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 3 Value (Bold Green)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat3Sub",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 3 Subtitle" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "stat3Cap",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Stat 3 Caption (Grey)" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Service Prices List",
      controls: [
        {
          name: "listIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Common List Icon (Optional)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "priceItems",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Service Item #${idx + 1}: ${item.label || ""}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Item
                      </button>
                    </div>

                    <Text
                      label="Service Label"
                      value={item.label || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Price Value"
                      value={item.price || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], price: v }; onChange(u);
                      }}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: PriceItem = {
                    id: `p_${Date.now()}`,
                    label: "New Service Description",
                    price: "$0.99",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-semibold cursor-pointer transition-colors"
              >
                + Add Service Pricing Row
              </button>
            </div>
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "CTA Button Details",
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
        {
          name: "btn3Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button 3 Label" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn3Link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 3 Link URL" value={value} onChange={onChange} />
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
          name: "cardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Overall Card Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "headerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Top Bar Background" value={value ?? "#f8fafc"} onChange={onChange} />
          ),
        },
        {
          name: "headerTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Top Bar Text Color" value={value ?? "#1e293b"} onChange={onChange} />
          ),
        },
        {
          name: "statsColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Stats Highlight (Green)" value={value ?? "#62b359"} onChange={onChange} />
          ),
        },
        {
          name: "statsLabelColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Stats Subtitle Label" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Pricing Rows Colors",
      controls: [
        {
          name: "itemTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Service Text Color" value={value ?? "#374151"} onChange={onChange} />
          ),
        },
        {
          name: "priceTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Price Text Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Before/After Image Height Setting",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Service Slider Height (px)"
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
      section: "CTA Buttons Colors",
      controls: [
        {
          name: "btn1Bg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 Background" value={value ?? "#075e7a"} onChange={onChange} />
          ),
        },
        {
          name: "btn1TextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 1 Text" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btn2Bg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 Background" value={value ?? "#668cff"} onChange={onChange} />
          ),
        },
        {
          name: "btn2TextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 2 Text" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "btn3Bg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 3 Background" value={value ?? "#004d66"} onChange={onChange} />
          ),
        },
        {
          name: "btn3TextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button 3 Text" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography Settings",
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

  render: (element: any) => <ServicePricingCardFrontend element={element} />,
};

export default servicePricingCardElement;
