const docs = require('../docs.json')

const repo = 'https://github.com/MathisBullinger/snatchblock'
let readme = `# SnatchBlock - a strictly typed TypeScript utility library.

This is my (WIP) personal collection of TypeScript helper functions and utilities that
I use across different projects.

Think an opionated version of lodash, but with first-class types.
`
const paramReplace = { __namedParameters: 'funs' }

const exps = docs.children
  .find(({ name }) => name === 'index')
  .children.filter(v => v.kindString === 'Reference')
  .map(v => [v.id, v.sources[0].fileName])

let cats = exps.reduce(
  (a, [id, file]) => ({ ...a, [file]: [...(a[file] ?? []), id] }),
  {}
)
cats = Object.entries(cats).map(([file, ids]) => {
  const [name] = file.match(/\w+?(?=\.ts$)/)
  return [name[0].toUpperCase() + name.slice(1), ids.sort()]
})

readme += '\n\n'
for (const [name, ids] of cats) {
  readme += `- __\`${name.toLowerCase()}\`__\n`
  ids.forEach(id => {
    const name = getItem(id)[0]
    readme += `    - [${name}](#${name})\n`
  })
}
readme += '\n\n'

for (const [name, ids] of cats)
  readme += `\n## ${name}\n\n${ids.map(docItem).join('\n\n---\n\n')}`

function docItem(id) {
  const [name, info] = getItem(id)
  const node = info.signatures?.[0] ?? info
  let descr = node.comment?.shortText ?? ''
  if (descr && node.comment?.text) descr += `\n\n${node.comment.text}`
  if (descr)
    descr = descr
      .replace(/(?<=^|\n)(.?)/g, '> $1')
      .replace(/\{@link\s(\w+)\}/g, '[$1](#$1)')

  const parenthHeur = expr =>
    expr.includes('=>') && !/^[{(\[]/.test(expr) ? `(${expr})` : expr

  const postProcess = str =>
    str
      .replace(/λ<([^>]+),\s*any>/g, 'λ<$1>')
      .replace(/\[\.{3}([A-Z])\[\]\]/g, '$1[]')
  const formatNode = node => postProcess(_formatNode(node))
  function _formatNode(node) {
    if (node.target) node = getItem(node.target)

    if (node.kindString === 'Call signature') {
      let ret = formatNode(node.type)
      if (ret === 'undefined') ret = 'void'
      return `(${
        node.parameters
          ?.map(
            v =>
              `${v.flags?.isRest ? '...' : ''}${
                paramReplace[v.name] ?? v.name
              }: ${formatNode(v)}`
          )
          .join(', ') ?? ''
      }) => ${ret}`
    }

    if (!node.type) {
      if (node.signatures?.length) return formatNode(node.signatures[0])
      if (node.children)
        return `{${node.children
          .map(v => `${v.name}: ${formatNode(v.type ?? v.signatures[0])}`)
          .join(', ')}}`
      throw node
    }

    if (typeof node.type === 'object') return formatNode(node.type)
    if (node.type === 'reference') {
      const name = node.name
      if (!node.typeArguments?.length) return name
      return `${name}<${node.typeArguments.map(formatNode).join(', ')}>`
    }
    if (node.type === 'intrinsic') return node.name
    if (node.type === 'literal') return JSON.stringify(node.value)
    if (node.type === 'predicate')
      return `${node.name} is ${formatNode(node.targetType)}`
    if (node.type === 'indexedAccess')
      return `${formatNode(node.objectType)}[${formatNode(node.indexType)}]`
    if (node.type === 'array') return `${formatNode(node.elementType)}[]`
    if (node.type === 'reflection') return formatNode(node.declaration)
    if (node.type === 'tuple')
      return `[${node.elements?.map(formatNode).join(', ') ?? ''}]`
    if (node.type === 'rest') return `...${formatNode(node.elementType)}`
    if (node.type === 'template-literal') return `\`\${string}\``
    if (node.type === 'conditional') {
      if (
        (node.trueType.name === 'never') !==
        (node.falseType.name === 'never')
      )
        return formatNode(
          node.falseType.name === 'never' ? node.trueType : node.falseType
        )
      return `${formatNode(node.checkType)}${
        node.extendsType ? ` extends ${formatNode(node.extendsType)}` : ''
      } ? ${formatNode(node.trueType)} : ${formatNode(node.falseType)}`
    }
    if (node.type === 'intersection') {
      if (node.types.every(({ type }) => type === 'reflection'))
        return formatNode(node.types[0])
      return node.types.map(formatNode).map(parenthHeur).join(' & ')
    }
    if (node.type === 'union')
      return node.types
        .map(formatNode)
        .filter(v => v !== 'undefined')
        .map(parenthHeur)
        .join(' | ')

    if (node.type === 'query') return `<${node.queryType.name}>`

    console.warn(`unknown node type ${node.type}:`, node)
    return '???'
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
  return `#### \`${name}\` 
  
\`\`\`hs
${formatNode(info)}
\`\`\`

<sup><sup>_[source](${repo}/blob/main/src/${fileName}#L${line})_</sup></sup>

${descr ?? ''}${examples(node)}`
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
