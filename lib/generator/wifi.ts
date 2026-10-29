import qrcode from "qrcode-generator"

const escapeField = (value: string) => value.replace(/([\\;,:"])/g, "\\$1")

export function wifiPayload(ssid: string, password: string): string {
  return "WIFI:T:WPA;S:" + escapeField(ssid) + ";P:" + escapeField(password) + ";;"
}

export function qrMatrix(text: string): boolean[][] {
  const qr = qrcode(0, "M")
  // The library writes one byte per char code, so hand it UTF-8 bytes for non-ASCII network names.
  const bytes = new TextEncoder().encode(text)
  let binary = ""
  for (const b of bytes) binary += String.fromCharCode(b)
  qr.addData(binary, "Byte")
  qr.make()
  const size = qr.getModuleCount()
  const rows: boolean[][] = []
  for (let r = 0; r < size; r++) {
    const row: boolean[] = []
    for (let c = 0; c < size; c++) row.push(qr.isDark(r, c))
    rows.push(row)
  }
  return rows
}
