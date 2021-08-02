import CodeMirror from 'codemirror'
import { execute } from './execute-user-code'

const mainElement = document.querySelector('main')

const loadExample = (file) => {
  const { default: Component, state } = require(`./examples/${file}`)

  const rawFile = require(`!raw-loader!./examples/${file}`).default

  const [copy, code] = rawFile.split('*****/')

  const sectionElement = document.createElement('section')
  const copyElement = document.createElement('div')
  copyElement.className = 'copy'
  copyElement.innerHTML = copy.split('\n').slice(1).join('\n')

  const exampleElement = document.createElement('div')
  exampleElement.className = 'example'

  const editorElement = document.createElement('div')
  editorElement.className = 'editor'

  const targetElement = document.createElement('div')
  targetElement.className = 'target'

  const rerunElement = document.createElement('button')
  rerunElement.className = 'rerun'
  rerunElement.innerHTML = 'Compile and run \u25BC'

  editorElement.appendChild(rerunElement)

  exampleElement.appendChild(editorElement)
  exampleElement.appendChild(targetElement)

  sectionElement.appendChild(copyElement)
  sectionElement.appendChild(exampleElement)

  mainElement.appendChild(sectionElement)

  const editor = CodeMirror(editorElement, {
    value: code.trim(),
    theme: 'material-darker',
    lineWrapping: true,
    mode: 'jsx',
    extraKeys: {
      Tab: false,
    },
  })

  render(h(Component), targetElement, state)

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

  rerunElement.addEventListener('click', rerun)
}

const examples = [
  'simple-counter.jsx',
  'ticker.jsx',
  // 'deep-objects.jsx',
  // 'passed-state.jsx',
  'todo-app.jsx',
]

examples.forEach(loadExample)

const logoElement = document.querySelector('#logo')

let animationRunning = false
const runLogoAnimation = () => {
  if (animationRunning) return

  animationRunning = true
  setTimeout(() => {
    animationRunning = false
  }, 2500)

  logoElement.querySelectorAll('animateTransform').forEach((anim) => {
    anim.beginElement()
  })
}

logoElement.addEventListener('mouseover', runLogoAnimation)

setTimeout(runLogoAnimation, 1000)
