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

  // Keep track of container width for absolute positioning of overlay image
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

  // Placeholder images if not provided
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
      {/* AFTER IMAGE (Background) */}
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

/* ── Frontend Card Component ── */
function BeforeAfterPricingCardFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content values
  const cardTitle: string = s.content?.cardTitle || "Clipping Path Services";
  const beforeImage: string = s.content?.beforeImage || "";
  const afterImage: string = s.content?.afterImage || "";
  const singleImage: string = s.content?.singleImage || "";
  
  const beforeLabel: string = s.content?.beforeLabel || "BEFORE";
  const afterLabel: string = s.content?.afterLabel || "AFTER";

  const pricePrefix: string = s.content?.pricePrefix || "Starts From";
  const startPrice: string = s.content?.startPrice || "$0.49";
  const priceSuffix: string = s.content?.priceSuffix || "per image";

  const pricesList: PriceRow[] = s.content?.pricesList || [];

  const btn1Label: string = s.content?.btn1Label || "Free Trial";
  const btn1Link = s.content?.btn1Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" };

  const btn2Label: string = s.content?.btn2Label || "Get a Quote";
  const btn2Link = s.content?.btn2Link || { url: "#", target: "_self", nofollow: false, customAttributes: "" };

  // Styling values
  const containerBg: string = s.style?.containerBg || "#ffffff";
  const titleBarBg: string = s.style?.titleBarBg || "#62b359";
  const titleColor: string = s.style?.titleColor || "#ffffff";
  const listTextColor: string = s.style?.listTextColor || "#1f2937";
  const priceHighlightColor: string = s.style?.priceHighlightColor || "#111827";
  
  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 320);

  // Button 1 Colors
  const btn1Bg: string = s.style?.btn1Bg || "transparent";
  const btn1Color: string = s.style?.btn1Color || "#3cb878";
  const btn1HoverBg: string = s.style?.btn1HoverBg || "#3cb878";
  const btn1HoverColor: string = s.style?.btn1HoverColor || "#ffffff";

  // Button 2 Colors
  const btn2BgStart: string = s.style?.btn2BgStart || "#0f766e";
  const btn2BgEnd: string = s.style?.btn2BgEnd || "#2dd4bf";
  const btn2TextColor: string = s.style?.btn2TextColor || "#ffffff";
  const btn2HoverBgStart: string = s.style?.btn2HoverBgStart || "#0d9488";
  const btn2HoverBgEnd: string = s.style?.btn2HoverBgEnd || "#14b8a6";
  const btn2HoverTextColor: string = s.style?.btn2HoverTextColor || "#ffffff";

  // Hover states for buttons
  const [hoverBtn1, setHoverBtn1] = useState(false);
  const [hoverBtn2, setHoverBtn2] = useState(false);

  // Screen width monitoring for responsive inline heights
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Compute active image height dynamically inline
  let activeImageHeight = heightObj.desktop;
  if (windowWidth <= 768) {
    activeImageHeight = heightObj.mobile;
  } else if (windowWidth <= 1024) {
    activeImageHeight = heightObj.tablet;
  }

  // Typography styles
  const cardTitleTyp = getTypographyStyles(s.style?.cardTitleTypography || {});
  const listTyp = getTypographyStyles(s.style?.listTypography || {});

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
      <div
        className="w-full max-w-[440px] rounded-xl overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-black/5 flex flex-col box-border"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* Title Bar header */}
        <div
          className="py-4.5 px-6 text-center box-border"
          style={{ backgroundColor: titleBarBg }}
        >
          <h3
            className="text-xl font-bold m-0 tracking-[0.2px]"
            style={{
              color: titleColor,
              ...cardTitleTyp,
            }}
          >
            {cardTitle}
          </h3>
        </div>

        {/* Image Display Panel */}
        {singleImage ? (
          <div
            className="w-full overflow-hidden"
            style={{ height: `${activeImageHeight}px` }}
          >
            <img
              src={singleImage}
              alt="Service view"
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

        {/* Details and table lists info box bottom */}
        <div className="flex flex-col p-[30px_24px] box-border">
          {/* Price Starts subtitle header */}
          <div className="flex items-center justify-center gap-2 text-sm text-gray-500 mb-6">
            <span>{pricePrefix}</span>
            <span
              className="text-[38px] font-extrabold leading-none"
              style={{ color: priceHighlightColor }}
            >
              {startPrice}
            </span>
            <span>{priceSuffix}</span>
          </div>

          {/* Pricing table list */}
          <div className="flex flex-col mb-7 w-full">
            {pricesList.map((item, idx) => (
              <div
                key={item.id || idx}
                className="flex justify-between items-center py-3 border-b-[1.5px] border-gray-100 last:border-b-0 text-[14.5px] font-medium"
                style={{
                  color: listTextColor,
                  ...listTyp,
                }}
              >
                <span>{item.label}</span>
                <span
                  className="font-bold"
                  style={{ color: priceHighlightColor }}
                >
                  {item.price}
                </span>
              </div>
            ))}
          </div>

          {/* Button actions row bottom */}
          <div className="flex items-center gap-4 w-full">
            {btn1Label && (
              <a
                className="flex-1 inline-flex items-center justify-center py-3 px-4 rounded-[40px] border-2 text-[13.5px] font-bold tracking-[0.5px] uppercase no-underline cursor-pointer transition-all duration-250 ease-in-out box-border"
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
                className="flex-1 inline-flex items-center justify-center py-3.5 px-4 rounded-[40px] border-none text-[13.5px] font-bold tracking-[0.5px] uppercase no-underline cursor-pointer transition-all duration-250 ease-in-out hover:-translate-y-0.5 box-border shadow-lg shadow-teal-500/20"
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
const beforeAfterPricingCardElement = {
  type: "before-after-pricing-card",
  category: "colorexperts",
  label: "Before/After Pricing Card",
  icon: "solar:slider-minimalistic-horizontal-bold-duotone",

  schema: {
    content: {
      cardTitle: "Clipping Path Services",
      beforeImage: "",
      afterImage: "",
      singleImage: "",
      beforeLabel: "BEFORE",
      afterLabel: "AFTER",
      pricePrefix: "Starts From",
      startPrice: "$0.49",
      priceSuffix: "per image",
      pricesList: [
        { id: "p1", label: "Basic Paths", price: "$0.49" },
        { id: "p2", label: "Simple Paths", price: "$0.99" },
        { id: "p3", label: "Complex Paths", price: "$6.90" },
        { id: "p4", label: "Super Complex Path", price: "$7.99" },
      ],
      btn1Label: "Free Trial",
      btn1Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
      btn2Label: "Get a Quote",
      btn2Link: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
    },

    style: {
      containerBg: "#ffffff",
      titleBarBg: "#62b359",
      titleColor: "#ffffff",
      listTextColor: "#1f2937",
      priceHighlightColor: "#111827",
      imageHeight: 320,
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
      cardTitleTypography: { fontSize: 20, fontSizeUnit: "px", fontWeight: "700" },
      listTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "500" },
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
          name: "cardTitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Card Header Title" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Image Display Settings",
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
            <ImageGallery label="After View Image (Background)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "beforeLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Before Tag Text" value={value || "BEFORE"} onChange={onChange} />
          ),
        },
        {
          name: "afterLabel",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="After Tag Text" value={value || "AFTER"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Starts From Pricing Header",
      controls: [
        {
          name: "pricePrefix",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Price prefix tag" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "startPrice",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Starts Price text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "priceSuffix",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Price suffix tag" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Pricing list items",
      controls: [
        {
          name: "pricesList",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-3">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Item #${idx + 1}: ${item.label || ""}`}>
                  <div className="space-y-2 pt-1">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Row
                      </button>
                    </div>

                    <Text
                      label="Path Level Name"
                      value={item.label || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], label: v }; onChange(u);
                      }}
                    />

                    <Text
                      label="Price Tag"
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
                  const newRow = {
                    id: `p_${Date.now()}`,
                    label: "New Path Level",
                    price: "$0.00",
                  };
                  onChange([...(value || []), newRow]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-medium cursor-pointer transition-colors"
              >
                + Add Pricing Row
              </button>
            </div>
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
            <Text label="Button 1 text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn1Link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 1 URL" value={value} onChange={onChange} />
          ),
        },
        {
          name: "btn2Label",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Button 2 text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "btn2Link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Button 2 URL" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Card & Header Colors",
      controls: [
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Card Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "titleBarBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Bar Background" value={value ?? "#62b359"} onChange={onChange} />
          ),
        },
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Title Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "listTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="List text color" value={value ?? "#1f2937"} onChange={onChange} />
          ),
        },
        {
          name: "priceHighlightColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Prices text color" value={value ?? "#111827"} onChange={onChange} />
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
              label="Single Image Height (px)"
              value={value ?? 320}
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
            <ColorPickerPopup label="Button 1 color" value={value ?? "#059669"} onChange={onChange} />
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
            <ColorPickerPopup label="Button 2 hover text" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography",
      controls: [
        {
          name: "cardTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Header Typography" value={value} onChange={onChange} />
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
      section: "Spacing",
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

  render: (element: any) => <BeforeAfterPricingCardFrontend element={element} />,
};

export default beforeAfterPricingCardElement;
