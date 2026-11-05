const Jimp = require('jimp')
const path = require('path')

const INPUT  = path.join(__dirname, '../public/assets/pampee.jpg')
const OUTPUT = path.join(__dirname, '../public/assets/pampee.png')

// Mesmo tamanho dos outros personagens (mitos, nia, galdios)
const TARGET_W = 896
const TARGET_H = 1200

Jimp.read(INPUT).then(img => {
  // Redimensiona para 896x1200 mantendo proporção com fit inside
  img.contain(TARGET_W, TARGET_H)

  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]

    const brightness = Math.max(r, g, b)

    if (brightness < 22) {
      this.bitmap.data[idx + 3] = 0
    } else if (brightness < 55) {
      const alpha = Math.round(((brightness - 22) / 33) * 255)
      this.bitmap.data[idx + 3] = alpha
    }
  })
  return img.writeAsync(OUTPUT)
}).then(() => {
  console.log('pampee.png salva sem fundo (896x1200) em:', OUTPUT)
}).catch(console.error)
