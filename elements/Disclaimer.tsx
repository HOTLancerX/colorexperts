"use client";

import React from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  Select,
  Toggle,
  NumberControl,
  Dimensions,
  ColorPickerPopup,
  Url,
  IconPicker,
  Typography,
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

function DisclaimerFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const showIcon: boolean = s.content?.showIcon ?? true;
  const iconName: string = s.content?.iconName || "mdi:alert-outline";
  const badgeText: string = s.content?.badgeText || "Disclaimer";
  const bodyText: string = s.content?.bodyText || "The before/after photos are used as a sample of services we offer. The actual price of displayed images might be higher than the mentioned Starting Price. For accurate prices, please ";
  const linkText: string = s.content?.linkText || "Request a Quote";
  const link: any = s.content?.link || { url: "" };

  // Styling configurations
  const bgColor: string = s.style?.bgColor || "#fdf2f2";
  const borderColor: string = s.style?.borderColor || "#fde8e8";
  const borderWidth: number = s.style?.borderWidth ?? 1;
  const borderRadius: number = s.style?.borderRadius ?? 6;
  
  const iconColor: string = s.style?.iconColor || "#9b1c1c";
  const iconSize: number = s.style?.iconSize ?? 24;

  const badgeBgColor: string = s.style?.badgeBgColor || "#004b6e";
  const badgeTextColor: string = s.style?.badgeTextColor || "#ffffff";
  const badgeItalic: boolean = s.style?.badgeItalic ?? true;

  const textColor: string = s.style?.textColor || "#7f1d1d";
  const linkColor: string = s.style?.linkColor || "#004b6e";
  const linkHoverColor: string = s.style?.linkHoverColor || "#083344";

  // Spacing
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  const elementId = `disclaimer-el-${element.id}`;

  const hasLink = !!(link && link.url);

  const textTyp = getTypographyStyles(s.style?.textTypography || {});

  return (
    <div
      className={`w-full ${elementId}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style>{`
        .${elementId} .disclaimer-box {
          background-color: ${bgColor};
          border: ${borderWidth}px solid ${borderColor};
          border-radius: ${borderRadius}px;
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          transition: all 0.3s ease;
        }
        @media (min-width: 768px) {
          .${elementId} .disclaimer-box {
            align-items: center;
          }
        }
        .${elementId} .badge-style {
          background-color: ${badgeBgColor};
          color: ${badgeTextColor};
          font-style: ${badgeItalic ? "italic" : "normal"};
        }
        .${elementId} .body-text-style {
          color: ${textColor};
          font-size: 14px;
          line-height: 1.6;
        }
        .${elementId} .link-style {
          color: ${linkColor};
          text-decoration: underline;
          font-weight: 600;
          transition: color 0.3s ease;
        }
        .${elementId} .link-style:hover {
          color: ${linkHoverColor};
        }
      `}</style>

      <div className="disclaimer-box w-full">
        {showIcon && (
          <div className="shrink-0 flex items-center justify-center">
            <Icon
              icon={iconName}
              style={{
                color: iconColor,
                fontSize: `${iconSize}px`,
              }}
            />
          </div>
        )}
        
        <div className="body-text-style flex-1" style={textTyp}>
          {badgeText && (
            <span className="badge-style inline-block px-2 py-0.5 mr-1.5 font-bold rounded">
              {badgeText}:
            </span>
          )}
          <span>{bodyText}</span>
          {linkText && hasLink && (
            <a
              href={link.url}
              target={link.target || undefined}
              rel={link.nofollow ? "nofollow" : undefined}
              className="link-style inline-block"
            >
              {linkText}
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

const disclaimerElement = {
  type: "disclaimer",
  category: "colorexperts",
  label: "Disclaimer",
  icon: "solar:danger-triangle-bold-duotone",

  schema: {
    content: {
      showIcon: true,
      iconName: "mdi:alert-outline",
      badgeText: "Disclaimer",
      bodyText: "The before/after photos are used as a sample of services we offer. The actual price of displayed images might be higher than the mentioned Starting Price. For accurate prices, please ",
      linkText: "Request a Quote",
      link: { url: "/quote" },
    },

    style: {
      bgColor: "#fdf2f2",
      borderColor: "#fde8e8",
      borderWidth: 1,
      borderRadius: 6,
      iconColor: "#9b1c1c",
      iconSize: 24,
      badgeBgColor: "#004b6e",
      badgeTextColor: "#ffffff",
      badgeItalic: true,
      textColor: "#7f1d1d",
      linkColor: "#004b6e",
      linkHoverColor: "#083344",
      textTypography: {
        fontSize: 14,
        fontWeight: "400",
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
      section: "Disclaimer Content",
      controls: [
        {
          name: "showIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Toggle label="Show Icon" value={value !== false} onChange={onChange} />
          ),
        },
        {
          name: "iconName",
          responsive: false,
          render: (value: any, onChange: any, { schema }: any) => (
            schema.content.showIcon !== false ? (
              <IconPicker label="Warning Icon" value={value || "mdi:alert-outline"} onChange={onChange} />
            ) : null
          ),
        },
        {
          name: "badgeText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Badge Prefix Text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "bodyText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Textarea label="Disclaimer Description" value={value || ""} onChange={onChange} rows={3} />
          ),
        },
        {
          name: "linkText",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Action Link Text" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "link",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Url label="Action Link Destination" value={value || { url: "" }} onChange={onChange} />
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Banner Styling",
      controls: [
        {
          name: "bgColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Background Color" value={value ?? "#fdf2f2"} onChange={onChange} />
          ),
        },
        {
          name: "borderColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Border Color" value={value ?? "#fde8e8"} onChange={onChange} />
              <NumberControl label="Border Width (px)" value={schema.style.borderWidth ?? 1} onChange={(v) => updateSchema("style", "borderWidth", v)} min={0} max={10} />
              <NumberControl label="Border Radius (px)" value={schema.style.borderRadius ?? 6} onChange={(v) => updateSchema("style", "borderRadius", v)} min={0} max={50} />
            </div>
          ),
        },
        {
          name: "iconColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            schema.content.showIcon !== false ? (
              <div className="space-y-4">
                <ColorPickerPopup label="Icon Color" value={value ?? "#9b1c1c"} onChange={onChange} />
                <NumberControl label="Icon Size (px)" value={schema.style.iconSize ?? 24} onChange={(v) => updateSchema("style", "iconSize", v)} min={12} max={64} />
              </div>
            ) : null
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Badge & Text Styling",
      controls: [
        {
          name: "badgeBgColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Badge Background Color" value={value ?? "#004b6e"} onChange={onChange} />
              <ColorPickerPopup label="Badge Text Color" value={schema.style.badgeTextColor ?? "#ffffff"} onChange={(v) => updateSchema("style", "badgeTextColor", v)} />
              <Toggle label="Badge Italic Formatting" value={schema.style.badgeItalic !== false} onChange={(v) => updateSchema("style", "badgeItalic", v)} />
            </div>
          ),
        },
        {
          name: "textColor",
          responsive: false,
          render: (value: any, onChange: any, { schema, updateSchema }: any) => (
            <div className="space-y-4">
              <ColorPickerPopup label="Body Text Color" value={value ?? "#7f1d1d"} onChange={onChange} />
              <ColorPickerPopup label="Action Link Color" value={schema.style.linkColor ?? "#004b6e"} onChange={(v) => updateSchema("style", "linkColor", v)} />
              <ColorPickerPopup label="Action Link Hover Color" value={schema.style.linkHoverColor ?? "#083344"} onChange={(v) => updateSchema("style", "linkHoverColor", v)} />
            </div>
          ),
        },
        {
          name: "textTypography",
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

  render: (element: any) => <DisclaimerFrontend element={element} />,
};

export default disclaimerElement;
