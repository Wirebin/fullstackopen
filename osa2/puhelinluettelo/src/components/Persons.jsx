const Persons = props => {
  const persons = props.persons
  const newFilter = props.newFilter
  const onDelete = props.onDelete

  return (
    <div>
      {persons
        .filter((person) => person.name.toLowerCase().includes(newFilter.toLowerCase()))
        .map(person => 
            <div key={person.name}>
                {person.name} {person.number} <button type='button' onClick={() => onDelete(person)}>delete</button>
            </div>)}
    </div>
  )
}

export default Persons
