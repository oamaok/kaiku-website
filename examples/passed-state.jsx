/*
<h3>Passing state objects as props</h3>
<p>Remember when you were learning React and tried to pass a mutable object to a child component? Well, now you can!</p>
<p>Kaiku allows you to pass state objects down to a child component, and lets you edit the state <i>directly within the child component</i>. No need to create custom callbacks to bubble the state updates back up.</p>

*****/
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
