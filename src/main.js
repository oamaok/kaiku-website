import kaiku from 'kaiku'

import 'codemirror/mode/jsx/jsx.js'

Object.assign(window, kaiku)

window.addEventListener('load', () => {
  switch (location.pathname.split('/').pop()) {
    case 'index.html':
    case '': {
      import('./index.js')
      break
    }
    case 'playground.html': {
      import('./playground.js')
      break
    }
    case 'guide.html': {
      import('./guide.js')
      break
    }
  }
})
