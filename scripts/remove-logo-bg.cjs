const Jimp = require('jimp')
const path = require('path')

const INPUT  = path.join(__dirname, '../../heroisdaescola-room/public/assets/logo.jpg')
const OUTPUT = path.join(__dirname, '../../heroisdaescola-room/public/assets/logo.png')

Jimp.read(INPUT).then(img => {
  img.scan(0, 0, img.bitmap.width, img.bitmap.height, function (x, y, idx) {
    const r = this.bitmap.data[idx]
    const g = this.bitmap.data[idx + 1]
    const b = this.bitmap.data[idx + 2]
    // remove branco e cinza claro (fundo)
    if (r > 235 && g > 235 && b > 235) {
      this.bitmap.data[idx + 3] = 0
    }
  })
  return img.writeAsync(OUTPUT)
}).then(() => {
  console.log('Logo sem fundo salva em:', OUTPUT)
}).catch(console.error)
