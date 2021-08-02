/*
<h3>Trivial deep objects</h3>
<p>Arbitrarily deep objects pose no challenge to Kaiku. </p>
*****/
export const state = createState({})

// You don't need to have anything initialized -- just keep adding things as you go!
state.i = { am: { a: { very: { deep: { object: 'with a value' } } } } }

export default function DeepObjectHandling() {
  return (
    <div>
      <pre>{JSON.stringify(state)}</pre>
      <input
        type="text"
        value={state.i.am.a.very.deep.object}
        onInput={(evt) => {
          state.i.am.a.very.deep.object = evt.target.value
        }}
      />
    </div>
  )
}
