import CodeMirror from 'codemirror'
import { execute } from './execute-user-code'

const editorElement = document.querySelector('#editor')

const editor = CodeMirror(editorElement, {
  value: '',
  theme: 'material-darker',
  lineWrapping: true,
  mode: 'jsx',
  extraKeys: {
    Tab: false,
  },
})
