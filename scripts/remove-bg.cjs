// Background removal via flood-fill from image corners
// Detects background color automatically from corner pixels
const Jimp = require('jimp')
const path = require('path')
const fs = require('fs')

const ASSETS_IN  = path.join(__dirname, '..', 'public', 'assets')
const ASSETS_OUT = path.join(__dirname, '..', 'public', 'assets')

// Per-image tolerance tuning (some chars share colors with background)
const CONFIG = {
  'mitos.png':      { tolerance: 55 },
  'pampee.png':     { tolerance: 50 },   // yellow armor, bright yellow bg
  'galdios.png':    { tolerance: 55 },
  'nia.png':        { tolerance: 45 },  // purple bg near purple char — careful
  'claudianis.png': { tolerance: 65 },
  'surto.png':      { tolerance: 50 },
  'impasse.png':    { tolerance: 55 },
  'fragmento.png':  { tolerance: 50 },
  'eclipse.png':    { tolerance: 40 },  // very dark, character also dark
}

function colorDist(c1, c2) {
  const r1 = (c1 >>> 24) & 0xFF, g1 = (c1 >>> 16) & 0xFF, b1 = (c1 >>> 8) & 0xFF
  const r2 = (c2 >>> 24) & 0xFF, g2 = (c2 >>> 16) & 0xFF, b2 = (c2 >>> 8) & 0xFF
  return Math.sqrt((r1-r2)**2 + (g1-g2)**2 + (b1-b2)**2)
}

async function removeBackground(filename, tolerance) {
  const inputPath = path.join(ASSETS_IN, filename)
  if (!fs.existsSync(inputPath)) {
    console.log(`  SKIP (not found): ${filename}`)
    return
  }

  const img = await Jimp.read(inputPath)
  const w = img.getWidth()
  const h = img.getHeight()

  // Sample background from all 4 corners and pick most common
  const corners = [
    img.getPixelColor(0, 0),
    img.getPixelColor(w - 1, 0),
    img.getPixelColor(0, h - 1),
    img.getPixelColor(w - 1, h - 1),
    img.getPixelColor(Math.floor(w / 2), 0),   // top center
    img.getPixelColor(0, Math.floor(h / 2)),    // left center
  ]
  // Use top-left as primary bg color (most reliable for these images)
  const bgColor = corners[0]
  const r = (bgColor >>> 24) & 0xFF
  const g = (bgColor >>> 16) & 0xFF
  const b = (bgColor >>> 8) & 0xFF
  console.log(`  ${filename}: bg color = rgb(${r},${g},${b}), tolerance = ${tolerance}`)

  // Iterative flood-fill from all 4 corners using a stack
  const visited = new Uint8Array(w * h)
  const stack = [0, w - 1, (h - 1) * w, (h - 1) * w + w - 1]
  // Also seed from top/bottom/left/right edges to handle edge cases
  for (let x = 0; x < w; x++) {
    stack.push(x)               // top row
    stack.push((h - 1) * w + x) // bottom row
  }
  for (let y = 0; y < h; y++) {
    stack.push(y * w)           // left col
    stack.push(y * w + w - 1)  // right col
  }

  while (stack.length > 0) {
    const idx = stack.pop()
    if (idx < 0 || idx >= w * h) continue
    if (visited[idx]) continue
    visited[idx] = 1

    const x = idx % w
    const y = Math.floor(idx / w)
    const pixColor = img.getPixelColor(x, y)
    const alpha = pixColor & 0xFF
    if (alpha === 0) continue // already transparent

    if (colorDist(pixColor, bgColor) <= tolerance) {
      img.setPixelColor(0x00000000, x, y)
      if (x + 1 < w)  stack.push(idx + 1)
      if (x - 1 >= 0) stack.push(idx - 1)
      if (y + 1 < h)  stack.push(idx + w)
      if (y - 1 >= 0) stack.push(idx - w)
    }
  }

  // Light edge cleanup — soften remaining fringe pixels
  img.scan(0, 0, w, h, function(x, y, idx_) {
    const alpha = this.bitmap.data[idx_ + 3]
    if (alpha > 0 && alpha < 128) {
      this.bitmap.data[idx_ + 3] = 0
    }
  })

  await img.writeAsync(path.join(ASSETS_OUT, filename))
  console.log(`  ✓ Saved: ${filename}`)
}

async function main() {
  console.log('Removing backgrounds...\n')
  for (const [filename, cfg] of Object.entries(CONFIG)) {
    try {
      await removeBackground(filename, cfg.tolerance)
    } catch (err) {
      console.error(`  ERROR ${filename}:`, err.message)
    }
  }
  console.log('\nDone!')
}

main()
