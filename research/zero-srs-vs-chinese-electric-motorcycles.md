# Zero SR/S vs. Chinese High-Performance Electric Motorcycles

**Status:** Research comparison  
**Evidence posture:** The figures below were supplied in the working comparison and should be independently checked against current manufacturer specifications, homologation documents, and repeatable testing before being treated as verified fact.

## 1. Comparison table

| Parameter | **Zero SR/S (United States)** | **Arctic Leopard EXE 880 (China)** | **Talaria Komodo (China)** | **Surron Ultra Bee HP (China)** |
| :--- | :--- | :--- | :--- | :--- |
| **Top speed** | **200 km/h** | 125 km/h | 105 km/h | 95 km/h |
| **Peak power** | **83–84 kW** | 37 kW | 32 kW | 24.5 kW |
| **Continuous power** | **~40 kW** | Not published | Not published | Not published |
| **Peak torque** | **190 Nm** | 880 Nm at wheel | 754 Nm at wheel | 520 Nm at wheel |
| **Battery capacity** | **17.3 kWh** (15.1 kWh usable) | 90V × 75Ah = **6.75 kWh** | 97.2V × 45Ah = **4.37 kWh** | 74V × 60Ah = **4.44 kWh** |
| **City range** | **275 km** | ~215 km at 22 mph | 115 km at 45 km/h | 115 km |
| **Highway range** | **187 km** | Not published | Not published | Not published |
| **Charging** | **6.6 kW onboard**; Level 2: 2.7 h to 100%; 6 kW fast charge: **1.6 h to 100%** | Not published | Not published | 2.5 h from 20% to 80% |
| **Curb weight** | **235 kg** | 108 kg | 98 kg | ~85–89 kg |
| **Braking and stability** | **Bosch ABS, cornering ABS, traction control, stability control** | Hydraulic discs; no ABS/TC | Hydraulic discs; four-level regenerative braking | Hydraulic discs; SRTC traction control |
| **Road registration** | Street-legal motorcycle; jurisdiction-specific registration applies | Market dependent; U.S. status requires verification | Market dependent | Market dependent |
| **Reference price** | **~$20,995 MSRP** | **$9,599** | **~$6,000** | **~$3,750** |
| **Repairability** | Official service documentation and parts catalog reported | Manufacturer parts pages reported | Owner manual available | Owner manual available |
| **Owner control** | Cypher III+ ride-mode adjustment; deeper tuning through dealer/app; not fully open | Race/Sport/Daily modes; OEM proprietary controller | Eco/Street/Hyper/Reverse modes | Six ride modes; app-level adjustment |
| **CAN documentation** | Not publicly documented | Not publicly documented | Not publicly documented | Community reverse-engineering reported |

## 2. Percentage differences

| Metric | vs. EXE 880 | vs. Komodo | vs. Ultra Bee HP |
| :--- | :--- | :--- | :--- |
| **Top speed** | **+60%** | **+90%** | **+111%** |
| **Peak power** | **+127%** | **+163%** | **+243%** |
| **Battery capacity** | **+156%** | **+296%** | **+290%** |

Formula used: `(Zero value / comparison value - 1) × 100`.

## 3. Category analysis

### Absolute performance

**Zero SR/S leads** in top speed, peak power, battery capacity, road safety systems, highway capability, and integrated charging.

### Power-to-weight

| Model | Approximate ratio |
| :--- | :--- |
| Zero SR/S | 235 kg / 84 kW = **2.80 kg/kW** |
| Arctic Leopard EXE 880 | 108 kg / 37 kW = **2.92 kg/kW** |
| Talaria Komodo | 98 kg / 32 kW = **3.06 kg/kW** |
| Surron Ultra Bee HP | ~87 kg / 24.5 kW = **3.55 kg/kW** |

Zero SR/S and EXE 880 are close by this simplified peak-power calculation, but they serve different vehicle categories and riding environments.

### Off-road agility

The three Chinese platforms lead in low mass, wheel and suspension geometry, ground clearance, and off-road maneuverability. The Zero SR/S is a road-oriented sport-touring motorcycle and is not an equivalent enduro platform.

### Owner control

None of the four currently demonstrates complete owner control under a strict standard requiring:

- owner-accessible firmware flashing;
- public CAN/UART protocol documentation;
- downloadable controller configuration software;
- complete wiring diagrams and diagnostic codes;
- unrestricted replacement-controller compatibility;
- no mandatory dealer, account, cloud, or vendor authorization dependency.

Manufacturer-developed electronics are classified as **proprietary** unless those owner-access capabilities are demonstrated.

### Performance per dollar

| Model | Price | Peak power | Approx. dollars per kW |
| :--- | ---: | ---: | ---: |
| Zero SR/S | $20,995 | 84 kW | **$250/kW** |
| Arctic Leopard EXE 880 | $9,599 | 37 kW | **$259/kW** |
| Talaria Komodo | ~$6,000 | 32 kW | **$188/kW** |
| Surron Ultra Bee HP | ~$3,750 | 24.5 kW | **$153/kW** |

This calculation excludes differences in road homologation, ABS and stability systems, charging hardware, warranty coverage, import costs, dealer support, and legal registration.

## 4. Verdict

> **CATEGORY MISMATCH: PREVENTS GENERAL CONCLUSION**

Supporting classifications:

- **AMERICAN COUNTEREXAMPLE: PROVEN** for absolute road performance, assuming the cited specifications are independently reproduced.
- **CHINESE OFF-ROAD ADVANTAGE: SUPPORTED** for lightweight agility and purchase-price efficiency.
- **OWNER-CONTROL CLAIM: UNPROVEN** for all four platforms.

The Zero SR/S demonstrates that an American electric motorcycle can substantially exceed these Chinese off-road platforms in speed, power, battery capacity, charging, and road safety integration. It does not disprove Chinese strength in lightweight electric enduro design, modification ecosystems, or performance per purchase dollar.

## 5. Verification checklist

Before promotion from research comparison to verified public proof, attach:

1. Current manufacturer specification pages or archived PDFs.
2. Model-year and regional-market identifiers.
3. Homologation or registration documentation.
4. Independent top-speed, range, and charging tests.
5. Clear distinction between motor torque and wheel torque.
6. Battery nominal capacity versus usable capacity.
7. Official service-manual and parts-catalog references.
8. Evidence supporting any CAN-bus or firmware-access claim.
