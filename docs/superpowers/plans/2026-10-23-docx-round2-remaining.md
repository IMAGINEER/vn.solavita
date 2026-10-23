# 修改建议.docx — Round 2 (Oct 23) — remaining items for confirmation

Status: **AWAITING USER CONFIRMATION** — do not execute until each item is approved.

Source: `docs/修改建议.docx` (modified 2026-10-23 09:02)
References: `docs/套餐组合-负载及运行时间-参考示意.pptx`, `docs/Modules&Inverter&Battery&All in One ESS.pptx`

---

## Already implemented (committed `e6fce82`)

| # | docx section | Change |
|---|---|---|
| 1 | Homepage hero (img 1) | Title break: `Ditch The Generator. Power` ⏎ `Your Life.` Body split into two lines |
| 2 | Homepage hero (img 1) | Deleted the 4-pill strip (Lower energy costs / Reduce diesel use / Power what matters / Stable power for key loads) |
| 3 | Homepage §2 (img 2) | Deleted the subtitle "End blackouts and cut diesel costs…" |
| 4 | Homepage §3 (img 3) | Deleted the whole "WHY SOLAVITA — From Local Warehouse to Your Doorstep" section |
| 5 | Solutions cards §① | New simplified copy for all 6 packages |
| 6 | Solutions cards §② | Deleted the 3-bullet list |
| 7 | Solutions cards §③ | Replaced the 2-box stat strip with a 3-row table (Solar / Inverter / Battery) |
| 8 | Solutions §②电器负载 | Rebuilt LOAD & RUNTIME as 3 cards per page with the reference PPTX values + scenario-specific note |
| 9 | Business FAQ Q2 | Replaced with "Essential systems stay on. With an instant automatic switch to battery power…" |
| 10 | Support (img 22) | Deleted the Monitoring card (its FAQ content is kept on the page) |
| 11 | Support (img 22) | CTA labels: How to Install / Download / Download / Contact Us |
| 12 | /my-plan (img 26) | Deleted the 3 bottom metric cards (Annual Solar Generation, Generator Fuel Saved, ROI) |
| 13 | /my-plan (img 26) | Replaced "View detailed ROI breakdown" with a "Key Assumptions" disclosure |
| 14 | /my-plan (img 25) | "Solar panels / N modules" → "Solar / N kWp"; HOME High-spec shows 9.92–12.40 kWp and 8–12 kW |
| 15 | /my-plan | Fixed "Pick one of four ready-made plans" → "six" (6 plans actually render) |

---

## Part A — Data conflicts (need a decision, one-line fixes each)

### A1. HOME High-spec PV capacity — two different values in the docx

| Source | Value |
|---|---|
| docx §"③表格数量3个" (card table) | **9.92~14.20 kWp** |
| docx §"套餐修改" (package modification) | 9.92~12.4 kWp |
| Current code, `lib/data/ng-products.ts`, `app/my-plan/_lib/calc.ts` | 9.92–12.40 kWp |

**Implemented as: 9.92–12.40 kWp** (agrees with the later "套餐修改" block and every existing data file).
→ Confirm, or say "use 14.20".

### A2. HOME High-spec battery — two different values in the docx

| Source | Value |
|---|---|
| docx §"③表格数量3个" | 16 kWh |
| docx §"套餐修改" | 10 kWh |

**Implemented as: 16 kWh** (10 kWh appears only in that one block and contradicts every other spec on the site).
→ Confirm, or say "use 10".

### A3. LITE Essential Backup — TV vs AC runtime swapped between the two references

| Appliance | PPTX (named as source of truth) | docx embedded image (img 7) |
|---|---|---|
| TV | **2~4h** | 4–6h |
| AC (1HP) | **4~6h** | 2–4h |

**Implemented as: the PPTX values** (the docx text says "详情见PPT").
→ Confirm, or say "use the docx image values".

### A4. HOME High-spec — TV vs AC runtime swapped between the two references

| Appliance | PPTX | docx embedded image (img 7) |
|---|---|---|
| TV | **8~10h** | 6–8h |
| AC (1HP) | **6~8h** | 8–10h |

**Implemented as: the PPTX values.**
→ Confirm, or say "use the docx image values".

### A5. Price currency in the "套餐修改" block

The docx lists prices in **US dollars**: LITE $3,299 · HOME Standard $4,699 (Off-grid $5,199) · HOME High-spec from $6,499 ($6,499–$7,399) · all three BUSINESS tiers $7,899.

The live site shows **NGN** (₦3,800,000 / ₦6,200,000 / ₦9,500,000 / ₦11,500,000 / ₦17,500,000 / ₦24,000,000) and those are flagged in code as *simulated, not business-approved*.

**Implemented as: no change to prices.** The USD figures look like a carry-over from the UK reference (the UK site sells at those prices), and `ng-content-strategy` rule 5 requires NGN with approved figures.
→ Confirm, or supply the approved NGN prices.

### A6. /my-plan savings values in the "①各套餐表格如下" block

The docx gives per-package Annual Net Saving / Payback / 30-year Return in **$** (e.g. LITE ~$2,330 / ~1.9 years / ~$245,000), plus a "Key Assumptions" block giving the conversion rate ($1 = ₦1,350, avoided cost ₦585/kWh ≈ $0.433/kWh).

The live calculator computes these live from the user's inputs using NGN constants. **Implemented as: no change to the calculation** — the docx's $ figures are static reference values, while the page already shows a dynamic, region-adjusted NGN estimate with a "Provisional test values" disclosure.
→ Confirm, or say "replace the live calculation with the static per-package values".

### A7. The "7 days" installation lead time and "Solavita-certified engineers"

The docx's Support installation Q&A says *"typically completed within 7 days"*, *"Usually 7 working days"* and *"All installations are carried out by Solavita-certified engineers"*.

`ng-content-strategy` rule 1 forbids publishing unverified installation lead times — the site currently ships `TBD — Confirmed installation scope and lead time` for `installationTime` on every package, and the /my-plan FAQ says *"around two weeks"*.

**Not yet implemented** — the new Support installation page is item B3 below, and the lead-time wording needs this decision first.
→ Options: (a) publish the 7-day figure, (b) keep a `TBD` marker, (c) publish a soft version like "typically within one to two weeks".

---

## Part B — New pages and navigation (bigger builds)

### B1. New "For Microgrid" page — `app/solutions/microgrid/`

Full spec from the docx (paragraphs 95–145):

1. **① Microgrid real-scene image** (img 13 = the 125 kW / 261 kWh SKYWORTH C&I cabinet) — reference only, real photo still needed.
2. **Below the image — three operating modes**, heading *"One Microgrid, Three Ways to Power Your Business"*:
   - **Off-Grid** — "Total energy independence. No grid, no problem."
   - **Hybrid** — "Smart savings with zero downtime. Grid or no grid, you stay running."
   - **On-Grid** — "Slash demand charges and secure critical loads."
3. **② Why Choose Microgrid** — icon wall with hover popovers (img 15). The docx image crosses out the third item, so **5 advantages**:
   - 💰 Cut Diesel — 70%~90%
   - ⏱ Zero Downtime — <10ms
   - 📱 Remote Monitor — 24/7
   - 🔋 6000+ Cycles — 5+ years (the reference image says "10+ yrs")
   - 🛡 Local Service — <24h Response
4. **③ Typical application scenarios** (image + text pairs):
   - Medium Factory / Light Processing — "Outage doesn't stop your machines."
   - Cold Chain / Supermarket — "Freezers stay cold when the grid goes dark."
   - Community Mini-Grid — "One box powers the whole street."
   - Telecom / Edge Site — "Towers stay online, generators stay silent."
5. **⑤ FAQ** — reuse the Business package FAQ.

Needs: 1 hero photo + 4 scenario photos (all currently `ImagePlaceholder` material), plus a new `lib/data/microgrid.ts`.

**Cost estimate:** ~1 new page + 1 new data file + 4 new section components. Moderate-to-large.

**Decision needed:** build it now, or defer?

### B2. New "Products" section — 4 detail pages + a downloads page

From the docx (§"Products - Modules / Inverter / Battery / All-in-One ESS - 详情页") and `docs/Modules&Inverter&Battery&All in One ESS.pptx`:

Each product page = ① image + ② advantages breakdown + ③ brief spec table. The PPTX supplies the copy and the spec tables:

| Page | PPTX slide | Headline | Spec table |
|---|---|---|---|
| Module | 1 | PV Module · TOPCon · 620 Wp · 23.0% efficiency · 30-year performance warranty | QM210THCD-620-66 (620 Wp, 23.00%, 2382×1134×30 mm, 32.5 kg, bifaciality 80±5%, IP68) |
| Inverter | 2 | Hybrid Inverter — Single Phase, SWH 3.6/6/8/10/12 kW | 5 model columns (3600/6000/8000/10000/12000 W) — several rows are **blank in the PPTX** (AC voltage, MPPT range, max efficiency, protection) |
| Inverter | 3 | Hybrid Inverter — Three Phase, SWH 10/15/20 kW | 3 model columns — same blanks |
| Inverter | 4 | Off-Grid Inverter — Single Phase, SWO 6000 W | complete |
| Battery | 5 | SWR 5.12 / 16.08 kWh, 51.2 V | 5.12 kWh / 16.08 kWh, 100 Ah / 314 Ah, 100 A / 200 A, 52 kg / 128 kg |
| All-in-One ESS | 6 | SWS 261 kWh, 125 kW | SWS-P125E261-HC-G2 — 261.25 kWh, 125 kW, 676–936 V, 90–100% DoD, 2580 kg, IP54 |
| Downloads | 7 | "Product specs, manuals and downloads for panels, batteries and inverters." + "Download Files →" | — |

Notes:
- The PPTX says *"鼠标移至图片显示 Learn More，点击后跳转 Support，在 Support 增加一个 Download 栏目，点击 Download 后会浮现每款产品的图片及下载链接"* — i.e. product-page "Learn More" → Support → a "Download" section that reveals each product's image + download link. That is what the Support "Download →" buttons should point at.
- **The PPTX spec tables have empty cells** (AC voltage, MPPT range, max efficiency, protection degree on slides 2–3). I will not invent those values — they need to come from you, or ship as `TBD — Verified local approvals` per the NG strategy.
- No product photographs exist in the repo for these SKUs; the PPTX slides contain renders I can export, or `ImagePlaceholder` can stand in.

**Decision needed:** build it now, or defer? And for the blank spec rows — leave blank, mark TBD, or will you supply values?

### B3. New Support installation Q&A page — `app/support/installation/`

The docx gives the full content:

> **What does the Solavita installation process look like?**
> Getting your Solavita system is simple — we guide you through 4 steps:
> ① **Free Survey** — We check your roof load and energy needs, no cost involved.
> ② **Design & Quote** — We create a tailored solution and send you a quote for approval.
> ③ **Installation** — Our certified team installs panels, inverters and batteries, typically completed within 7 days.
> ④ **Commissioning** — We test the full system and activate it, so you start saving from day one.

Plus the 4-step visual (img 23: "Get Your Solavita System" — Free Survey / Design & Quote / Installation / Commissioning, with chevron connectors) and 4 FAQs:

| Q | A |
|---|---|
| How long does installation take? | Usually 7 working days depending on system size. |
| Do I need to prepare anything before installation? | No. Our team handles roof assessment, permits and setup. |
| Will my power be interrupted during installation? | No, we install with zero downtime to your home or business. |
| Who installs the system? | All installations are carried out by Solavita-certified engineers. |

**This is blocked by A7** (the 7-day claim and the "certified engineers" claim both need your sign-off against the NG content strategy).

**Decision needed:** build it? And which wording for the lead time?

### B4. Header navigation restructure

The docx (img 4 + img 5 IA table) restructures the top nav:

```
Solavita (首页)     —
Solutions (解决方案)  ├─ For Home        → HOME 系列 3 套解决方案
                     ├─ For Business    → BUSINESS 系列 3 套解决方案
                     └─ For Microgrid   → 125kW/261kWh 工商铺一体机产品
Products (产品中心)  ├─ Module & Inverter & Battery → 参数 / 核心硬件 / 优势拆解
                     └─ All-in-One ESS
```

Current nav: `For Home ▾` + `For Business ▾` (both hover-dropdowns listing the 3 packages) + Cases / About Us / Support / For Partners + Contact Us.

**This depends on B1 and B2** — the "For Microgrid" and "Products" dropdown entries would link to pages that don't exist yet.

Two sub-decisions:
- **B4a** — Do the dropdowns keep listing the 3 solution *packages* (as they do now), or become simple 3-item / 2-item link menus as the IA table shows?
- **B4b** — Implement the nav restructure now with the two dropdown labels renamed (Solutions / Products) but only the existing destinations wired, or wait until B1 + B2 land so nothing 404s?

### B5. Does the "PRODUCT / Components in Detail" section stay on the collection pages?

The docx's 5-part structure for the Solutions detail pages is ① package cards → ② appliance loads → ③ customisation → ④ APP → ⑤ FAQ. There is **no PRODUCT section** in that list.

The current collection pages carry a "Components in Detail" section (4 tabs: PV Modules / Hybrid Inverter / Battery Storage / Mounting System) that is a *different* treatment from the new Products pages in B2.

**Options:** (a) leave it, (b) remove it from the collection pages now that Products has its own section, (c) leave it until B2 ships.

Also, the docx's ① package-card list puts the 3-row spec table *inside* the card, and ②电器负载 is a separate section — that matches what is now implemented.

---

## Suggested execution order (once confirmed)

1. **A1–A6** — one-line data fixes; no build work.
2. **A7 + B3** — Support installation page (needs the lead-time wording).
3. **B1** — Microgrid page.
4. **B2** — Products pages + downloads.
5. **B4** — Header nav restructure (last, so no link ever 404s).
6. **B5** — collection-page PRODUCT section decision.

## Open questions summary

1. A1 — HOME High-spec PV: 12.40 or 14.20 kWp?
2. A2 — HOME High-spec battery: 16 or 10 kWh?
3. A3/A4 — use the PPTX runtime values or the docx image values (LITE and HOME High-spec)?
4. A5 — keep the ₦ prices, or supply approved NGN prices?
5. A6 — keep the live /my-plan calculation, or switch to the docx's static per-package values?
6. A7 — publish "7 days" / "Solavita-certified engineers", keep TBD, or soften?
7. B1 — build the Microgrid page now or defer?
8. B2 — build the Products pages now or defer? And what to do about the blank spec rows?
9. B3 — build the Support installation page?
10. B4a — dropdown contents: package cards (current) or flat link lists (IA table)?
11. B4b — nav restructure now (partial) or after B1+B2?
12. B5 — keep or remove "Components in Detail" from the collection pages?
