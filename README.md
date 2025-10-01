# Iranian Businesses Data Reports

A simple, searchable archive of data reports published by Iranian businesses. Browse by year and category, and download PDFs directly.

![Project preview](ibr-preview.png)

- Live site: `https://mahdimajidzadeh.github.io/iranian-businesses-data-reports/`
- Source repository: `https://github.com/MahdiMajidzadeh/iranian-businesses-data-reports`
- Related data source: `https://github.com/saeedesmaili/iranian-businesses-data-reports`

### Features
- Search by title, year, or category
- Filter by year and tags, with a quick "Show All" toggle
- Sorted newest-first
- Direct links to download each report as PDF

### Getting started (local)
1. Clone the repository.
2. Serve the directory with any static server (so `output.json` loads correctly). For example:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

### Project structure
- `index.html` — main page and meta tags
- `style.css` — styling
- `app.js` — data loading, search, filters, and rendering
- `output.json` — dataset describing reports
- `reports/` — PDF files (downloaded via links)

### Contributing
- Open an issue to suggest a new report or improvement.
- PRs are welcome for UI/UX, performance, accessibility, or data updates.

---

### Tasks to do
- [ ] add favicon
- [x] add serach
- [x] better view for tags
- [x] add meta tags for better preveiw in socials and other
- [x] add all to filters to show all reports after select one of tags 
