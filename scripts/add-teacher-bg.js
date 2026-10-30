import Jimp from 'jimp'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = resolve(__dirname, '../public/assets')
const SRC = 'C:/Users/PROERD/Downloads/Gemini_Generated_Image_gtbmchgtbmchgtbm.jpg'

const PANELS = [
  { name: 'lucianis',  index: 0 },
  { name: 'ludmilis',  index: 1 },
  { name: 'gabrielis', index: 2 },
]

// Flood-fill from all 4 corners replacing checkered (gray/white neutral pixels) with white
function removeCheckered(img) {
  const w = img.getWidth()
  const h = img.getHeight()
  const data = img.bitmap.data
  const visited = new Uint8Array(w * h)

  function isNeutralGray(x, y) {
    const i = (y * w + x) * 4
    const r = data[i], g = data[i + 1], b = data[i + 2]
    return r > 150 && g > 150 && b > 150 && Math.abs(r - g) < 25 && Math.abs(g - b) < 25
  }

  function fill(sx, sy) {
    if (!isNeutralGray(sx, sy)) return
    const stack = [[sx, sy]]
    while (stack.length) {
      const [x, y] = stack.pop()
      if (x < 0 || x >= w || y < 0 || y >= h) continue
      if (visited[y * w + x]) continue
      if (!isNeutralGray(x, y)) continue
      visited[y * w + x] = 1
      const i = (y * w + x) * 4
      data[i] = 255; data[i + 1] = 255; data[i + 2] = 255
      stack.push([x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1])
    }
  }

  fill(0, 0); fill(w - 1, 0); fill(0, h - 1); fill(w - 1, h - 1)
}

const src = await Jimp.read(SRC)
const totalW = src.getWidth()
const totalH = src.getHeight()
const panelW = Math.floor(totalW / 3)
console.log(`Fonte: ${totalW}x${totalH} → cada painel: ${panelW}x${totalH}`)

for (const { name, index } of PANELS) {
  const panel = src.clone().crop(index * panelW, 0, panelW, totalH)
  removeCheckered(panel)
  const out = `${ASSETS}/${name}.png`
  await panel.writeAsync(out)
  console.log(`✓ ${name}.png`)
}
console.log('Pronto.')
