/*****
<h3>Compact code</h3>
<p>Forget about wrapping state updates in callbacks. With Kaiku, you can mutate the state as you would an original JavaScript object.</p>
<h4>Challenge</h4>
<p>Try adding a button which resets <span class="code">state.counter</span> next to the others.</p>
*****/
export default function Counter() {
  const state = useState({ counter: 0 })

  return (
    <div>
      <div>Counter: {state.counter}</div>
      <button
        onClick={() => {
          state.counter++
        }}
      >
        Increment
      </button>
      <button
        onClick={() => {
          state.counter--
        }}
      >
        Decrement
      </button>
    </div>
  )
}
