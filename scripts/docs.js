const docs = require('../docs.json')

const repo = 'https://github.com/MathisBullinger/snatchblock'
let readme = `# A strictly typed TypeScript utility library.\n`

const exps = docs.children
  .find(({ name }) => name === 'index')
  .children.filter(v => v.kindString === 'Reference')
  .map(v => [v.id, v.sources[0].fileName])

const cats = exps.reduce(
  (a, [id, file]) => ({ ...a, [file]: [...(a[file] ?? []), id] }),
  {}
)

for (const [file, names] of Object.entries(cats)) {
  let [catName] = file.match(/\w+?(?=\.ts$)/)
  catName = catName[0].toUpperCase() + catName.slice(1)

  readme += `\n## ${catName}\n\n${names.map(docItem).join('\n\n')}`
}

function docItem(id) {
  const [name, info] = getItem(id)
  console.log(info)

  const params = info.signatures[0].parameters
  const args = params
    .map(v => `${v.flags?.isRest ? '...' : ''}${v.name}: ${v.type.name}`)
    .join(', ')

  const descr = info.signatures[0].comment?.shortText

  const [{ fileName, line }] = info.sources
  return `### \`${name} (${args})\` <sup><sup>_[source](${repo}/blob/main/src/${fileName}#L${line})_</sup></sup>

${descr ?? ''}`
}

require('fs').writeFileSync(
  require('path').resolve(__dirname, '../README.md'),
  readme
)

function getItem(id, node = docs) {
  if (node?.id === id)
    return [node.name, !node.target ? node : getItem(node.target)[1]]

  if (!node.children?.length) return
  for (const child of node.children) {
    let match = getItem(id, child)
    if (match) return match
  }
}
