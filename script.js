/*
DealerSpecialsHub
Google Sheet ID: 1goXqQsLki1EwkU50zKJTLUskJ_0k3tC_t7FgThJuCFo

This file is ready for Google Sheets connection.
To make live sheet data work:
1. Open your Google Sheet.
2. File > Share > Publish to web.
3. Publish the tab that contains your specials as CSV.
4. Replace SHEET_CSV_URL below with the published CSV link.

Recommended sheet columns:
Dealer ID, Dealer Name, Brand, Service Type, Special Title, Special Price,
Special URL, Address, City, State, ZIP, Latitude, Longitude, Rating, Review Count
*/

const SHEET_ID = "1goXqQsLki1EwkU50zKJTLUskJ_0k3tC_t7FgThJuCFo";
const SHEET_CSV_URL = ""; // paste published CSV URL here

const fallbackDeals = [
  {
    dealerName: "Toyota of Beverly Hills",
    brand: "Toyota",
    serviceType: "Oil Change",
    zip: "90210",
    distance: 1.8,
    rating: 4.6,
    reviews: 128,
    specials: 12,
    logo: "Toyota",
    specialUrl: "#"
  },
  {
    dealerName: "Honda of Santa Monica",
    brand: "Honda",
    serviceType: "Brake Service",
    zip: "90210",
    distance: 2.7,
    rating: 4.4,
    reviews: 96,
    specials: 9,
    logo: "Honda",
    specialUrl: "#"
  },
  {
    dealerName: "Sunset Ford",
    brand: "Ford",
    serviceType: "Tire Rotation",
    zip: "90210",
    distance: 3.4,
    rating: 4.5,
    reviews: 74,
    specials: 15,
    logo: "Ford",
    specialUrl: "#"
  },
  {
    dealerName: "Chevy of Culver City",
    brand: "Chevrolet",
    serviceType: "Battery Replacement",
    zip: "90210",
    distance: 4.1,
    rating: 4.3,
    reviews: 88,
    specials: 8,
    logo: "Chevy",
    specialUrl: "#"
  }
];

let allDeals = [...fallbackDeals];

const serviceTypeSelect = document.getElementById("serviceType");
const makeSelect = document.getElementById("make");
const zipInput = document.getElementById("zipCode");
const dealerGrid = document.getElementById("dealerGrid");
const activeZip = document.getElementById("activeZip");
const searchForm = document.getElementById("searchForm");
const changeZipBtn = document.getElementById("changeZipBtn");

function normalize(value) {
  return String(value || "").trim().toLowerCase();
}

function uniqueValues(items, key) {
  return [...new Set(items.map(item => item[key]).filter(Boolean))].sort();
}

function populateDropdowns() {
  const serviceValues = uniqueValues(allDeals, "serviceType");
  const makeValues = uniqueValues(allDeals, "brand");

  serviceTypeSelect.innerHTML = `<option value="">Select Service Type</option>` + 
    serviceValues.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");

  makeSelect.innerHTML = `<option value="">Select Make</option>` + 
    makeValues.map(value => `<option value="${escapeHtml(value)}">${escapeHtml(value)}</option>`).join("");
}

function renderDealers(deals) {
  if (!deals.length) {
    dealerGrid.innerHTML = `
      <article class="dealer-card skeleton-card">
        <div class="dealer-logo-placeholder"></div>
        <h3>No dealerships found</h3>
        <p>Try a different service type, make, or ZIP code.</p>
      </article>
    `;
    return;
  }

  dealerGrid.innerHTML = deals.map(deal => `
    <article class="dealer-card">
      <div class="dealer-logo">${escapeHtml(deal.logo || deal.brand || "Dealer")}</div>
      <h3>${escapeHtml(deal.dealerName || "Dealer Name")}</h3>
      <p class="distance">${formatDistance(deal.distance)}</p>
      <div class="rating">${stars(deal.rating)} <span>${escapeHtml(deal.rating || "4.5")} (${escapeHtml(deal.reviews || "0")})</span></div>
      <p class="special-count">${escapeHtml(deal.specials || 1)} Service Specials</p>
      <a class="view-specials" href="${escapeHtml(deal.specialUrl || "#")}" target="_blank" rel="noopener">
        View Specials <span>›</span>
      </a>
    </article>
  `).join("");
}

function formatDistance(distance) {
  if (distance === undefined || distance === null || distance === "") return "Mileage available after ZIP search";
  return `${Number(distance).toFixed(1)} miles away`;
}

function stars(rating) {
  const rounded = Math.round(Number(rating || 4.5));
  return "★".repeat(Math.min(5, Math.max(1, rounded)));
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function searchDeals() {
  const selectedService = normalize(serviceTypeSelect.value);
  const selectedMake = normalize(makeSelect.value);
  const zip = normalize(zipInput.value);

  if (zip) activeZip.textContent = zip;

  const filtered = allDeals.filter(deal => {
    const serviceMatch = !selectedService || normalize(deal.serviceType).includes(selectedService);
    const makeMatch = !selectedMake || normalize(deal.brand).includes(selectedMake);
    const zipMatch = !zip || normalize(deal.zip) === zip || !deal.zip;
    return serviceMatch && makeMatch && zipMatch;
  });

  const results = filtered.length ? filtered : allDeals.slice(0, 4);
  renderDealers(results.slice(0, 4));
}

function parseCsv(text) {
  const rows = [];
  let current = [];
  let value = "";
  let insideQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const next = text[i + 1];

    if (char === '"' && insideQuotes && next === '"') {
      value += '"';
      i++;
    } else if (char === '"') {
      insideQuotes = !insideQuotes;
    } else if (char === "," && !insideQuotes) {
      current.push(value);
      value = "";
    } else if ((char === "\n" || char === "\r") && !insideQuotes) {
      if (value || current.length) {
        current.push(value);
        rows.push(current);
        current = [];
        value = "";
      }
      if (char === "\r" && next === "\n") i++;
    } else {
      value += char;
    }
  }

  if (value || current.length) {
    current.push(value);
    rows.push(current);
  }

  return rows;
}

function mapSheetRows(rows) {
  if (!rows.length) return [];
  const headers = rows[0].map(h => normalize(h));

  return rows.slice(1).map(row => {
    const get = (...names) => {
      for (const name of names) {
        const index = headers.indexOf(normalize(name));
        if (index >= 0) return row[index];
      }
      return "";
    };

    return {
      dealerName: get("Dealer Name", "Name", "Dealer"),
      brand: get("Brand", "Make", "Vehicle Make"),
      serviceType: get("Service Type", "Category", "Service Category"),
      zip: get("ZIP", "Zip Code", "Postal Code"),
      distance: get("Distance", "Miles", "Mileage"),
      rating: get("Rating"),
      reviews: get("Review Count", "Reviews"),
      specials: get("Special Count", "Specials"),
      logo: get("Logo", "Brand", "Make"),
      specialUrl: get("Special URL", "URL", "Link")
    };
  }).filter(item => item.dealerName || item.brand || item.serviceType);
}

async function loadSheetData() {
  if (!SHEET_CSV_URL) {
    populateDropdowns();
    renderDealers(allDeals);
    return;
  }

  try {
    const response = await fetch(SHEET_CSV_URL);
    if (!response.ok) throw new Error("Could not load sheet data.");
    const csv = await response.text();
    const rows = parseCsv(csv);
    const mapped = mapSheetRows(rows);

    if (mapped.length) {
      allDeals = mapped;
    }

    populateDropdowns();
    renderDealers(allDeals.slice(0, 4));
  } catch (error) {
    console.warn(error);
    populateDropdowns();
    renderDealers(allDeals);
  }
}

searchForm.addEventListener("submit", event => {
  event.preventDefault();
  searchDeals();
});

changeZipBtn.addEventListener("click", () => {
  zipInput.focus();
  zipInput.select();
});

loadSheetData();
