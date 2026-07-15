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
  Url,
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

function BeforeAfterSlidersFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const title: string = s.content?.title || "Portrait photo retouching.";
  const description: string = s.content?.description || "Are you looking for a way to make your portraits pop? Professional portrait retouching services can help you achieve the perfect look for your photos.";
  
  const btn1Text: string = s.content?.btn1Text || "Try for free now";
  const btn1Link: any = s.content?.btn1Link || { url: "" };
  const btn2Text: string = s.content?.btn2Text || "";
  const btn2Link: any = s.content?.btn2Link || { url: "" };

  const versions: any[] = s.content?.versions || [];
  const switchTrigger: "click" | "hover" = s.content?.switchTrigger || "click";
  const contentPosition: "left" | "right" | "center" = s.content?.contentPosition || "right";
  const capsulePosition: "left" | "center" | "right" | "inside-card" = s.content?.capsulePosition || "left";

  // Style configurations
  const imageHeight: number = s.style?.imageHeight ?? 450;
  const imageBorderRadius: number = s.style?.imageBorderRadius ?? 8;

  const textAlignment: "left" | "center" | "right" = s.style?.textAlignment || "left";
  const contentCardBg: string = s.style?.contentCardBg || "transparent";
  const contentCardPadding: number = s.style?.contentCardPadding ?? 32;
  const contentCardRadius: number = s.style?.contentCardRadius ?? 16;

  // Toggle Capsule configurations
  const capsuleBg: string = s.style?.capsuleBg || "rgba(255, 255, 255, 0.2)";
  const capsuleBorder: string = s.style?.capsuleBorder || "rgba(255, 255, 255, 0.3)";
  const capsuleActiveBg: string = s.style?.capsuleActiveBg || "rgba(255, 255, 255, 0.4)";
  const capsuleActiveTextColor: string = s.style?.capsuleActiveTextColor || "#ffffff";
  const capsuleInactiveTextColor: string = s.style?.capsuleInactiveTextColor || "rgba(255, 255, 255, 0.8)";

  // Typography/Colors right side
  const commonTitleColor: string = s.style?.commonTitleColor || "#111827";
  const commonTitleTyp = getTypographyStyles(s.style?.commonTitleTypography || {});
  const commonDescColor: string = s.style?.commonDescColor || "#4b5563";
  const commonDescTyp = getTypographyStyles(s.style?.commonDescTypography || {});

  // Buttons configuration
  const btn1BgColor: string = s.style?.btn1BgColor || "#ff3b00";
  const btn1TextColor: string = s.style?.btn1TextColor || "#ffffff";
  const btn1HoverBgColor: string = s.style?.btn1HoverBgColor || "#e03400";
  
  const btn2BgColor: string = s.style?.btn2BgColor || "transparent";
  const btn2TextColor: string = s.style?.btn2TextColor || "#ff3b00";
  const btn2BorderColor: string = s.style?.btn2BorderColor || "#ff3b00";
  const btn2HoverBgColor: string = s.style?.btn2HoverBgColor || "rgba(255, 59, 0, 0.05)";

  const btnTypography = getTypographyStyles(s.style?.btnTypography || {});

  // Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // React active version state
  const [activeVerIdx, setActiveVerIdx] = useState<number>(0);
  const elementId = `ba-sliders-el-${element.id}`;

  const hasBtn1 = !!(btn1Text && btn1Link?.url);
  const hasBtn2 = !!(btn2Text && btn2Link?.url);

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
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
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

        /* Common content styling */
        .${elementId} .btn-style-1 {
          background-color: ${btn1BgColor};
          color: ${btn1TextColor};
          border-radius: 9999px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          transition: background-color 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .${elementId} .btn-style-1:hover {
          background-color: ${btn1HoverBgColor};
        }

        .${elementId} .btn-style-2 {
          background-color: ${btn2BgColor};
          color: ${btn2TextColor};
          border: 1px solid ${btn2BorderColor};
          border-radius: 9999px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          text-decoration: none;
        }
        .${elementId} .btn-style-2:hover {
          background-color: ${btn2HoverBgColor};
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
          {versions.map((version, idx) => (
            <img
              key={version.id || idx}
              src={version.image}
              alt={version.label}
              className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-in-out"
              style={{
                opacity: activeVerIdx === idx ? 1 : 0,
                zIndex: 1,
              }}
            />
          ))}

          {/* ── Foreground Container Content Layer ── */}
          <div className="absolute inset-0 z-10 flex items-center">
            <div className="container mx-auto px-6 md:px-12 h-full flex items-center pointer-events-none">
              {(title || description || hasBtn1 || hasBtn2) && (
                <div
                  className="w-full md:w-[480px] pointer-events-auto transition-all duration-300"
                  style={{
                    marginLeft: contentPosition === "right" ? "auto" : contentPosition === "center" ? "auto" : "0",
                    marginRight: contentPosition === "left" ? "auto" : contentPosition === "center" ? "auto" : "0",
                    textAlign: textAlignment,
                    backgroundColor: contentCardBg,
                    padding: contentCardBg !== "transparent" ? `${contentCardPadding}px` : "0px",
                    borderRadius: contentCardBg !== "transparent" ? `${contentCardRadius}px` : "0px",
                    backdropFilter: contentCardBg !== "transparent" ? "blur(8px)" : "none",
                    WebkitBackdropFilter: contentCardBg !== "transparent" ? "blur(8px)" : "none",
                    border: contentCardBg !== "transparent" ? "1px solid rgba(255, 255, 255, 0.4)" : "none",
                    boxShadow: contentCardBg !== "transparent" ? "0 10px 25px rgba(0,0,0,0.08)" : "none",
                  }}
                >
                  {title && (
                    <h3
                      className="text-2xl md:text-3xl font-bold tracking-tight mb-4"
                      style={{ color: commonTitleColor, ...commonTitleTyp }}
                    >
                      {title}
                    </h3>
                  )}

                  {description && (
                    <p
                      className="text-sm md:text-[15px] leading-relaxed mb-6"
                      style={{ color: commonDescColor, ...commonDescTyp }}
                    >
                      {description}
                    </p>
                  )}

                  {(hasBtn1 || hasBtn2) && (
                    <div
                      className="flex flex-wrap gap-4"
                      style={{
                        justifyContent: textAlignment === "center" ? "center" : textAlignment === "right" ? "flex-end" : "flex-start",
                      }}
                    >
                      {hasBtn1 && (
                        <a
                          href={btn1Link.url}
                          target={btn1Link.target || undefined}
                          rel={btn1Link.nofollow ? "nofollow" : undefined}
                          className="btn-style-1"
                          style={btnTypography}
                        >
                          {btn1Text}
                        </a>
                      )}

                      {hasBtn2 && (
                        <a
                          href={btn2Link.url}
                          target={btn2Link.target || undefined}
                          rel={btn2Link.nofollow ? "nofollow" : undefined}
                          className="btn-style-2"
                          style={btnTypography}
                        >
                          {btn2Text}
                        </a>
                      )}
                    </div>
                  )}

                  {/* Render Switcher Capsule inside Card Section if position matches */}
                  {capsulePosition === "inside-card" && (
                    <div
                      className="mt-6 flex"
                      style={{
                        justifyContent: textAlignment === "center" ? "center" : textAlignment === "right" ? "flex-end" : "flex-start",
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
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Render Switcher Capsule at bottom container if position matches */}
          {capsulePosition !== "inside-card" && (
            <div className="absolute bottom-8 left-0 right-0 z-20 pointer-events-none">
              <div
                className="container mx-auto px-6 md:px-12 flex pointer-events-auto"
                style={{
                  justifyContent: capsulePosition === "center" ? "center" : capsulePosition === "right" ? "flex-end" : "flex-start",
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
          )}
        </div>
      ) : (
        <div className="p-8 border border-dashed text-center text-gray-500 rounded bg-gray-50 text-sm">
          Please add image versions inside Content Settings.
        </div>
      )}
    </div>
  );
}

const beforeAfterSlidersElement = {
  type: "before-after-sliders",
  category: "colorexperts",
  label: "Before After Sliders",
  icon: "solar:gallery-wide-bold-duotone",

  schema: {
    content: {
      title: "Portrait photo retouching.",
      description: "Are you looking for a way to make your portraits pop? Professional portrait retouching services can help you achieve the perfect look for your photos.",
      btn1Text: "Try for free now",
      btn1Link: { url: "/free-trial" },
      btn2Text: "",
      btn2Link: { url: "" },
      switchTrigger: "click",
      contentPosition: "right",
      versions: [
        {
          id: "ver-1",
          label: "Original",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
        },
        {
          id: "ver-2",
          label: "Photo Retouching",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
        },
        {
          id: "ver-3",
          label: "New Backdrop",
          image: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=800&auto=format&fit=crop&q=80",
        },
      ],
    },

    style: {
      imageHeight: 450,
      imageBorderRadius: 8,
      textAlignment: "left",
      contentCardBg: "transparent",
      contentCardPadding: 32,
      contentCardRadius: 16,
      capsuleBg: "rgba(255, 255, 255, 0.2)",
      capsuleBorder: "rgba(255, 255, 255, 0.3)",
      capsuleActiveBg: "rgba(255, 255, 255, 0.4)",
      capsuleActiveTextColor: "#ffffff",
      capsuleInactiveTextColor: "rgba(255, 255, 255, 0.8)",
      commonTitleColor: "#111827",
      commonTitleTypography: {
        fontSize: 28,
        fontWeight: "700",
      },
      commonDescColor: "#4b5563",
      commonDescTypography: {
        fontSize: 15,
      },
      btn1BgColor: "#ff3b00",
      btn1TextColor: "#ffffff",
      btn1HoverBgColor: "#e03400",
      btn2BgColor: "transparent",
      btn2TextColor: "#ff3b00",
      btn2BorderColor: "#ff3b00",
      btn2HoverBgColor: "rgba(255, 59, 0, 0.05)",
      btnTypography: {
        fontSize: 14,
        fontWeight: "600",
      },
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
      section: "Common Section Information",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Title Heading" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "description",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Description details" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "btn1Text",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <Text label="Button 1 Label" value={value || ""} onChange={onChange} />
              <Url label="Button 1 Redirect Link" value={schema.content.btn1Link || { url: "" }} onChange={(v) => updateSchema("content", "btn1Link", v)} />
            </div>
          ),
        },
        {
          name: "btn2Text",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <Text label="Button 2 Label" value={value || ""} onChange={onChange} />
              <Url label="Button 2 Redirect Link" value={schema.content.btn2Link || { url: "" }} onChange={(v) => updateSchema("content", "btn2Link", v)} />
            </div>
          ),
        },
        {
          name: "contentPosition",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Common Section Position"
              value={value ?? "right"}
              onChange={onChange}
              options={[
                { value: "left", label: "Left" },
                { value: "right", label: "Right" },
                { value: "center", label: "Center" },
              ]}
            />
          ),
        },
        {
          name: "capsulePosition",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Switcher Capsule Alignment"
              value={value ?? "left"}
              onChange={onChange}
              options={[
                { value: "left", label: "Bottom Left of Container" },
                { value: "center", label: "Bottom Center of Container" },
                { value: "right", label: "Bottom Right of Container" },
                { value: "inside-card", label: "Inside Text Card Section" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Image Version Sliders",
      controls: [
        {
          name: "switchTrigger",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Switch Image Action"
              value={value ?? "click"}
              onChange={onChange}
              options={[
                { value: "click", label: "Click Button" },
                { value: "hover", label: "Hover / Mouse Enter Button" },
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
      section: "Layout & Spacing",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Image Height (px)" value={value ?? 450} onChange={onChange} min={200} max={800} />
          ),
        },
        {
          name: "imageBorderRadius",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Image Border Radius (px)" value={value ?? 8} onChange={onChange} min={0} max={100} />
          ),
        },
        {
          name: "contentCardBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Text Card Background" value={value ?? "rgba(255, 255, 255, 0.9)"} onChange={onChange} />
          ),
        },
        {
          name: "contentCardPadding",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Text Card Padding (px)" value={value ?? 32} onChange={onChange} min={10} max={100} />
          ),
        },
        {
          name: "contentCardRadius",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Text Card Border Radius (px)" value={value ?? 16} onChange={onChange} min={0} max={50} />
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
      section: "Capsule Settings",
      controls: [
        {
          name: "capsuleBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Capsule Background" value={value ?? "rgba(255, 255, 255, 0.2)"} onChange={onChange} />
              <ColorPickerPopup label="Capsule Border Color" value={schema.style.capsuleBorder ?? "rgba(255, 255, 255, 0.3)"} onChange={(v) => updateSchema("style", "capsuleBorder", v)} />
              <ColorPickerPopup label="Active Button Background" value={schema.style.capsuleActiveBg ?? "rgba(255, 255, 255, 0.4)"} onChange={(v) => updateSchema("style", "capsuleActiveBg", v)} />
            </div>
          ),
        },
        {
          name: "capsuleActiveTextColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Active Text Color" value={value ?? "#ffffff"} onChange={onChange} />
              <ColorPickerPopup label="Inactive Text Color" value={schema.style.capsuleInactiveTextColor ?? "rgba(255, 255, 255, 0.8)"} onChange={(v) => updateSchema("style", "capsuleInactiveTextColor", v)} />
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
          name: "commonTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Title Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "commonTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "commonDescColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "commonDescTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Action Buttons Styling",
      controls: [
        {
          name: "btn1BgColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Button 1 Background Color" value={value ?? "#ff3b00"} onChange={onChange} />
              <ColorPickerPopup label="Button 1 Text Color" value={schema.style.btn1TextColor ?? "#ffffff"} onChange={(v) => updateSchema("style", "btn1TextColor", v)} />
              <ColorPickerPopup label="Button 1 Hover Background" value={schema.style.btn1HoverBgColor ?? "#e03400"} onChange={(v) => updateSchema("style", "btn1HoverBgColor", v)} />
            </div>
          ),
        },
        {
          name: "btn2TextColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Button 2 Text & Border Color" value={value ?? "#ff3b00"} onChange={onChange} />
              <ColorPickerPopup label="Button 2 Border Color" value={schema.style.btn2BorderColor ?? "#ff3b00"} onChange={(v) => updateSchema("style", "btn2BorderColor", v)} />
              <ColorPickerPopup label="Button 2 Background Color" value={schema.style.btn2BgColor ?? "transparent"} onChange={(v) => updateSchema("style", "btn2BgColor", v)} />
              <ColorPickerPopup label="Button 2 Hover Background" value={schema.style.btn2HoverBgColor ?? "rgba(255, 59, 0, 0.05)"} onChange={(v) => updateSchema("style", "btn2HoverBgColor", v)} />
            </div>
          ),
        },
        {
          name: "btnTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Buttons Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <BeforeAfterSlidersFrontend element={element} />,
};

export default beforeAfterSlidersElement;
