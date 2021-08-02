import kaiku from 'kaiku'

import 'codemirror/mode/jsx/jsx.js'

Object.assign(window, kaiku)

window.addEventListener('load', () => {
  switch (location.pathname.split('/').pop()) {
    case 'index.html':
    case '': {
      require('./index.js')
      break
    }
    case 'playground.html': {
      require('./playground.js')
      break
    }
    case 'guide.html': {
      require('./guide.js')
      break
    }
  }
})
