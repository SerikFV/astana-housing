// apartments.json -> seed SQL генератор
const fs = require('fs')
const path = require('path')

const data = JSON.parse(fs.readFileSync(path.join(__dirname, '../public/apartments.json'), 'utf8'))

const escape = (v) => v == null ? 'NULL' : `'${String(v).replace(/'/g, "''")}'`
const num = (v) => (v == null || v === '') ? 'NULL' : Number(v)

let sql = `-- Auto-generated seed from apartments.json (${data.length} records)\nTRUNCATE TABLE apartments RESTART IDENTITY CASCADE;\n\n`

// Batch insert 500 at a time
const BATCH = 500
for (let i = 0; i < data.length; i += BATCH) {
  const batch = data.slice(i, i + BATCH)
  sql += `INSERT INTO apartments (id, residential_complex_name, district, rooms, area, floor, total_floors, price_usd, price_local, price_per_m2, house_type, year_built, condition, bathroom, balcony, parking, furniture, heating, address, latitude, longitude, url, created_at) VALUES\n`
  sql += batch.map(a =>
    `(${num(a.id)}, ${escape(a.residential_complex_name)}, ${escape(a.district)}, ${num(a.rooms)}, ${num(a.area)}, ${num(a.floor)}, ${num(a.total_floors)}, ${num(a.price_usd)}, ${num(a.price_local)}, ${num(a.price_per_m2)}, ${escape(a.house_type)}, ${num(a.year_built)}, ${escape(a.condition)}, ${escape(a.bathroom)}, ${escape(a.balcony)}, ${escape(a.parking)}, ${escape(a.furniture)}, ${escape(a.heating)}, ${escape(a.address)}, ${num(a.latitude)}, ${num(a.longitude)}, ${escape(a.url)}, NOW())`
  ).join(',\n')
  sql += ';\n\n'
}

fs.writeFileSync(path.join(__dirname, 'seed-full.sql'), sql)
console.log(`Done: ${data.length} apartments written to database/seed-full.sql`)
