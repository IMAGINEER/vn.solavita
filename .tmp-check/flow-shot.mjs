// Capture the SolaHome "LẮP ĐẶT & HẬU MÃI" snake flow.
// usage: node flow-shot.mjs <width>
import fs from 'node:fs'

const BASE = 'http://127.0.0.1:9222'
const WIDTH = Number(process.argv[2] || 1440)
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
const ev = async (expression) => {
  const { result } = await send('Runtime.evaluate', {
    expression,
    returnByValue: true,
  })
  return result.result.value
}

await send('Page.enable')
await send('Emulation.setDeviceMetricsOverride', {
  width: WIDTH,
  height: 1600,
  deviceScaleFactor: 2,
  mobile: false,
})
await send('Page.navigate', { url: 'http://127.0.0.1:3000/solutions/solahome/' })
await sleep(8000)

// Settle framer-motion inline styles only; class-based opacity stays.
await ev(`(() => {
  const s = document.createElement('style')
  s.textContent = '*, *::before, *::after { animation: none !important; }[style*="opacity: 0"]{opacity:1 !important;transform:none !important}'
  document.head.appendChild(s)
  document.querySelectorAll('[style]').forEach((el) => {
    if (el.style.opacity === '0') {
      el.style.setProperty('opacity', '1', 'important')
      el.style.setProperty('transform', 'none', 'important')
    }
  })
  return true
})()`)

const rect = JSON.parse(
  await ev(`(() => {
    const sec = [...document.querySelectorAll('section')].find((s) =>
      s.textContent.includes('LẮP ĐẶT & HẬU MÃI'),
    )
    if (!sec) return 'null'
    sec.scrollIntoView({ block: 'start' })
    const r = sec.getBoundingClientRect()
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, s: window.scrollY })
  })()`),
)
await sleep(700)
const rect2 = JSON.parse(
  await ev(`(() => {
    const sec = [...document.querySelectorAll('section')].find((s) =>
      s.textContent.includes('LẮP ĐẶT & HẬU MÃI'),
    )
    const r = sec.getBoundingClientRect()
    return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, s: window.scrollY })
  })()`),
)
console.log('section', rect, rect2)

const shot = await send('Page.captureScreenshot', {
  format: 'png',
  captureBeyondViewport: true,
  clip: {
    x: Math.max(0, rect2.x),
    y: Math.max(0, rect2.y + rect2.s),
    width: Math.min(WIDTH, rect2.w),
    height: rect2.h,
    scale: 1,
  },
})
const out = `.tmp-check/solahome-flow-${WIDTH}.png`
fs.writeFileSync(`D:/VN.solavita/${out}`, Buffer.from(shot.result.data, 'base64'))
console.log('saved', out)

// Report the placement of each numbered card and whether the arrows exist.
console.log(
  await ev(`(() => {
    const ol = [...document.querySelectorAll('ol')].find((o) => o.textContent.includes('Khảo sát miễn phí'))
    const lis = [...ol.children]
    return JSON.stringify({
      cols: getComputedStyle(ol).gridTemplateColumns,
      cards: lis.map((li) => {
        const r = li.getBoundingClientRect()
        return { n: li.textContent.trim().slice(0, 2), x: Math.round(r.x), y: Math.round(r.y), h: Math.round(r.height) }
      }),
      arrows: lis.map((li) => li.querySelectorAll('[aria-hidden="true"]').length),
    })
  })()`),
)

ws.close()