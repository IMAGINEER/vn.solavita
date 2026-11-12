// Snapshot the SolaHome package table (or any element via argv[3]).
// usage: node table-shot.mjs <path-without-leading-slash> <outfile> [selector] [width]
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:9222'
const PATH = '/' + (process.argv[2] || 'solutions/solahome/').replace(/^\/+/, '')
const OUT = process.argv[3] || '.tmp-check/table.png'
const SEL = process.argv[4] || 'table'
const WIDTH = Number(process.argv[5] || 1440)
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

let rect = null
for (let i = 0; i < 60; i++) {
  const { result } = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.querySelector(${JSON.stringify(SEL)});
      if (!el) return null;
      el.scrollIntoView({ block: 'center' });
      const r = el.getBoundingClientRect();
      return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, s: window.scrollY });
    })()`,
    returnByValue: true,
  })
  const v = result.result.value
  if (v) {
    rect = JSON.parse(v)
    break
  }
  await sleep(400)
}
if (!rect) throw new Error('selector not found: ' + SEL)
await sleep(900)

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  clip: {
    x: Math.max(0, rect.x - 8),
    y: Math.max(0, rect.y + rect.s - 8),
    width: Math.min(WIDTH, rect.w + 16),
    height: Math.min(rect.h + 16, 2400),
    scale: 1,
  },
})
fs.writeFileSync(`D:/VN.solavita/${OUT}`, Buffer.from(shot.result.data, 'base64'))
console.log('saved', OUT, PATH, rect)
ws.close()