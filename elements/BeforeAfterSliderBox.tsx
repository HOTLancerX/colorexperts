"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Dimensions,
  NumberControl,
  ImageGallery,
} from "@/components/builder/controls";

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

/* ── Frontend Box Component ── */
function BeforeAfterSliderBoxFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content values
  const beforeImage: string = s.content?.beforeImage || "";
  const afterImage: string = s.content?.afterImage || "";
  const singleImage: string = s.content?.singleImage || "";
  const beforeLabel: string = s.content?.beforeLabel || "BEFORE";
  const afterLabel: string = s.content?.afterLabel || "AFTER";

  // Height settings
  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 350);

  // Screen Width monitoring
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
        className="w-full max-w-[600px] overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.06)] border border-black/5 flex flex-col box-border"
        style={{ ...paddingStyle }}
      >
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
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const beforeAfterSliderBoxElement = {
  type: "before-after-slider-box",
  category: "colorexperts",
  label: "Before/After Slider Box",
  icon: "solar:slider-minimalistic-horizontal-bold-duotone",

  schema: {
    content: {
      beforeImage: "",
      afterImage: "",
      singleImage: "",
      beforeLabel: "BEFORE",
      afterLabel: "AFTER",
    },

    style: {
      imageHeight: 350,
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
      section: "Image Settings",
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

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Height Setting",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl
              label="Box Height (px)"
              value={value ?? 350}
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

  render: (element: any) => <BeforeAfterSliderBoxFrontend element={element} />,
};

export default beforeAfterSliderBoxElement;
