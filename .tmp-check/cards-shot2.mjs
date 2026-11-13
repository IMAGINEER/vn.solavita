// Capture the SolaHome package grid + hover reveal after the disclosure
// was removed. usage: node cards-shot2.mjs <width>
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
await sleep(7000)

// Headless throttles rAF, so framer-motion entrance animations never commit.
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

await send('Input.dispatchMouseEvent', { type: 'mouseMoved', x: 5, y: 5 })
await ev(`(() => {
  const el = document.querySelector('#goi-cards')
  const top = el.getBoundingClientRect().top + window.scrollY
  window.scrollTo(0, Math.max(0, top - 90))
  return true
})()`)
await sleep(600)

const rectOf = async (sel) =>
  JSON.parse(
    await ev(`(() => {
      const el = document.querySelector(${JSON.stringify(sel)})
      if (!el) return null
      const r = el.getBoundingClientRect()
      return JSON.stringify({ x: r.x, y: r.y, w: r.width, h: r.height, s: window.scrollY })
    })()`),
  )

const shoot = async (sel, out) => {
  const b = await rectOf(sel)
  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    captureBeyondViewport: true,
    clip: {
      x: Math.max(0, b.x - 8),
      y: Math.max(0, b.y + b.s - 8),
      width: Math.min(WIDTH, b.w + 16),
      height: b.h + 16,
      scale: 1,
    },
  })
  fs.writeFileSync(`D:/VN.solavita/${out}`, Buffer.from(shot.result.data, 'base64'))
  console.log('saved', out, b)
}

await shoot('#goi-cards', `.tmp-check/solahome2-cards-${WIDTH}.png`)

if (WIDTH >= 1280) {
  const media = await rectOf('article.group > div.relative')
  await send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: Math.round(media.x + media.w / 2),
    y: Math.round(media.y + media.h / 2),
  })
  await sleep(700)
  await shoot('article.group', `.tmp-check/solahome2-hover-${WIDTH}.png`)
}

// Confirm the disclosure is gone and the CTA still sits at the card foot.
console.log(
  await ev(`(() => {
    const cards = [...document.querySelectorAll('#goi-cards article')]
    return JSON.stringify(cards.map((c) => ({
      hasDetails: !!c.querySelector('details'),
      h: Math.round(c.getBoundingClientRect().height),
      cta: !!c.querySelector('button'),
    })))
  })()`),
)

ws.close()