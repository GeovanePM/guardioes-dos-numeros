import Jimp from 'jimp'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import { dirname } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const ASSETS = resolve(__dirname, '../public/assets')

const TARGET_W = 896
const TARGET_H = 1200

const SOURCES = [
  { src: 'C:/Users/PROERD/Downloads/11.501.png', out: 'lucianis.png' },
  { src: 'C:/Users/PROERD/Downloads/11.502.png', out: 'ludmilis.png' },
  { src: 'C:/Users/PROERD/Downloads/11.503.png', out: 'gabrielis.png' },
]

for (const { src, out } of SOURCES) {
  const img = await Jimp.read(src)

  // Scale to COVER TARGET_W x TARGET_H (fills entire canvas, crops excess)
  const scale = Math.max(TARGET_W / img.getWidth(), TARGET_H / img.getHeight())
  const newW = Math.round(img.getWidth() * scale)
  const newH = Math.round(img.getHeight() * scale)
  img.resize(newW, newH)

  // Crop centered to exact TARGET dimensions
  const cropX = Math.floor((newW - TARGET_W) / 2)
  const cropY = Math.floor((newH - TARGET_H) / 2)
  img.crop(cropX, cropY, TARGET_W, TARGET_H)

  const canvas = img

  const outPath = `${ASSETS}/${out}`
  await canvas.writeAsync(outPath)
  console.log(`✓ ${out}  (${newW}x${newH} → ${TARGET_W}x${TARGET_H})`)
}
console.log('Pronto.')
