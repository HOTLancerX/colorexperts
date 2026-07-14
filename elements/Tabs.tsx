"use client";

import React, { useEffect, useRef, useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  Select,
  Dimensions,
  ColorPickerPopup,
  Url,
  IconPicker,
  Typography,
  NumberControl,
  ImageGallery,
  Section,
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

/* ── Before/After Slider Component ── */
function BeforeAfterImageSlider({
  beforeImage,
  afterImage,
  beforeLabel = "BEFORE",
  afterLabel = "AFTER",
  height = 350,
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
    const container = containerRef.current;
    const handleResize = () => {
      setContainerWidth(container.offsetWidth);
    };
    handleResize();

    const observer = new ResizeObserver(() => {
      handleResize();
    });
    observer.observe(container);

    window.addEventListener("resize", handleResize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", handleResize);
    };
  }, [beforeImage, afterImage]);

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

  const startDrag = (clientX: number) => {
    isDragging.current = true;
    if (containerRef.current) {
      setContainerWidth(containerRef.current.offsetWidth);
    }
    handleMove(clientX);
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

  const placeholderBefore =
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80";
  const placeholderAfter =
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80&monochrome=1";

  const imgBefore = beforeImage || placeholderBefore;
  const imgAfter = afterImage || placeholderAfter;

  return (
    <div
      ref={containerRef}
      onMouseDown={(e) => startDrag(e.clientX)}
      onTouchStart={(e) => {
        if (e.touches.length > 0) {
          startDrag(e.touches[0].clientX);
        }
      }}
      onMouseMove={onMouseMove}
      onTouchMove={onTouchMove}
      className="relative w-full overflow-hidden select-none cursor-ew-resize bg-gray-100 flex items-center justify-center"
      style={{
        height: `${height}px`,
        touchAction: "none",
      }}
    >
      {/* AFTER IMAGE (Background) */}
      <img
        src={imgAfter}
        alt="After view"
        className="w-full h-full object-cover block pointer-events-none"
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          objectPosition: "center",
        }}
      />
      <div
        className="absolute bottom-2.5 right-2.5 text-[11px] font-bold text-white bg-slate-900/70 py-1 px-2.5 rounded z-10 tracking-[0.5px]"
      >
        {afterLabel}
      </div>

      {/* BEFORE IMAGE (Clipped Overlay) */}
      <div
        className="absolute top-0 left-0 bottom-0 overflow-hidden z-2 pointer-events-none"
        style={{
          width: `${sliderPos}%`,
        }}
      >
        <img
          src={imgBefore}
          alt="Before view"
          className="absolute top-0 left-0 h-full max-w-none object-cover block pointer-events-none"
          style={{
            width: containerWidth || "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center",
          }}
        />
        <div
          className="absolute bottom-2.5 left-2.5 text-[11px] font-bold text-white bg-slate-900/70 py-1 px-2.5 rounded z-10 tracking-[0.5px] whitespace-nowrap"
        >
          {beforeLabel}
        </div>
      </div>

      {/* Slider Line Divider */}
      <div
        className="absolute top-0 bottom-0 w-[2px] bg-white z-3 pointer-events-none"
        style={{
          left: `${sliderPos}%`,
        }}
      />

      {/* Custom Slider Handle (Soybean outline / dark theme circle style) */}
      <div
        className="absolute top-1/2 -translate-y-1/2 z-4 w-10.5 h-10.5 rounded-full bg-slate-900 border-[3px] border-white shadow-[0_4px_12px_rgba(0,0,0,0.3)] flex items-center justify-center pointer-events-none text-white transition-transform duration-105 scale-100"
        style={{
          left: `${sliderPos}%`,
          transform: "translate(-50%, -50%)",
        }}
      >
        <Icon icon="solar:alt-arrow-left-right-bold" width="18" className="text-white" />
      </div>
    </div>
  );
}

interface TabItem {
  id: string;
  label: string;
  icon: string;
  title: string;
  description: string;
  beforeImage: string;
  afterImage: string;
  singleImage: string;
  beforeLabel: string;
  afterLabel: string;
  features: string;
  btnLabel: string;
  btnLink: any;
}

/* ── Frontend Component ── */
function TabsFrontend({ element }: { element: any }) {
  const s = element.schema;

  const tabs: TabItem[] = s.content?.tabsList || [];
  const [activeTabId, setActiveTabId] = useState("");

  // Select first tab as default active
  useEffect(() => {
    if (tabs.length > 0 && (!activeTabId || !tabs.find((t) => t.id === activeTabId))) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Screen Width monitoring
  const [windowWidth, setWindowWidth] = useState(1200);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    setIsMobile(window.innerWidth <= MOBILE_MAX);
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
      setIsMobile(window.innerWidth <= MOBILE_MAX);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Mobile soybean dropdown open state
  const [dropdownOpen, setDropdownOpen] = useState(false);

  // Height configurations
  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 350);
  let activeImageHeight = heightObj.desktop;
  if (windowWidth <= MOBILE_MAX) {
    activeImageHeight = heightObj.mobile;
  } else if (windowWidth <= TABLET_MAX) {
    activeImageHeight = heightObj.tablet;
  }

  // Styles computed
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Colors
  const containerBg = s.style?.containerBg || "transparent";
  const tabsBg = s.style?.tabsBg || "#f8fafc";
  const activeTabBg = s.style?.activeTabBg || "#ffffff";
  const activeTabColor = s.style?.activeTabColor || "#ff4b72";
  const inactiveTabBg = s.style?.inactiveTabBg || "transparent";
  const inactiveTabColor = s.style?.inactiveTabColor || "#1e293b";
  const contentBg = s.style?.contentBg || "#ffffff";
  const titleColor = s.style?.titleColor || "#1e3a8a";
  const descColor = s.style?.descColor || "#4b5563";
  const featureDotColor = s.style?.featureDotColor || "#ff4b72";
  const featureTextColor = s.style?.featureTextColor || "#4b5563";
  const btnBg = s.style?.btnBg || "#ff4b72";
  const btnTextColor = s.style?.btnTextColor || "#ffffff";

  // Typography styles
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const descTyp = getTypographyStyles(s.style?.descTypography || {});
  const tabTyp = getTypographyStyles(s.style?.tabTypography || {});

  // Tab Sidebar width (Desktop)
  const tabWidth = s.style?.tabWidth ?? 280;
  const position = s.style?.position || "left"; // left, right, top, bottom

  if (!activeTab) {
    return (
      <div className="p-8 text-center text-gray-400 font-semibold">
        Please configure tab items in the builder content panel.
      </div>
    );
  }

  // Parse features string by newline
  const featuresList = (activeTab.features || "")
    .split("\n")
    .map((f) => f.trim())
    .filter((f) => f.length > 0);

  // Render navigation item lists
  const renderNavItems = () => {
    return tabs.map((tab) => {
      const isActive = tab.id === activeTabId;
      return (
        <button
          key={tab.id}
          type="button"
          onClick={() => setActiveTabId(tab.id)}
          className={`relative flex items-center gap-3 py-4 px-6 w-full text-left font-bold border-none transition-all duration-300 rounded-[20px] cursor-pointer group outline-none select-none`}
          style={{
            backgroundColor: isActive ? activeTabBg : inactiveTabBg,
            color: isActive ? activeTabColor : inactiveTabColor,
            boxShadow: isActive ? "0 8px 24px rgba(255, 75, 114, 0.06)" : "none",
            ...tabTyp,
          }}
        >
          {tab.icon && (
            <Icon
              icon={tab.icon}
              width="20"
              className="shrink-0 transition-transform duration-300 group-hover:scale-110"
              style={{
                color: isActive ? activeTabColor : "rgba(30, 41, 59, 0.4)",
              }}
            />
          )}
          <span className="truncate leading-normal">{tab.label}</span>

          {/* Active pointer indicator */}
          {isActive && (
            <div
              className="hidden md:block transition-all duration-300"
              style={{
                position: "absolute",
                backgroundColor: activeTabBg,
                width: "12px",
                height: "12px",
                transform: "rotate(45deg)",
                zIndex: 10,
                // Position indicator depending on dynamic layout setting
                ...(position === "left" && {
                  top: "50%",
                  right: "-6px",
                  transform: "translateY(-50%) rotate(45deg)",
                }),
                ...(position === "right" && {
                  top: "50%",
                  left: "-6px",
                  transform: "translateY(-50%) rotate(45deg)",
                }),
                ...(position === "top" && {
                  bottom: "-6px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                }),
                ...(position === "bottom" && {
                  top: "-6px",
                  left: "50%",
                  transform: "translateX(-50%) rotate(45deg)",
                }),
              }}
            />
          )}
        </button>
      );
    });
  };

  // Build grid layout depending on Left/Right side position
  const isHorizontalTabs = position === "top" || position === "bottom";
  const navFlexDirection = position === "right" ? "md:flex-row-reverse" : "md:flex-row";
  const stackDirection = position === "bottom" ? "flex-col-reverse" : "flex-col";

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
      <style
        dangerouslySetInnerHTML={{
          __html: `
            .no-scrollbar::-webkit-scrollbar {
              display: none;
            }
          `,
        }}
      />

      <div
        className="w-full max-w-[1200px] flex flex-col box-border"
        style={{
          backgroundColor: containerBg,
          ...paddingStyle,
        }}
      >
        {/* MOBILE LAYOUT: Soybean styled dropdown */}
        {isMobile ? (
          <div className="flex flex-col gap-6 w-full px-4 sm:px-6">
            {/* Soybean Selector trigger */}
            <div className="relative w-full">
              <button
                type="button"
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-full border border-gray-100 rounded-full px-5 py-4 flex items-center justify-between shadow-[0_6px_20px_rgba(0,0,0,0.03)] cursor-pointer text-[15px] font-bold text-slate-800 bg-white text-left outline-none transition-all"
              >
                <div className="flex items-center gap-3 overflow-hidden">
                  {activeTab.icon && (
                    <Icon icon={activeTab.icon} width="20" className="text-[#ff4b72] shrink-0" />
                  )}
                  <span className="truncate">{activeTab.label}</span>
                </div>
                <Icon
                  icon="solar:alt-arrow-down-linear"
                  width="18"
                  className={`text-slate-400 shrink-0 transition-transform duration-300 ${
                    dropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Options list dropdown overlay */}
              {dropdownOpen && (
                <div
                  className="absolute left-0 right-0 mt-2 p-2 bg-white rounded-2xl border border-gray-100 shadow-[0_12px_30px_rgba(0,0,0,0.09)] z-50 flex flex-col gap-1 max-h-[300px] overflow-y-auto"
                >
                  {tabs.map((tab) => {
                    const isSelected = tab.id === activeTabId;
                    return (
                      <button
                        key={tab.id}
                        type="button"
                        onClick={() => {
                          setActiveTabId(tab.id);
                          setDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-3 border-none outline-none rounded-xl text-left text-[14.5px] font-bold cursor-pointer transition-colors ${
                          isSelected
                            ? "bg-rose-50 text-[#ff4b72]"
                            : "bg-transparent text-slate-700 hover:bg-slate-50"
                        }`}
                      >
                        {tab.icon && (
                          <Icon
                            icon={tab.icon}
                            width="18"
                            className={isSelected ? "text-[#ff4b72]" : "text-slate-400"}
                          />
                        )}
                        <span className="truncate">{tab.label}</span>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Content Display Area (Mobile Card Panel) */}
            <div
              className="w-full rounded-2xl overflow-hidden shadow-[0_12px_36px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col"
              style={{ backgroundColor: contentBg }}
            >
              {/* Slider Block */}
              <div className="w-full shrink-0">
                {activeTab.singleImage ? (
                  <div
                    className="w-full overflow-hidden flex items-center justify-center bg-gray-100"
                    style={{ width: "100%", height: `${activeImageHeight}px` }}
                  >
                    <img
                      src={activeTab.singleImage}
                      alt={activeTab.title}
                      className="w-full h-full object-cover block pointer-events-none"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                ) : (
                  <BeforeAfterImageSlider
                    beforeImage={activeTab.beforeImage}
                    afterImage={activeTab.afterImage}
                    beforeLabel={activeTab.beforeLabel}
                    afterLabel={activeTab.afterLabel}
                    height={activeImageHeight}
                  />
                )}
              </div>

              {/* Text Block */}
              <div className="flex flex-col p-6 gap-5">
                <h3
                  className="text-2xl font-extrabold m-0 leading-tight"
                  style={{ color: titleColor, ...titleTyp }}
                >
                  {activeTab.title}
                </h3>
                <p
                  className="text-[14.5px] leading-relaxed m-0 text-gray-500 font-medium"
                  style={{ color: descColor, ...descTyp }}
                >
                  {activeTab.description}
                </p>

                {/* Bullets List */}
                {featuresList.length > 0 && (
                  <ul className="list-none p-0 m-0 flex flex-col gap-3">
                    {featuresList.map((feature, fIdx) => (
                      <li key={fIdx} className="flex items-center gap-3 text-slate-700 text-[14.5px]">
                        <span
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: featureDotColor }}
                        />
                        <span style={{ color: featureTextColor }}>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Action CTA Button */}
                {activeTab.btnLabel && (
                  <div className="mt-2">
                    <a
                      href={activeTab.btnLink?.url || "#"}
                      target={activeTab.btnLink?.target || "_self"}
                      rel={
                        activeTab.btnLink?.nofollow
                          ? "nofollow noopener noreferrer"
                          : "noopener noreferrer"
                      }
                      className="inline-flex items-center justify-center gap-2 py-3 px-6 rounded-xl text-[14px] font-bold uppercase no-underline cursor-pointer transition-all duration-200 shadow-md w-full sm:w-auto"
                      style={{
                        backgroundColor: btnBg,
                        color: btnTextColor,
                        boxShadow: `0 6px 15px rgba(255, 75, 114, 0.15)`,
                      }}
                    >
                      <span>{activeTab.btnLabel}</span>
                      <Icon icon="solar:double-alt-arrow-right-bold" width="16" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : (
          /* DESKTOP LAYOUT */
          <div className={`flex w-full ${isHorizontalTabs ? stackDirection : navFlexDirection} gap-6`}>
            {/* Sidebar or Top/Bottom Bar */}
            <div
              className={`shrink-0 flex ${
                isHorizontalTabs
                  ? "w-full overflow-x-auto whitespace-nowrap scrollbar-none pb-2"
                  : "flex-col rounded-[24px]"
              } gap-2 p-2`}
              style={{
                width: isHorizontalTabs ? "100%" : `${tabWidth}px`,
                backgroundColor: tabsBg,
                scrollbarWidth: "none",
                msOverflowStyle: "none",
                display: "flex",
                WebkitOverflowScrolling: "touch",
              }}
            >
              {renderNavItems()}
            </div>

            {/* Right/Main Card Container content */}
            <div
              className="flex-1 rounded-[24px] overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.035)] border border-black/5 flex flex-col lg:flex-row bg-white transition-all duration-300 min-h-[400px]"
              style={{ backgroundColor: contentBg }}
            >
              {/* Image comparison section (Left) */}
              <div className="w-full lg:w-[48%] shrink-0 flex items-center justify-center bg-gray-50/50" style={{ alignSelf: "stretch" }}>
                {activeTab.singleImage ? (
                  <div
                    className="w-full overflow-hidden flex items-center justify-center bg-gray-100"
                    style={{ width: "100%", height: "100%", minHeight: `${activeImageHeight}px` }}
                  >
                    <img
                      src={activeTab.singleImage}
                      alt={activeTab.title}
                      className="w-full h-full object-cover block pointer-events-none"
                      style={{
                        width: "100%",
                        height: "100%",
                        objectFit: "cover",
                        objectPosition: "center",
                      }}
                    />
                  </div>
                ) : (
                  <BeforeAfterImageSlider
                    beforeImage={activeTab.beforeImage}
                    afterImage={activeTab.afterImage}
                    beforeLabel={activeTab.beforeLabel}
                    afterLabel={activeTab.afterLabel}
                    height={activeImageHeight}
                  />
                )}
              </div>

              {/* Description & button features details column (Right) */}
              <div className="flex-1 flex flex-col justify-between p-8 lg:p-10 gap-6 box-border">
                <div className="flex flex-col gap-4">
                  <h3
                    className="text-3xl font-extrabold m-0 leading-tight"
                    style={{ color: titleColor, ...titleTyp }}
                  >
                    {activeTab.title}
                  </h3>
                  <p
                    className="text-[15.5px] leading-relaxed m-0 text-gray-500 font-medium"
                    style={{ color: descColor, ...descTyp }}
                  >
                    {activeTab.description}
                  </p>

                  {/* Bullet Lists */}
                  {featuresList.length > 0 && (
                    <ul className="list-none p-0 m-0 flex flex-col gap-3 mt-2">
                      {featuresList.map((feature, fIdx) => (
                        <li key={fIdx} className="flex items-center gap-3 text-slate-700 text-[14.5px] font-semibold">
                          <span
                            className="w-2.5 h-2.5 rounded-full shrink-0"
                            style={{ backgroundColor: featureDotColor }}
                          />
                          <span style={{ color: featureTextColor }}>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* CTA Action button row bottom */}
                {activeTab.btnLabel && (
                  <div className="flex items-center mt-2">
                    <a
                      href={activeTab.btnLink?.url || "#"}
                      target={activeTab.btnLink?.target || "_self"}
                      rel={
                        activeTab.btnLink?.nofollow
                          ? "nofollow noopener noreferrer"
                          : "noopener noreferrer"
                      }
                      className="inline-flex items-center justify-center gap-2.5 py-4 px-8 rounded-2xl text-[14px] font-extrabold uppercase no-underline cursor-pointer transition-all duration-200 hover:-translate-y-0.5"
                      style={{
                        backgroundColor: btnBg,
                        color: btnTextColor,
                        boxShadow: `0 8px 24px rgba(255, 75, 114, 0.2)`,
                      }}
                    >
                      <span>{activeTab.btnLabel}</span>
                      <Icon icon="solar:double-alt-arrow-right-bold" width="16" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const tabsElement = {
  type: "tabs-color",
  category: "colorexperts",
  label: "Tabs Box",
  icon: "material-symbols-light:tab-outline-rounded",

  schema: {
    content: {
      tabsList: [
        {
          id: "tab1",
          label: "Background Removal Service",
          icon: "solar:box-bold-duotone",
          title: "Background Removal",
          description:
            "Professional background removal services for ecommerce, product, and marketing images. We deliver clean edges, precise manual clipping paths, and natural cutouts, ensuring your products look sharp, consistent, and conversion-ready across websites, marketplaces, and advertising platforms.",
          beforeImage: "",
          afterImage: "",
          singleImage: "",
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          features:
            "Manual clipping path\nClean white or transparent background\nHair and edge refinement\nEcommerce-ready images\nFast turnaround time",
          btnLabel: "View Background Removal",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "tab2",
          label: "Photo Retouching Service",
          icon: "solar:magic-stick-bold-duotone",
          title: "Photo Retouching",
          description:
            "High-end photo retouching services to enhance colors, remove blemishes, adjust lighting, and correct skin tones. Perfect for beauty, portrait, fashion, and commercial photography, making your photos look flawless and professional.",
          beforeImage: "",
          afterImage: "",
          singleImage: "",
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          features:
            "Blemish and spot removal\nSkin smoothing and tone correction\nLighting and contrast adjustments\nColor grading and enhancement\nHigh-end editorial retouching",
          btnLabel: "View Photo Retouching",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
        {
          id: "tab3",
          label: "Jewelry Retouching Service",
          icon: "solar:hanger-bold-duotone",
          title: "Jewelry Retouching",
          description:
            "Exquisite jewelry photo editing to bring out the brilliance of gems and precious metals. We eliminate dust, scratches, and reflections, while enhancing sparkles and color richness to create breathtaking catalogs.",
          beforeImage: "",
          afterImage: "",
          singleImage: "",
          beforeLabel: "BEFORE",
          afterLabel: "AFTER",
          features:
            "Dust, scratch, and reflection removal\nGemstone color and shine enhancement\nMetal polish and color correction\nShadow creation for realism\nHigh-detail zoom readiness",
          btnLabel: "View Jewelry Retouching",
          btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
        },
      ],
    },

    style: {
      position: "left",
      containerBg: "transparent",
      tabsBg: "#f8fafc",
      activeTabBg: "#ffffff",
      activeTabColor: "#ff4b72",
      inactiveTabBg: "transparent",
      inactiveTabColor: "#1e293b",
      contentBg: "#ffffff",
      titleColor: "#1e3a8a",
      descColor: "#4b5563",
      featureDotColor: "#ff4b72",
      featureTextColor: "#4b5563",
      btnBg: "#ff4b72",
      btnTextColor: "#ffffff",
      imageHeight: 350,
      tabWidth: 280,
      titleTypography: { fontSize: 28, fontSizeUnit: "px", fontWeight: "800" },
      descTypography: { fontSize: 15, fontSizeUnit: "px", fontWeight: "400" },
      tabTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "600" },
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
      section: "Tab Elements Setup",
      controls: [
        {
          name: "tabsList",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Tab Item #${idx + 1}: ${item.label || ""}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove Tab Item
                      </button>
                    </div>

                    <Text
                      label="Sidebar Tab Label"
                      value={item.label || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], label: v };
                        onChange(u);
                      }}
                    />

                    <IconPicker
                      label="Sidebar Tab Icon"
                      value={item.icon || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], icon: v };
                        onChange(u);
                      }}
                    />

                    <Text
                      label="Content Header Title"
                      value={item.title || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], title: v };
                        onChange(u);
                      }}
                    />

                    <Textarea
                      label="Description Paragraph text"
                      value={item.description || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], description: v };
                        onChange(u);
                      }}
                      rows={4}
                    />

                    <Textarea
                      label="Features Bullet Items (One per line)"
                      value={item.features || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], features: v };
                        onChange(u);
                      }}
                      rows={4}
                    />

                    <ImageGallery
                      label="Single Overlay Image (Overrides comparison slider)"
                      value={item.singleImage || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], singleImage: v };
                        onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Before Image"
                      value={item.beforeImage || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], beforeImage: v };
                        onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="After Image"
                      value={item.afterImage || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], afterImage: v };
                        onChange(u);
                      }}
                    />

                    <div className="grid grid-cols-2 gap-2">
                      <Text
                        label="Before Text Tag"
                        value={item.beforeLabel || "BEFORE"}
                        onChange={(v: string) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], beforeLabel: v };
                          onChange(u);
                        }}
                      />
                      <Text
                        label="After Text Tag"
                        value={item.afterLabel || "AFTER"}
                        onChange={(v: string) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], afterLabel: v };
                          onChange(u);
                        }}
                      />
                    </div>

                    <div className="border-t border-gray-100 pt-2 mt-2">
                      <Text
                        label="Button CTA Label"
                        value={item.btnLabel || "View Details"}
                        onChange={(v: string) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], btnLabel: v };
                          onChange(u);
                        }}
                      />
                      <Url
                        label="Button URL Link"
                        value={item.btnLink}
                        onChange={(v: any) => {
                          const u = [...value];
                          u[idx] = { ...u[idx], btnLink: v };
                          onChange(u);
                        }}
                      />
                    </div>
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newTab: TabItem = {
                    id: `tab_${Date.now()}`,
                    label: "New Service Element",
                    icon: "solar:gallery-wide-bold-duotone",
                    title: "New Clipping Service",
                    description: "Details explaining the service advantages and customer values.",
                    beforeImage: "",
                    afterImage: "",
                    singleImage: "",
                    beforeLabel: "BEFORE",
                    afterLabel: "AFTER",
                    features: "Quality manual clipping\nFast delivery speed\nProfessional support",
                    btnLabel: "Get Started",
                    btnLink: { url: "#", target: "_self", nofollow: false, customAttributes: "" },
                  };
                  onChange([...(value || []), newTab]);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-bold cursor-pointer transition-colors"
              >
                + Add New Service Tab
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Tabs Position Layout",
      controls: [
        {
          name: "position",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Tab Bar position layout"
              value={value || "left"}
              onChange={onChange}
              options={[
                { value: "left", label: "Left Sidebar" },
                { value: "right", label: "Right Sidebar" },
                { value: "top", label: "Top Horizontal List" },
                { value: "bottom", label: "Bottom Horizontal List" },
              ]}
            />
          ),
        },
        {
          name: "tabWidth",
          responsive: false,
          render: (value: any, onChange: any, { schema }: any) => {
            const isVert = schema.style?.position === "left" || schema.style?.position === "right";
            if (!isVert) return null;
            return (
              <NumberControl
                label="Sidebar Width (px)"
                value={value ?? 280}
                onChange={onChange}
                min={200}
                max={400}
                step={10}
                showSlider
                grid={2}
              />
            );
          },
        },
      ],
    },

    {
      tab: "Style",
      section: "Color Palette & Backgrounds",
      controls: [
        {
          name: "containerBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Full Outer Container Background" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "tabsBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Tabs List Box Background" value={value ?? "#f8fafc"} onChange={onChange} />
          ),
        },
        {
          name: "activeTabBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Tab Item Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "activeTabColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Tab Accent Color" value={value ?? "#ff4b72"} onChange={onChange} />
          ),
        },
        {
          name: "inactiveTabBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Tab Item Background" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "inactiveTabColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Tab Text Color" value={value ?? "#1e293b"} onChange={onChange} />
          ),
        },
        {
          name: "contentBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Content Card Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Content Title Color" value={value ?? "#1e3a8a"} onChange={onChange} />
          ),
        },
        {
          name: "descColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Content Description Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "featureDotColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Feature Bullet Dot Color" value={value ?? "#ff4b72"} onChange={onChange} />
          ),
        },
        {
          name: "featureTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Feature Item Text Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "btnBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button CTA Background" value={value ?? "#ff4b72"} onChange={onChange} />
          ),
        },
        {
          name: "btnTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Button CTA Text Color" value={value ?? "#ffffff"} onChange={onChange} />
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
              label="Slider Image Height (px)"
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

    {
      tab: "Style",
      section: "Typography Settings",
      controls: [
        {
          name: "tabTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Tab Buttons Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Content Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "descTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Content Description Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <TabsFrontend element={element} />,
};

export default tabsElement;
