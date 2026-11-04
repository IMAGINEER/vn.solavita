# Solavita Việt Nam — Product Line & Packages

> Source of truth for the packages and component line published on the
> Vietnam site. The web app reads the same numbers from
> `lib/data/solutions.ts` (packages) and `lib/data/products.ts`
> (component spec sheets) — keep the three in sync.
>
> Reconstructed 2026-10-30 from `lib/data/solutions.ts`,
> `lib/data/products.ts` and `docs/修改建议(2).docx`. Compare against the
> business's own copy before launch; module counts, inverter ratings,
> battery capacities, phase types and annual generation estimates must
> not change without explicit approval.

---

## 1. Packages — For Homes

| Package | Phase | Solar | Inverter | Battery | Est. annual generation |
|---|---|---|---|---|---|
| **LITE Essential Backup** | Single phase | 4.34 kWp (7 × 620 W) | 3.6 kW | 5 kWh | 5,500–6,000 kWh (estimate) |
| **HOME Standard** | Single phase | 7.44 kWp (12 × 620 W) | 6 kW, off-grid capable | 10 kWh (2 × 5 kWh) | 9,500–10,500 kWh (estimate) |
| **HOME High-spec** | Single phase | 9.92–12.40 kWp (16–20 × 620 W) | 8–12 kW | 16 kWh | 15,000–16,000 kWh (estimate) |

## 2. Packages — Commercial & Industrial

| Package | Phase | Solar | Inverter | Battery | Est. annual generation |
|---|---|---|---|---|---|
| **BUSINESS Entry 3-Phase** | Three phase | 11.78 kWp (19 × 620 W) | 10 kW | 16 kWh | 15,000–16,000 kWh (estimate) |
| **BUSINESS Standard 3-Phase** | Three phase | 17.36 kWp (28 × 620 W) | 15 kW | 32 kWh (2 × 16 kWh) | 22,000–23,000 kWh (estimate) |
| **BUSINESS Flagship 3-Phase** | Three phase | 23.56 kWp (38 × 620 W) | 20 kW | 32 kWh (2 × 16 kWh) | 30,000–32,000 kWh (estimate) |

### 2.1 All-in-One ESS (added 2026-10-30)

Not a package in the ladder — a stand-alone industrial system with its
own solution page at `/solutions/microgrid`. Listed under the business
page's "HEAVY DEMAND. VITAL POWER." category.

| System | Output | Energy | Spec |
|---|---|---|---|
| **SWS 261 kWh** (SWS-P125E261-HC-G2) | 125 kW | 261.25 kWh nominal / 261.25 kWh usable | 676–936 V operating range · 90%–100% DoD (90% recommended) · IP54 · C4 anti-corrosion (C5 optional) · 2,580 kg · 1050 × 2250 × 1400 mm |

---

## 3. Component line

### 3.1 PV Module — QM210THCD-620-66

Series-66 TOPCon · 620 Wp · 23.00% rated efficiency · 14.99 A max power
current · 41.40 V max circuit voltage · 2382 × 1134 × 30 mm · 32.5 kg ·
80 ± 5% bifaciality · 15-year product warranty · 30-year performance
warranty · IP68 junction box.

Quality system: IEC 61215 (2021) · IEC 61730 (2018) · ISO 9001:2015 ·
ISO 14001:2015 · ISO 45001:2018.

### 3.2 Inverters

| Family | Models | Output | Phase | Protection |
|---|---|---|---|---|
| SWH single-phase hybrid | SWH3600L-S1-G2 · SWH6000L-S1-G2 · SWH8000L-S1-G2 · SWH010KL-S1-G2 · SWH012KL-S1-G2 | 3.6 / 6 / 8 / 10 / 12 kW | Single, low voltage | IP66 |
| SWH three-phase hybrid | SWH010KL-T1-G2 · SWH015KL-T1-G2 · SWH020KL-T1-G2 | 10 / 15 / 20 kW | Three, low voltage | IP66 |
| SWO single-phase off-grid | SWO6000L-S1-SR | 6 kW | Single, low voltage | IP65 |

MPPT trackers: 2 (single-phase hybrid) · 3 / 4 / 4 (three-phase hybrid) ·
2 (off-grid). Max efficiency: 97.60% (single-phase hybrid) · 97.80%
(three-phase hybrid) · 99.90% (off-grid).

### 3.3 Battery — SWR 5.12 / 16.08 kWh

| Model | Nominal voltage | Nominal energy | Nominal capacity | Max charge / discharge | Weight | Dimensions |
|---|---|---|---|---|---|---|
| SWR5.12-L1-WW | 51.2 V | 5.12 kWh | 100 Ah | 100 A | 52 kg | 600 × 480 × 180 mm |
| SWR16.08-L1-WW | 51.2 V | 16.08 kWh | 314 Ah | 200 A | 128 kg | 840 × 490 × 250 mm |

Max. 16 modules in parallel. IP65 protection. 10-year standard warranty.
Optional automatic self-heating (−20 °C to 55 °C).

### 3.4 C&I Energy Storage System — SWS 261 kWh

See §2.1.

---

## 4. Pricing

Published prices come from `docs/修改建议(2).docx` §"套餐选择与经济性测算页面"
and are displayed in **USD** on the `/my-plan` tool only. The marketing
surfaces carry no hard price — they route to "Request a Quote".

| Package | Published price |
|---|---|
| LITE Essential Backup | $3,299 |
| HOME Standard | $4,699 (off-grid $5,199) |
| HOME High-spec | From $6,499 ($6,499 – $7,399) |
| BUSINESS Entry 3-Phase | $7,899 |
| BUSINESS Standard 3-Phase | $7,899 |
| BUSINESS Flagship 3-Phase | $7,899 |

> ⚠ Confirm each figure with the business before launch — these are the
> docx's numbers, not yet a verified price list.

---

## 5. Rules

- Annual generation figures are **package-level estimates** and must be
  labelled "estimate", with the note that actual output depends on
  location, system design, shading, weather and operating conditions.
- Annual generation must never be equated with guaranteed household
  consumption or backup runtime.
- Module counts, inverter ratings, battery capacities and phase types
  change only with explicit approval from the business.
