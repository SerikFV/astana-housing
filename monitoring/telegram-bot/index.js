const http = require('http')
const https = require('https')

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN || ''
const CHAT_ID        = process.env.TELEGRAM_CHAT_ID || ''

function sendTelegram(text) {
  if (!TELEGRAM_TOKEN || !CHAT_ID) {
    console.log('⚠️  TELEGRAM_TOKEN немесе CHAT_ID орнатылмаған')
    return
  }
  const body = JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: 'HTML' })
  const req = https.request({
    hostname: 'api.telegram.org',
    path: `/bot${TELEGRAM_TOKEN}/sendMessage`,
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Content-Length': Buffer.byteLength(body) },
  })
  req.write(body)
  req.end()
}

const server = http.createServer((req, res) => {
  if (req.method !== 'POST' || req.url !== '/alert') {
    res.writeHead(404)
    return res.end()
  }

  let data = ''
  req.on('data', chunk => data += chunk)
  req.on('end', () => {
    try {
      const payload = JSON.parse(data)
      for (const alert of payload.alerts || []) {
        const status   = alert.status === 'firing' ? '🔴 ЕСКЕРТУ' : '✅ ШЕШІЛДІ'
        const name     = alert.labels?.alertname || 'Белгісіз'
        const summary  = alert.annotations?.summary || ''
        const msg = `${status}\n<b>${name}</b>\n${summary}`
        sendTelegram(msg)
        console.log('Alert жіберілді:', name)
      }
    } catch (e) {
      console.error('Parse қатесі:', e)
    }
    res.writeHead(200)
    res.end('ok')
  })
})

server.listen(8080, () => console.log('✅ Telegram bot іске қосылды: port 8080'))
