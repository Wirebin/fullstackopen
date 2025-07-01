const AddPersonForm = (props) => {
  const newName = props.name
  const newNumber = props.number
  const nameChange = props.onNameChange
  const numberChange = props.onNumberChange
  const onClick = props.onClick

  return (
    <form>
      <div>name: <input value={newName} onChange={nameChange} /></div>
      <div>number: <input value={newNumber} onChange={numberChange} /></div>
      <div><button type="submit" onClick={onClick}>add</button></div>
    </form>
  )
}

export default AddPersonForm
