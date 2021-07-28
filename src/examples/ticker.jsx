/*****
<h3>Global state with no limits</h3>
<p>You can modify your application's state anywhere, anytime.</p>
<p>Limitations blah blah</p>
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