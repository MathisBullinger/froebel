import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const indexPath = path.resolve(__dirname, '../build/index.mjs')
let content = fs.readFileSync(indexPath, 'utf-8')
let match

while (match = content.match(/export \* from "([^"]+).+/)) {
  const fileExports = Object.keys(await import(path.resolve(__dirname, '../build', match[1])))
  const individualExports = fileExports.map(name => `export { ${name} } from "${match[1]}";`)
  content = content.slice(0, match.index) + individualExports.join('\n') + content.slice(match.index + match[0].length)
}

content = content.split('\n').filter(Boolean).filter((line, i, lines) => lines.findIndex(v => v.startsWith(line.split('from ')[0])) === i).join('\n')

fs.writeFileSync(indexPath, content)
