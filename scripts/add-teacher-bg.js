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

  // Scale to fit inside TARGET_W x TARGET_H preserving aspect ratio
  const scale = Math.min(TARGET_W / img.getWidth(), TARGET_H / img.getHeight())
  const newW = Math.round(img.getWidth() * scale)
  const newH = Math.round(img.getHeight() * scale)
  img.resize(newW, newH)

  // Center on white canvas
  const canvas = new Jimp(TARGET_W, TARGET_H, 0xFFFFFFFF)
  const x = Math.floor((TARGET_W - newW) / 2)
  const y = Math.floor((TARGET_H - newH) / 2)
  canvas.composite(img, x, y)

  const outPath = `${ASSETS}/${out}`
  await canvas.writeAsync(outPath)
  console.log(`✓ ${out}  (${newW}x${newH} → ${TARGET_W}x${TARGET_H})`)
}
console.log('Pronto.')
