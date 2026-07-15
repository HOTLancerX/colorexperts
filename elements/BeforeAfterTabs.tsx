"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import useEmblaCarousel from "embla-carousel-react";
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

function BeforeAfterTabsFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const categories: any[] = s.content?.categories || [];
  const switchTrigger: "click" | "hover" = s.content?.switchTrigger || "click";

  // Style configurations
  const imageHeight: number = s.style?.imageHeight ?? 450;
  const imageBorderRadius: number = s.style?.imageBorderRadius ?? 8;
  const columnGap: number = s.style?.columnGap ?? 40;

  // Toggle Capsule configurations
  const capsuleBg: string = s.style?.capsuleBg || "rgba(255, 255, 255, 0.2)";
  const capsuleBorder: string = s.style?.capsuleBorder || "rgba(255, 255, 255, 0.3)";
  const capsuleActiveBg: string = s.style?.capsuleActiveBg || "rgba(255, 255, 255, 0.4)";
  const capsuleActiveTextColor: string = s.style?.capsuleActiveTextColor || "#ffffff";
  const capsuleInactiveTextColor: string = s.style?.capsuleInactiveTextColor || "rgba(255, 255, 255, 0.8)";

  // Typography/Colors right side
  const rightTitleColor: string = s.style?.rightTitleColor || "#111827";
  const rightTitleTyp = getTypographyStyles(s.style?.rightTitleTypography || {});
  const rightBulletColor: string = s.style?.rightBulletColor || "#4b5563";
  const rightBulletTyp = getTypographyStyles(s.style?.rightBulletTypography || {});

  // Bottom Tabs configurations
  const tabThumbWidth: number = s.style?.tabThumbWidth ?? 120;
  const tabThumbHeight: number = s.style?.tabThumbHeight ?? 75;
  const tabActiveBorderColor: string = s.style?.tabActiveBorderColor || "#3b82f6";
  const tabLabelColor: string = s.style?.tabLabelColor || "#6b7280";
  const tabActiveLabelColor: string = s.style?.tabActiveLabelColor || "#111827";
  const tabLabelTyp = getTypographyStyles(s.style?.tabLabelTypography || {});

  const arrowBgColor: string = s.style?.arrowBgColor || "rgba(255, 255, 255, 0.9)";
  const arrowIconColor: string = s.style?.arrowIconColor || "#374151";

  // Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // React state
  const [activeIdx, setActiveIdx] = useState<number>(0);
  const [activeImageMode, setActiveImageMode] = useState<"before" | "after">("before");
  
  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    containScroll: "trimSnaps",
    dragFree: true,
  });

  const elementId = `ba-tabs-el-${element.id}`;
  const currentCategory = categories[activeIdx] || categories[0] || null;

  const scrollPrev = () => {
    if (emblaApi) emblaApi.scrollPrev();
  };

  const scrollNext = () => {
    if (emblaApi) emblaApi.scrollNext();
  };

  const getBullets = (bulletsStr: string): string[] => {
    if (!bulletsStr) return [];
    return bulletsStr
      .split("\n")
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
  };

  const renderBulletList = (bulletsStr: string) => {
    const list = getBullets(bulletsStr);
    return (
      <ul className="space-y-3.5 list-none pl-0">
        {list.map((bullet, idx) => (
          <li
            key={idx}
            className="flex items-start gap-2.5 text-sm"
            style={{ color: rightBulletColor, ...rightBulletTyp }}
          >
            <span className="text-gray-400 mt-0.5">•</span>
            <span>{bullet}</span>
          </li>
        ))}
      </ul>
    );
  };

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
          display: flex;
          align-items: center;
          gap: 4px;
          position: absolute;
          bottom: 24px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 20;
          box-shadow: 0 4px 10px rgba(0,0,0,0.1);
        }
        .${elementId} .ba-button {
          padding: 6px 18px;
          font-size: 12px;
          font-weight: 600;
          border-radius: 9999px;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
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

        /* bottom carousel tab items */
        .${elementId} .ba-carousel-container {
          position: relative;
          display: flex;
          align-items: center;
          width: 100%;
          margin-top: 32px;
        }
        .${elementId} .ba-carousel-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scroll-behavior: smooth;
        }
        .${elementId} .ba-carousel-scroll::-webkit-scrollbar {
          display: none;
        }
        .${elementId} .ba-tab-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          cursor: pointer;
          flex-shrink: 0;
          opacity: 0.65;
          transition: opacity 0.3s ease;
        }
        .${elementId} .ba-tab-item:hover {
          opacity: 0.95;
        }
        .${elementId} .ba-tab-item.active {
          opacity: 1;
        }
        .${elementId} .ba-tab-thumb-wrapper {
          border-radius: 6px;
          overflow: hidden;
          transition: border-color 0.3s ease;
          border: 2px solid transparent;
        }
        .${elementId} .ba-tab-item.active .ba-tab-thumb-wrapper {
          border-color: ${tabActiveBorderColor};
        }
        .${elementId} .ba-tab-label {
          margin-top: 8px;
          text-align: center;
          color: ${tabLabelColor};
          font-size: 12px;
          font-weight: 500;
          transition: color 0.3s ease;
        }
        .${elementId} .ba-tab-item.active .ba-tab-label {
          color: ${tabActiveLabelColor};
          font-weight: 600;
        }
        
        .${elementId} .scroll-btn {
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 9999px;
          border: 1px solid #e5e7eb;
          box-shadow: 0 2px 4px rgba(0,0,0,0.06);
          position: absolute;
          z-index: 10;
          cursor: pointer;
          transition: all 0.3s ease;
        }
        .${elementId} .scroll-btn:hover {
          background-color: #f9fafb;
        }
      `}</style>

      {currentCategory ? (
        <div className="w-full">
          {/* ── Main Comparison Row ── */}
          <div
            className="flex flex-col lg:flex-row w-full items-stretch"
            style={{ gap: `${columnGap}px` }}
          >
            {/* Left Comparison image container */}
            <div className="flex-1 min-w-0 relative group">
              <div
                className="w-full overflow-hidden relative"
                style={{
                  height: `${imageHeight}px`,
                  borderRadius: `${imageBorderRadius}px`,
                }}
              >
                {/* Before Image */}
                <img
                  src={currentCategory.beforeImage}
                  alt="Before image"
                  className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: activeImageMode === "before" ? 1 : 0,
                    zIndex: activeImageMode === "before" ? 5 : 0,
                  }}
                />

                {/* After Image */}
                <img
                  src={currentCategory.afterImage}
                  alt="After image"
                  className="w-full h-full object-cover absolute inset-0 transition-opacity duration-500 ease-in-out"
                  style={{
                    opacity: activeImageMode === "after" ? 1 : 0,
                    zIndex: activeImageMode === "after" ? 5 : 0,
                  }}
                />

                {/* Glassmorphic Capsule Buttons */}
                <div className="toggle-capsule">
                  <button
                    type="button"
                    onClick={() => setActiveImageMode("before")}
                    onMouseEnter={switchTrigger === "hover" ? () => setActiveImageMode("before") : undefined}
                    className={`ba-button ${activeImageMode === "before" ? "active" : "inactive"}`}
                  >
                    Before
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveImageMode("after")}
                    onMouseEnter={switchTrigger === "hover" ? () => setActiveImageMode("after") : undefined}
                    className={`ba-button ${activeImageMode === "after" ? "active" : "inactive"}`}
                  >
                    After
                  </button>
                </div>
              </div>
            </div>

            {/* Right Information description container */}
            <div className="w-full lg:w-[380px] shrink-0 flex flex-col justify-center">
              <h3
                className="text-2xl font-bold tracking-tight mb-5"
                style={{ color: rightTitleColor, ...rightTitleTyp }}
              >
                {currentCategory.rightTitle || "Our photo editors' works"}
              </h3>
              
              {renderBulletList(currentCategory.rightBulletPoints)}
            </div>
          </div>

          {/* ── Bottom Carousel Categories Selector ── */}
          {categories.length > 1 && (
            <div className="ba-carousel-container">
              {/* Left Arrow */}
              <button
                type="button"
                onClick={scrollPrev}
                className="scroll-btn -left-4"
                style={{ backgroundColor: arrowBgColor, color: arrowIconColor }}
                title="Scroll Left"
              >
                <Icon icon="mdi:chevron-left" width="18" />
              </button>

              {/* Embla Viewport wrapper */}
              <div
                ref={emblaRef}
                className="w-full px-4 overflow-hidden"
              >
                <div className="flex gap-4">
                  {categories.map((cat, idx) => (
                    <div
                      key={cat.id || idx}
                      onClick={() => {
                        setActiveIdx(idx);
                        setActiveImageMode("before");
                      }}
                      className={`ba-tab-item ${activeIdx === idx ? "active" : ""}`}
                      style={{ width: `${tabThumbWidth}px` }}
                    >
                      <div
                        className="ba-tab-thumb-wrapper shadow-sm w-full"
                        style={{
                          height: `${tabThumbHeight}px`,
                        }}
                      >
                        <img
                          src={cat.thumbnail || cat.beforeImage}
                          alt={cat.tabLabel}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <span className="ba-tab-label" style={tabLabelTyp}>
                        {cat.tabLabel || `Category #${idx + 1}`}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Right Arrow */}
              <button
                type="button"
                onClick={scrollNext}
                className="scroll-btn -right-4"
                style={{ backgroundColor: arrowBgColor, color: arrowIconColor }}
                title="Scroll Right"
              >
                <Icon icon="mdi:chevron-right" width="18" />
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="p-8 border border-dashed text-center text-gray-500 rounded bg-gray-50 text-sm">
          Please add categories inside Content Settings.
        </div>
      )}
    </div>
  );
}

const beforeAfterTabsElement = {
  type: "before-after-tabs",
  category: "colorexperts",
  label: "Before After Tabs",
  icon: "solar:slider-minimalistic-horizontal-bold-duotone",

  schema: {
    content: {
      switchTrigger: "click",
      categories: [
        {
          id: "cat-1",
          tabLabel: "Newborn",
          thumbnail: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=300&auto=format&fit=crop&q=80",
          beforeImage: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&auto=format&fit=crop&q=80",
          afterImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=80",
          rightTitle: "Newborn Retouching",
          rightBulletPoints: "Skin smoothing and toning\nTeeth whitening & eye correction\nBasic touch-ups such as eyebrows\nBlemish and scar removal\nBackground clean-up\nAdjusting brightness and contrast\nOverall enhancement of facial features",
        },
        {
          id: "cat-2",
          tabLabel: "Maternity",
          thumbnail: "https://images.unsplash.com/photo-1511497584788-876760111969?w=300&auto=format&fit=crop&q=80",
          beforeImage: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800&auto=format&fit=crop&q=80",
          afterImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=800&auto=format&fit=crop&q=80",
          rightTitle: "Maternity Glow Up",
          rightBulletPoints: "Stretch marks smoothing\nGown color enhancement\nAtmospheric background fog styling\nSkin glow additions",
        },
      ],
    },

    style: {
      imageHeight: 450,
      imageBorderRadius: 8,
      columnGap: 40,
      capsuleBg: "rgba(255, 255, 255, 0.2)",
      capsuleBorder: "rgba(255, 255, 255, 0.3)",
      capsuleActiveBg: "rgba(255, 255, 255, 0.4)",
      capsuleActiveTextColor: "#ffffff",
      capsuleInactiveTextColor: "rgba(255, 255, 255, 0.8)",
      rightTitleColor: "#111827",
      rightTitleTypography: {
        fontSize: 24,
        fontWeight: "700",
      },
      rightBulletColor: "#4b5563",
      rightBulletTypography: {
        fontSize: 14,
      },
      tabThumbWidth: 120,
      tabThumbHeight: 75,
      tabActiveBorderColor: "#3b82f6",
      tabLabelColor: "#6b7280",
      tabActiveLabelColor: "#111827",
      arrowBgColor: "rgba(255, 255, 255, 0.9)",
      arrowIconColor: "#374151",
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
      section: "Tabs Settings",
      controls: [
        {
          name: "switchTrigger",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Before/After Switch Trigger"
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
          name: "categories",
          responsive: false,
          render: (value: any, onChange: any) => {
            const list = value || [];
            return (
              <div className="space-y-4 pt-1">
                <span className="text-xs font-semibold text-gray-400">Categories List</span>
                {list.map((cat: any, idx: number) => (
                  <Section key={cat.id || idx} label={cat.tabLabel || `Category #${idx + 1}`}>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => {
                            const newCat = {
                              ...cat,
                              id: `cat-${Date.now()}`,
                              tabLabel: `${cat.tabLabel || "Copy"} (Copy)`,
                            };
                            const next = [...list];
                            next.splice(idx + 1, 0, newCat);
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
                        label="Tab Label Text"
                        value={cat.tabLabel || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], tabLabel: v };
                          onChange(next);
                        }}
                      />

                      <ImageGallery
                        label="Tab Thumbnail Image"
                        value={cat.thumbnail || ""}
                        onChange={(img) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], thumbnail: img };
                          onChange(next);
                        }}
                      />

                      <ImageGallery
                        label="Before Image (Large)"
                        value={cat.beforeImage || ""}
                        onChange={(img) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], beforeImage: img };
                          onChange(next);
                        }}
                      />

                      <ImageGallery
                        label="After Image (Large)"
                        value={cat.afterImage || ""}
                        onChange={(img) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], afterImage: img };
                          onChange(next);
                        }}
                      />

                      <Text
                        label="Right Panel Title"
                        value={cat.rightTitle || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], rightTitle: v };
                          onChange(next);
                        }}
                      />

                      <Textarea
                        label="Right Panel Bullet Points (One per line)"
                        value={cat.rightBulletPoints || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], rightBulletPoints: v };
                          onChange(next);
                        }}
                        rows={6}
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
                        id: `cat-${Date.now()}`,
                        tabLabel: "New Category",
                        thumbnail: "",
                        beforeImage: "",
                        afterImage: "",
                        rightTitle: "Editing Works Title",
                        rightBulletPoints: "Feature point #1\nFeature point #2",
                      },
                    ];
                    onChange(next);
                  }}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs font-semibold cursor-pointer text-center"
                >
                  + Add New Category
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
      section: "Image Styling",
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
            <NumberControl label="Image Border Radius (px)" value={value ?? 8} onChange={onChange} min={0} max={50} />
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
      section: "Pill Toggle Toggle",
      controls: [
        {
          name: "capsuleBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Pill Background" value={value ?? "rgba(255, 255, 255, 0.2)"} onChange={onChange} />
              <ColorPickerPopup label="Pill Border Color" value={schema.style.capsuleBorder ?? "rgba(255, 255, 255, 0.3)"} onChange={(v) => updateSchema("style", "capsuleBorder", v)} />
              <ColorPickerPopup label="Active Tab Background" value={schema.style.capsuleActiveBg ?? "rgba(255, 255, 255, 0.4)"} onChange={(v) => updateSchema("style", "capsuleActiveBg", v)} />
            </div>
          ),
        },
        {
          name: "capsuleActiveTextColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Active Text Color" value={value ?? "#ffffff"} onChange={onChange} />
              <ColorPickerPopup label="Inactive Text Color" value={schema.style.capsuleInactiveTextColor ?? "rgba(255,255,255,0.8)"} onChange={(v) => updateSchema("style", "capsuleInactiveTextColor", v)} />
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
          name: "rightTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Right Panel Title Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "rightTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Right Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "rightBulletColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Bullet Points Text Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "rightBulletTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Bullet Points Typography" value={value} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Carousel Tabs Styling",
      controls: [
        {
          name: "tabThumbWidth",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <NumberControl label="Thumbnail Width (px)" value={value ?? 120} onChange={onChange} min={60} max={250} />
              <NumberControl label="Thumbnail Height (px)" value={schema.style.tabThumbHeight ?? 75} onChange={(v) => updateSchema("style", "tabThumbHeight", v)} min={40} max={150} />
            </div>
          ),
        },
        {
          name: "tabActiveBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Active Border Color" value={value ?? "#3b82f6"} onChange={onChange} />
          ),
        },
        {
          name: "tabLabelColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Tab Label Color" value={value ?? "#6b7280"} onChange={onChange} />
              <ColorPickerPopup label="Active Tab Label Color" value={schema.style.tabActiveLabelColor ?? "#111827"} onChange={(v) => updateSchema("style", "tabActiveLabelColor", v)} />
            </div>
          ),
        },
        {
          name: "tabLabelTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Tab Label Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "arrowBgColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Arrow Button Background" value={value ?? "rgba(255, 255, 255, 0.9)"} onChange={onChange} />
              <ColorPickerPopup label="Arrow Icon Color" value={schema.style.arrowIconColor ?? "#374151"} onChange={(v) => updateSchema("style", "arrowIconColor", v)} />
            </div>
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

  render: (element: any) => <BeforeAfterTabsFrontend element={element} />,
};

export default beforeAfterTabsElement;
