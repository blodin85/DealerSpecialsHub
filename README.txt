DealerSpecialsHub Website Files
================================

Included files:
- index.html
- styles.css
- script.js
- README.txt

This version matches the simple, modern UI direction:
- Desktop website layout
- Mobile responsive layout
- DealerSpecialsHub header/logo styling
- Hero section
- Search fields:
  1. Service Type
  2. Make
  3. ZIP Code
- Top Dealerships Near You section
- Compare & Save / Local & Accurate / Trusted Dealers section
- About section using your full About DealerSpecialsHub copy
- Google Sheet ID included in script.js:
  1goXqQsLki1EwkU50zKJTLUskJ_0k3tC_t7FgThJuCFo

How to connect Google Sheets:
1. Open your Google Sheet.
2. Go to File > Share > Publish to web.
3. Choose the tab that contains your dealer specials.
4. Publish as CSV.
5. Copy the published CSV URL.
6. Open script.js.
7. Paste the URL here:
   const SHEET_CSV_URL = "";

Recommended Google Sheet columns:
- Dealer Name
- Brand or Make
- Service Type
- ZIP
- Distance or Miles
- Rating
- Review Count
- Special Count
- Special URL

Mileage:
- If your sheet already has Distance/Miles, the website will display it.
- If you want automatic mileage calculations later, add:
  - Dealer Latitude
  - Dealer Longitude
  Then the website can calculate distance from the user ZIP/geolocation using an API.

Important:
This is a static website, so it works on GitHub Pages.
If your Google Sheet is not published publicly as CSV, the site cannot read it directly.
