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

for (const [file, ids] of Object.entries(cats)) {
  let [catName] = file.match(/\w+?(?=\.ts$)/)
  catName = catName[0].toUpperCase() + catName.slice(1)

  readme += `\n## ${catName}\n\n${ids.sort().map(docItem).join('\n\n')}`
}

function docItem(id) {
  const [name, info] = getItem(id)
  const descr = info.signatures[0].comment?.shortText

  const formatArgs = args =>
    args
      .map(
        v =>
          `${v.flags?.isRest ? '...' : ''}${v.name}: ${
            v.type.name ?? v.type.trueType?.name
          }`
      )
      .join(', ')

  function formatReturn(ret) {
    if (ret.type === 'reference') {
      const name = ret.name
      if (!ret.typeArguments?.length) return name
      return `${name}<${ret.typeArguments.map(({ name }) => name).join(', ')}>`
    }
    if (ret.type === 'predicate')
      return `${ret.name} is ${formatReturn(ret.targetType)}`
    return signature(ret.declaration)
  }

  function signature(sig) {
    if (!sig) return '???'
    return `(${formatArgs(sig.signatures[0].parameters)}) => ${formatReturn(
      sig.signatures[0].type
    )}`
  }

  function examples(sig) {
    const examples = sig.comment?.tags?.filter(({ tag }) => tag === 'example')
    if (!examples?.length) return ''
    return `\n\n#### Example${examples.length > 1 ? 's' : ''}\n${examples
      .map(
        ({ text }) =>
          `\`\`\`ts\n${text.replace(/(^[`\n]+)|([`\n]+$)/g, '')}\n\`\`\``
      )
      .join('\n\n')}`
  }

  const [{ fileName, line }] = info.sources
  return `### \`${name}\` 
  
\`\`\`hs
${signature(info)}
\`\`\`

<sup><sup>_[source](${repo}/blob/main/src/${fileName}#L${line})_</sup></sup>

${descr ?? ''}${examples(info.signatures[0])}`
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
