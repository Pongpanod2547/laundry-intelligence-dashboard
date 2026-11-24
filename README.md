# LaundryIQ — Laundry Market Dashboard

Thai/English React dashboard with live competitor discovery through **Google Places API (New)**.

## Google Places setup

1. In Google Cloud Console, enable **Places API (New)** and configure billing/quotas.
2. Create a new API key. Restrict it to Places API (New); keep the key private.
3. In this project root (same folder as `package.json`), copy `.env.example` to `.env`.
4. Put your new key in `.env`:

```env
GOOGLE_PLACES_API_KEY=your_new_key_here
API_PORT=4000
```

5. Run the app:

```bash
npm install
npm run dev
```

Open http://localhost:5173 and search an area such as `ขอนแก่น` or `บางนา กรุงเทพฯ`. The frontend calls the local backend; the key is not sent to the browser. Do not put the key in a `VITE_` variable, commit `.env`, or share the ZIP with a real key inside it.

## Data integrity

- **Live Google Places data:** the competitor search panel shows business names, addresses, ratings, review counts, business status, phone/website where provided, and Google Maps links returned by the API.
- **Not live/verified:** overview KPIs, trends, sample competitor price chart, decorative map and AI insight are still demonstration content. Google Places does not reliably provide laundromat wash/dry prices; do not treat sample prices or KPI numbers as market facts.
- Search results depend on Google's coverage, query relevance, API quotas and billing. Results may be incomplete.

## API

- `GET /api/health` — backend status and whether an API key is configured (never returns the key).
- `GET /api/places/laundry?location=ขอนแก่น` — Google Places API (New) Text Search proxy.

## Docker

Create `.env` in the project root before running:

```bash
docker compose up --build
```

Open http://localhost:5173. Stop with `docker compose down`.


## Price comparison page (updated)
Open **Price Comparison** from the sidebar or page shortcuts. The page is now a standalone screen:
- If no Google Places results have been loaded, it shows a clear prompt and a button to find competitors.
- After searching competitors, return to Price Comparison; all returned listings appear with checkboxes and wash/dry price fields.
- You can select all/clear selection, enter verified prices, and see lowest and average prices for wash and dry separately.
- Google Places does not provide laundry cycle prices; enter prices checked directly with each business. The values remain in the current browser session and are not persisted to a database.

### Market Opportunity
The Market Opportunities page now shows live Google Places listing count, average rating among rated listings, and the number of listings rated 4.0 or below as research signals. These are not a definitive market-size or profit forecast: Google Places results may be incomplete, and low ratings should be validated by reading reviews and surveying local customers. Use the configured search area and search real stores first.
