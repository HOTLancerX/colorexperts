"use client";

import React, { useEffect, useState } from "react";
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

interface TabItem {
  id: string;
  label: string;
  image: string;
}

/* ── Frontend Component ── */
function OneTabsFrontend({ element }: { element: any }) {
  const s = element.schema;
  const tabs: TabItem[] = s.content?.tabsList || [];
  const [activeTabId, setActiveTabId] = useState("");
  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null);

  // Default active tab setup
  useEffect(() => {
    if (tabs.length > 0 && (!activeTabId || !tabs.find((t) => t.id === activeTabId))) {
      setActiveTabId(tabs[0].id);
    }
  }, [tabs, activeTabId]);

  const activeTab = tabs.find((t) => t.id === activeTabId) || tabs[0];

  // Screen Width monitoring
  const [windowWidth, setWindowWidth] = useState(1200);

  useEffect(() => {
    setWindowWidth(window.innerWidth);
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Heights
  const heightObj = resolveResponsiveValue(s.style?.imageHeight, 400);
  let activeImageHeight = heightObj.desktop;
  if (windowWidth <= MOBILE_MAX) {
    activeImageHeight = heightObj.mobile;
  } else if (windowWidth <= TABLET_MAX) {
    activeImageHeight = heightObj.tablet;
  }

  // Spacing styles
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Colors
  const containerBg = s.style?.containerBg || "transparent";
  const topBg = s.style?.topBg || "#ffffff";
  const bottomBg = s.style?.bottomBg || "#f8fafc";
  const activeTabBg = s.style?.activeTabBg || "#3b82f6";
  const activeTabColor = s.style?.activeTabColor || "#ffffff";
  const inactiveTabBg = s.style?.inactiveTabBg || "transparent";
  const inactiveTabColor = s.style?.inactiveTabColor || "#4f46e5";
  const contentBg = s.style?.contentBg || "#ffffff";

  // Typography
  const tabTyp = getTypographyStyles(s.style?.tabTypography || {});

  if (!activeTab) {
    return (
      <div className="p-8 text-center text-gray-400 font-semibold">
        Please configure tab items in the builder content panel.
      </div>
    );
  }

  const placeholderImage =
    "https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?auto=format&fit=crop&w=600&q=80";
  const imgUrl = activeTab.image || placeholderImage;

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
        className="w-full rounded-2xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-black/5 flex flex-col box-border"
        style={{
          backgroundColor: contentBg,
          ...paddingStyle,
        }}
      >
        {/* Top Image Panel */}
        <div
          className="w-full overflow-hidden flex items-center justify-center transition-colors duration-300"
          style={{
            height: `${activeImageHeight}px`,
            backgroundColor: topBg,
          }}
        >
          <img
            src={imgUrl}
            alt={activeTab.label}
            className="block pointer-events-none animate-fadeIn"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "contain",
              objectPosition: "center",
            }}
          />
        </div>

        {/* Separator Line */}
        <div className="h-px w-full bg-black/5" />

        {/* Centered Tab Menu (Pill shapes) */}
        <div
          className="flex justify-center items-center gap-4 py-6 px-4 w-full box-border transition-colors duration-300"
          style={{ backgroundColor: bottomBg }}
        >
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isHovered = tab.id === hoveredTabId;

            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTabId(tab.id)}
                onMouseEnter={() => setHoveredTabId(tab.id)}
                onMouseLeave={() => setHoveredTabId(null)}
                className="py-2.5 px-6 rounded-full font-bold border-none transition-all duration-200 cursor-pointer outline-none select-none"
                style={{
                  backgroundColor: isActive || isHovered ? activeTabBg : inactiveTabBg,
                  color: isActive || isHovered ? activeTabColor : inactiveTabColor,
                  boxShadow: isActive ? "0 4px 15px rgba(59, 130, 246, 0.15)" : "none",
                  ...tabTyp,
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const oneTabsElement = {
  type: "one-tabs",
  category: "colorexperts",
  label: "OneTabs",
  icon: "material-symbols-light:tab-outline-rounded",

  schema: {
    content: {
      tabsList: [
        {
          id: "tab1",
          label: "ORIGINAL",
          image: "",
        },
        {
          id: "tab2",
          label: "PATH EDIT",
          image: "",
        },
        {
          id: "tab3",
          label: "AI EDIT",
          image: "",
        },
      ],
    },

    style: {
      containerBg: "transparent",
      topBg: "#ffffff",
      bottomBg: "#f8fafc",
      activeTabBg: "#3b82f6",
      activeTabColor: "#ffffff",
      inactiveTabBg: "transparent",
      inactiveTabColor: "#4f46e5",
      contentBg: "#ffffff",
      imageHeight: 400,
      tabTypography: { fontSize: 13, fontSizeUnit: "px", fontWeight: "700" },
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
                      label="Tab Label Name"
                      value={item.label || ""}
                      onChange={(v: string) => {
                        const u = [...value];
                        u[idx] = { ...u[idx], label: v };
                        onChange(u);
                      }}
                    />

                    <ImageGallery
                      label="Tab Display Image"
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
                  const newTab = {
                    id: `ot_${Date.now()}`,
                    label: "NEW TAB",
                    image: "",
                  };
                  onChange([...(value || []), newTab]);
                }}
                className="w-full flex items-center justify-center gap-1.5 py-3 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-bold cursor-pointer transition-colors"
              >
                + Add New Tab
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
          name: "contentBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Outer Card Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "topBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Top Image Section Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "bottomBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Bottom Section Background" value={value ?? "#f8fafc"} onChange={onChange} />
          ),
        },
        {
          name: "activeTabBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active / Hover Background Color" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "activeTabColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active / Hover Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "inactiveTabBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Background Color" value={value ?? "transparent"} onChange={onChange} />
          ),
        },
        {
          name: "inactiveTabColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Inactive Text Color" value={value ?? "#4f46e5"} onChange={onChange} />
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
              label="Display Image Height (px)"
              value={value ?? 400}
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
      section: "Typography",
      controls: [
        {
          name: "tabTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Tab Buttons Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <OneTabsFrontend element={element} />,
};

export default oneTabsElement;
