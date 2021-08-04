import CodeMirror from 'codemirror'
import rawGuide from '!!raw-loader!./guide.md'
import marked from 'marked'

import 'codemirror/mode/htmlmixed/htmlmixed.js'
import 'codemirror/mode/shell/shell.js'

const lexer = new marked.Lexer()
const tokens = lexer.lex(rawGuide)

const navigationElement = document.querySelector('#nav-items')
const contentElement = document.querySelector('#content')

const sections = []

contentElement.innerHTML = marked(rawGuide)

const langs = {
  'language-js': 'jsx',
  'language-html': 'htmlmixed',
  'language-shell': 'shell',
}

contentElement.querySelectorAll('code').forEach((codeElement) => {
  const lang = langs[codeElement.className]
  if (!lang) {
    return
  }

  const code = codeElement.innerText
  codeElement.innerHTML = ''
  new CodeMirror(codeElement, {
    value: code.trim(),
    theme: 'material-darker',
    lineWrapping: true,
    mode: lang,
    readOnly: true,
  })
})

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
  a.innerText = section.name
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

window.addEventListener('scroll', () => {
  const { top } = navigationElement.parentElement.getBoundingClientRect()
  navigationElement.classList.toggle('sticky', top < 0)
})

document.querySelector('.guide').classList.toggle('hidden', false)
