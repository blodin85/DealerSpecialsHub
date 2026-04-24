// DealerSpecialsHub demo behavior.
// Your Google Sheet ID from earlier:
const GOOGLE_SHEET_ID = "1goXqQsLki1EwkU50zKJTLUskJ_0k3tC_t7FgThJuCFo";

// IMPORTANT:
// To fully connect live Google Sheet data, publish your sheet as CSV and replace SHEET_CSV_URL below.
// Example format:
// https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/gviz/tq?tqx=out:csv&sheet=Service%20Specials
const SHEET_CSV_URL = "";

const form = document.getElementById("searchForm");
const cards = Array.from(document.querySelectorAll(".deal-card"));
const note = document.getElementById("resultNote");

function normalize(value){
  return (value || "").trim().toLowerCase();
}

form.addEventListener("submit", function(event){
  event.preventDefault();

  const service = normalize(document.getElementById("serviceType").value);
  const make = normalize(document.getElementById("make").value);
  const zip = normalize(document.getElementById("zipCode").value);

  let visibleCount = 0;

  cards.forEach(card => {
    const cardService = normalize(card.dataset.service);
    const cardMake = normalize(card.dataset.make);
    const cardZip = normalize(card.dataset.zip);

    const serviceMatch = !service || cardService.includes(service);
    const makeMatch = !make || cardMake.includes(make);
    const zipMatch = !zip || cardZip === zip;

    const show = serviceMatch && makeMatch && zipMatch;
    card.style.display = show ? "block" : "none";
    if(show) visibleCount++;
  });

  note.textContent = visibleCount
    ? `${visibleCount} sample special${visibleCount === 1 ? "" : "s"} matched your search.`
    : "No sample matches found. Live Google Sheet results can replace these cards.";
});

// Mileage note:
// Real mileage requires dealer latitude/longitude in your sheet or a geocoding service.
// The UI is built to display mileage once those fields are available.
