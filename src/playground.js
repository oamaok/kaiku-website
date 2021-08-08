import CodeMirror from 'codemirror'
import 'codemirror/mode/jsx/jsx.js'
import { execute } from './execute-user-code'

const examples = [
  'simple-counter.jsx',
  'ticker.jsx',
  'deep-objects.jsx',
  'passed-state.jsx',
  'todo-app.jsx',
]

const loadExampleCode = (file) => {
  const rawFile = require(`!!raw-loader!../examples/${file}`).default

  const [, code] = rawFile.split('*****/')
  return code.trim()
}

const defaultExample = 'todo-app.jsx'

const exampleSelectElement = document.querySelector('#example-select')

exampleSelectElement.addEventListener('change', (evt) => {
  editor.setValue(loadExampleCode(evt.target.value))
  rerun()
})

for (const example of examples) {
  const optionElement = document.createElement('option')
  optionElement.innerText = example
  optionElement.selected = example === defaultExample
  exampleSelectElement.appendChild(optionElement)
}

const editorElement = document.querySelector('#editor')
const editor = CodeMirror(editorElement, {
  value: loadExampleCode(defaultExample),
  theme: 'material-darker',
  lineWrapping: true,
  mode: 'jsx',
  extraKeys: {
    Tab: false,
  },
})

let timeout = 0
editor.on('change', () => {
  clearTimeout(timeout)
  timeout = setTimeout(rerun, 500)
})

const targetElement = document.querySelector('.target')

const rerun = async () => {
  if (targetElement.firstChild) {
    targetElement.removeChild(targetElement.firstChild)
  }

  const code = editor.getValue()
  try {
    const { Component, state } = await execute(code)
    render(h(Component), targetElement, state)
  } catch (err) {
    console.error(err)
    const preElement = document.createElement('pre')
    preElement.className = 'error'
    preElement.innerText = err
    targetElement.appendChild(preElement)
  }
}

rerun()
