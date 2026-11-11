/**
 * One-off extractor for the Skyworth PV case deck.
 *
 * The .pptx is a zip archive whose entries are deflate-compressed, and
 * this environment's shell refuses unzip / tar / python, so we parse the
 * zip central directory by hand and inflate each entry with zlib.
 *
 *   node .tmp-deck/extract.js
 *
 * Writes:
 *   .tmp-deck/ppt/...      every entry (slides, rels, media)
 *   .tmp-deck/slides-index.txt
 *                          one block per slide: the slide's text runs
 *                          followed by the media files it references
 *                          (resolved through the slide's .rels)
 */
const fs = require('fs')
const path = require('path')
const zlib = require('zlib')

const src = 'docs/20260921_创维光伏海外案例.pptx'
const out = '.tmp-deck'

const buf = fs.readFileSync(src)

// --- locate the End Of Central Directory record -------------------------
let eocd = -1
const min = Math.max(0, buf.length - 22 - 0xffff)
for (let i = buf.length - 22; i >= min; i--) {
  if (buf.readUInt32LE(i) === 0x06054b50) {
    eocd = i
    break
  }
}
if (eocd < 0) throw new Error('EOCD not found')

const count = buf.readUInt16LE(eocd + 10)
let off = buf.readUInt32LE(eocd + 16)

let written = 0
let skipped = 0

for (let n = 0; n < count; n++) {
  if (buf.readUInt32LE(off) !== 0x02014b50) break

  const method = buf.readUInt16LE(off + 10)
  const compSize = buf.readUInt32LE(off + 20)
  const nameLen = buf.readUInt16LE(off + 28)
  const extraLen = buf.readUInt16LE(off + 30)
  const commentLen = buf.readUInt16LE(off + 32)
  const localOff = buf.readUInt32LE(off + 42)
  const name = buf.toString('utf8', off + 46, off + 46 + nameLen)

  const lNameLen = buf.readUInt16LE(localOff + 26)
  const lExtraLen = buf.readUInt16LE(localOff + 28)
  const dataStart = localOff + 30 + lNameLen + lExtraLen
  const raw = buf.subarray(dataStart, dataStart + compSize)

  try {
    let data
    if (method === 0) data = Buffer.from(raw)
    else if (method === 8) data = zlib.inflateRawSync(raw)
    else {
      skipped++
      off += 46 + nameLen + extraLen + commentLen
      continue
    }
    const dest = path.join(out, name)
    fs.mkdirSync(path.dirname(dest), { recursive: true })
    fs.writeFileSync(dest, data)
    written++
  } catch (err) {
    skipped++
  }

  off += 46 + nameLen + extraLen + commentLen
}

// --- slide index: text runs + referenced media ---------------------------
const slidesDir = path.join(out, 'ppt', 'slides')
const slideFiles = fs.existsSync(slidesDir)
  ? fs
      .readdirSync(slidesDir)
      .filter((f) => /^slide\d+\.xml$/.test(f))
      .sort((a, b) => {
        const na = Number(a.match(/\d+/)[0])
        const nb = Number(b.match(/\d+/)[0])
        return na - nb
      })
  : []

const index = []

for (const file of slideFiles) {
  const xml = fs.readFileSync(path.join(slidesDir, file), 'utf8')

  // <a:t>…</a:t> — the visible text of the slide, in document order.
  const texts = []
  const textRe = /<a:t>([\s\S]*?)<\/a:t>/g
  let m
  while ((m = textRe.exec(xml)) !== null) {
    const t = m[1]
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'")
    if (t.trim()) texts.push(t.trim())
  }

  // media referenced by this slide, via its .rels file
  const relFile = path.join(slidesDir, '_rels', file + '.rels')
  const media = []
  if (fs.existsSync(relFile)) {
    const rels = fs.readFileSync(relFile, 'utf8')
    const relRe = /Target="([^"]*media\/[^"]+)"/g
    let r
    while ((r = relRe.exec(rels)) !== null) {
      const target = r[1].replace('../', 'ppt/')
      media.push(path.basename(target))
    }
  }

  index.push(
    `\n===== ${file} =====\n` +
      (texts.length ? texts.join('\n') : '(no text)') +
      (media.length ? `\n--- media: ${media.join(', ')}` : ''),
  )
}

fs.writeFileSync(path.join(out, 'slides-index.txt'), index.join('\n'))

console.log(`entries in central directory: ${count}`)
console.log(`extracted: ${written}, skipped: ${skipped}`)
console.log(`slides indexed: ${slideFiles.length}`)
console.log('wrote .tmp-deck/slides-index.txt')
