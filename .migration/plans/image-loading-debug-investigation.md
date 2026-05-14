# Image Loading Fix Plan — Placeholder Images

## Problem Summary

The homepage at your AEM Edge Delivery site has **14 broken images**, primarily in the **Cards blocks** and **Tabs block**. Only 2 images (in the Columns/hero section) load correctly.

## Root Cause

The `media_` hash filenames in the page content reference image files that either don't exist or contain wrong content in your SharePoint document library. The content is served from SharePoint, and the media files need to be present there for images to render.

| Category | Count | Symptom |
|----------|-------|---------|
| **Working images** | 2 | Load correctly (1216x832px, ~44-64KB) |
| **Tiny placeholder images** | 2 | Render as 24x24px icons (~500 bytes) |
| **Completely broken images** | 10 | Don't load at all (0x0px, 404) |

### Affected Blocks
- **Cards block** ("Trends made for your lifestyle") — 8 card images broken
- **Cards block** ("Style that never sleeps") — 4 story images broken
- **Tabs block** — 2 of 3 tab images broken

## Fix Approach: Placeholder Images

Since image generation isn't available, we'll replace the broken `media_` references in the page HTML with placeholder image URLs from a service like `placehold.co`. This provides properly sized, themed placeholders until real images are authored in SharePoint.

### Image Sizing Plan
| Block | Placeholder Size | Label/Theme |
|-------|-----------------|-------------|
| Cards ("Trends") | 600x400 | Fashion trend categories |
| Cards ("Stories") | 600x400 | Story thumbnails |
| Tabs | 800x500 | Lifestyle/trend imagery |

### Steps
1. Fetch the page's source HTML from AEM (`*.plain.html` or content endpoint)
2. Identify all broken `media_` image references
3. Replace each broken reference with a `placehold.co` URL of appropriate dimensions
4. Update the content HTML file
5. Preview and verify all images render correctly

### Important Note
- Placeholder images are **temporary** — real photos should be authored in SharePoint for production
- This fix modifies the local content HTML; changes need to be pushed and published to reflect on the live site

## Checklist

- [x] Inspect live page for image loading status
- [x] Identify which images work vs. fail (14 broken, 2 working)
- [x] Determine root cause (missing/wrong media files in SharePoint)
- [x] Choose fix approach (placeholder images)
- [ ] Fetch page source HTML from AEM content endpoint
- [ ] Map each broken image to appropriate placeholder dimensions and labels
- [ ] Replace all 14 broken `media_` references with placeholder URLs
- [ ] Push updated content and preview
- [ ] Verify all images render correctly on the live page
- [ ] Address header/footer loading errors (separate issue)

---

> **To begin implementation, switch to Execute mode.**
