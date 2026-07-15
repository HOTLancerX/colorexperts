"use client";

import React from "react";
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

function EBoxFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const stepText: string = s.content?.stepText || "Step 1";
  const title: string = s.content?.title || "Submit one (1) image for testing";
  const description: string = s.content?.description || "Let's work with one image first so that we can preliminarily assess your desired output.";
  const subDescription: string = s.content?.subDescription || "On the first attempt, your feedback will assist us in refining the image until we are able to align with your style. The final edited version will be stored in our system as reference for our future projects together. Contact and let us know if you want another image for testing.";

  const beforeImage: string = s.content?.beforeImage || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80";
  const afterImage: string = s.content?.afterImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80";
  const arrowLink: any = s.content?.arrowLink || { url: "" };
  const contentPosition: "left" | "right" = s.content?.contentPosition || "left";

  // Style configurations
  const imageHeight: number = s.style?.imageHeight ?? 380;
  const imageBorderRadius: number = s.style?.imageBorderRadius ?? 8;
  const columnGap: number = s.style?.columnGap ?? 50;

  const stepBg: string = s.style?.stepBg || "#fee2e2";
  const stepTextColor: string = s.style?.stepTextColor || "#991b1b";

  const titleColor: string = s.style?.titleColor || "#111827";
  const titleTyp = getTypographyStyles(s.style?.titleTypography || {});
  const descColor: string = s.style?.descColor || "#1f2937";
  const descTyp = getTypographyStyles(s.style?.descTypography || {});
  
  const subDescColor: string = s.style?.subDescColor || "#4b5563";
  const subDescTyp = getTypographyStyles(s.style?.subDescTypography || {});

  // Circular link arrow styling
  const arrowBg: string = s.style?.arrowBg || "#ffffff";
  const arrowBorderColor: string = s.style?.arrowBorderColor || "#d1d5db";
  const arrowColor: string = s.style?.arrowColor || "#1f2937";
  const arrowHoverBg: string = s.style?.arrowHoverBg || "#f3f4f6";

  const labelColor: string = s.style?.labelColor || "#111827";
  const labelTyp = getTypographyStyles(s.style?.labelTypography || {});

  // Advanced configurations
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const elementId = `ebox-el-${element.id}`;

  const hasArrowLink = !!arrowLink?.url;

  return (
    <div
      className={`w-full ${elementId}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style>{`
        .${elementId} .step-badge {
          background-color: ${stepBg};
          color: ${stepTextColor};
          padding: 4px 10px;
          font-size: 11px;
          font-weight: 700;
          border-radius: 4px;
          display: inline-block;
          margin-bottom: 16px;
        }

        .${elementId} .round-arrow-btn {
          width: 46px;
          height: 46px;
          border-radius: 9999px;
          background-color: ${arrowBg};
          border: 1px solid ${arrowBorderColor};
          color: ${arrowColor};
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
          flex-shrink: 0;
          text-decoration: none;
        }
        .${elementId} .round-arrow-btn:hover {
          background-color: ${arrowHoverBg};
          transform: translateX(3px);
        }
      `}</style>

      <div
        className="flex flex-col lg:flex-row w-full items-stretch"
        style={{
          gap: `${columnGap}px`,
          flexDirection: contentPosition === "right" ? "row-reverse" : "row",
        }}
      >
        {/* ── Text Content Column ── */}
        <div className="flex-1 flex flex-row items-start gap-4 lg:gap-6">
          {/* Circular arrow icon wrapper */}
          {hasArrowLink && (
            <a
              href={arrowLink.url}
              target={arrowLink.target || undefined}
              rel={arrowLink.nofollow ? "nofollow" : undefined}
              className="round-arrow-btn mt-[52px]"
            >
              <Icon icon="solar:arrow-right-linear" width="20" />
            </a>
          )}

          <div className="flex-1 flex flex-col items-start justify-center">
            {stepText && <span className="step-badge">{stepText}</span>}
            
            {title && (
              <h3
                className="text-3xl font-bold tracking-tight mb-6"
                style={{ color: titleColor, ...titleTyp }}
              >
                {title}
              </h3>
            )}

            {description && (
              <p
                className="text-[15px] font-semibold leading-relaxed mb-4"
                style={{ color: descColor, ...descTyp }}
              >
                {description}
              </p>
            )}

            {subDescription && (
              <p
                className="text-sm leading-relaxed"
                style={{ color: subDescColor, ...subDescTyp }}
              >
                {subDescription}
              </p>
            )}
          </div>
        </div>

        {/* ── Image Comparison Column (Double layout before/after) ── */}
        <div className="flex-1 min-w-0 flex flex-col items-center justify-center">
          <div className="grid grid-cols-2 gap-4 w-full">
            <div
              className="overflow-hidden shadow-sm"
              style={{
                height: `${imageHeight}px`,
                borderRadius: `${imageBorderRadius}px`,
              }}
            >
              <img
                src={beforeImage}
                alt="Before Retouch"
                className="w-full h-full object-cover"
              />
            </div>

            <div
              className="overflow-hidden shadow-sm"
              style={{
                height: `${imageHeight}px`,
                borderRadius: `${imageBorderRadius}px`,
              }}
            >
              <img
                src={afterImage}
                alt="After Retouch"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Bottom Labels with curved dashed arrow in the middle */}
          <div className="flex items-center gap-6 mt-4 select-none">
            <span
              className="text-sm italic font-medium"
              style={{ color: labelColor, ...labelTyp }}
            >
              Before
            </span>
            <img
              src="https://ephotovn.com/wp-content/themes/ephotovn/assets/images/solution/group-37261.svg"
              alt="Curved indicator arrow"
              className="h-5 object-contain"
            />
            <span
              className="text-sm italic font-medium"
              style={{ color: labelColor, ...labelTyp }}
            >
              After
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

const eBoxElement = {
  type: "e-box",
  category: "colorexperts",
  label: "Before After Step",
  icon: "solar:double-alt-arrow-right-bold-duotone",

  schema: {
    content: {
      stepText: "Step 1",
      title: "Submit one (1) image for testing",
      description: "Let's work with one image first so that we can preliminarily assess your desired output.",
      subDescription: "On the first attempt, your feedback will assist us in refining the image until we are able to align with your style. The final edited version will be stored in our system as reference for our future projects together. Contact and let us know if you want another image for testing.",
      beforeImage: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80",
      afterImage: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=800&auto=format&fit=crop&q=80",
      arrowLink: { url: "/start-test" },
      contentPosition: "left",
    },

    style: {
      imageHeight: 380,
      imageBorderRadius: 8,
      columnGap: 50,
      stepBg: "#fee2e2",
      stepTextColor: "#991b1b",
      titleColor: "#111827",
      titleTypography: {
        fontSize: 30,
        fontWeight: "700",
      },
      descColor: "#1f2937",
      descTypography: {
        fontSize: 15,
        fontWeight: "600",
      },
      subDescColor: "#4b5563",
      subDescTypography: {
        fontSize: 14,
      },
      arrowBg: "#ffffff",
      arrowBorderColor: "#d1d5db",
      arrowColor: "#1f2937",
      arrowHoverBg: "#f3f4f6",
      labelColor: "#111827",
      labelTypography: {
        fontSize: 14,
        fontStyle: "italic",
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
      section: "Step Information",
      controls: [
        {
          name: "stepText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Step Label (e.g. Step 1)" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Heading Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "description",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Bold Description paragraph" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "subDescription",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Regular Description copy" value={value || ""} onChange={onChange} rows={4} />
          ),
        },
        {
          name: "arrowLink",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Circular Arrow button link" value={value} onChange={onChange} />
          ),
        },
        {
          name: "contentPosition",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Select
              label="Content position alignment"
              value={value ?? "left"}
              onChange={onChange}
              options={[
                { value: "left", label: "Text left, Images right" },
                { value: "right", label: "Text right, Images left" },
              ]}
            />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Retouch Images",
      controls: [
        {
          name: "beforeImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="Before Image" value={value} onChange={onChange} />
          ),
        },
        {
          name: "afterImage",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ImageGallery label="After Image" value={value} onChange={onChange} />
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
            <NumberControl label="Images Height (px)" value={value ?? 380} onChange={onChange} min={200} max={600} />
          ),
        },
        {
          name: "imageBorderRadius",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Images Border Radius (px)" value={value ?? 8} onChange={onChange} min={0} max={50} />
          ),
        },
        {
          name: "columnGap",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Columns Spacing Gap (px)" value={value ?? 50} onChange={onChange} min={20} max={120} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Badge & Arrow Button Styling",
      controls: [
        {
          name: "stepBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Badge Background" value={value ?? "#fee2e2"} onChange={onChange} />
              <ColorPickerPopup label="Badge Text Color" value={schema.style.stepTextColor ?? "#991b1b"} onChange={(v) => updateSchema("style", "stepTextColor", v)} />
            </div>
          ),
        },
        {
          name: "arrowBg",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Arrow Background" value={value ?? "#ffffff"} onChange={onChange} />
              <ColorPickerPopup label="Arrow Border Color" value={schema.style.arrowBorderColor ?? "#d1d5db"} onChange={(v) => updateSchema("style", "arrowBorderColor", v)} />
              <ColorPickerPopup label="Arrow Icon Color" value={schema.style.arrowColor ?? "#1f2937"} onChange={(v) => updateSchema("style", "arrowColor", v)} />
              <ColorPickerPopup label="Arrow Hover Background" value={schema.style.arrowHoverBg ?? "#f3f4f6"} onChange={(v) => updateSchema("style", "arrowHoverBg", v)} />
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
            <ColorPickerPopup label="Title Heading Color" value={value ?? "#111827"} onChange={onChange} />
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
            <ColorPickerPopup label="Bold Desc Color" value={value ?? "#1f2937"} onChange={onChange} />
          ),
        },
        {
          name: "descTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Bold Desc Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "subDescColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Regular Copy Color" value={value ?? "#4b5563"} onChange={onChange} />
          ),
        },
        {
          name: "subDescTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Regular Copy Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "labelColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Italic Labels Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "labelTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Italic Labels Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <EBoxFrontend element={element} />,
};

export default eBoxElement;
