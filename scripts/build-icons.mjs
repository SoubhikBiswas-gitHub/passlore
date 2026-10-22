import { readFile, writeFile } from "node:fs/promises"
import sharp from "sharp"

const source = await readFile(new URL("../public/icon.svg", import.meta.url))
const sizes = [16, 32, 48, 64]
const images = await Promise.all(sizes.map(size => sharp(source).resize(size, size).png().toBuffer()))
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
await writeFile(new URL("../public/favicon.ico", import.meta.url), Buffer.concat([header, ...images]))
for (const [name, size] of [["apple-icon.png", 180], ["icon-192.png", 192], ["icon-512.png", 512]]) {
  await sharp(source).resize(size, size).png().toFile(new URL(`../public/${name}`, import.meta.url).pathname)
}
