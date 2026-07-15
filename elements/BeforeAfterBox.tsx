"use client";

import React, { useState, useRef, useEffect } from "react";
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

function BeforeAfterBoxFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const beforeImage: string = s.content?.beforeImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";
  const afterImage: string = s.content?.afterImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80";
  const layoutType: "split-slider" | "side-by-side" = s.content?.layoutType || "split-slider";
  const imagePosition: "left" | "right" = s.content?.imagePosition || "left";

  const title: string = s.content?.title || "Basic Portrait And Colors";
  const description: string = s.content?.description || "Are you looking for a way to make your portraits pop? Professional portrait retouching services can help you achieve the perfect look for your photos.";
  const bulletPoints: string = s.content?.bulletPoints || "Color correction | Stray hairs removal\nSkin tone improvement | Make eyes more expressive\nRemoving minor glares in glasses | Basic photo retouching";

  const btn1Text: string = s.content?.btn1Text || "Free trial";
  const btn1Link: any = s.content?.btn1Link || { url: "" };
  const btn2Text: string = s.content?.btn2Text || "Place an order";
  const btn2Link: any = s.content?.btn2Link || { url: "" };

  // Style configurations
  const imageHeight: number = s.style?.imageHeight ?? 450;
  const imageBorderRadius: number = s.style?.imageBorderRadius ?? 8;
  const columnGap: number = s.style?.columnGap ?? 40;

  const titleColor: string = s.style?.titleColor || "#111827";
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const descColor: string = s.style?.descColor || "#4b5563";
  const descTyp = getTypographyStyles(s.style?.descTypography || {});

  const bulletColor: string = s.style?.bulletColor || "#4b5563";
  const bulletTyp = getTypographyStyles(s.style?.bulletTypography || {});

  // Slider controls styling
  const handleBg: string = s.style?.handleBg || "#ffffff";
  const handleIconColor: string = s.style?.handleIconColor || "#4b5563";
  
  const badgeBg: string = s.style?.badgeBg || "rgba(0, 0, 0, 0.4)";
  const badgeTextColor: string = s.style?.badgeTextColor || "#ffffff";
  
  const sbsBadgeBg: string = s.style?.sbsBadgeBg || "#fca5a5";
  const sbsBadgeTextColor: string = s.style?.sbsBadgeTextColor || "#7f1d1d";

  // Buttons configurations
  const btn1Bg: string = s.style?.btn1Bg || "#ff3b00";
  const btn1TextColor: string = s.style?.btn1TextColor || "#ffffff";
  const btn1HoverBg: string = s.style?.btn1HoverBg || "#e03400";
  
  const btn2Bg: string = s.style?.btn2Bg || "transparent";
  const btn2TextColor: string = s.style?.btn2TextColor || "#374151";
  const btn2BorderColor: string = s.style?.btn2BorderColor || "#d1d5db";
  const btn2HoverBg: string = s.style?.btn2HoverBg || "#f3f4f6";

  const btnTyp = getTypographyStyles(s.style?.btnTypography || {});

  // Advanced configurations
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // React state for split slider
  const [sliderPos, setSliderPos] = useState<number>(50);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const elementId = `ba-box-el-${element.id}`;

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches[0]) handleMove(e.touches[0].clientX);
  };

  useEffect(() => {
    if (!isDragging) return;
    const onMouseMove = (e: MouseEvent) => handleMove(e.clientX);
    const onMouseUp = () => setIsDragging(false);
    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [isDragging]);

  const hasBtn1 = !!(btn1Text && btn1Link?.url);
  const hasBtn2 = !!(btn2Text && btn2Link?.url);

  // Parse bullet points into two columns
  const parseBullets = (): { col1: string[]; col2: string[] } => {
    const lines = bulletPoints
      .split("\n")
      .map((l) => l.trim())
      .filter((l) => l.length > 0);

    const col1: string[] = [];
    const col2: string[] = [];

    lines.forEach((line) => {
      if (line.includes("|")) {
        const [left, right] = line.split("|").map((p) => p.trim());
        if (left) col1.push(left);
        if (right) col2.push(right);
      } else {
        col1.push(line);
      }
    });

    return { col1, col2 };
  };

  const { col1, col2 } = parseBullets();

  return (
    <div
      className={`w-full ${elementId}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style>{`
        .${elementId} .slider-handle {
          background-color: ${handleBg};
          box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          cursor: ew-resize;
          transition: transform 0.2s ease;
          border: 1px solid rgba(0,0,0,0.1);
        }
        .${elementId} .slider-handle:hover {
          transform: translate(-50%, -50%) scale(1.1);
        }
        
        .${elementId} .slider-badge {
          background-color: ${badgeBg};
          color: ${badgeTextColor};
          padding: 6px 14px;
          font-size: 11px;
          font-weight: 600;
          border-radius: 4px;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          opacity: 0;
          transition: opacity 0.3s ease;
          pointer-events: none;
          backdrop-filter: blur(4px);
        }
        .${elementId} .slider-container:hover .slider-badge {
          opacity: 1;
        }

        /* Double side-by-side badges */
        .${elementId} .sbs-badge {
          background-color: ${sbsBadgeBg};
          color: ${sbsBadgeTextColor};
          padding: 4px 12px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 8px;
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }

        .${elementId} .btn-primary {
          background-color: ${btn1Bg};
          color: ${btn1TextColor};
          border: none;
          border-radius: 9999px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: background-color 0.3s ease;
          text-decoration: none;
        }
        .${elementId} .btn-primary:hover {
          background-color: ${btn1HoverBg};
        }

        .${elementId} .btn-secondary {
          background-color: ${btn2Bg};
          color: ${btn2TextColor};
          border: 1px solid ${btn2BorderColor};
          border-radius: 9999px;
          padding: 10px 24px;
          font-size: 14px;
          font-weight: 600;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          text-decoration: none;
        }
        .${elementId} .btn-secondary:hover {
          background-color: ${btn2HoverBg};
        }
      `}</style>

      <div
        className="flex flex-col lg:flex-row w-full items-stretch"
        style={{
          gap: `${columnGap}px`,
          flexDirection: imagePosition === "right" ? "row-reverse" : "row",
        }}
      >
        {/* ── Image Comparison side block ── */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {layoutType === "split-slider" ? (
            /* Split slider layout */
            <div
              ref={containerRef}
              onTouchMove={handleTouchMove}
              onMouseDown={() => setIsDragging(true)}
              className="slider-container w-full relative select-none overflow-hidden group cursor-ew-resize"
              style={{
                height: `${imageHeight}px`,
                borderRadius: `${imageBorderRadius}px`,
              }}
            >
              {/* After image background */}
              <img
                src={afterImage}
                alt="After image"
                className="w-full h-full object-cover pointer-events-none"
              />

              {/* Before image foreground (clipped) */}
              <img
                src={beforeImage}
                alt="Before image"
                className="absolute inset-0 w-full h-full object-cover pointer-events-none"
                style={{
                  clipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                  WebkitClipPath: `inset(0 ${100 - sliderPos}% 0 0)`,
                }}
              />

              {/* Slider Line handle switcher */}
              <div
                className="absolute top-0 bottom-0 w-[2px] bg-white z-20 pointer-events-none"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="slider-handle">
                  <Icon icon="mdi:chevron-left-right" width="16" className="text-gray-500" />
                </div>
              </div>

              {/* Dynamic Overlay Hover Labels */}
              <span className="slider-badge left-4">Before</span>
              <span className="slider-badge right-4">After</span>
            </div>
          ) : (
            /* Side-by-side double image layout */
            <div className="grid grid-cols-2 gap-4 w-full">
              {/* Before image box */}
              <div className="flex flex-col items-start w-full">
                <span className="sbs-badge">Before</span>
                <div
                  className="w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  style={{
                    height: `${imageHeight - 40}px`,
                    borderRadius: `${imageBorderRadius}px`,
                  }}
                >
                  <img
                    src={beforeImage}
                    alt="Before image"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>
              </div>

              {/* After image box */}
              <div className="flex flex-col items-start w-full">
                <span className="sbs-badge">After</span>
                <div
                  className="w-full overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
                  style={{
                    height: `${imageHeight - 40}px`,
                    borderRadius: `${imageBorderRadius}px`,
                  }}
                >
                  <img
                    src={afterImage}
                    alt="After image"
                    className="w-full h-full object-cover transition-transform duration-300 hover:scale-[1.03]"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Text Copy Details side block ── */}
        {(title || description || col1.length > 0 || col2.length > 0 || hasBtn1 || hasBtn2) && (
          <div className="flex-1 flex flex-col justify-center">
            {title && (
              <h3
                className="text-3xl font-bold tracking-tight mb-4"
                style={{ color: titleColor, ...titleTyp }}
              >
                {title}
              </h3>
            )}

            {description && (
              <p
                className="text-[15px] leading-relaxed mb-6"
                style={{ color: descColor, ...descTyp }}
              >
                {description}
              </p>
            )}

            {/* Bullet points display grid columns */}
            {(col1.length > 0 || col2.length > 0) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-3.5 mb-8">
                {/* Column 1 */}
                {col1.length > 0 && (
                  <ul className="space-y-3 pl-0 list-none">
                    {col1.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm font-medium"
                        style={{ color: bulletColor, ...bulletTyp }}
                      >
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}

                {/* Column 2 */}
                {col2.length > 0 && (
                  <ul className="space-y-3 pl-0 list-none">
                    {col2.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-start gap-2.5 text-sm font-medium"
                        style={{ color: bulletColor, ...bulletTyp }}
                      >
                        <span className="text-gray-400 mt-0.5">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            {/* CTA action buttons row */}
            {(hasBtn1 || hasBtn2) && (
              <div className="flex flex-wrap gap-4 items-center">
                {hasBtn1 && (
                  <a
                    href={btn1Link.url}
                    target={btn1Link.target || undefined}
                    rel={btn1Link.nofollow ? "nofollow" : undefined}
                    className="btn-primary"
                    style={btnTyp}
                  >
                    {btn1Text}
                  </a>
                )}

                {hasBtn2 && (
                  <a
                    href={btn2Link.url}
                    target={btn2Link.target || undefined}
                    rel={btn2Link.nofollow ? "nofollow" : undefined}
                    className="btn-secondary"
                    style={btnTyp}
                  >
                    {btn2Text}
                  </a>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const beforeAfterBoxElement = {
  type: "before-after-box",
  category: "colorexperts",
  label: "Before After Box",
  icon: "solar:slider-minimalistic-horizontal-bold-duotone",

  schema: {
    content: {
      beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      afterImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
      layoutType: "split-slider",
      imagePosition: "left",
      title: "Basic Portrait And Colors",
      description: "Are you looking for a way to make your portraits pop? Professional portrait retouching services can help you achieve the perfect look for your photos.",
      bulletPoints: "Color correction | Stray hairs removal\nSkin tone improvement | Make eyes more expressive\nRemoving minor glares in glasses | Basic photo retouching",
      btn1Text: "Free trial",
      btn1Link: { url: "/free-trial" },
      btn2Text: "Place an order",
      btn2Link: { url: "/order" },
    },

    style: {
      imageHeight: 450,
      imageBorderRadius: 8,
      columnGap: 40,
      titleColor: "#111827",
      titleTypography: {
        fontSize: 28,
        fontWeight: "700",
      },
      descColor: "#4b5563",
      descTypography: {
        fontSize: 15,
      },
      bulletColor: "#4b5563",
      bulletTypography: {
        fontSize: 14,
      },
      handleBg: "#ffffff",
      handleIconColor: "#4b5563",
      badgeBg: "rgba(0, 0, 0, 0.4)",
      badgeTextColor: "#ffffff",
      sbsBadgeBg: "#fca5a5",
      sbsBadgeTextColor: "#7f1d1d",
      btn1Bg: "#ff3b00",
      btn1TextColor: "#ffffff",
      btn1HoverBg: "#e03400",
      btn2Bg: "transparent",
      btn2TextColor: "#374151",
      btn2BorderColor: "#d1d5db",
      btn2HoverBg: "#f3f4f6",
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
      section: "Image Comparison Assets",
      controls: [
        {
          name: "beforeImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Before Image (Original)" value={value} onChange={onChange} />
          ),
        },
        {
          name: "afterImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="After Image (Edited)" value={value} onChange={onChange} />
          ),
        },
        {
          name: "layoutType",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Comparison Display Style"
              value={value ?? "split-slider"}
              onChange={onChange}
              options={[
                { value: "split-slider", label: "Interactive Split Drag-Slider" },
                { value: "side-by-side", label: "Double Side-by-Side Images" },
              ]}
            />
          ),
        },
        {
          name: "imagePosition",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Image Position"
              value={value ?? "left"}
              onChange={onChange}
              options={[
                { value: "left", label: "Left of content text" },
                { value: "right", label: "Right of content text" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Information details",
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
            <Textarea label="Description copy" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "bulletPoints",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea
              label="Bullet list details (Use pipe '|' to place in column 2)"
              value={value || ""}
              onChange={onChange}
              rows={6}
            />
          ),
        },
        {
          name: "btn1Text",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <Text label="Button 1 Label" value={value || ""} onChange={onChange} />
              <Url label="Button 1 Destination" value={schema.content.btn1Link || { url: "" }} onChange={(v) => updateSchema("content", "btn1Link", v)} />
            </div>
          ),
        },
        {
          name: "btn2Text",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <Text label="Button 2 Label" value={value || ""} onChange={onChange} />
              <Url label="Button 2 Destination" value={schema.content.btn2Link || { url: "" }} onChange={(v) => updateSchema("content", "btn2Link", v)} />
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Sizes & Spacing",
      controls: [
        {
          name: "imageHeight",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Image Display Height (px)" value={value ?? 450} onChange={onChange} min={200} max={800} />
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
          name: "columnGap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns Gap Size (px)" value={value ?? 40} onChange={onChange} min={10} max={100} />
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
            <ColorPickerPopup label="Title Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "titleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "descColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Description Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "descTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Description Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "bulletColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Bullets Text Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "bulletTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Bullets Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Slider Components styling",
      controls: [
        {
          name: "handleBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Slider Handle Background" value={value ?? "#ffffff"} onChange={onChange} />
              <ColorPickerPopup label="Slider Handle Icon Color" value={schema.style.handleIconColor ?? "#4b5563"} onChange={(v) => updateSchema("style", "handleIconColor", v)} />
            </div>
          ),
        },
        {
          name: "badgeBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Hover Badge Background" value={value ?? "rgba(0, 0, 0, 0.4)"} onChange={onChange} />
              <ColorPickerPopup label="Hover Badge Text Color" value={schema.style.badgeTextColor ?? "#ffffff"} onChange={(v) => updateSchema("style", "badgeTextColor", v)} />
            </div>
          ),
        },
        {
          name: "sbsBadgeBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="SBS Pill Background" value={value ?? "#fca5a5"} onChange={onChange} />
              <ColorPickerPopup label="SBS Pill Text Color" value={schema.style.sbsBadgeTextColor ?? "#7f1d1d"} onChange={(v) => updateSchema("style", "sbsBadgeTextColor", v)} />
            </div>
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Call to Action Buttons styling",
      controls: [
        {
          name: "btn1Bg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Button 1 Background Color" value={value ?? "#ff3b00"} onChange={onChange} />
              <ColorPickerPopup label="Button 1 Text Color" value={schema.style.btn1TextColor ?? "#ffffff"} onChange={(v) => updateSchema("style", "btn1TextColor", v)} />
              <ColorPickerPopup label="Button 1 Hover Background" value={schema.style.btn1HoverBg ?? "#e03400"} onChange={(v) => updateSchema("style", "btn1HoverBg", v)} />
            </div>
          ),
        },
        {
          name: "btn2TextColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Button 2 Text Color" value={schema.style.btn2TextColor ?? "#374151"} onChange={(v) => updateSchema("style", "btn2TextColor", v)} />
              <ColorPickerPopup label="Button 2 Border Color" value={schema.style.btn2BorderColor ?? "#d1d5db"} onChange={(v) => updateSchema("style", "btn2BorderColor", v)} />
              <ColorPickerPopup label="Button 2 Background Color" value={schema.style.btn2Bg ?? "transparent"} onChange={(v) => updateSchema("style", "btn2Bg", v)} />
              <ColorPickerPopup label="Button 2 Hover Background" value={schema.style.btn2HoverBg ?? "#f3f4f6"} onChange={(v) => updateSchema("style", "btn2HoverBg", v)} />
            </div>
          ),
        },
        {
          name: "btnTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Button Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <BeforeAfterBoxFrontend element={element} />,
};

export default beforeAfterBoxElement;
