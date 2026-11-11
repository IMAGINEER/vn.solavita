// Snapshot the SolaMate package card at a narrow width (inline fallback).
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:9222'
const WIDTH = Number(process.argv[2] || 1024)
const OUT = process.argv[3] || '.tmp-check/solamate-1024.png'
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
  height: 900,
  deviceScaleFactor: 1,
  mobile: WIDTH < 640,
})
await send('Page.navigate', { url: 'http://localhost:3000/solutions/solamate/' })
for (let i=0;i<40;i++){ const {result:chk}=await send('Runtime.evaluate',{expression:"document.querySelectorAll('article.group').length",returnByValue:true}); if (chk.result.value>0) break; await sleep(500) }

const { result } = await send('Runtime.evaluate', {
  expression: `(() => {
    const card = document.querySelectorAll('article.group')[0];
    if (!card) return JSON.stringify({ error: 'card not found' });
    card.scrollIntoView({ block: 'center' });
    return 'ok';
  })()`,
  returnByValue: true,
})
await sleep(500)
const { result: r2 } = await send('Runtime.evaluate', {
  expression: `(() => {
    const card = document.querySelectorAll('article.group')[0];
    const r = card.getBoundingClientRect();
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, s: window.scrollY });
  })()`,
  returnByValue: true,
})
const b = JSON.parse(r2.result.value)
const shot = await send('Page.captureScreenshot', {
  format: 'png',
  clip: { x: Math.max(0, b.x - 8), y: b.y + b.s - 8, width: Math.min(WIDTH, b.w + 16), height: Math.min(b.h + 16, 1600), scale: 1 },
})
fs.writeFileSync(`D:/VN.solavita/${OUT}`, Buffer.from(shot.result.data, 'base64'))
console.log('saved', OUT, b)
ws.close()