"use client";

import React, { useState } from "react";
import {
  Textarea,
  ButtonGroup,
  Toggle,
  NumberControl,
  Dimensions,
  ImageGallery,
  Url,
  ColorPickerPopup,
  Tabs,
  Typography,
  Select,
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

function getHoverOverlayBackground(s: any) {
  const type = s.style?.hoverOverlayType || "gradient";
  if (type === "classic") {
    return s.style?.hoverOverlayColor || "rgba(0,0,0,0.5)";
  }
  const g = s.style?.hoverGradient || {
    type: "linear",
    angle: 135,
    color1: "rgba(16,185,129,0.85)",
    color2: "rgba(59,130,246,0.85)",
    location1: 0,
    location2: 100,
  };
  if (g.type === "radial") {
    return `radial-gradient(circle, ${g.color1} ${g.location1 ?? 0}%, ${g.color2} ${g.location2 ?? 100}%)`;
  }
  return `linear-gradient(${g.angle ?? 135}deg, ${g.color1} ${g.location1 ?? 0}%, ${g.color2} ${g.location2 ?? 100}%)`;
}

function HoverBoxFrontend({ element }: { element: any }) {
  const s = element.schema;
  const [hovered, setHovered] = useState(false);

  // Content configurations
  const image: string = s.content?.image || "";
  const title: string = s.content?.title || "UPLOAD\nYOUR FILES";
  const link: any = s.content?.link || {};

  // Style configurations
  const alignment: string = s.style?.alignment || "center"; // center | left | right
  const valignment: string = s.style?.valignment || "center"; // center | flex-start | flex-end
  const height: number = s.style?.height ?? 350;
  const heightUnit: string = s.style?.heightUnit || "px";
  const transitionDuration: number = s.style?.transitionDuration ?? 500;

  // Zoom configurations
  const normalScale: number = s.style?.normalScale ?? 1.0;
  const hoverScale: number = s.style?.hoverScale ?? 1.1;

  // Inset Border configurations
  const showInsetBorder: boolean = s.style?.showInsetBorder ?? true;
  const insetOffset: number = s.style?.insetOffset ?? 20;
  const insetBorderWidth: number = s.style?.insetBorderWidth ?? 1;
  const insetBorderColor: string = s.style?.insetBorderColor || "rgba(255,255,255,0.8)";
  const insetHoverBorderColor: string = s.style?.insetHoverBorderColor || "rgba(255,255,255,1)";
  const insetScale: number = s.style?.insetScale ?? 1.0;
  const insetHoverScale: number = s.style?.insetHoverScale ?? 1.02;

  // Overlay configurations
  const normalOverlayColor: string = s.style?.normalOverlayColor || "rgba(0,0,0,0.3)";
  const hoverOverlayColor: string = getHoverOverlayBackground(s);

  // Typography
  const titleNormalColor: string = s.style?.titleNormalColor || "#f59e0b";
  const titleHoverColor: string = s.style?.titleHoverColor || "#ffffff";
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});

  // Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // Element ID for unique CSS selectors
  const elementId = `hoverbox-el-${element.id}`;

  const hasLink = !!(link && link.url);

  // Aligner layout calculation
  let hAlign = "items-center";
  if (alignment === "left") hAlign = "items-start";
  else if (alignment === "right") hAlign = "items-end";

  let vAlign = "justify-center";
  if (valignment === "flex-start") vAlign = "justify-start";
  else if (valignment === "flex-end") vAlign = "justify-end";

  const renderContent = (
    <div
      className="content-wrapper w-full h-full relative overflow-hidden group cursor-pointer"
      style={{
        height: height > 0 ? `${height}${heightUnit}` : "auto",
        transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
      }}
    >
      {/* ── Background Image Layer ── */}
      <div
        className="bg-image-layer absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: image ? `url(${image})` : "none",
          backgroundColor: "#1f2937",
          transform: hovered ? `scale(${hoverScale})` : `scale(${normalScale})`,
          transition: `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
        }}
      />

      {/* ── Translucent / Gradient Overlay Layer ── */}
      <div
        className="overlay-layer absolute inset-0 transition-all"
        style={{
          background: hovered ? hoverOverlayColor : normalOverlayColor,
          transition: `background ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1), opacity ${transitionDuration}ms ease`,
        }}
      />

      {/* ── Inset Border Layer ── */}
      {showInsetBorder && (
        <div
          className="inset-border-layer absolute pointer-events-none transition-all duration-500"
          style={{
            top: `${insetOffset}px`,
            right: `${insetOffset}px`,
            bottom: `${insetOffset}px`,
            left: `${insetOffset}px`,
            border: `${insetBorderWidth}px solid ${hovered ? insetHoverBorderColor : insetBorderColor}`,
            transform: hovered ? `scale(${insetHoverScale})` : `scale(${insetScale})`,
            transition: `all ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        />
      )}

      {/* ── Inner Content Block (flexbox aligning) ── */}
      <div
        className={`content-inner absolute inset-0 flex flex-col ${vAlign} ${hAlign}`}
        style={{
          padding: `${insetOffset + 15}px`,
        }}
      >
        <div
          className="text-block flex flex-col justify-center items-center transition-all"
          style={{
            transform: hovered ? "translateY(-4px)" : "translateY(0)",
            transition: `transform ${transitionDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`,
          }}
        >
          <span
            className="title-text text-center font-bold tracking-wider uppercase block transition-colors duration-300"
            style={{
              color: hovered ? titleHoverColor : titleNormalColor,
              whiteSpace: "pre-line",
              fontSize: "24px",
              ...titleTyp,
            }}
          >
            {title}
          </span>
        </div>
      </div>
    </div>
  );

  return (
    <div
      className={`w-full ${elementId}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {hasLink ? (
        <a
          href={link.url}
          target={link.target || undefined}
          rel={link.nofollow ? "nofollow" : undefined}
          className="w-full block h-full no-underline"
        >
          {renderContent}
        </a>
      ) : (
        renderContent
      )}
    </div>
  );
}

const hoverBoxElement = {
  type: "hover-box-element",
  category: "colorexperts",
  label: "Hover Box",
  icon: "solar:widget-2-bold-duotone",

  schema: {
    content: {
      image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=800&auto=format&fit=crop&q=80",
      title: "UPLOAD\nYOUR FILES",
      link: { url: "" },
    },

    style: {
      alignment: "center",
      valignment: "center",
      height: 350,
      heightUnit: "px",
      transitionDuration: 500,
      normalScale: 1.0,
      hoverScale: 1.1,
      showInsetBorder: true,
      insetOffset: 20,
      insetBorderWidth: 1,
      insetBorderColor: "rgba(255,255,255,0.7)",
      insetHoverBorderColor: "rgba(255,255,255,1)",
      insetScale: 1.0,
      insetHoverScale: 1.02,
      normalOverlayColor: "rgba(0,0,0,0.45)",
      hoverOverlayType: "gradient",
      hoverOverlayColor: "rgba(30,144,255,0.8)",
      hoverGradient: {
        type: "linear",
        angle: 135,
        color1: "rgba(16,185,129,0.85)",
        color2: "rgba(59,130,246,0.85)",
        location1: 0,
        location2: 100,
      },
      titleNormalColor: "#f59e0b",
      titleHoverColor: "#ffffff",
      titleTypography: {
        fontSize: 26,
        fontSizeUnit: "px",
        fontWeight: "700",
        letterSpacing: 2,
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
      section: "Box Content",
      controls: [
        {
          name: "image",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Background Image" value={value} onChange={onChange} />
          ),
        },
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Box Text (supports linebreaks)" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Redirect Link" value={value || { url: "" }} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Layout Dimensions",
      controls: [
        {
          name: "height",
          responsive: true,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-gray-300">Box Height</span>
                <select
                  value={schema.style.heightUnit || "px"}
                  onChange={(e) => updateSchema("style", "heightUnit", e.target.value)}
                  className="bg-gray-800 text-white text-[11px] border border-gray-700 rounded px-1.5 py-0.5"
                >
                  <option value="px">px</option>
                  <option value="vh">vh</option>
                </select>
              </div>
              <NumberControl value={value ?? 350} onChange={onChange} min={100} max={1000} />
            </div>
          ),
        },
        {
          name: "alignment",
          responsive: true,
          render: (value: any, onChange: any) => (
            <ButtonGroup
              label="Horizontal Align"
              value={value ?? "center"}
              onChange={onChange}
              options={[
                { value: "left", icon: "mdi:format-align-left" },
                { value: "center", icon: "mdi:format-align-center" },
                { value: "right", icon: "mdi:format-align-right" },
              ]}
            />
          ),
        },
        {
          name: "valignment",
          responsive: true,
          render: (value: any, onChange: any) => (
            <ButtonGroup
              label="Vertical Align"
              value={value ?? "center"}
              onChange={onChange}
              options={[
                { value: "flex-start", icon: "mdi:align-vertical-top" },
                { value: "center", icon: "mdi:align-vertical-center" },
                { value: "flex-end", icon: "mdi:align-vertical-bottom" },
              ]}
            />
          ),
        },
        {
          name: "transitionDuration",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Transition Duration (ms)" value={value ?? 500} onChange={onChange} min={100} max={2000} step={50} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Overlay & Zoom",
      controls: [
        {
          name: "normalScale",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Normal Image Scale</span>
                <input
                  type="range"
                  min="0.8"
                  max="1.5"
                  step="0.05"
                  value={value ?? 1.0}
                  onChange={(e) => onChange(parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-indigo-500"
                />
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-gray-400">Hover Image Scale</span>
                <input
                  type="range"
                  min="1.0"
                  max="2.0"
                  step="0.05"
                  value={schema.style.hoverScale ?? 1.1}
                  onChange={(e) => updateSchema("style", "hoverScale", parseFloat(e.target.value))}
                  className="w-full cursor-pointer accent-indigo-500"
                />
              </div>
            </div>
          ),
        },
        {
          name: "normalOverlayColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => {
            const hg = schema.style.hoverGradient || {
              type: "linear",
              angle: 135,
              color1: "rgba(16,185,129,0.85)",
              color2: "rgba(59,130,246,0.85)",
              location1: 0,
              location2: 100,
            };

            const updateGradient = (field: string, v: any) => {
              updateSchema("style", "hoverGradient", {
                ...hg,
                [field]: v,
              });
            };

            return (
              <Tabs
                tabs={[
                  {
                    label: "Normal Overlay",
                    content: (
                      <div className="pt-2">
                        <ColorPickerPopup label="Overlay Color" value={value ?? "rgba(0,0,0,0.4)"} onChange={onChange} />
                      </div>
                    ),
                  },
                  {
                    label: "Hover Overlay",
                    content: (
                      <div className="pt-2 space-y-4">
                        <Select
                          label="Overlay Type"
                          value={schema.style.hoverOverlayType || "gradient"}
                          onChange={(v: string) => updateSchema("style", "hoverOverlayType", v)}
                          options={[
                            { value: "classic", label: "Classic Color" },
                            { value: "gradient", label: "Gradient Overlay" },
                          ]}
                        />

                        {schema.style.hoverOverlayType === "classic" ? (
                          <ColorPickerPopup
                            label="Hover Overlay Color"
                            value={schema.style.hoverOverlayColor || "rgba(0,0,0,0.5)"}
                            onChange={(v: string) => updateSchema("style", "hoverOverlayColor", v)}
                          />
                        ) : (
                          <div className="space-y-4">
                            <ButtonGroup
                              label="Gradient Shape"
                              value={hg.type ?? "linear"}
                              onChange={(v: string) => updateGradient("type", v)}
                              options={[
                                { value: "linear", icon: "mdi:gradient-horizontal", label: "Linear" },
                                { value: "radial", icon: "mdi:circle-outline", label: "Radial" },
                              ]}
                            />

                            {hg.type !== "radial" && (
                              <NumberControl
                                label="Gradient Angle (deg)"
                                value={hg.angle ?? 135}
                                onChange={(v: number) => updateGradient("angle", v)}
                                min={0}
                                max={360}
                              />
                            )}

                            <div className="border-t border-gray-700 pt-3 space-y-4">
                              <ColorPickerPopup
                                label="Gradient Color 1"
                                value={hg.color1 ?? "rgba(16,185,129,0.85)"}
                                onChange={(v: string) => updateGradient("color1", v)}
                              />
                              <NumberControl
                                label="Color 1 Location (%)"
                                value={hg.location1 ?? 0}
                                onChange={(v: number) => updateGradient("location1", v)}
                                min={0}
                                max={100}
                              />
                            </div>

                            <div className="border-t border-gray-700 pt-3 space-y-4">
                              <ColorPickerPopup
                                label="Gradient Color 2"
                                value={hg.color2 ?? "rgba(59,130,246,0.85)"}
                                onChange={(v: string) => updateGradient("color2", v)}
                              />
                              <NumberControl
                                label="Color 2 Location (%)"
                                value={hg.location2 ?? 100}
                                onChange={(v: number) => updateGradient("location2", v)}
                                min={0}
                                max={100}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            );
          },
        },
      ],
    },

    {
      tab: "Style",
      section: "Inset Border Settings",
      controls: [
        {
          name: "showInsetBorder",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Toggle label="Enable Inset Border" value={value !== false} onChange={onChange} />
          ),
        },
        {
          name: "insetOffset",
          responsive: true,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            schema.style.showInsetBorder !== false ? (
              <div className="space-y-4 pt-1">
                <NumberControl label="Border Offset Spacing (px)" value={value ?? 20} onChange={onChange} min={5} max={100} />
                <NumberControl label="Border Thickness (px)" value={schema.style.insetBorderWidth ?? 1} onChange={(v) => updateSchema("style", "insetBorderWidth", v)} min={1} max={10} />
                <ColorPickerPopup label="Border Color" value={schema.style.insetBorderColor ?? "rgba(255,255,255,0.7)"} onChange={(v) => updateSchema("style", "insetBorderColor", v)} />
                <ColorPickerPopup label="Hover Border Color" value={schema.style.insetHoverBorderColor ?? "rgba(255,255,255,1)"} onChange={(v) => updateSchema("style", "insetHoverBorderColor", v)} />
              </div>
            ) : null
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Text Configurations",
      controls: [
        {
          name: "titleNormalColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <Tabs
              tabs={[
                {
                  label: "Normal Color",
                  content: <ColorPickerPopup label="Text Normal" value={value ?? "#f59e0b"} onChange={onChange} />,
                },
                {
                  label: "Hover Color",
                  content: (
                    <ColorPickerPopup
                      label="Text Hover"
                      value={schema.style.titleHoverColor || ""}
                      onChange={(v: string) => updateSchema("style", "titleHoverColor", v)}
                    />
                  ),
                },
              ]}
            />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Text Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <HoverBoxFrontend element={element} />,
};

export default hoverBoxElement;
