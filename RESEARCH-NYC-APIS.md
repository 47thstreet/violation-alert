# NYC Violation Data Sources — Complete Research

> Generated 2026-05-13. 20+ datasets across 10+ NYC agencies.

## Summary of All Datasets

| # | Agency | Dataset | ID | Key Filter |
|---|--------|---------|-----|-----------|
| 1 | DOB | DOB Violations | `3h2n-5cm9` | BIN |
| 2 | DOB/ECB | ECB Violations | `6bgk-3dad` | BIN |
| 3 | DOB | DOB NOW Safety Violations | `855j-jady` | BIN |
| 4 | DOB | DOB Complaints Received | `eabe-havv` | BIN |
| 5 | HPD | Housing Maintenance Code Violations | `wvxf-dwi5` | BIN |
| 6 | HPD | Open HPD Violations | `csn4-vhvf` | BIN |
| 7 | HPD | HMC Complaints & Problems | `ygpa-z7cr` | BIN |
| 8 | FDNY | FDNY Violations | `avgm-ztsb` | address |
| 9 | DSNY | Sanitation Violations | `rzh9-p7nt` | address |
| 10 | DOT | Sidewalk Violations | `6kbp-uz6m` | address |
| 11 | LPC | Landmark Violations | `wwpi-9hdf` | address |
| 12 | DEP | DEP ECB Violations | `skr7-cxt3` | address |
| 13 | DCWP | DCWP Charges | `5fn4-dr26` | address |
| 14 | DOHMH | Restaurant Inspection Results | `43nn-pn8j` | address |
| 15 | OATH/ECB | ECB Violations (multi-agency) | `db6c-hpns` | address |
| 16 | 311 | Service Requests 2020-Present | `erm2-nwe9` | address |

## API Pattern

All datasets: `https://data.cityofnewyork.us/resource/{DATASET_ID}.json`

### Query Parameters (SODA API)
- `$where=` — WHERE clause filtering
- `$select=` — SELECT specific columns
- `$order=` — ORDER BY
- `$limit=` — LIMIT results (default 1000, max 50000)
- `$offset=` — Pagination offset

### Example Queries
```
# HPD violations by BIN
https://data.cityofnewyork.us/resource/wvxf-dwi5.json?bin=1001001

# DOB violations by BIN
https://data.cityofnewyork.us/resource/3h2n-5cm9.json?bin=1001001

# FDNY violations by address
https://data.cityofnewyork.us/resource/avgm-ztsb.json?$where=address='350 5TH AVE'
```

---

## Detailed Dataset Info

### 1. DOB — Department of Buildings

**DOB Violations** — `3h2n-5cm9`
- URL: `https://data.cityofnewyork.us/resource/3h2n-5cm9.json`
- Civil penalties issued by DOB
- Key fields: BIN, violation_type, violation_number, issue_date, disposition_date, penalty_applied
- Updated daily

**DOB/ECB Violations** — `6bgk-3dad`
- URL: `https://data.cityofnewyork.us/resource/6bgk-3dad.json`
- Summonses adjudicated by OATH/ECB
- Updated daily

**DOB NOW Safety Violations** — `855j-jady`
- URL: `https://data.cityofnewyork.us/resource/855j-jady.json`
- Newer DOB NOW platform violations
- Updated daily

**DOB Complaints Received** — `eabe-havv`
- URL: `https://data.cityofnewyork.us/resource/eabe-havv.json`
- All complaints received (311 or DOB staff)
- Key fields: BIN, complaint_category, date_entered, disposition

### 2. HPD — Housing Preservation & Development

**Housing Maintenance Code Violations** — `wvxf-dwi5`
- URL: `https://data.cityofnewyork.us/resource/wvxf-dwi5.json`
- Violations against rental dwellings (HMC or NY State MDL)
- Key fields: BoroID, Block, Lot, BIN, ViolationID, ViolationDate, ViolationStatus, Class (A/B/C)
- Updated daily

**Open HPD Violations** — `csn4-vhvf`
- URL: `https://data.cityofnewyork.us/resource/csn4-vhvf.json`
- Only open/active violations

**HMC Complaints & Problems** — `ygpa-z7cr`
- URL: `https://data.cityofnewyork.us/resource/ygpa-z7cr.json`
- 311 complaints for HMC/MDL violations
- Updated daily

### 3. FDNY — Fire Department

**FDNY Violations** — `avgm-ztsb`
- URL: `https://data.cityofnewyork.us/resource/avgm-ztsb.json`
- Fire code violations and inspection violations

### 4. DSNY — Department of Sanitation

**Sanitation Violations** — `rzh9-p7nt`
- URL: `https://data.cityofnewyork.us/resource/rzh9-p7nt.json`
- Sanitation code violations

### 5. DOT — Department of Transportation

**Sidewalk Violations** — `6kbp-uz6m`
- URL: `https://data.cityofnewyork.us/resource/6kbp-uz6m.json`
- Sidewalk defect violations and citations
- Key fields: address, lot info, inspection_date, violation_date, status

### 6. LPC — Landmarks Preservation Commission

**Landmark Violations** — `wwpi-9hdf`
- URL: `https://data.cityofnewyork.us/resource/wwpi-9hdf.json`
- Violations against designated landmarks
- Key fields: landmark_name, address, violation_type (A/B), warning_letter_date, nov_date, status

### 7. DEP — Department of Environmental Protection

**DEP ECB Violations** — `skr7-cxt3`
- URL: `https://data.cityofnewyork.us/resource/skr7-cxt3.json`
- Environmental violations (noise, air quality, hazmat, backflow, water/sewer)
- Fines: $1,000-$10,000+

### 8. DCWP — Department of Consumer & Worker Protection

**DCWP Charges** — `5fn4-dr26`
- URL: `https://data.cityofnewyork.us/resource/5fn4-dr26.json`
- Consumer protection and licensing violations

### 9. DOHMH — Department of Health

**Restaurant Inspection Results** — `43nn-pn8j`
- URL: `https://data.cityofnewyork.us/resource/43nn-pn8j.json`
- Health code violations for ~30,000 food establishments
- Key fields: restaurant name, address, inspection_date, violation_code, grade, score

### 10. OATH/ECB — Office of Administrative Trials & Hearings

**ECB Violations** — `db6c-hpns`
- URL: `https://data.cityofnewyork.us/resource/db6c-hpns.json`
- Multi-agency violations adjudicated by ECB

### 11. 311 Service Requests

**311 Requests 2020-Present** — `erm2-nwe9`
- URL: `https://data.cityofnewyork.us/resource/erm2-nwe9.json`
- 24M+ rows, all complaint types, all agencies
- Updated daily

---

## Competitor Analysis: DOBAlerts.com

| Feature | DOBAlerts | ViolationAlert (ours) |
|---------|-----------|----------------------|
| Agencies | DOB, 311, ECB, DOT only | 10+ agencies |
| Violations | DOB-focused (illegal occupancy, injuries, work w/o permit) | ALL violation types |
| Alerts | Email + SMS | Email + SMS + WhatsApp |
| Resolution help | None | AI knowledge base + step-by-step guides |
| Marketplace | None | Contractor matching by violation type |
| Resolution tracking | None | Full pipeline: open → submitted → resolved |
| Pricing | Hidden (call for quote) | Transparent: Free / $29 Pro / Enterprise |
| Self-service | Unclear | Full dashboard |

**Their gap**: Only covers DOB + 311. Missing HPD, FDNY, DSNY, LPC, DEP, DOHMH, DCWP. Zero resolution support.

---

## Property Matching Strategy

1. **BIN (Building Identification Number)** — Most reliable, available in DOB + HPD datasets
2. **BBL (Borough-Block-Lot)** — Alternative unique identifier
3. **Address matching** — Available in all datasets, needs normalization
4. **GeoSearch API** — `geosearch.planninglabs.nyc/v2/search` for address→BIN resolution
