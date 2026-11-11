/**
 * One-off extractor for the Skyworth PV case deck.
 *
 * The .pptx is a zip archive whose entries are deflate-compressed, and
 * this environment's shell refuses unzip / tar / python, so we parse the
 * zip central directory by hand and inflate each entry with zlib.
 *
 *   node .tmp-deck/extract.js
 *
 * Writes every entry into .tmp-deck/ (slides + rels + media).
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

console.log(`entries in central directory: ${count}`)
console.log(`extracted: ${written}, skipped: ${skipped}`)
