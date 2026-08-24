# Flowexa Website — Deployment Package

## Included
- `index.html` — complete responsive Flowexa website
- `assets/flowexa-full.png` — full Flowexa logo
- `assets/flowexa-mark.png` — Flowexa favicon/mark
- `assets/pdfs/` — free resource PDFs
- `robots.txt` and `sitemap.xml`

## Integrations already configured
- Cal.com: `https://cal.com/saudagar-zeeshan-sttyxl/30min`
- Google Apps Script `/exec`: configured in `index.html`
- Booked Job Score sends both `auditAnswers` and the calculated `auditScore` to the sheet

## GitHub Pages
1. Extract this ZIP.
2. Upload **all files inside this folder** to the root of your GitHub repository.
3. Confirm `index.html` is in the repository root.
4. GitHub → Settings → Pages → Deploy from branch → `main` → `/(root)`.
5. Open the published URL and test the forms.

## Required testing before launch
1. Submit Contact → confirm a row appears in Google Sheets.
2. Download each PDF → confirm the resource and contact details appear in Google Sheets.
3. Complete Booked Job Score → confirm `Type = audit`, `Audit Data` contains the answers and score.
4. Run the Revenue Leak Calculator and submit its analysis form → confirm the row.
5. Apply for the Free Pilot → confirm the row.
6. Click Book a Strategy Call → confirm Cal.com loads and that the booking creates the expected Google Calendar/Google Meet event.

## Important
The website uses `fetch(..., mode: "no-cors")` for the Apps Script endpoint, so the browser cannot read the Apps Script response. That is normal. The important test is whether the row is successfully appended to the Google Sheet.

For strategy calls, the website sends visitors directly to Cal.com rather than forcing them through a second Flowexa form. Configure your Cal.com event questions for any additional business information you want before the call.
