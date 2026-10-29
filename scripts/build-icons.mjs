import { writeFile } from "node:fs/promises"
import sharp from "sharp"

const BLUE = "#2447F5"
const WHITE = "#FFFFFF"
const FULL = "M6.5 3H17A8.5 8.5 0 0 1 17 20H12.5V22H17.5V24.5H12.5V26H15.5V29H6.5Z M18 8.5A3 3 0 0 1 19.4 14.15L20 16.5H16L16.6 14.15A3 3 0 0 1 18 8.5Z"
const SMALL = "M6 3H17A8.5 8.5 0 0 1 17 20H13V22.5H19V29H6Z M18 8A3.5 3.5 0 1 1 18 15A3.5 3.5 0 1 1 18 8Z"

// box, tile corner radius, mark offset and scale come from the brand kit board
const icon = ({ box, rx, offset, scale, path }) =>
  Buffer.from(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${box} ${box}"><rect width="${box}" height="${box}" rx="${rx}" fill="${BLUE}"/><g transform="translate(${offset} ${offset}) scale(${scale})"><path fill="${WHITE}" fill-rule="evenodd" d="${path}"/></g></svg>`
  )

const favicon = icon({ box: 16, rx: 3.5, offset: 2.2, scale: 0.36, path: SMALL })
const rounded = icon({ box: 96, rx: 21, offset: 22, scale: 1.62, path: FULL })
const apple = icon({ box: 72, rx: 0, offset: 16, scale: 1.25, path: FULL })
const maskable = icon({ box: 128, rx: 0, offset: 36, scale: 1.75, path: FULL })

const png = (svg, size) => sharp(svg, { density: 1200 }).resize(size, size).png().toBuffer()
const out = (name) => new URL(`../public/${name}`, import.meta.url)

const sizes = [16, 32]
const images = await Promise.all(sizes.map((size) => png(favicon, size)))
const header = Buffer.alloc(6 + sizes.length * 16)
header.writeUInt16LE(1, 2)
header.writeUInt16LE(sizes.length, 4)
let offset = header.length
images.forEach((image, index) => {
  const entry = 6 + index * 16
  header[entry] = sizes[index]
  header[entry + 1] = sizes[index]
  header.writeUInt16LE(1, entry + 4)
  header.writeUInt16LE(32, entry + 6)
  header.writeUInt32LE(image.length, entry + 8)
  header.writeUInt32LE(offset, entry + 12)
  offset += image.length
})
await writeFile(out("favicon.ico"), Buffer.concat([header, ...images]))

for (const [name, svg, size] of [
  ["apple-icon.png", apple, 180],
  ["icon-192.png", rounded, 192],
  ["icon-512.png", rounded, 512],
  ["icon-512-maskable.png", maskable, 512],
]) {
  await writeFile(out(name), await png(svg, size))
}
