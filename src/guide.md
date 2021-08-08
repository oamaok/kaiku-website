# Getting started

Kaiku is packaged to be easily used in both browser and as a module, no build tools required:

```html
<script src="https://unpkg.com/kaiku"></script>
<script>
  const { h, render, createState } = kaiku
  const state = createState({ greeting: 'Hello world' })

  const App = () => h('span', null, state.greeting)

  render(h(App), document.body, state)
</script>
```

Or, just install the package using your favorite package manager:

```shell
# With NPM
npm i -s kaiku

# With yarn
yarn add kaiku
```

## Usage with Babel

If you are already using a Babel preset such as `@babel/preset-env`, you have everything installed to make Kaiku work. The only thing you need to configure is how the JSX elements are transpiled into JavaScript by adding the following modification to your `babel.config.json` (or wherever your Babel configuration resides):

```json
{
  "plugins": [["@babel/plugin-transform-react-jsx", { "pragma": "h" }]]
}
```

## Usage with TypeScript

JSX with TypeScript is currently unsupported due to unfinished typings. The library itself is written strictly in TypeScript, but the way JSX is handled causes friction.

You can follow the progress on the main Github issue [here](https://github.com/oamaok/kaiku/issues/3).

# Performance optimization

The global and mutable state management styles of Kaiku allow you to apply some optimizations not necessarily available in other libraries. In this section we will be going over some of them.

## Remember to use the minified build in production

Kaiku ships with two distinct builds: `kaiku.dev.js` and `kaiku.min.js`. The former includes many debugging checks to catch common bugs, as well as the full name of each internal function. This is really helpful when developing the application, but the performance is significantly worse.

Once you are ready to ship your application, make sure to switch to the minified version to get the best performance out of your product.

## Avoid arrow functions in the component body

Since Kaiku's global state management is made extremely simple, you can usually hoist the arrow functions you would normally require outside your function components. Consider the following simple case:

```js
const state = createState({ inputValue: '' })

const InputComponent = () => {
  // Creates a function on every render, bad!
  const handleInput = (evt) => {
    state.inputValue = evt.target.value
  }

  // Since the identity of the `handleInput` function changes,
  // we also need to replace the previous handler every single time.
  return (
    <div>
      <input onInput={handleInput}>
      The current value reversed is
      <b>{state.inputValue.split('').reverse().join('')}</b>
    </div>
  )
}

```

Here our `handleInput` function is re-created every time the component is rendered. Since the `state` object can be mutated as you would an ordinary JavaScript object, we can move that function outside the component body:

```js
// Single function for the entire lifetime of the application!
const handleInput = (evt) => {
  state.inputValue = evt.target.value
}

const InputComponent = () => {
  // The input handler doesn't get replaced either.
  return (
    <div>
      <input onInput={handleInput}>
      The current value reversed is
      <b>{state.inputValue.split('').reverse().join('')}</b>
    </div>
  )
}
```

## Use the `immutable` utility function

Sometimes you need to load large, immutable chunks of data into your state. By default, Kaiku will process the state and starts to keep track of any potential changes to the object. For example, say you have a multilingual website and you fetch and store the translations into the state. You rarely, if ever, want to touch the individual translation fields.

You can help Kaiku to know it does not need to keep track of changes to any of the individual keys by marking the state as immutable, using the `immutable` utility function:

```js
import { createState, immutable } from 'kaiku'

const state = createState({ translations: null })

function setLanguage(lang) {
  state.translations = immutable(await fetchTranslations(lang))
}
```

This causes Kaiku to not pay attention to any changes inside the `state.translation` object. This will both speed up the initial load of the translations _and_ subsequent renders.

# Working with mutable state

## Passing state objects as props

```js
const Person = ({ person }) => (
  <span>
    {person.name}
    <input
      type="checkbox"
      checked={person.checked}
      onClick={() => {
        // It's this easy!
        person.checked = !person.checked
      }}
    />
  </span>
)

export default function App() {
  const state = useState({
    people: [
      { name: 'Alice', checked: true },
      { name: 'Bob', checked: false },
      { name: 'Chris', checked: false },
      { name: 'David', checked: true },
    ],
  })

  const checkedPeople = state.people.filter((person) => person.checked)

  return (
    <div>
      <div>{checkedPeople.length} people checked in.</div>
      {state.people.map((person) => (
        <Person person={person} />
      ))}
    </div>
  )
}
```

# Common pitfalls

## Updating a primitive variable

With Kaiku's state management, you must always update a field of an object instead of copying the value and updating a secondary variable. Like with your common JavaScript objects, the following won't work:

```js
const state = createState({ counter: 0 })
let { counter } = state
// This won't update the `state` object!
counter++
```

Why is this? Consider an ordinary object with a primitive value inside it, in our case a `string`:

```js
const obj = { foo: 'bar' }
```

Since you cannot have references to primitive data types in JavaScript, the following makes a _copy_ of the string instead of passing the reference. So, when we edit the variable, the object's field won't get updated:

```js
let foo = obj.foo
foo = 'foobar'

console.log(obj.foo) // Outputs 'bar'
console.log(foo) // Outputs 'foobar'
```

## Mutating objects not derived from the state object

```js
const state = createState()
```

# API reference

## `h` or `createElement`

## `render`

## `createState`

## `useState`

## `useRef`

Under the hood, the `useRef` implementation is just a small wrapper around the `useState` hook:

```js
const useRef = <T>(initialValue?: T): Ref<T> =>
  useState({ current: initialValue })
```

## `useEffect`

## `immutable`
