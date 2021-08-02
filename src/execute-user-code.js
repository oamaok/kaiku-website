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

const execute = async (code) => {
  await loadBabel()

  const transformed = Babel.transform(code, {
    plugins: [
      'transform-modules-umd',
      ['transform-react-jsx', { pragma: 'h' }],
    ],
  }).code

  const { default: Component, state } = new Function(
    `"use strict";const exports = {};${transformed}; return exports`
  )()

  return { Component, state }
}

export { execute }
