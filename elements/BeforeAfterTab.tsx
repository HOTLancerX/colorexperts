"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  Select,
  NumberControl,
  Dimensions,
  ColorPickerPopup,
  ImageGallery,
  Typography,
  Section,
  ButtonGroup,
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

function resolveResponsiveValue(val: any, fallback: number): number {
  if (val === undefined || val === null) return fallback;
  if (typeof val === "number") return val;
  if (typeof val === "string") {
    const num = parseInt(val, 10);
    return isNaN(num) ? fallback : num;
  }
  if (typeof val === "object") {
    const res = val.desktop ?? val.tablet ?? val.mobile ?? val.value;
    if (res !== undefined && res !== null) {
      if (typeof res === "number") return res;
      const num = parseInt(res, 10);
      return isNaN(num) ? fallback : num;
    }
  }
  return fallback;
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

function BeforeAfterTabFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const title: string = s.content?.title || "Skin retouching a flawless finish.";
  const versions: any[] = s.content?.versions || [];
  const switchTrigger: "click" | "hover" = s.content?.switchTrigger || "click";
  
  const contentPosition: "left" | "right" | "center" = s.content?.contentPosition || "left";
  const textAlignment: "left" | "center" | "right" = s.style?.textAlignment || "left";

  // Style configurations
  const imageHeight: number = s.style?.imageHeight ?? 500;
  const imageBorderRadius: number = s.style?.imageBorderRadius ?? 12;

  const imageLeftOffsetDesktop = resolveResponsiveValue(s.style?.imageLeftOffset?.desktop ?? s.style?.imageLeftOffset, 20);
  const imageLeftOffsetTablet = resolveResponsiveValue(s.style?.imageLeftOffset?.tablet ?? s.style?.imageLeftOffset, 15);
  const imageLeftOffsetMobile = resolveResponsiveValue(s.style?.imageLeftOffset?.mobile ?? s.style?.imageLeftOffset, 0);

  const marginLeftDesktop = resolveResponsiveValue(s.style?.marginLeft?.desktop ?? s.style?.marginLeft, 0);
  const marginLeftTablet = resolveResponsiveValue(s.style?.marginLeft?.tablet ?? s.style?.marginLeft, 0);
  const marginLeftMobile = resolveResponsiveValue(s.style?.marginLeft?.mobile ?? s.style?.marginLeft, 0);

  const titleColor: string = s.style?.titleColor || "#ffffff";
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});

  // Toggle Capsule configurations
  const capsuleBg: string = s.style?.capsuleBg || "rgba(255, 255, 255, 0.15)";
  const capsuleBorder: string = s.style?.capsuleBorder || "rgba(255, 255, 255, 0.25)";
  const capsuleActiveBg: string = s.style?.capsuleActiveBg || "rgba(255, 255, 255, 0.4)";
  const capsuleActiveTextColor: string = s.style?.capsuleActiveTextColor || "#ffffff";
  const capsuleInactiveTextColor: string = s.style?.capsuleInactiveTextColor || "rgba(255, 255, 255, 0.8)";

  // Advanced configurations
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // React state for active image
  const [activeVerIdx, setActiveVerIdx] = useState<number>(0);
  const elementId = `ba-tab-el-${element.id}`;

  return (
    <div
      className={`w-full ${elementId}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style>{`
        .${elementId} .toggle-capsule {
          background-color: ${capsuleBg};
          border: 1px solid ${capsuleBorder};
          backdrop-filter: blur(12px);
          -webkit-backdrop-filter: blur(12px);
          border-radius: 9999px;
          padding: 4px;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          z-index: 20;
          box-shadow: 0 4px 10px rgba(0,0,0,0.15);
        }
        .${elementId} .ba-button {
          padding: 6px 16px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          white-space: nowrap;
        }
        .${elementId} .ba-button.active {
          background-color: ${capsuleActiveBg};
          color: ${capsuleActiveTextColor};
          box-shadow: 0 2px 6px rgba(0,0,0,0.15);
        }
        .${elementId} .ba-button.inactive {
          background-color: transparent;
          color: ${capsuleInactiveTextColor};
        }

        /* Responsive Margins */
        .${elementId} .responsive-margin-container {
          margin-left: ${marginLeftDesktop}px;
        }
        @media (max-width: 1024px) {
          .${elementId} .responsive-margin-container {
            margin-left: ${marginLeftTablet}px;
          }
        }
        @media (max-width: 768px) {
          .${elementId} .responsive-margin-container {
            margin-left: ${marginLeftMobile}px;
          }
        }

        /* Image Left Offset Spacing */
        .${elementId} .bg-images-layer {
          position: absolute;
          top: 0;
          bottom: 0;
          right: 0;
          left: ${imageLeftOffsetDesktop}%;
        }
        @media (max-width: 1024px) {
          .${elementId} .bg-images-layer {
            left: ${imageLeftOffsetTablet}%;
          }
        }
        @media (max-width: 768px) {
          .${elementId} .bg-images-layer {
            left: ${imageLeftOffsetMobile}%;
          }
        }
      `}</style>

      {versions.length > 0 ? (
        <div
          className="relative w-full overflow-hidden"
          style={{
            height: `${imageHeight}px`,
            borderRadius: `${imageBorderRadius}px`,
          }}
        >
          {/* ── Background Images Layer ── */}
          <div className="bg-images-layer overflow-hidden h-full">
            {versions.map((version, idx) => (
              <img
                key={version.id || idx}
                src={version.image}
                alt={version.label}
                className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-in-out"
                style={{
                  opacity: activeVerIdx === idx ? 1 : 0,
                  zIndex: 1,
                  borderRadius: `${imageBorderRadius}px`,
                }}
              />
            ))}
          </div>

          {/* ── Foreground Content Layout Container (Floating overlay without background) ── */}
          <div className="absolute inset-0 z-10">
            <div className="container mx-auto px-6 md:px-12 h-full py-10 pointer-events-none">
              <div className="responsive-margin-container w-full h-full flex flex-col justify-between">
                
                {/* Header Title Section */}
                {title && (
                  <div
                    className="mt-8 w-full md:w-[600px] pointer-events-auto"
                    style={{
                      marginLeft: contentPosition === "right" ? "auto" : contentPosition === "center" ? "auto" : "0",
                      marginRight: contentPosition === "left" ? "auto" : contentPosition === "center" ? "auto" : "0",
                      textAlign: textAlignment,
                    }}
                  >
                    <h2
                      className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1] select-none"
                      style={{ color: titleColor, ...titleTyp }}
                    >
                      {title.split("\n").map((line, idx) => (
                        <div key={idx}>{line}</div>
                      ))}
                    </h2>
                  </div>
                )}

                {/* Bottom Capsule Switcher Selector */}
                <div
                  className="mt-auto w-full flex pointer-events-auto"
                  style={{
                    justifyContent: contentPosition === "center" ? "center" : contentPosition === "right" ? "flex-end" : "flex-start",
                  }}
                >
                  <div className="toggle-capsule">
                    {versions.map((version, idx) => (
                      <button
                        key={version.id || idx}
                        type="button"
                        onClick={() => setActiveVerIdx(idx)}
                        onMouseEnter={switchTrigger === "hover" ? () => setActiveVerIdx(idx) : undefined}
                        className={`ba-button ${activeVerIdx === idx ? "active" : "inactive"}`}
                      >
                        {version.label || `Version #${idx + 1}`}
                      </button>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="p-8 border border-dashed text-center text-gray-500 rounded bg-gray-50 text-sm">
          Please add image versions inside Content Settings.
        </div>
      )}
    </div>
  );
}

const beforeAfterTabElement = {
  type: "before-after-tab",
  category: "colorexperts",
  label: "Before After Tab",
  icon: "solar:mask-haze-bold-duotone",

  schema: {
    content: {
      title: "Skin retouching a flawless finish.",
      switchTrigger: "click",
      contentPosition: "left",
      versions: [
        {
          id: "ver-1",
          label: "Original",
          image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&auto=format&fit=crop&q=80",
        },
        {
          id: "ver-2",
          label: "Nature retouch",
          image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=1200&auto=format&fit=crop&q=80",
        },
        {
          id: "ver-3",
          label: "Beauty retouch",
          image: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=1200&auto=format&fit=crop&q=80",
        },
        {
          id: "ver-4",
          label: "Background",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=1200&auto=format&fit=crop&q=80",
        },
      ],
    },

    style: {
      imageHeight: 500,
      imageBorderRadius: 12,
      textAlignment: "left",
      marginLeft: { desktop: 0, tablet: 0, mobile: 0 },
      titleColor: "#ffffff",
      titleTypography: {
        fontSize: 48,
        fontWeight: "800",
      },
      capsuleBg: "rgba(255, 255, 255, 0.15)",
      capsuleBorder: "rgba(255, 255, 255, 0.25)",
      capsuleActiveBg: "rgba(255, 255, 255, 0.4)",
      capsuleActiveTextColor: "#ffffff",
      capsuleInactiveTextColor: "rgba(255, 255, 255, 0.8)",
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
      section: "Banner Copy",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Heading Title Text" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "contentPosition",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Horizontal Alignment Layout"
              value={value ?? "left"}
              onChange={onChange}
              options={[
                { value: "left", label: "Left aligned" },
                { value: "center", label: "Center aligned" },
                { value: "right", label: "Right aligned" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Image Versions",
      controls: [
        {
          name: "switchTrigger",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Switch Trigger Action"
              value={value ?? "click"}
              onChange={onChange}
              options={[
                { value: "click", label: "Click capsule tab" },
                { value: "hover", label: "Hover capsule tab" },
              ]}
            />
          ),
        },
        {
          name: "versions",
          responsive: false,
          render: (value: any, onChange: any) => {
            const list = value || [];
            return (
              <div className="space-y-4 pt-1">
                <span className="text-xs font-semibold text-gray-400">Sliders Version List</span>
                {list.map((ver: any, idx: number) => (
                  <Section key={ver.id || idx} label={ver.label || `Version #${idx + 1}`}>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newV = {
                              ...ver,
                              id: `ver-${Date.now()}`,
                              label: `${ver.label || "Copy"} (Copy)`,
                            };
                            const next = [...list];
                            next.splice(idx + 1, 0, newV);
                            onChange(next);
                          }}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-white cursor-pointer"
                        >
                          <Icon icon="solar:copy-linear" width="14" />
                        </button>
                        <button
                          type="button"
                          onClick={() => onChange(list.filter((_: any, i: number) => i !== idx))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-red-400 cursor-pointer"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width="14" />
                        </button>
                      </div>

                      <Text
                        label="Version Label Text"
                        value={ver.label || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], label: v };
                          onChange(next);
                        }}
                      />

                      <ImageGallery
                        label="Version Display Image"
                        value={ver.image || ""}
                        onChange={(img) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], image: img };
                          onChange(next);
                        }}
                      />
                    </div>
                  </Section>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...list,
                      {
                        id: `ver-${Date.now()}`,
                        label: "New Version",
                        image: "",
                      },
                    ];
                    onChange(next);
                  }}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs font-semibold cursor-pointer text-center"
                >
                  + Add Image Version
                </button>
              </div>
            );
          },
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Banner Layout Settings",
      controls: [

        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Banner Height (px)" value={value ?? 500} onChange={onChange} min={200} max={900} />
          ),
        },
        {
          name: "imageBorderRadius",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Banner Border Radius (px)" value={value ?? 12} onChange={onChange} min={0} max={100} />
          ),
        },
        {
          name: "imageLeftOffset",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Image Left Offset (%)" value={value ?? 20} onChange={onChange} min={0} max={80} />
          ),
        },
        {
          name: "marginLeft",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Left Indentation Margin (px)" value={value ?? 0} onChange={onChange} min={0} max={300} />
          ),
        },
        {
          name: "textAlignment",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ButtonGroup
              label="Text Alignment"
              value={value ?? "left"}
              onChange={onChange}
              options={[
                { value: "left", icon: "mdi:format-align-left", label: "Left" },
                { value: "center", icon: "mdi:format-align-center", label: "Center" },
                { value: "right", icon: "mdi:format-align-right", label: "Right" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Capsule Styles",
      controls: [
        {
          name: "capsuleBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Capsule Background" value={value ?? "rgba(255, 255, 255, 0.15)"} onChange={onChange} />
              <ColorPickerPopup label="Capsule Border Color" value={schema.style.capsuleBorder ?? "rgba(255, 255, 255, 0.25)"} onChange={(v) => updateSchema("style", "capsuleBorder", v)} />
              <ColorPickerPopup label="Active Tab Background" value={schema.style.capsuleActiveBg ?? "rgba(255, 255, 255, 0.4)"} onChange={(v) => updateSchema("style", "capsuleActiveBg", v)} />
            </div>
          ),
        },
        {
          name: "capsuleActiveTextColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Active Tab Text Color" value={value ?? "#ffffff"} onChange={onChange} />
              <ColorPickerPopup label="Inactive Tab Text Color" value={schema.style.capsuleInactiveTextColor ?? "rgba(255, 255, 255, 0.8)"} onChange={(v) => updateSchema("style", "capsuleInactiveTextColor", v)} />
            </div>
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography & Colors",
      controls: [
        {
          name: "titleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Title Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <BeforeAfterTabFrontend element={element} />,
};

export default beforeAfterTabElement;
