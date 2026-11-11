// Snapshot a page hero's H1 after forcing framer-motion's entrance state
// (headless Chrome pauses rAF, so `animate={{opacity:1}}` never commits).
// usage: node hero-shot.mjs <path-without-leading-slash> <outfile> [width]
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:9222'
const PATH = '/' + (process.argv[2] || 'solutions/business-solar/').replace(/^\/+/, '')
const OUT = process.argv[3] || '.tmp-check/hero.png'
const WIDTH = Number(process.argv[4] || 1440)
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))

const list = await (await fetch(`${BASE}/json/list`)).json()
const page = list.find((t) => t.type === 'page')
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
  width: WIDTH,
  height: 1000,
  deviceScaleFactor: 2,
  mobile: false,
})
await send('Page.navigate', { url: `http://127.0.0.1:3000${PATH}` })

let info = null
for (let i = 0; i < 60; i++) {
  const { result } = await send('Runtime.evaluate', {
    expression: `(() => {
      const h = document.querySelector('h1');
      if (!h) return null;
      const r = h.getBoundingClientRect();
      return JSON.stringify({ text: h.innerText.slice(0, 80), y: r.y, w: r.width, h: r.height });
    })()`,
    returnByValue: true,
  })
  if (result.result.value) {
    info = JSON.parse(result.result.value)
    break
  }
  await sleep(300)
}
if (!info) throw new Error('h1 not found at ' + PATH)

// Headless rAF is throttled, so the entrance animation never commits.
// Force the settled state before capturing.
await send('Runtime.evaluate', {
  expression: `
    document.querySelectorAll('h1, [data-hero-eyebrow]').forEach((el) => {
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('transform', 'none', 'important');
    });
    const sec = document.querySelector('section.hero-banner');
    if (sec) sec.querySelectorAll('p, div.flex, div.inline-flex').forEach((el) => {
      el.style.setProperty('opacity', '1', 'important');
      el.style.setProperty('transform', 'none', 'important');
    });
  `,
})
await sleep(400)
await send('Runtime.evaluate', { expression: `window.scrollTo(0, 0)` })
await sleep(200)

const { result: r2 } = await send('Runtime.evaluate', {
  expression: `(() => {
    const h = document.querySelector('h1');
    const r = h.getBoundingClientRect();
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, s: window.scrollY });
  })()`,
  returnByValue: true,
})
const b = JSON.parse(r2.result.value)
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  clip: {
    x: Math.max(0, b.x - 24),
    y: Math.max(0, b.y + b.s - 24),
    width: Math.min(WIDTH, b.w + 48),
    height: b.h + 48,
    scale: 1,
  },
})
fs.writeFileSync(`D:/VN.solavita/${OUT}`, Buffer.from(shot.result.data, 'base64'))
console.log('saved', OUT, PATH, info)
ws.close()
