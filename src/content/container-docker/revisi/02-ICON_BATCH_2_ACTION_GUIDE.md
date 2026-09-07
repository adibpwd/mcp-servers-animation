# Icon Batch 2 — Quick Action Guide

Practical checklist & quick reference untuk implement planning. Gunakan ini sebagai **day-to-day guide** saat execute tasks.

---

## 🚀 Quick Start Checklist

```
⬜ Phase 1: Audit & Research (2-3 jam)
   ├─ [ ] Read icons.json Batch 2
   ├─ [ ] List all icons → spreadsheet
   ├─ [ ] Rate current accuracy (1-5 scale)
   └─ [ ] Start source research

⬜ Phase 2: Source Mapping (1-2 hari)
   ├─ [ ] Finish source URLs untuk semua icons
   ├─ [ ] Verify license setiap icon
   ├─ [ ] Pick download method (manual / script / hybrid)
   └─ [ ] Setup folder structure

⬜ Phase 3: Download & Processing (1-2 hari)
   ├─ [ ] Download all icons
   ├─ [ ] Validate format & quality
   ├─ [ ] Optimize (compress SVG/PNG)
   └─ [ ] Update metadata CSV

⬜ Phase 4: QA & Integration (1 hari)
   ├─ [ ] Visual review & accuracy check
   ├─ [ ] License compliance verify
   ├─ [ ] Update icons.json
   └─ [ ] Integration test di UI

⬜ Phase 5: Documentation (1 hari)
   ├─ [ ] Write ICON_MANAGEMENT.md
   ├─ [ ] Create ICON_SOURCES.csv
   ├─ [ ] Add LICENSE file
   └─ [ ] Commit & push
```

---

## 📊 Source Mapping Template

Buat file `icon-sources-mapping.csv` dengan struktur ini:

```csv
Icon Name,Category,Current Status,Source URL,License,Format,Quality Rating,Notes,Downloaded
Python,Languages,GPT-generated,https://commons.wikimedia.org/wiki/File:Python-logo-notext.svg,CC-BY,SVG,Excellent,Official logo,
JavaScript,Languages,GPT-generated,https://commons.wikimedia.org/wiki/File:Unofficial_JavaScript_logo_2.svg,CC-BY,SVG,Good,Community logo,
PostgreSQL,Databases,GPT-generated,https://commons.wikimedia.org/wiki/File:Postgresql_elephant.svg,CC0,SVG,Excellent,Official logo,
React,Frameworks,GPT-generated,https://raw.githubusercontent.com/facebook/react/main/docs/img/logo.svg,MIT,SVG,Excellent,Official repo,
Docker,DevTools,GPT-generated,https://commons.wikimedia.org/wiki/File:Docker_(container_engine)_logo.svg,CC-BY,SVG,Excellent,Official logo,
```

### Cara isi:
- **Icon Name**: Exact name dari icons.json
- **Category**: programming-languages / databases / frameworks / devtools / cloud / monitoring / other
- **Current Status**: Temporary atau GPT-generated (apa status sekarang)
- **Source URL**: Direct link ke image atau website
- **License**: MIT / Apache-2.0 / CC-BY / CC0 / Proprietary / Unclear
- **Format**: SVG / PNG / JPEG (prefer SVG)
- **Quality Rating**: Excellent / Good / Fair / Needs-Review
- **Notes**: Any special notes (needs compression, has transparency, dll)
- **Downloaded**: Checkbox atau date (2026-09-07)

---

## 🔍 Quick Source Finder — Programming Languages

| Language | Primary Source | Backup | Format |
|----------|---|---|---|
| Python | [Wikipedia](https://commons.wikimedia.org/wiki/File:Python-logo-notext.svg) | python.org | SVG |
| JavaScript | [Wikipedia](https://commons.wikimedia.org/wiki/File:Unofficial_JavaScript_logo_2.svg) | github.com/voodootikigod | PNG |
| Go | [golang.org/doc/gopher](https://golang.org/doc/gopher) | Wikipedia | PNG |
| Rust | [rust-lang.org/logos](https://www.rust-lang.org/logos/rust-logo-512x512.png) | GitHub | PNG |
| Java | [Wikipedia](https://commons.wikimedia.org/wiki/File:Java_programming_language_logo.svg) | oracle.com | SVG |
| C++ | [Wikipedia](https://commons.wikimedia.org/wiki/File:ISO_C%2B%2B_Logo.svg) | isocpp.org | SVG |
| C# | [Microsoft](https://raw.githubusercontent.com/dotnet/brand) | Wikipedia | SVG |
| PHP | [Wikipedia](https://commons.wikimedia.org/wiki/File:PHP-logo.svg) | php.net | SVG |
| Ruby | [Ruby-lang.org](https://www.ruby-lang.org/images/ruby-logo.png) | Wikipedia | PNG |
| TypeScript | [typescriptlang.org](https://www.typescriptlang.org/images/typescript-icon.png) | GitHub | PNG |

**Simple Icons Check**: Most languages tersedia di [simpleicons.org](https://simpleicons.org) dengan CDN links langsung

---

## 🔍 Quick Source Finder — Databases

| Database | Primary Source | Backup | Format |
|----------|---|---|---|
| PostgreSQL | [PostgreSQL](https://www.postgresql.org/media/img/about/press/elephant.png) | Wikipedia | PNG |
| MySQL | [MySQL](https://www.mysql.com/) (brand assets) | Wikipedia | PNG |
| MongoDB | [MongoDB](https://www.mongodb.com/pressroom) | Wikipedia | PNG |
| Redis | [redis.io](https://redis.io/) | Wikipedia | PNG |
| Elasticsearch | [Elastic](https://www.elastic.co/brand) | Wikipedia | PNG |
| Cassandra | [Apache](https://cassandra.apache.org/) | Wikipedia | PNG |
| DynamoDB | [AWS](https://aws.amazon.com/architecture/icons/) | Wikipedia | PNG |
| Oracle DB | [Oracle](https://www.oracle.com/) | Wikipedia | PNG |
| SQLite | [SQLite.org](https://www.sqlite.org/images/sqlite370_banner.gif) | Wikipedia | PNG |
| CouchDB | [CouchDB](https://couchdb.apache.org/) | Wikipedia | PNG |

---

## 💻 Quick Script Template — Batch Download

**File**: `scripts/download-icons.py`

```python
#!/usr/bin/env python3
import csv
import os
import requests
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

def download_icon(icon_name, url, output_dir, category):
    try:
        ext = '.svg' if 'svg' in url.lower() else '.png'
        filename = f"{icon_name.lower().replace(' ', '-')}{ext}"
        filepath = Path(output_dir) / category / filename
        
        filepath.parent.mkdir(parents=True, exist_ok=True)
        
        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        with open(filepath, 'wb') as f:
            f.write(response.content)
        
        logger.info(f"✅ {icon_name} → {filepath}")
        return True
        
    except Exception as e:
        logger.error(f"❌ {icon_name} (from {url}) → {str(e)}")
        return False

def main():
    import argparse
    
    parser = argparse.ArgumentParser()
    parser.add_argument('--csv', required=True, help='CSV file')
    parser.add_argument('--output-dir', default='./icon-sources/batch-2/')
    parser.add_argument('--workers', type=int, default=5)
    
    args = parser.parse_args()
    
    tasks = []
    with open(args.csv, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row.get('Downloaded') != 'True' and row.get('Source URL'):
                tasks.append({
                    'name': row['Icon Name'],
                    'url': row['Source URL'],
                    'category': row.get('Category', 'other'),
                })
    
    logger.info(f"Starting download of {len(tasks)} icons...")
    with ThreadPoolExecutor(max_workers=args.workers) as executor:
        results = executor.map(
            lambda t: download_icon(t['name'], t['url'], args.output_dir, t['category']),
            tasks
        )
    
    success = sum(results)
    total = len(tasks)
    logger.info(f"\n📊 Results: {success}/{total} successful")

if __name__ == '__main__':
    main()
```

**Usage**:
```bash
pip install requests
python scripts/download-icons.py --csv icon-sources-mapping.csv --output-dir ./icons/ --workers 5
```

---

## ✅ Post-Download Checklist

Setelah download, jalankan ini:

### 1. Validate Format
```bash
# Check SVG valid
for f in icons/*/*.svg; do
  xml lint "$f" > /dev/null && echo "✅ $f" || echo "❌ $f INVALID"
done

# Check PNG dimensions
for f in icons/*/*.png; do
  identify "$f" | grep -E "256x256|512x512|1024x1024" && echo "✅ $f" || echo "⚠️  $f LOW-RES"
done
```

### 2. Optimize Files
```bash
# Install tools
npm install -g svgo        # SVG optimizer
brew install optipng       # PNG optimizer

# Minify SVGs
svgo icons/**/*.svg --pretty

# Compress PNGs
optipng -o2 icons/**/*.png
```

### 3. License Check
```bash
cat > icons/LICENSE.md << 'EOF'
# Icon Batch 2 — License Attribution

...list each icon...

## General Notes
- All icons comply with their respective licenses
EOF
```

---

## 🎯 Priority Icons — Start Here

Jika ingin quick wins, prioritas icons ini:

1. Python — Wikipedia has clean SVG
2. JavaScript — Wikipedia
3. Docker — Official has excellent logo
4. PostgreSQL — Official website
5. React — GitHub repo clean logo
6. Kubernetes — CNCF official
7. Git — git-scm.com
8. GitHub — Official
9. AWS — AWS Architecture Icons
10. Node.js — nodejs.org

Target: Complete ini dalam 1-2 jam, test integration immediately.

---

## 🚨 Common Pitfalls & Solutions

| Problem | Solution |
|---------|----------|
| **404 Not Found** | Check URL jalan di browser dulu |
| **Timeout on big files** | Increase timeout, atau manual download |
| **SVG has broken XML** | Use SVGO to validate/fix, atau fallback ke PNG |
| **File too large** | Optimize dengan svgo/optipng |
| **License unclear** | Check terms of service, safer to find alternative |
| **Different naming schemes** | Standardize: `python.svg`, `postgres.svg` |
| **Forgotten to update CSV** | Keep download log real-time |

---

## 📞 Quick Support Links

- **Simple Icons CDN**: https://cdn.jsdelivr.net/npm/simple-icons/icons/
- **Wikimedia Commons Search**: https://commons.wikimedia.org/wiki/Main_Page
- **Brand Asset Collections**: https://brandcolors.net/ atau https://brandeps.com/
- **SVGO Playground**: https://jakearchibald.github.io/svgomg/

---

**Status**: Ready for implementation  
**Last Updated**: 2026-09-07
