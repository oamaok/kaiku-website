import CodeMirror from 'codemirror'
import kaiku from 'kaiku'

import 'codemirror/mode/jsx/jsx.js'

const { h, render, useState, useEffect, createState } = kaiku
window.h = h
window.render = render
window.useState = useState
window.useEffect = useEffect
window.createState = createState

window.addEventListener('load', () => {
  const mainElement = document.querySelector('main')

  let babelLoaded = false

  const loadBabel = async () => {
    if (babelLoaded) {
      return
    }

    const script = document.createElement('script')
    script.src = 'https://unpkg.com/@babel/standalone/babel.min.js'
    document.body.appendChild(script)

    for (;;) {
      if (typeof Babel !== 'undefined') {
        babelLoaded = true
        return
      }

      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

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
      await loadBabel()

      if (targetElement.firstChild) {
        targetElement.removeChild(targetElement.firstChild)
      }

      const code = editor.getValue()
      try {
        const transformed = Babel.transform(code, {
          plugins: [
            'transform-modules-umd',
            ['transform-react-jsx', { pragma: 'h' }],
          ],
        }).code

        const { default: Component, state } = new Function(
          `"use strict";const exports = {};${transformed}; return exports`
        )()

        render(h(Component), targetElement, state)
      } catch (err) {
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
    'deep-objects.jsx',
    'passed-state.jsx',
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
})
