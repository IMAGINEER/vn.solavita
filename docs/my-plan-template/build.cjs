/**
 * Generate a freely-editable Word template that mirrors the /my-plan
 * page layout, structure, and brand styling.
 *
 * Run with: node docs/my-plan-template/build.cjs
 *
 * Output: docs/my-plan-template/my-plan-template.docx
 *
 * Design intent
 * ─────────────
 * - Brand colours mirror /my-plan (uk-navy / uk-slate / uk-teal-dark /
 *   uk-teal / uk-emerald / uk-line / uk-teal-soft).
 * - Uses built-in Heading1/2/3 styles so the document opens with a real
 *   navigable outline in Word.
 * - Section blocks use plain paragraphs + tables (NOT unicode glyphs /
 *   text-as-image). Every number / label is editable text.
 * - UK A4 page, 1" margins.
 *
 * Edit guidance
 * ─────────────
 * - The 4 plan prices in `PLANS` (lines 36-49) drive the
 *   "Choose your plan" + "Plan summary" tables. Update them in Word and
 *   the rest of the doc stays consistent.
 * - The savings/ROI rows in `savingsRows` (lines 60-90) are placeholder
 *   numbers from the Pro tier — replace with the live values from
 *   /my-plan's ROI engine.
 */
const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  HeadingLevel,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  BorderStyle,
  WidthType,
  ShadingType,
  PageOrientation,
  PageBreak,
  LevelFormat,
} = require('docx')
const fs = require('node:fs')
const path = require('node:path')

/* ────────────────────────────────────────────────────────────────────────
   Brand palette — mirrors app/globals.css `@theme` block
   ──────────────────────────────────────────────────────────────────────── */
const C = {
  navy: '0F172A',
  navyDeep: '0A1628',
  slate: '64748B',
  slateLight: '94A3B8',
  teal: '14B8A6',
  tealDark: '0F766E',
  tealSoft: 'CCFBF1',
  emerald: '10B981',
  emeraldDark: '047857',
  emeraldLight: 'D1FAE5',
  line: 'E2E8F0',
  lineLight: 'F1F5F9',
  pageBg: 'F7F9FC',
  white: 'FFFFFF',
}

const FONT = 'Arial' // universally supported; matches docx-js skill defaults

/* ────────────────────────────────────────────────────────────────────────
   Small helpers
   ──────────────────────────────────────────────────────────────────────── */

const p = (text, opts = {}) =>
  new Paragraph({
    spacing: { after: 120 },
    ...opts,
    children: [new TextRun({ text, ...opts.run })],
  })

const h = (level, text, opts = {}) =>
  new Paragraph({
    heading: level,
    spacing: { before: opts.before ?? 200, after: opts.after ?? 120 },
    ...opts,
    children: [new TextRun({ text, bold: true, color: C.navy, ...opts.run })],
  })

const cell = ({
  text,
  bold = false,
  color = C.navy,
  size = 20,
  align = AlignmentType.LEFT,
  shading,
  width,
  borderColor = C.line,
}) =>
  new TableCell({
    width: { size: width, type: WidthType.DXA },
    borders: {
      top: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      bottom: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      left: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
      right: { style: BorderStyle.SINGLE, size: 6, color: borderColor },
    },
    shading: shading ? { fill: shading, type: ShadingType.CLEAR } : undefined,
    margins: { top: 100, bottom: 100, left: 140, right: 140 },
    children: [
      new Paragraph({
        alignment: align,
        spacing: { after: 0 },
        children: [
          new TextRun({
            text: String(text),
            bold,
            color,
            size,
            font: FONT,
          }),
        ],
      }),
    ],
  })

/* ────────────────────────────────────────────────────────────────────────
   Plan data (mirror of /my-plan/_lib/calc.ts PLANS)
   Editable in Word — these are the four tiers.
   ──────────────────────────────────────────────────────────────────────── */
const PLANS = [
  { name: 'Home Energy One',   sub: 'Solar only',            panels: 8,  battery: '—',  inverter: '3.6 kW',  price: '£5,099' },
  { name: 'Home Energy Pro',   sub: 'Solar + Storage',       panels: 8,  battery: '5.12 kWh',  inverter: '3.6 kW',  price: '£6,999' },
  { name: 'Home Energy Max',   sub: 'Solar + Storage + EV',  panels: 12, battery: '5.12 kWh',  inverter: '6 kW',    price: '£7,899' },
  { name: 'Home Energy Ultra', sub: 'Whole-home energy',     panels: 12, battery: '10.24 kWh', inverter: '6 kW',    price: '£9,399' },
]

/* Savings rows from the demo consultation profile (London, 1 person, low
   use, EV charger → Pro tier). Replace with live values per user. */
const SAVINGS = [
  { label: 'Annual Saving',          value: '£1,140',    sub: 'Estimated per year',            highlight: true  },
  { label: 'Estimated Payback',      value: '6.1 years', sub: 'Years to break even',           highlight: false },
  { label: '30-Year Return',          value: '£21,800',   sub: 'Net lifetime saving',           highlight: true  },
  { label: 'Annual Solar Generation',value: '3,830 kWh', sub: 'Estimated per year',            highlight: false },
  { label: 'Export Income',           value: '£74',       sub: 'SEG export tariff',             highlight: true  },
  { label: 'ROI',                     value: '211%',      sub: '30-year return on investment',  highlight: true  },
]

/* ────────────────────────────────────────────────────────────────────────
   Document
   ──────────────────────────────────────────────────────────────────────── */

const breadcrumb = [
  new Paragraph({
    spacing: { after: 60 },
    children: [
      new TextRun({ text: 'Home', color: C.slate, size: 18, font: FONT }),
      new TextRun({ text: '  /  ', color: C.slateLight, size: 18, font: FONT }),
      new TextRun({ text: 'My Plan', color: C.slate, size: 18, font: FONT }),
    ],
  }),
]

/* Hero band — title + subtitle + accent underline */
const hero = [
  new Paragraph({
    spacing: { before: 200, after: 80 },
    children: [
      new TextRun({
        text: 'Your Initial Solar Plan',
        bold: true,
        size: 48, // 24pt
        color: C.navyDeep,
        font: FONT,
      }),
    ],
  }),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: 'A personalised system designed around your home and energy needs.',
        size: 22,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
  // Accent underline — teal → emerald gradient bar (single cell with shading)
  new Table({
    width: { size: 1100, type: WidthType.DXA }, // ~80pt
    columnWidths: [1100],
    borders: {
      top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
      right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
    },
    rows: [
      new TableRow({
        height: { value: 60, rule: 'exact' },
        children: [
          new TableCell({
            width: { size: 1100, type: WidthType.DXA },
            shading: { fill: C.tealDark, type: ShadingType.CLEAR },
            borders: {
              top:    { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              bottom: { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              left:   { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
              right:  { style: BorderStyle.NONE, size: 0, color: 'FFFFFF' },
            },
            children: [new Paragraph({ children: [new TextRun({ text: '' })] })],
          }),
        ],
      }),
    ],
  }),
  // Vertical gap after accent
  new Paragraph({ spacing: { after: 240 }, children: [new TextRun({ text: '' })] }),
]

/* Home details card — single-row card with region / house / usage + Edit */
const homeDetails = [
  h(HeadingLevel.HEADING_2, 'Your home'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: C.white, type: ShadingType.CLEAR },
            borders: {
              top:    { style: BorderStyle.SINGLE, size: 6, color: C.line },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line },
              left:   { style: BorderStyle.SINGLE, size: 6, color: C.line },
              right:  { style: BorderStyle.SINGLE, size: 6, color: C.line },
            },
            margins: { top: 200, bottom: 200, left: 240, right: 240 },
            children: [
              new Paragraph({
                spacing: { after: 80 },
                children: [
                  new TextRun({
                    text: 'Region · House type · Household size · Roof type',
                    bold: true,
                    size: 22,
                    color: C.navy,
                    font: FONT,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 60 },
                children: [
                  new TextRun({
                    text: 'England - London  ·  Semi-detached  ·  1 person  ·  Hipped',
                    size: 22,
                    color: C.slate,
                    font: FONT,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 120 },
                children: [
                  new TextRun({
                    text: 'Low use  ·  EV charger',
                    size: 22,
                    color: C.slate,
                    font: FONT,
                  }),
                ],
              }),
              new Paragraph({
                spacing: { after: 0 },
                children: [
                  new TextRun({
                    text: '[ Edit details ]',
                    bold: true,
                    size: 20,
                    color: C.tealDark,
                    font: FONT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
]

/* "Your system" heading + 3 product cards */
const yourSystem = [
  h(HeadingLevel.HEADING_1, 'Your system'),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: '✓  Recommended for your home',
        bold: true,
        size: 20,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({
        children: [
          cell({ text: 'Solar panels',     bold: true, color: C.navy,     size: 22, shading: C.white,     width: 3120 }),
          cell({ text: 'Battery',           bold: true, color: C.navy,     size: 22, shading: C.white,     width: 3120 }),
          cell({ text: 'Inverter',          bold: true, color: C.navy,     size: 22, shading: C.white,     width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: '8 × 460W modules',   color: C.slate,    size: 20, shading: C.white,     width: 3120 }),
          cell({ text: '5.12 kWh storage',   color: C.slate,    size: 20, shading: C.white,     width: 3120 }),
          cell({ text: '3.6 kW inverter',    color: C.slate,    size: 20, shading: C.white,     width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: '8 modules',  bold: true, color: C.tealDark, size: 28, shading: C.white, width: 3120 }),
          cell({ text: '5.12 kWh',   bold: true, color: C.tealDark, size: 28, shading: C.white, width: 3120 }),
          cell({ text: '3.6 kW',     bold: true, color: C.tealDark, size: 28, shading: C.white, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Change plan ›', color: C.teal, size: 20, shading: C.white, width: 3120 }),
          cell({ text: 'Change plan ›', color: C.teal, size: 20, shading: C.white, width: 3120 }),
          cell({ text: 'Change plan ›', color: C.teal, size: 20, shading: C.white, width: 3120 }),
        ],
      }),
    ],
  }),
]

/* Choose your plan — 4 plans in a 2×2 grid */
const choosePlan = [
  h(HeadingLevel.HEADING_1, 'Choose your plan'),
  new Paragraph({
    spacing: { after: 160 },
    children: [
      new TextRun({
        text: 'Pick one of four ready-made plans. Each plan pairs a fixed solar array, battery and inverter — they are bundled together, so the whole configuration switches as one. ROI updates instantly.',
        size: 22,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
]

// 4-plan grid: 2 rows × 2 cols
const planRows = []
for (let i = 0; i < PLANS.length; i += 2) {
  const left = PLANS[i]
  const right = PLANS[i + 1]
  // Top row: name + subtitle
  planRows.push(
    new TableRow({
      children: [
        cell({ text: left.name,    bold: true, color: C.navy, size: 24, shading: C.tealSoft, width: 4680 }),
        cell({ text: right.name,   bold: true, color: C.navy, size: 24, shading: C.white,    width: 4680 }),
      ],
    }),
  )
  // Subtitle row
  planRows.push(
    new TableRow({
      children: [
        cell({ text: left.sub,         color: C.slate, size: 18, shading: C.tealSoft, width: 4680 }),
        cell({ text: right.sub,        color: C.slate, size: 18, shading: C.white,    width: 4680 }),
      ],
    }),
  )
  // Specs row: panels / battery / inverter
  planRows.push(
    new TableRow({
      children: [
        cell({ text: `Panels: ${left.panels}    Battery: ${left.battery}    Inverter: ${left.inverter}`, color: C.slate, size: 18, shading: C.tealSoft, width: 4680 }),
        cell({ text: `Panels: ${right.panels}   Battery: ${right.battery}   Inverter: ${right.inverter}`, color: C.slate, size: 18, shading: C.white, width: 4680 }),
      ],
    }),
  )
}

const choosePlanTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [4680, 4680],
  rows: planRows,
})

/* Savings section — 6 cards in a 3×2 grid */
const savingsHeading = [
  h(HeadingLevel.HEADING_1, 'Your estimated savings'),
  new Paragraph({
    spacing: { after: 200 },
    children: [
      new TextRun({
        text: 'Generation is region-adjusted for England - London — e.g. England - South East = 1,042 kWh/kWp/yr. Source: EU JRC PVGIS 6, 2014–2024 average, 14% system losses.',
        size: 18,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
]

const savingsRows = []
for (let i = 0; i < SAVINGS.length; i += 3) {
  const cellsInRow = SAVINGS.slice(i, i + 3).map((s) =>
    cell({
      text: `${s.label}\n${s.value}\n${s.sub}`,
      bold: false,
      color: C.slate,
      size: 20,
      shading: C.white,
      width: 3120,
    }),
  )
  // Pad to 3 cells if last row has only 2
  while (cellsInRow.length < 3) cellsInRow.push(cell({ text: '', width: 3120, shading: C.white }))
  savingsRows.push(new TableRow({ children: cellsInRow }))
}

const savingsTable = new Table({
  width: { size: 9360, type: WidthType.DXA },
  columnWidths: [3120, 3120, 3120],
  rows: savingsRows,
})

/* ROI breakdown — collapsible detail row */
const roiBreakdown = [
  h(HeadingLevel.HEADING_2, 'View detailed ROI breakdown'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [4680, 4680],
    shading: { fill: C.tealSoft, type: ShadingType.CLEAR },
    rows: [
      new TableRow({
        children: [
          cell({ text: 'Annual generation',  color: C.slate, size: 20, shading: C.tealSoft, width: 4680 }),
          cell({ text: '3,830 kWh', bold: true, color: C.navy, size: 20, align: AlignmentType.RIGHT, shading: C.tealSoft, width: 4680 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Self-consumed', color: C.slate, size: 20, shading: C.tealSoft, width: 4680 }),
          cell({ text: '2,340 kWh', bold: true, color: C.navy, size: 20, align: AlignmentType.RIGHT, shading: C.tealSoft, width: 4680 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Exported', color: C.slate, size: 20, shading: C.tealSoft, width: 4680 }),
          cell({ text: '1,490 kWh', bold: true, color: C.navy, size: 20, align: AlignmentType.RIGHT, shading: C.tealSoft, width: 4680 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: '30-year cumulative', bold: true, color: C.navy, size: 22, shading: C.tealSoft, width: 4680 }),
          cell({ text: '£34,200', bold: true, color: C.navy, size: 22, align: AlignmentType.RIGHT, shading: C.tealSoft, width: 4680 }),
        ],
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 100, after: 200 },
    children: [
      new TextRun({
        text: '30-year figures use the panel degradation curve (year 1 = 100%, year 10 ≈ 95.7%, year 30 = 85%) at £0.2632/kWh imported and £0.15/kWh exported.',
        size: 18,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
]

/* Offer card — 3-col price summary + CTA */
const offer = [
  h(HeadingLevel.HEADING_1, 'Your offer'),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [3120, 3120, 3120],
    rows: [
      new TableRow({
        children: [
          cell({ text: 'System price',  color: C.slate,    size: 18, shading: C.tealSoft, width: 3120 }),
          cell({ text: 'Your offer',    bold: true, color: C.emerald, size: 18, shading: C.white, width: 3120 }),
          cell({ text: 'Offer valid until', color: C.slate, size: 18, shading: C.tealSoft, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: '£6,999', bold: true, color: C.navy,     size: 32, shading: C.tealSoft, width: 3120 }),
          cell({ text: '£6,299', bold: true, color: C.emerald, size: 40, shading: C.white,    width: 3120 }),
          cell({ text: '30 Sep 2026', bold: true, color: C.navy, size: 24, shading: C.tealSoft, width: 3120 }),
        ],
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 240, after: 240 },
    alignment: AlignmentType.CENTER,
    children: [
      new TextRun({
        text: '[ Talk to an expert ]',
        bold: true,
        size: 24,
        color: C.tealDark,
        font: FONT,
      }),
    ],
  }),
]

/* Plan summary — right-rail mini spec */
const planSummary = [
  h(HeadingLevel.HEADING_1, 'Your plan summary'),
  new Paragraph({
    spacing: { after: 120 },
    children: [
      new TextRun({
        text: 'Solar + Storage',
        size: 18,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [9360],
    rows: [
      new TableRow({
        children: [
          new TableCell({
            width: { size: 9360, type: WidthType.DXA },
            shading: { fill: C.tealSoft, type: ShadingType.CLEAR },
            borders: {
              top:    { style: BorderStyle.SINGLE, size: 6, color: C.line },
              bottom: { style: BorderStyle.SINGLE, size: 6, color: C.line },
              left:   { style: BorderStyle.SINGLE, size: 6, color: C.line },
              right:  { style: BorderStyle.SINGLE, size: 6, color: C.line },
            },
            margins: { top: 120, bottom: 120, left: 200, right: 200 },
            children: [
              new Paragraph({
                spacing: { after: 0 },
                children: [
                  new TextRun({
                    text: 'Home Energy Pro',
                    bold: true,
                    size: 24,
                    color: C.tealDark,
                    font: FONT,
                  }),
                ],
              }),
            ],
          }),
        ],
      }),
    ],
  }),
  new Paragraph({ spacing: { after: 120 }, children: [new TextRun({ text: '' })] }),
  // Spec rows
  new Table({
    width: { size: 9360, type: WidthType.DXA },
    columnWidths: [6240, 3120],
    rows: [
      new TableRow({
        children: [
          cell({ text: 'System size',        color: C.slate, size: 20, width: 6240 }),
          cell({ text: '3.68 kWp',           bold: true, color: C.navy, size: 20, align: AlignmentType.RIGHT, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Battery capacity',   color: C.slate, size: 20, width: 6240 }),
          cell({ text: '5.12 kWh',           bold: true, color: C.navy, size: 20, align: AlignmentType.RIGHT, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Inverter',           color: C.slate, size: 20, width: 6240 }),
          cell({ text: '3.6 kW',             bold: true, color: C.navy, size: 20, align: AlignmentType.RIGHT, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Estimated investment', color: C.slate, size: 20, width: 6240 }),
          cell({ text: '£6,999',             bold: true, color: C.navy, size: 24, align: AlignmentType.RIGHT, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Estimated annual saving', color: C.slate, size: 20, width: 6240 }),
          cell({ text: '£1,140 / year',      bold: true, color: C.emerald, size: 24, align: AlignmentType.RIGHT, width: 3120 }),
        ],
      }),
      new TableRow({
        children: [
          cell({ text: 'Estimated payback',  color: C.slate, size: 20, width: 6240 }),
          cell({ text: '6.1 years',          bold: true, color: C.navy, size: 24, align: AlignmentType.RIGHT, width: 3120 }),
        ],
      }),
    ],
  }),
]

/* Footer note — trust + Solavita branding */
const footer = [
  new Paragraph({
    spacing: { before: 400 },
    border: { top: { style: BorderStyle.SINGLE, size: 12, color: C.line, space: 12 } },
    children: [
      new TextRun({
        text: '✓  Your plan is saved and secure. You can come back at any time.',
        size: 18,
        color: C.slate,
        font: FONT,
      }),
    ],
  }),
  new Paragraph({
    spacing: { before: 80 },
    children: [
      new TextRun({
        text: 'Solavita UK  ·  uk@solavita.com',
        size: 16,
        color: C.slateLight,
        font: FONT,
      }),
    ],
  }),
]

/* ────────────────────────────────────────────────────────────────────────
   Build the document
   ──────────────────────────────────────────────────────────────────────── */

const doc = new Document({
  creator: 'Solavita UK',
  title: 'My Plan — Solavita UK Template',
  description: 'Editable Word template mirroring the /my-plan page layout.',
  styles: {
    default: {
      document: { run: { font: FONT, size: 22, color: C.navy } },
    },
    paragraphStyles: [
      {
        id: 'Heading1',
        name: 'Heading 1',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 36, bold: true, color: C.navy, font: FONT },
        paragraph: {
          spacing: { before: 320, after: 160 },
          outlineLevel: 0,
        },
      },
      {
        id: 'Heading2',
        name: 'Heading 2',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 28, bold: true, color: C.navy, font: FONT },
        paragraph: {
          spacing: { before: 200, after: 120 },
          outlineLevel: 1,
        },
      },
      {
        id: 'Heading3',
        name: 'Heading 3',
        basedOn: 'Normal',
        next: 'Normal',
        quickFormat: true,
        run: { size: 24, bold: true, color: C.slate, font: FONT },
        paragraph: {
          spacing: { before: 160, after: 80 },
          outlineLevel: 2,
        },
      },
    ],
  },
  sections: [
    {
      properties: {
        page: {
          size: {
            width: 11906,  // A4
            height: 16838,
            orientation: PageOrientation.PORTRAIT,
          },
          margin: { top: 1000, right: 1000, bottom: 1000, left: 1000 },
        },
      },
      children: [
        // Brand banner at the top
        new Paragraph({
          spacing: { after: 80 },
          children: [
            new TextRun({
              text: 'SOLAVITA UK',
              bold: true,
              size: 18,
              color: C.tealDark,
              font: FONT,
              characterSpacing: 60,
            }),
          ],
        }),
        ...breadcrumb,
        ...hero,
        ...homeDetails,
        ...yourSystem,
        ...choosePlan,
        choosePlanTable,
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '' })] }),
        ...savingsHeading,
        savingsTable,
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: '' })] }),
        ...roiBreakdown,
        ...offer,
        ...planSummary,
        ...footer,
      ],
    },
  ],
})

/* ────────────────────────────────────────────────────────────────────────
   Write to disk
   ──────────────────────────────────────────────────────────────────────── */

const outPath = path.join(__dirname, 'my-plan-template.docx')
Packer.toBuffer(doc)
  .then((buf) => {
    fs.writeFileSync(outPath, buf)
    console.log(`✓ Wrote ${outPath} (${buf.length.toLocaleString()} bytes)`)
  })
  .catch((err) => {
    console.error('✗ Build failed:', err)
    process.exit(1)
  })