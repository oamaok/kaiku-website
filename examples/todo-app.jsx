/*
<h3>The mandatory Todo app</h3>
<p>Since everyone seems to be so into TODO-lists these days, let's make our own using Kaiku.</p>
*****/

const TodoItem = ({ item }) => (
  <li>
    {item.done ? <s>{item.name}</s> : item.name}
    <input
      type="checkbox"
      value={item.done}
      onClick={() => {
        item.done = !item.done
      }}
    />
  </li>
)

export default function TodoApp() {
  const state = useState({ newItemName: '', items: [] })

  return (
    <div>
      <input
        type="text"
        value={state.newItemName}
        onInput={(evt) => {
          state.newItemName = evt.target.value
        }}
      />
      <button
        onClick={() => {
          state.items.push({ name: state.newItemName, done: false })
          state.newItemName = ''
        }}
      >
        Add Todo item
      </button>
      <ul>
        {state.items.map((item) => (
          <TodoItem item={item} />
        ))}
      </ul>
    </div>
  )
}
