# PLAN: Icon Batch 2 — Download & Update Dari Internet

**Status**: Planning Phase  
**Date**: 2026-09-07  
**Context**: Replace GPT-generated icons dengan akurat icons dari Wikipedia/Google/official websites  
**Related**: `src/extensions/vm-icon-generator/`, `icons.json` Batch 2  

---

## 📋 Ringkasan Masalah

Saat ini batch 2 dari `icons.json` berisi icon yang di-generate GPT, hasil accuracy-nya kurang akurat. 
Perlu di-replace dengan icon dari sumber resmi (Wikipedia, website resmi, Google Images, Icon libraries).

---

## 🎯 Tujuan

Membuat workflow standar untuk:
1. **Identify** — Tentukan icon apa saja yang perlu di-update (dari icons.json Batch 2)
2. **Source** — Tentukan source terbaik untuk setiap icon (Wikipedia logo, official website, atau icon library)
3. **Download** — Download dengan kualitas tinggi (SVG/PNG 512px+)
4. **Validate** — Cek akurasi & legal permissions
5. **Organize** — Simpan ke folder terstruktur dengan naming convention yang jelas
6. **Update DB** — Update referensi di icons.json atau metadata file

---

## 📊 Task Breakdown — Hierarki Standar

### 1. Phase 1: Discovery & Planning

#### 1.1. Audit Current icons.json Batch 2
- **1.1.1** List semua icon di Batch 2 (cara terbaik: parsing JSON)
- **1.1.2** Kategorisasi per tipe (programming languages, tools, databases, software, dll)
- **1.1.3** Rate akurasi setiap icon dari GPT (manual review atau comparison tools)
- **1.1.4** Identify priority — mana yang paling perlu di-update terlebih dahulu

#### 1.2. Research & Source Mapping
- **1.2.1** Buat spreadsheet mapping: `icon name → source URL → format → download method`
- **1.2.2** Tentukan primary sources per kategori:
  - **Programming Languages**: Wikipedia (commons.wikimedia.org) atau official language website
  - **Databases**: Official website atau DB-Engines logo repository
  - **Web Frameworks**: GitHub repo resmi atau official documentation
  - **DevTools**: Official website atau project repository
  - **Cloud Services**: Brand asset pages (AWS, GCP, Azure, Heroku, dll)
- **1.2.3** Document licensing untuk setiap icon (MIT, Apache, CC, proprietary dll)

#### 1.3. Tool & Method Selection
- **1.3.1** Tentukan workflow download:
  - **Option A**: Manual download via browser → organize di folder local
  - **Option B**: Python script with requests/selenium → bulk download dari URL list
  - **Option C**: Hybrid — gunakan existing icon APIs (Simpleicons, Brandicons, dll)
- **1.3.2** Tentukan format output:
  - **SVG** (preferred): scalable, tiny file size
  - **PNG 512x512+**: fallback jika SVG tidak tersedia
- **1.3.3** Setup folder structure untuk organized storage

---

### 2. Phase 2: Automated Source Discovery

#### 2.1. API & Library Integration
- **2.1.1** Evaluate **Simple Icons** (simpleicons.org)
- **2.1.2** Evaluate **Wikimedia Commons** API
- **2.1.3** Evaluate **Brands Dataset**
- **2.1.4** Evaluate **GitHub-based icon collections**

#### 2.2. Scraping Strategy (untuk sources tanpa API)
- **2.2.1** Tentukan crawl rules: robots.txt compliant, rate limiting
- **2.2.2** Tools: Python + requests + BeautifulSoup atau Selenium/Puppeteer
- **2.2.3** Manual Curation List untuk icons yang tidak ada di APIs

#### 2.3. Download & Processing
- **2.3.1** Setup folder structure untuk organized storage
- **2.3.2** Execute downloads (manual, automated, atau hybrid)
- **2.3.3** Post-download processing (validation, optimization)

---

### 3. Phase 3: Validation & QA

#### 3.1. License Compliance Check
- **3.1.1** Verify setiap icon's license (Open Source vs Proprietary)
- **3.1.2** Document license di metadata file
- **3.1.3** Create LICENSE file listing setiap icon + license

#### 3.2. Visual Accuracy Review
- **3.2.1** Compare downloaded icon vs original (side-by-side)
- **3.2.2** Rating system: Excellent / Good / Needs Replacement
- **3.2.3** Integration test di UI component

---

### 4. Phase 4: Database Update & Documentation

#### 4.1. Update icons.json Schema
- **4.1.1** Determine perlu add fields (source_url, license, format, updated_date, quality_rating)
- **4.1.2** Migrate existing entries → add new fields
- **4.1.3** Validate JSON schema

#### 4.2. Documentation
- **4.2.1** Create `docs/ICON_MANAGEMENT.md`
- **4.2.2** Create `ICON_SOURCES.csv` (master list)

---

## ✅ Success Criteria

- [ ] All 50+ Batch 2 icons downloaded
- [ ] 95%+ file format valid (SVG/PNG)
- [ ] 100% license checked & documented
- [ ] File size optimized (SVG <50KB, PNG <200KB ideal)
- [ ] Visual accuracy score >85%
- [ ] icons.json updated dengan new references
- [ ] UI test passed — icons render correctly
- [ ] Documentation complete & committed

