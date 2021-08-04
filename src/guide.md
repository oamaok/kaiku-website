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

```js
{
  "plugins": [
    ["@babel/plugin-transform-react-jsx", { "pragma": "h" }]
  ]
}
```

## Usage with TypeScript

JSX with TypeScript is currently unsupported due to unfinished typings. The library itself is written strictly in TypeScript, but the way JSX is handled causes friction.

You can follow the progress on the main Github issue [here](https://github.com/oamaok/kaiku/issues/3).

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

## Common pitfalls

```js
const state = createState({ counter: 0 })
let { counter } = state
// This won't update the `state` object!
counter++
```

Consider an ordinary object with a primitive value inside it, in our case a `string`:

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

# API reference

## `render`

## `createState`

## `useState`

## `useEffect`
