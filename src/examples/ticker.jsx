/*****
<h3>Global state with no&nbsp;limits</h3>
<p>You can modify your application's state anywhere, anytime. No need to signal the changes to a state manager — Kaiku takes care of that for you.</p>
<h4>Challenge</h4>
<p>Try adding a field into the state which affects how much the <span class="code">state.ticks</span> is incremented every second. Maybe reuse the buttons from the counter example for the controls!</p>
*****/
export const state = createState({ ticks: 0 })

export default function Ticker () {
  return (
    <div>
      <div>There have been <b>{state.ticks} ticks</b> since last update.</div>
      <button onClick={() => { state.ticks = 0 }}>Reset</button>
    </div>
  )
}

setInterval(() => state.ticks++, 1000)