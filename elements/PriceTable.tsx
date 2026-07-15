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

function PriceTableFrontend({ element }: { element: any }) {
  const s = element.schema;

  // Content configurations
  const title: string = s.content?.title || "PHOTO RETOUCHING SERVICES:";
  const columns: any[] = s.content?.columns || [];
  const sections: any[] = s.content?.sections || [];

  // Style configurations
  const collapsedCount: number = s.style?.collapsedCount ?? 12;
  const tableBorderColor: string = s.style?.tableBorderColor || "rgba(0, 0, 0, 0.08)";
  const cellPadding: number = s.style?.cellPadding ?? 12;

  const headerTitleColor: string = s.style?.headerTitleColor || "#111827";
  const headerTitleTyp = getTypographyStyles(s.style?.headerTitleTypography || {});

  const featureTextColor: string = s.style?.featureTextColor || "#1f2937";
  const featureTextTyp = getTypographyStyles(s.style?.featureTextTypography || {});

  // Advanced dimensions
  const margin = s.advanced?.margin || {};
  const padding = s.advanced?.padding || {};
  const marginStyle = getDimensionsStyles(margin, "margin");
  const paddingStyle = getDimensionsStyles(padding, "padding");

  // React state for show more/less and active responsive mobile tab
  const [isExpanded, setIsExpanded] = useState<boolean>(false);
  const [activeMobileColIdx, setActiveMobileColIdx] = useState<number>(0);

  const elementId = `price-table-${element.id}`;

  // Flat list of all features to calculate collapsed rows
  const allRows: { type: "section" | "feature"; sectionTitle?: string; featureName?: string; values?: boolean[]; sectionColorDetails?: any }[] = [];
  sections.forEach((sect) => {
    allRows.push({
      type: "section",
      sectionTitle: sect.sectionTitle,
      sectionColorDetails: columns.map((col) => ({
        name: col.name,
        color: col.color,
        lightColor: col.lightColor,
      })),
    });
    if (sect.features) {
      sect.features.forEach((feat: any) => {
        allRows.push({
          type: "feature",
          featureName: feat.name,
          values: feat.values || [false, false, false],
        });
      });
    }
  });

  const visibleRows = isExpanded ? allRows : allRows.slice(0, collapsedCount);
  const showButton = allRows.length > collapsedCount;

  return (
    <div
      className={`w-full ${elementId}`}
      style={{
        ...marginStyle,
        ...paddingStyle,
      }}
    >
      <style>{`
        .${elementId} table {
          border-collapse: collapse;
          width: 100%;
        }
        .${elementId} th, .${elementId} td {
          border: 1px solid ${tableBorderColor};
          padding: ${cellPadding}px;
          text-align: center;
          vertical-align: middle;
        }
        .${elementId} td.feature-label {
          text-align: left;
          font-weight: 500;
        }
        .${elementId} .popular-badge {
          position: absolute;
          top: 12px;
          right: -25px;
          background-color: #f97316;
          color: white;
          font-size: 9px;
          font-weight: 800;
          padding: 4px 28px;
          transform: rotate(45deg);
          box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          text-transform: uppercase;
          letter-spacing: 0.05em;
        }
      `}</style>

      {/* ── Desktop & Tablet Price Table Layout (Hidden on Mobile) ── */}
      <div className="hidden md:block w-full overflow-x-auto">
        <table className="w-full min-w-[768px]">
          <thead>
            {/* Header images layer */}
            <tr>
              <th className="bg-transparent border-0 text-left w-1/4">
                {title && (
                  <h3
                    className="text-lg font-bold uppercase tracking-wider mb-2"
                    style={{ color: headerTitleColor, ...headerTitleTyp }}
                  >
                    {title}
                  </h3>
                )}
              </th>
              {columns.map((col, idx) => (
                <th key={col.id || idx} className="p-0 border-0 overflow-hidden relative" style={{ width: "25%" }}>
                  {col.popular && <span className="popular-badge">Popular</span>}
                  <div className="w-full h-[140px] overflow-hidden">
                    {col.image && (
                      <img
                        src={col.image}
                        alt={col.name}
                        className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                      />
                    )}
                  </div>
                </th>
              ))}
            </tr>

            {/* Header names and prices row */}
            <tr>
              <th className="bg-transparent border-t-0 text-left border-l-0 border-r-0"></th>
              {columns.map((col, idx) => (
                <th
                  key={col.id || idx}
                  className="text-white text-center py-4 relative"
                  style={{ backgroundColor: col.color }}
                >
                  <div className="font-extrabold text-xl tracking-tight leading-none">
                    {col.name} {col.price}
                  </div>
                  {col.galleryLink && (
                    <a
                      href={col.galleryLink}
                      className="text-xs text-white/90 hover:text-white underline mt-1.5 block font-medium"
                    >
                      View gallery
                    </a>
                  )}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {visibleRows.map((row, idx) => {
              if (row.type === "section") {
                return (
                  <tr key={`sec-${idx}`}>
                    <td className="bg-gray-100 text-gray-900 font-extrabold text-xs uppercase tracking-wider text-left border-r-0">
                      {row.sectionTitle}
                    </td>
                    {row.sectionColorDetails.map((col: any, colIdx: number) => (
                      <td
                        key={`sec-col-${colIdx}`}
                        className="text-white font-extrabold text-xs uppercase tracking-wider border-l-0 border-r-0"
                        style={{ backgroundColor: col.lightColor || col.color }}
                      >
                        {col.name}
                      </td>
                    ))}
                  </tr>
                );
              } else {
                return (
                  <tr key={`feat-${idx}`} className="hover:bg-gray-50/50 transition-colors duration-150">
                    <td
                      className="feature-label text-sm leading-snug"
                      style={{ color: featureTextColor, ...featureTextTyp }}
                    >
                      {row.featureName}
                    </td>
                    {row.values?.map((val, valIdx) => (
                      <td key={`val-${valIdx}`}>
                        {val ? (
                          <div className="flex items-center justify-center">
                            <Icon icon="lucide:check" className="text-emerald-500 stroke-[3.5]" width="18" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Icon icon="lucide:x" className="text-rose-500 stroke-[3.5]" width="16" />
                          </div>
                        )}
                      </td>
                    ))}
                  </tr>
                );
              }
            })}

            {/* Bottom expanded footer CTA row */}
            {isExpanded && (
              <tr>
                <td className="border-0 bg-transparent"></td>
                {columns.map((col, idx) => (
                  <td
                    key={`footer-col-${idx}`}
                    className="p-6 text-center align-top relative"
                    style={{ backgroundColor: `${col.color}0a` }}
                  >
                    <div
                      className="font-extrabold text-[13px] uppercase tracking-wide mb-4 whitespace-pre-line"
                      style={{ color: col.color }}
                    >
                      {col.bottomSubtext || `${col.name} / SERVICES`}
                    </div>
                    {col.btnText && (
                      <a
                        href={col.btnLink || "#"}
                        className="inline-block w-full py-2.5 px-4 text-xs font-bold rounded shadow-sm hover:shadow-md transition-all duration-300 border mb-3 text-center"
                        style={{
                          backgroundColor: col.btnBg || "#ffffff",
                          color: col.btnColor || "#1f2937",
                          borderColor: tableBorderColor,
                        }}
                      >
                        {col.btnText}
                      </a>
                    )}
                    {col.footerNotice && (
                      <div className="text-[10px] text-gray-500 leading-normal">{col.footerNotice}</div>
                    )}
                  </td>
                ))}
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Mobile Pricing Table Layout with Tab Systems (Visible on Mobile Only) ── */}
      <div className="block md:hidden w-full">
        {title && (
          <h3
            className="text-base font-bold uppercase tracking-wider mb-4"
            style={{ color: headerTitleColor, ...headerTitleTyp }}
          >
            {title}
          </h3>
        )}

        {/* Tab switchers row */}
        <div className="flex w-full rounded-t-lg overflow-hidden border border-b-0" style={{ borderColor: tableBorderColor }}>
          {columns.map((col, idx) => (
            <button
              key={`mob-tab-${idx}`}
              type="button"
              onClick={() => setActiveMobileColIdx(idx)}
              className="flex-1 py-3 text-center relative flex flex-col items-center justify-center transition-all duration-300"
              style={{
                backgroundColor: activeMobileColIdx === idx ? col.color : "#f9fafb",
                color: activeMobileColIdx === idx ? "#ffffff" : "#4b5563",
              }}
            >
              <span className="font-extrabold text-sm tracking-tight">{col.name}</span>
              <span className={`text-[10px] font-bold mt-0.5 ${activeMobileColIdx === idx ? "text-white/90" : "text-gray-500"}`}>
                {col.price}
              </span>
              {col.popular && (
                <span className="absolute top-0 right-0 bg-orange-500 text-[8px] font-bold text-white px-1.5 py-0.5 rounded-bl uppercase">
                  POP
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Dynamic Mobile Feature List */}
        <div className="border border-t-0 rounded-b-lg overflow-hidden" style={{ borderColor: tableBorderColor }}>
          <table className="w-full">
            <tbody>
              {visibleRows.map((row, idx) => {
                if (row.type === "section") {
                  return (
                    <tr key={`mob-sec-${idx}`}>
                      <td className="bg-gray-100 text-gray-900 font-extrabold text-xs uppercase tracking-wider text-left border-r-0">
                        {row.sectionTitle}
                      </td>
                      <td
                        className="text-white font-extrabold text-xs uppercase tracking-wider border-l-0 text-center"
                        style={{ backgroundColor: columns[activeMobileColIdx]?.lightColor || columns[activeMobileColIdx]?.color }}
                      >
                        {columns[activeMobileColIdx]?.name}
                      </td>
                    </tr>
                  );
                } else {
                  return (
                    <tr key={`mob-feat-${idx}`} className="hover:bg-gray-50/50 transition-colors duration-150">
                      <td
                        className="feature-label text-xs leading-snug w-[80%]"
                        style={{ color: featureTextColor, ...featureTextTyp }}
                      >
                        {row.featureName}
                      </td>
                      <td className="text-center w-[20%]">
                        {row.values?.[activeMobileColIdx] ? (
                          <div className="flex items-center justify-center">
                            <Icon icon="lucide:check" className="text-emerald-500 stroke-[3.5]" width="16" />
                          </div>
                        ) : (
                          <div className="flex items-center justify-center">
                            <Icon icon="lucide:x" className="text-rose-500 stroke-[3.5]" width="14" />
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                }
              })}

              {/* Bottom expanded footer CTA (Mobile view) */}
              {isExpanded && columns[activeMobileColIdx] && (
                <tr>
                  <td
                    colSpan={2}
                    className="p-5 text-center align-top relative"
                    style={{ backgroundColor: `${columns[activeMobileColIdx].color}06` }}
                  >
                    <div
                      className="font-extrabold text-[12px] uppercase tracking-wide mb-3"
                      style={{ color: columns[activeMobileColIdx].color }}
                    >
                      {columns[activeMobileColIdx].bottomSubtext || `${columns[activeMobileColIdx].name} / SERVICES`}
                    </div>
                    {columns[activeMobileColIdx].btnText && (
                      <a
                        href={columns[activeMobileColIdx].btnLink || "#"}
                        className="inline-block w-full py-2 px-4 text-xs font-bold rounded shadow-sm hover:shadow-md transition-all duration-300 border mb-2 text-center"
                        style={{
                          backgroundColor: columns[activeMobileColIdx].btnBg || "#ffffff",
                          color: columns[activeMobileColIdx].btnColor || "#1f2937",
                          borderColor: tableBorderColor,
                        }}
                      >
                        {columns[activeMobileColIdx].btnText}
                      </a>
                    )}
                    {columns[activeMobileColIdx].footerNotice && (
                      <div className="text-[9px] text-gray-500 leading-normal">{columns[activeMobileColIdx].footerNotice}</div>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ── Show More / Show Less Toggle Button ── */}
      {showButton && (
        <div className="w-full flex justify-center mt-6">
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-2 px-6 py-2.5 rounded-full border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-bold text-xs shadow-sm hover:shadow transition-all duration-300 uppercase cursor-pointer"
          >
            <Icon icon={isExpanded ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} width="14" />
            <span>{isExpanded ? "Show Less" : "Show More"}</span>
            <Icon icon={isExpanded ? "solar:arrow-up-linear" : "solar:arrow-down-linear"} width="14" />
          </button>
        </div>
      )}
    </div>
  );
}

const priceTableElement = {
  type: "price-table",
  category: "colorexperts",
  label: "Pricing Feature Table",
  icon: "solar:ranking-bold-duotone",

  schema: {
    content: {
      title: "PHOTO RETOUCHING SERVICES:",
      columns: [
        {
          id: "col-mini",
          name: "MINI",
          price: "$3",
          image: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80",
          color: "#22c55e",
          lightColor: "#86efac",
          galleryLink: "/gallery/mini",
          popular: false,
          bottomSubtext: "MINI / RETOUCH\n$3/photo",
          btnText: "GET A FREE TRIAL",
          btnLink: "/free-trial",
          btnColor: "#22c55e",
          btnBg: "#ffffff",
          footerNotice: "No credit card required. Cancel anytime.",
        },
        {
          id: "col-midi",
          name: "MIDI",
          price: "$9",
          image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80",
          color: "#a855f7",
          lightColor: "#d8b4fe",
          galleryLink: "/gallery/midi",
          popular: true,
          bottomSubtext: "MIDI / PREMIUM\n$9/photo",
          btnText: "PLACE YOUR ORDER",
          btnLink: "/order",
          btnColor: "#ffffff",
          btnBg: "#a855f7",
          footerNotice: "No credit card required. Cancel anytime.",
        },
        {
          id: "col-maxi",
          name: "MAXI",
          price: "$15",
          image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&auto=format&fit=crop&q=80",
          color: "#ec4899",
          lightColor: "#fbcfe8",
          galleryLink: "/gallery/maxi",
          popular: false,
          bottomSubtext: "MAXI / ULTIMATE\n$15/photo",
          btnText: "PLACE YOUR ORDER",
          btnLink: "/order",
          btnColor: "#ffffff",
          btnBg: "#ec4899",
          footerNotice: "No credit card required. Cancel anytime.",
        },
      ],
      sections: [
        {
          sectionTitle: "WORKING WITH THE RAW FILES",
          features: [
            { name: "White balance correction", values: [true, true, true] },
            { name: "Exposure correction", values: [true, true, true] },
            { name: "Toning according to a reference", values: [true, true, true] },
            { name: "Detailed color/expo correction", values: [false, false, true] },
            { name: "Sharpening", values: [false, true, true] },
          ],
        },
        {
          sectionTitle: "WORKING WITH THE BACKGROUND",
          features: [
            { name: "Cleaning, extending of the background", values: [false, true, true] },
            { name: "Background replacement", values: [false, false, true] },
            { name: "Clipping path", values: [false, true, true] },
            { name: "Horizon alignment", values: [true, true, true] },
          ],
        },
        {
          sectionTitle: "RETOUCH / SHAPE CORRECTION",
          features: [
            { name: "Light shape correction (general)", values: [true, true, true] },
            { name: "Detailed shape correction", values: [false, true, true] },
            { name: "Esthetic shaping of face and figure", values: [false, true, true] },
          ],
        },
        {
          sectionTitle: "SKIN RETOUCH",
          features: [
            { name: "Toning", values: [true, true, true] },
          ],
        },
      ],
    },

    style: {
      collapsedCount: 12,
      tableBorderColor: "rgba(0, 0, 0, 0.08)",
      cellPadding: 12,
      headerTitleColor: "#111827",
      headerTitleTypography: {
        fontSize: 16,
        fontWeight: "700",
      },
      featureTextColor: "#1f2937",
      featureTextTypography: {
        fontSize: 14,
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
      section: "Header Settings",
      controls: [
        {
          name: "title",
          responsive: false,
          render: (value: any, onChange: any) => (
            <Text label="Heading Title Text" value={value || ""} onChange={onChange} />
          ),
        },
      ],
    },

    {
      tab: "Content",
      section: "Table Columns Tiers",
      controls: [
        {
          name: "columns",
          responsive: false,
          render: (value: any, onChange: any) => {
            const list = value || [];
            return (
              <div className="space-y-4 pt-1">
                <span className="text-xs font-semibold text-gray-400">Pricing Columns List</span>
                {list.map((col: any, idx: number) => (
                  <Section key={col.id || idx} label={col.name || `Column #${idx + 1}`}>
                    <div className="space-y-3 pt-2">
                      <Text
                        label="Column Name"
                        value={col.name || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], name: v };
                          onChange(next);
                        }}
                      />
                      <Text
                        label="Column Price"
                        value={col.price || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], price: v };
                          onChange(next);
                        }}
                      />
                      <ImageGallery
                        label="Column Header Image"
                        value={col.image || ""}
                        onChange={(img) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], image: img };
                          onChange(next);
                        }}
                      />
                      <ColorPickerPopup
                        label="Theme Color"
                        value={col.color || "#22c55e"}
                        onChange={(c) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], color: c };
                          onChange(next);
                        }}
                      />
                      <ColorPickerPopup
                        label="Section Header Background Color"
                        value={col.lightColor || "#86efac"}
                        onChange={(c) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], lightColor: c };
                          onChange(next);
                        }}
                      />
                      <Text
                        label="Gallery URL Link"
                        value={col.galleryLink || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], galleryLink: v };
                          onChange(next);
                        }}
                      />
                      <Select
                        label="Is Popular Flag"
                        value={col.popular ? "yes" : "no"}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], popular: v === "yes" };
                          onChange(next);
                        }}
                        options={[
                          { value: "no", label: "No" },
                          { value: "yes", label: "Yes (Shows Popular Tag)" },
                        ]}
                      />
                      <Textarea
                        label="Bottom Footer Subtext"
                        value={col.bottomSubtext || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], bottomSubtext: v };
                          onChange(next);
                        }}
                        rows={2}
                      />
                      <Text
                        label="Button Action Label"
                        value={col.btnText || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], btnText: v };
                          onChange(next);
                        }}
                      />
                      <Text
                        label="Button Destination Link"
                        value={col.btnLink || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], btnLink: v };
                          onChange(next);
                        }}
                      />
                      <ColorPickerPopup
                        label="Button Text Color"
                        value={col.btnColor || "#1f2937"}
                        onChange={(c) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], btnColor: c };
                          onChange(next);
                        }}
                      />
                      <ColorPickerPopup
                        label="Button Background Color"
                        value={col.btnBg || "#ffffff"}
                        onChange={(c) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], btnBg: c };
                          onChange(next);
                        }}
                      />
                      <Text
                        label="Footer Bottom Notice"
                        value={col.footerNotice || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[idx] = { ...next[idx], footerNotice: v };
                          onChange(next);
                        }}
                      />
                    </div>
                  </Section>
                ))}
              </div>
            );
          },
        },
      ],
    },

    {
      tab: "Content",
      section: "Sections & Features Rows",
      controls: [
        {
          name: "sections",
          responsive: false,
          render: (value: any, onChange: any) => {
            const list = value || [];
            return (
              <div className="space-y-4 pt-1">
                <span className="text-xs font-semibold text-gray-400">Sections Repeater List</span>
                {list.map((sec: any, secIdx: number) => (
                  <Section key={secIdx} label={sec.sectionTitle || `Section #${secIdx + 1}`}>
                    <div className="space-y-3 pt-2">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => onChange(list.filter((_: any, i: number) => i !== secIdx))}
                          className="w-7 h-7 flex items-center justify-center rounded-lg border border-gray-700 bg-gray-800 text-gray-400 hover:text-red-400 cursor-pointer"
                        >
                          <Icon icon="solar:trash-bin-trash-linear" width="14" />
                        </button>
                      </div>

                      <Text
                        label="Section Title"
                        value={sec.sectionTitle || ""}
                        onChange={(v) => {
                          const next = [...list];
                          next[secIdx] = { ...next[secIdx], sectionTitle: v };
                          onChange(next);
                        }}
                      />

                      {/* Features under section */}
                      <div className="space-y-3 bg-gray-50 p-3 rounded border border-gray-200">
                        <span className="text-xs font-bold text-gray-500">Rows in this section</span>
                        {(sec.features || []).map((feat: any, featIdx: number) => (
                          <div key={featIdx} className="space-y-2 border-b border-gray-200 pb-3 last:border-b-0 last:pb-0">
                            <div className="flex justify-between items-center gap-2">
                              <span className="text-xs font-semibold text-gray-600">Row #{featIdx + 1}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const nextFeatures = (sec.features || []).filter((_: any, i: number) => i !== featIdx);
                                  const next = [...list];
                                  next[secIdx] = { ...next[secIdx], features: nextFeatures };
                                  onChange(next);
                                }}
                                className="w-5 h-5 flex items-center justify-center rounded border border-gray-300 text-gray-400 hover:text-red-400 cursor-pointer text-[10px]"
                              >
                                <Icon icon="solar:trash-bin-trash-linear" width="10" />
                              </button>
                            </div>
                            <Text
                              label="Feature Name"
                              value={feat.name || ""}
                              onChange={(v) => {
                                const nextFeatures = [...(sec.features || [])];
                                nextFeatures[featIdx] = { ...nextFeatures[featIdx], name: v };
                                const next = [...list];
                                next[secIdx] = { ...next[secIdx], features: nextFeatures };
                                onChange(next);
                              }}
                            />
                            {/* Checkmark values for each column */}
                            <div className="grid grid-cols-3 gap-2">
                              {[0, 1, 2].map((colNum) => (
                                <button
                                  key={colNum}
                                  type="button"
                                  onClick={() => {
                                    const nextVals = [...(feat.values || [false, false, false])];
                                    nextVals[colNum] = !nextVals[colNum];
                                    const nextFeatures = [...(sec.features || [])];
                                    nextFeatures[featIdx] = { ...nextFeatures[featIdx], values: nextVals };
                                    const next = [...list];
                                    next[secIdx] = { ...next[secIdx], features: nextFeatures };
                                    onChange(next);
                                  }}
                                  className={`py-1 text-[10px] font-bold border rounded cursor-pointer ${
                                    feat.values?.[colNum]
                                      ? "bg-emerald-50 text-emerald-600 border-emerald-300"
                                      : "bg-rose-50 text-rose-600 border-rose-300"
                                  }`}
                                >
                                  Col #{colNum + 1}: {feat.values?.[colNum] ? "Yes" : "No"}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={() => {
                            const nextFeatures = [
                              ...(sec.features || []),
                              { name: "New Feature", values: [true, true, true] },
                            ];
                            const next = [...list];
                            next[secIdx] = { ...next[secIdx], features: nextFeatures };
                            onChange(next);
                          }}
                          className="w-full py-1.5 bg-gray-200 hover:bg-gray-300 rounded text-[10px] font-bold text-gray-700 cursor-pointer text-center"
                        >
                          + Add Row
                        </button>
                      </div>
                    </div>
                  </Section>
                ))}

                <button
                  type="button"
                  onClick={() => {
                    const next = [
                      ...list,
                      {
                        sectionTitle: "New Section",
                        features: [],
                      },
                    ];
                    onChange(next);
                  }}
                  className="w-full py-2 bg-gray-700 hover:bg-gray-800 text-white rounded text-xs font-semibold cursor-pointer text-center"
                >
                  + Add New Section
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
      section: "Layout Settings",
      controls: [
        {
          name: "collapsedCount",
          responsive: false,
          render: (value: any, onChange: any) => (
            <NumberControl label="Rows Shown Initially (Collapsed Count)" value={value ?? 12} onChange={onChange} min={2} max={100} />
          ),
        },
        {
          name: "tableBorderColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Grid Border Color" value={value ?? "rgba(0, 0, 0, 0.08)"} onChange={onChange} />
          ),
        },
        {
          name: "cellPadding",
          responsive: true,
          render: (value: any, onChange: any) => (
            <NumberControl label="Cell Spacing padding (px)" value={value ?? 12} onChange={onChange} min={4} max={32} />
          ),
        },
      ],
    },

    {
      tab: "Style",
      section: "Typography & Colors",
      controls: [
        {
          name: "headerTitleColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Header Title Color" value={value ?? "#111827"} onChange={onChange} />
          ),
        },
        {
          name: "headerTitleTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Header Title Typography" value={value} onChange={onChange} />
          ),
        },
        {
          name: "featureTextColor",
          responsive: false,
          render: (value: any, onChange: any) => (
            <ColorPickerPopup label="Feature Row Text Color" value={value ?? "#1f2937"} onChange={onChange} />
          ),
        },
        {
          name: "featureTextTypography",
          responsive: true,
          render: (value: any, onChange: any) => (
            <Typography label="Feature Row Typography" value={value} onChange={onChange} />
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

  render: (element: any) => <PriceTableFrontend element={element} />,
};

export default priceTableElement;
