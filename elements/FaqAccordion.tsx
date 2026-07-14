"use client";

import React, { useState } from "react";
import { Icon } from "@iconify/react";
import {
  Text,
  Textarea,
  ColorPickerPopup,
  Dimensions,
  Typography,
  Section,
  IconPicker,
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

interface FaqItem {
  id: string;
  question: string;
  answer: string;
  icon?: string;
}

/* ── FAQ Accordion Element Component ── */
function FaqAccordionFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const title: string = s.content?.title || "FREQUENTLY ASKED QUESTIONS (FAQ)";
  const subtitle: string = s.content?.subtitle || "";
  const items: FaqItem[] = s.content?.items || [];
  
  // Right side toggle icons
  const collapsedIcon: string = s.content?.collapsedIcon || "solar:add-linear";
  const expandedIcon: string = s.content?.expandedIcon || "solar:minimize-linear";

  // Style configurations
  const headerColor: string = s.style?.headerColor || "#111827";
  const subtitleColor: string = s.style?.subtitleColor || "#6b7280";

  const itemBg: string = s.style?.itemBg || "#f8fafc";
  const activeItemBg: string = s.style?.activeItemBg || "#ffffff";
  const questionColor: string = s.style?.questionColor || "#1e293b";
  const activeQuestionColor: string = s.style?.activeQuestionColor || "#006699";
  const answerColor: string = s.style?.answerColor || "#475569";

  const numBg: string = s.style?.numBg || "#e2e8f0";
  const activeNumBg: string = s.style?.activeNumBg || "#006699";
  const numTextColor: string = s.style?.numTextColor || "#475569";
  const activeNumTextColor: string = s.style?.activeNumTextColor || "#ffffff";

  // State: all items closed initially (first one is NOT open by default)
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  // Toggle single item accordion behavior
  const handleToggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  // Typography
  const headerTyp = getTypographyStyles(s.style?.headerTypography || {});
  const questionTyp = getTypographyStyles(s.style?.questionTypography || {});
  const answerTyp = getTypographyStyles(s.style?.answerTypography || {});

  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  return (
    <div
      style={{
        width: "100%",
        boxSizing: "border-box",
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      {/* Title Header Section */}
      {(title || subtitle) && (
        <div className="flex flex-col items-center w-full mb-12 select-none">
          {title && (
            <h2
              className="text-3xl font-extrabold tracking-wide mb-3 m-0 text-center uppercase"
              style={{
                color: headerColor,
                ...headerTyp,
              }}
            >
              {title}
            </h2>
          )}

          {subtitle && (
            <p
              className="text-base text-center max-w-2xl m-0 leading-relaxed mb-5"
              style={{ color: subtitleColor }}
            >
              {subtitle}
            </p>
          )}

          {/* Square dots dividers */}
          <div className="flex items-center gap-1.5 justify-center">
            <span className="w-2 h-2 bg-[#62b359] rounded-sm" />
            <span className="w-2 h-2 bg-[#f1c40f] rounded-sm" />
            <span className="w-2 h-2 bg-[#3498db] rounded-sm" />
            <span className="w-2 h-2 bg-[#2c3e50] rounded-sm" />
          </div>
        </div>
      )}

      {/* Accordion list */}
      <div className="w-full max-w-[850px] mx-auto flex flex-col gap-4">
        {items.map((item, idx) => {
          const isOpen = openIndex === idx;
          const formattedNum = String(idx + 1).padStart(2, "0");

          return (
            <div
              key={item.id || idx}
              className="w-full rounded-xl border border-black/5 overflow-hidden transition-all duration-300"
              style={{ backgroundColor: isOpen ? activeItemBg : itemBg }}
            >
              {/* Header trigger bar */}
              <div
                className="w-full flex items-center justify-between p-4 sm:p-5 cursor-pointer select-none gap-4"
                onClick={() => handleToggle(idx)}
              >
                <div className="flex items-center gap-4">
                  {/* Automatic Numbering & Custom Icon block */}
                  <div
                    className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 font-bold text-sm transition-all duration-300"
                    style={{
                      backgroundColor: isOpen ? activeNumBg : numBg,
                      color: isOpen ? activeNumTextColor : numTextColor,
                    }}
                  >
                    {item.icon ? (
                      <Icon icon={item.icon} width="20" />
                    ) : (
                      formattedNum
                    )}
                  </div>

                  {/* Question Heading */}
                  <h4
                    className="text-[15.5px] font-bold m-0 leading-snug transition-colors duration-300"
                    style={{
                      color: isOpen ? activeQuestionColor : questionColor,
                      ...questionTyp,
                    }}
                  >
                    {item.question}
                  </h4>
                </div>

                {/* Right side collapsed/expanded state icon */}
                <div
                  className="shrink-0 transition-all duration-300"
                  style={{ color: isOpen ? activeQuestionColor : questionColor }}
                >
                  <Icon icon={isOpen ? expandedIcon : collapsedIcon} width="20" />
                </div>
              </div>

              {/* Collapsible Answer block */}
              <div
                className="transition-all duration-300 ease-in-out overflow-hidden"
                style={{
                  maxHeight: isOpen ? "800px" : "0px",
                  opacity: isOpen ? 1 : 0,
                }}
              >
                <div className="p-[0_24px_24px_80px] sm:p-[0_24px_24px_80px] box-border">
                  <div
                    className="text-[14.5px] leading-relaxed m-0 border-t border-gray-100 pt-4"
                    style={{
                      color: answerColor,
                      ...answerTyp,
                    }}
                    dangerouslySetInnerHTML={{ __html: item.answer }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ── Element Registry Definition ── */
const faqAccordionElement = {
  type: "colorexperts-faq-accordion",
  category: "colorexperts",
  label: "FAQ Accordion",
  icon: "solar:question-square-bold-duotone",

  schema: {
    content: {
      title: "FREQUENTLY ASKED QUESTIONS (FAQ)",
      subtitle: "",
      collapsedIcon: "solar:add-linear",
      expandedIcon: "solar:minimize-linear",
      items: [
        {
          id: "faq_1",
          question: "Industry Verticals that Require Background Removal and Editing Service-",
          answer: "All types of product-based companies require background removing and retouching services more or less. But e-commerce and retail businesses along with printing businesses enormously need this particular service. When e-commerce companies upload product photos on their website for sales and promotional activities, they require removing product photo backgrounds and doing necessary touch-ups for ensuring product consistency and appeal. This, in turn, persuades shoppers to make purchases easily. When it comes to retail businesses, they seek this service as a way of marketing their products both online and offline. When they create catalogs or user manuals, they look for photo background removal and touch-up service to remove distractions and add complementary visuals to the texts. Besides, pro photographers have a huge need for photo background cut-out and editing service as well.",
          icon: "",
        },
        {
          id: "faq_2",
          question: "Cases When Background Removing and Editing Service is Necessary-",
          answer: "Background removal is necessary when you want to highlight the main subject without distractions, display products on pure white backgrounds for online stores, create composites, or optimize image loading times.",
          icon: "",
        },
        {
          id: "faq_3",
          question: "Image Editing Services in which We Remove Background-",
          answer: "We offer clipping path, multi-clipping path, image masking, transparent background removal, shadow effects, and neck joint editing services.",
          icon: "",
        },
        {
          id: "faq_4",
          question: "Image Background Removal and Editing Service at Color Experts International, Inc.-",
          answer: "Color Experts International, Inc. provides high quality image background removal and clipping path services starting from just $0.49 per image with 24/7 client support and quick turnaround times.",
          icon: "",
        },
      ],
    },

    style: {
      headerColor: "#111827",
      subtitleColor: "#6b7280",
      itemBg: "#f8fafc",
      activeItemBg: "#ffffff",
      questionColor: "#1e293b",
      activeQuestionColor: "#0f766e",
      answerColor: "#475569",
      numBg: "#e2e8f0",
      activeNumBg: "#0f766e",
      numTextColor: "#475569",
      activeNumTextColor: "#ffffff",
      headerTypography: { fontSize: 28, fontSizeUnit: "px", fontWeight: "800" },
      questionTypography: { fontSize: 15.5, fontSizeUnit: "px", fontWeight: "700" },
      answerTypography: { fontSize: 14.5, fontSizeUnit: "px", fontWeight: "400" },
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
      section: "Header Settings",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Header Title" value={value || ""} onChange={onChange} />
          ),
        },
        {
          name: "subtitle",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Header Subtitle" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Accordion State Icons",
      controls: [
        {
          name: "collapsedIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Collapsed Icon (Closed)" value={value ?? "solar:add-linear"} onChange={onChange} />
          ),
        },
        {
          name: "expandedIcon",
          responsive: false,
          render: (value: any, onChange: any) => (
            <IconPicker label="Expanded Icon (Open)" value={value ?? "solar:minimize-linear"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Accordion FAQ list",
      controls: [
        {
          name: "items",
          responsive: false,
          render: (value: any, onChange: any) => (
            <div className="space-y-4">
              {(value || []).map((item: any, idx: number) => (
                <Section key={item.id || idx} label={`Item #${idx + 1}: ${item.question || ""}`}>
                  <div className="space-y-3 pt-2">
                    <div className="flex justify-end">
                      <button
                        type="button"
                        onClick={() => onChange((value || []).filter((_: any, i: number) => i !== idx))}
                        className="text-[11px] text-red-400 hover:text-red-600 cursor-pointer"
                      >
                        Remove FAQ Row
                      </button>
                    </div>

                    <Text
                      label="Question text"
                      value={item.question || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], question: v }; onChange(u);
                      }}
                    />

                    <IconPicker
                      label="Optional custom item icon (overrides numbering)"
                      value={item.icon || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], icon: v }; onChange(u);
                      }}
                    />

                    <Textarea
                      label="Answer text (supports HTML tags)"
                      value={item.answer || ""}
                      onChange={(v: string) => {
                        const u = [...value]; u[idx] = { ...u[idx], answer: v }; onChange(u);
                      }}
                      rows={5}
                    />
                  </div>
                </Section>
              ))}

              <button
                type="button"
                onClick={() => {
                  const newItem: FaqItem = {
                    id: `faq_${Date.now()}`,
                    question: "New Accordion Question",
                    answer: "Accordion answer goes here.",
                    icon: "",
                  };
                  onChange([...(value || []), newItem]);
                }}
                className="w-full flex items-center justify-center gap-1 py-2.5 bg-gray-700 hover:bg-gray-800 text-white rounded text-[13px] font-semibold cursor-pointer transition-colors"
              >
                + Add FAQ Accordion Row
              </button>
            </div>
          ),
        },
      ],
    },

    // ═══════════════════ STYLE TAB ══════════════════
    {
      tab: "Style",
      section: "Header Colors Theme",
      controls: [
        {
          name: "headerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Title Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "subtitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Subtitle Color" value={value ?? "#6b7280"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Accordion Row Colors",
      controls: [
        {
          name: "itemBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Normal Row Background" value={value ?? "#f8fafc"} onChange={onChange} />
          ),
        },
        {
          name: "activeItemBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Expanded Row Background" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
        {
          name: "questionColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Normal Question Color" value={value ?? "#1e293b"} onChange={onChange} />
          ),
        },
        {
          name: "activeQuestionColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Expanded Question Color" value={value ?? "#0f766e"} onChange={onChange} />
          ),
        },
        {
          name: "answerColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Answer Text Color" value={value ?? "#475569"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Left Number/Icon Block styling",
      controls: [
        {
          name: "numBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Normal Block Background" value={value ?? "#e2e8f0"} onChange={onChange} />
          ),
        },
        {
          name: "activeNumBg",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Expanded Block Background" value={value ?? "#0f766e"} onChange={onChange} />
          ),
        },
        {
          name: "numTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Normal Block Text Color" value={value ?? "#475569"} onChange={onChange} />
          ),
        },
        {
          name: "activeNumTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Expanded Block Text Color" value={value ?? "#ffffff"} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography Settings",
      controls: [
        {
          name: "headerTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Header Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "questionTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Question Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "answerTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Answer Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <FaqAccordionFrontend element={element} />,
};

export default faqAccordionElement;
