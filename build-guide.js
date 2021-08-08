const { JSDOM } = require('jsdom')
const fs = require('fs')

const window = new JSDOM(
  `<div id="wrapper"><main>
<nav><ul></ul></nav>
<section><div></div></section>
</main></div>
`,
  {
    url: 'https://kaiku.dev/guide.html',
    pretendToBeVisual: true,
  }
).window

const marked = require('marked')
const Prism = require('prismjs')
require('prismjs/components/')(['jsx', 'json', 'shell'])
Object.assign(global, window)

const rawGuide = fs.readFileSync('./src/guide.md').toString()

const lexer = new marked.Lexer()
const tokens = lexer.lex(rawGuide)

const navigationElement = document.querySelector('nav')
const contentElement = document.querySelector('section>div')

const sections = []

const langs = {
  js: 'jsx',
  json: 'json',
  html: 'html',
  shell: 'shell',
}

for (const token of tokens) {
  if (token.type === 'heading') {
    if (token.depth === 1) {
      sections.push({
        name: token.text,
        subsections: [],
      })
    }
    if (token.depth === 2) {
      sections[sections.length - 1].subsections.push({ name: token.text })
    }
  }
}

for (const section of sections) {
  const li = document.createElement('li')
  const a = document.createElement('a')
  a.innerHTML = section.name
  a.href = '#' + section.name.toLowerCase().split(' ').join('-')
  li.appendChild(a)
  navigationElement.firstChild.appendChild(li)

  if (section.subsections.length) {
    const subsectionUl = document.createElement('ul')
    li.appendChild(subsectionUl)
    for (const subsection of section.subsections) {
      const li = document.createElement('li')

      const a = document.createElement('a')
      a.innerHTML = marked(subsection.name)
      a.href =
        '#' +
        subsection.name.replace(/`/g, '').toLowerCase().split(' ').join('-')
      li.appendChild(a)

      subsectionUl.appendChild(li)
    }
  }
}

const render = (tokens, parent = contentElement) => {
  for (const token of tokens) {
    let element

    switch (token.type) {
      case 'code': {
        element = document.createElement('pre')
        element.className = 'highlighted'
        element.innerHTML = Prism.highlight(
          token.text,
          Prism.languages[langs[token.lang]],
          langs[token.lang]
        )
        break
      }
      case 'heading': {
        element = document.createElement('h' + token.depth)
        element.id = token.text
          .replace(/[^a-z0-9 ]/gi, '')
          .toLowerCase()
          .split(' ')
          .join('-')
        if (!token.tokens) {
          element.innerHTML = token.text
        }
        break
      }
      case 'text': {
        if (!token.tokens) {
          element = document.createTextNode(token.raw)
          element.innerHTML = token.text
        } else {
          element = document.createElement('span')
        }
        break
      }
      case 'paragraph': {
        element = document.createElement('p')
        if (!token.tokens) {
          element.innerHTML = token.text
        }
        break
      }
      case 'codespan': {
        element = document.createElement('code')

        if (!token.tokens) {
          element.innerHTML = token.text
        }
        break
      }
      case 'link': {
        element = document.createElement('a')
        if (!token.tokens) {
          element.innerHTML = token.text
        }
        element.href = token.href
        element.title = token.title
        break
      }
      case 'em': {
        element = document.createElement('em')
        if (!token.tokens) {
          element.innerHTML = token.text
        }
        break
      }
      case 'space': {
        break
      }
      default:
        throw Error('Unhandled token type: ' + token.type)
    }
    if (!element) {
      continue
    }
    if (token.tokens) {
      render(token.tokens, element)
    }
    parent.appendChild(element)
  }
}

render(tokens)

document.querySelector('main').classList.toggle('hidden', false)

fs.writeFileSync(
  './src/guide.html',
  document.querySelector('#wrapper').innerHTML
)
