# Theme Plan: Light/Dark Toggle untuk Web Dashboard

## Pendekatan
CSS custom properties + `data-theme="light|dark"` attribute di `<html>`. Semua warna UI shell diganti ke variabel CSS. Content/animasi tetap dark.

---

## Langkah Implementasi

### 1. Buat `useTheme` hook (`src/hooks/useTheme.js`)
- Read dari `localStorage('theme')` (default: `'dark'`)
- Set `document.documentElement.setAttribute('data-theme', theme)`
- Persist ke localStorage
- Export ThemeProvider + useTheme context

### 2. Buat CSS variables (`src/styles/theme-ui.css`)
- `:root` = dark values (default, backward compatible)
- `[data-theme="light"]` = light palette
- Variables: `--ui-bg`, `--ui-bg-alt`, `--ui-bg-card`, `--ui-bg-input`, `--ui-border`, `--ui-text`, `--ui-text-secondary`, `--ui-text-muted`
- Import di `main.jsx`

### 3. Update CSS files — ganti hard-coded hex ke `var(--ui-*)`

| File | Yang diubah |
|------|------------|
| `App.css` | `body` background/color |
| `ContentList.css` | backgrounds, borders, text |
| `PlayerShell.css` | backgrounds, borders, buttons, export overlay |
| `ExportHistory.css` | backgrounds, borders, table |
| `ContentManagement/ContentManagement.css` | backgrounds, borders |
| `ContentCard.css` | card bg, borders, text |
| `ContentPreview.css` | backgrounds |
| `ProgressIndicator.css` | backgrounds, borders |
| `TimelineProgressBar.css` | background |
| `SettingsModal.module.css` | modal bg, borders |

### 4. TIDAK diubah (content tetap dark)
- `src/styles/theme.css` (animation vars)
- `MCPAnimation.css`, `NetworkDiagram.css`, `animations.css`
- Inline styles di animation components

### 5. Tambah theme toggle ke `SettingsModal.jsx`
- Section "Appearance" di antara SFX toggle dan info box
- Dua pilihan: Dark / Light (radio buttons styled)

### 6. Tambah theme icon toggle di `ContentList.jsx` header
- Icon moon/sun di sebelah "History" button

### 7. Wrap App dengan ThemeProvider di `App.jsx`

---

## Light Palette

```
--ui-bg:          #f8f9fc     (page bg)
--ui-bg-alt:      #ffffff     (sidebar/panels)
--ui-bg-card:     #ffffff     (cards)
--ui-bg-input:    #f1f5f9     (input fields)
--ui-border:      #e2e8f0     (borders)
--ui-text:        #1e293b     (primary text)
--ui-text-sec:    #475569     (secondary text)
--ui-text-muted:  #94a3b8     (muted text)
```

---

## Dark Palette (current, ke default)

```
--ui-bg:          #090b15     (page bg)
--ui-bg-alt:      #0d1522     (sidebar/panels)
--ui-bg-card:     #0d1117     (cards)
--ui-bg-input:    #0f172a     (input fields)
--ui-border:      #1e3048     (borders)
--ui-text:        #c0ccd8     (primary text)
--ui-text-sec:    #94a3b8     (secondary text)
--ui-text-muted:  #4a6080     (muted text)
```

---

## File yang dibuat/diubah

### Baru
- `src/hooks/useTheme.js`
- `src/styles/theme-ui.css`

### Diubah
- `main.jsx` — import theme-ui.css
- `App.jsx` — wrap ThemeProvider
- `ContentList.jsx` — theme toggle icon di header
- `SettingsModal.jsx` — theme section di modal
- 10 CSS files (ganti hex ke var)
