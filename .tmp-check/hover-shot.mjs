// Snapshot the SolaMate package card in its hover state via CDP.
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:9222'
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

async function main() {
  const list = await (await fetch(`${BASE}/json/list`)).json()
  const page = list.find((t) => t.type === 'page')
  if (!page) throw new Error('no page target')

  const ws = new WebSocket(page.webSocketDebuggerUrl)
  let id = 0
  const pending = new Map()
  ws.onmessage = (e) => {
    const msg = JSON.parse(e.data)
    if (msg.id && pending.has(msg.id)) {
      pending.get(msg.id)(msg)
      pending.delete(msg.id)
    }
  }
  await new Promise((r) => (ws.onopen = r))

  const send = (method, params = {}) =>
    new Promise((resolve) => {
      const n = ++id
      pending.set(n, resolve)
      ws.send(JSON.stringify({ id: n, method, params }))
    })

  await send('Page.enable')
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1400,
    deviceScaleFactor: 1,
    mobile: false,
  })
  await send('Page.navigate', { url: 'http://localhost:3000/solutions/solamate/' })
  await sleep(3500)

  // Scroll the package grid into view and read the first card's box.
  const { result } = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = document.querySelectorAll('article.group');
      const card = cards[0];
      if (!card) return JSON.stringify({ error: 'card not found' });
      card.scrollIntoView({ block: 'center' });
      const r = card.getBoundingClientRect();
      return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height });
    })()`,
    returnByValue: true,
  })
  const box = JSON.parse(result.result.value)
  console.log('card box', box)
  await sleep(500)

  // Re-read after scrolling (coordinates changed).
  const { result: r2 } = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.querySelectorAll('article.group')[0];
      const r = card.getBoundingClientRect();
      return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, scrollY: window.scrollY });
    })()`,
    returnByValue: true,
  })
  const b = JSON.parse(r2.result.value)

  // Hover the photo band (upper part of the card).
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: b.x + b.w / 2,
    y: b.y + 120,
  })
  await sleep(900)

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: b.x - 10, y: b.y + (b.scrollY||0) - 10, width: b.w + 20, height: Math.min(b.h, 900) + 20, scale: 1 },
  })
  fs.writeFileSync('D:/VN.solavita/.tmp-check/solamate-hover.png', Buffer.from(shot.result.data, 'base64'))
  console.log('saved')

  // Also a non-hover shot for comparison.
  await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 })
  await sleep(700)
  const shot2 = await send('Page.captureScreenshot', {
    format: 'png',
    clip: { x: b.x - 10, y: b.y + (b.scrollY||0) - 10, width: b.w + 20, height: Math.min(b.h, 900) + 20, scale: 1 },
  })
  fs.writeFileSync('D:/VN.solavita/.tmp-check/solamate-rest.png', Buffer.from(shot2.result.data, 'base64'))
  console.log('saved rest')
  ws.close()
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})