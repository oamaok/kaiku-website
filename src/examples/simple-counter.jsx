/*****
<h3>Small size</h3>
<p>
  Most UI frameworks are large enough to be the majority of an app's
  JavaScript size. Preact is different: it's small enough that your
  code is the largest part of your application.
</p>
<p>
  That means less JavaScript to download, parse and execute - leaving
  more time for your code, so you can build an experience you define
  without fighting to keep a framework under control.
</p>
<button class="cta">Try it out</button>
*****/
export default function Counter() {
  const state = useState({ counter: 0 })

  return (
    <div>
      <div>Counter: {state.counter}</div>
      <button onClick={() => { state.counter++ }}>Increment</button>
      <button onClick={() => { state.counter-- }}>Decrement</button>
    </div>
  )
}
