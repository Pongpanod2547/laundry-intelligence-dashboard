import 'dotenv/config'
import express from 'express'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const app = express()
const port = Number(process.env.API_PORT || 4000)
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({
  ok: true,
  source: 'Google Places API (New)',
  apiKeyConfigured: Boolean(process.env.GOOGLE_PLACES_API_KEY)
}))

app.get('/api/places/laundry', async (req, res) => {
  const location = String(req.query.location || 'ขอนแก่น').trim()
  if (!location) return res.status(400).json({ error: 'กรุณาระบุพื้นที่ เช่น ขอนแก่น' })
  const apiKey = process.env.GOOGLE_PLACES_API_KEY
  if (!apiKey) return res.status(503).json({ error: 'ยังไม่ได้ตั้งค่า GOOGLE_PLACES_API_KEY ในไฟล์ .env ฝั่ง Backend' })

  try {
    // Places API (New) Text Search. API key remains on the server; never expose it to Vite/client code.
    const response = await fetch('https://places.googleapis.com/v1/places:searchText', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Goog-Api-Key': apiKey,
        'X-Goog-FieldMask': 'places.id,places.displayName,places.formattedAddress,places.location,places.rating,places.userRatingCount,places.businessStatus,places.googleMapsUri,places.websiteUri,places.nationalPhoneNumber,places.primaryType'
      },
      body: JSON.stringify({
        textQuery: `laundromat in ${location}, Thailand`,
        languageCode: 'th',
        regionCode: 'TH',
        maxResultCount: 20
      })
    })

    const data = await response.json().catch(() => ({}))
    if (!response.ok) {
      const apiMessage = data?.error?.message || `Google Places API error (${response.status})`
      const message = response.status === 403
        ? `Google Places API ปฏิเสธคำขอ (403): ตรวจสอบว่าเปิด Places API (New), เปิด Billing และจำกัด API Key ถูกต้องแล้ว — ${apiMessage}`
        : response.status === 429
          ? `เรียก Google Places API เกินโควตา กรุณารอสักครู่ — ${apiMessage}`
          : apiMessage
      return res.status(response.status === 429 ? 429 : 502).json({ error: message })
    }

    const places = (data.places || []).map(place => ({
      id: place.id,
      name: place.displayName?.text || 'Unnamed place',
      address: place.formattedAddress || 'ไม่มีที่อยู่จาก Google Places',
      lat: place.location?.latitude ?? null,
      lng: place.location?.longitude ?? null,
      rating: typeof place.rating === 'number' ? place.rating : null,
      reviews: Number.isInteger(place.userRatingCount) ? place.userRatingCount : null,
      status: place.businessStatus || 'UNKNOWN',
      mapsUrl: place.googleMapsUri || '',
      website: place.websiteUri || '',
      phone: place.nationalPhoneNumber || '',
      category: place.primaryType || 'laundry'
    })).filter(place => place.id)

    res.json({
      source: 'Google Places API (New)',
      queriedAt: new Date().toISOString(),
      location,
      count: places.length,
      places,
      note: 'Google Places data; availability, ratings and details depend on Google listing and API response.'
    })
  } catch (err) {
    res.status(502).json({ error: err instanceof Error ? err.message : 'เกิดข้อผิดพลาดในการค้นหา Google Places' })
  }
})

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const dist = path.resolve(__dirname, '../dist')
app.use(express.static(dist))
app.get('*', (_req, res) => res.sendFile(path.join(dist, 'index.html')))
app.listen(port, () => console.log(`LaundryIQ Google Places API server listening on ${port}`))
