import { useState } from 'react'

const Header = (props) => {
  return (
    <div>
      <h1>
        {props.text}
      </h1>
    </div>
  )
}

const Button = (props) => {
  return (
    <div>
      <button onClick={props.onClick}>
        {props.text}
      </button>
    </div>
  )
}

const Anecdote = (props) => {
  return (
    <div>
      {props.anecdotes[props.selected]}
      <br />
      has {props.votes[props.selected]} votes
    </div>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often.',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.',
    'The only way to go fast, is to go well.'
  ]
   
  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(new Uint8Array(8))

  const setRandomAnecdote = () => {
    setSelected(Math.floor(Math.random() * anecdotes.length))
  }

  const incrementVote = () => {
    const copy = [...votes]
    copy[selected] += 1
    setVotes(copy)
  }

  const maxVote = votes.indexOf(Math.max(...votes))

  if (Math.max(...votes) <= 0) {
    return (
      <div>
        <Header text="Anecdote of the day" />
        <Anecdote votes={votes} selected={selected} anecdotes={anecdotes} />
        <div style={{display: 'flex'}}>
          <Button onClick={() => incrementVote()} text="vote" />
          <Button onClick={() => setRandomAnecdote()} text="next anecdote" />
        </div>
        <Header text="Anecdote with most votes" />
        <div>No votes :(</div>
      </div>
    )
  }
  
  return (
      <div>
        <Header text="Anecdote of the day" />
        <Anecdote votes={votes} selected={selected} anecdotes={anecdotes} />
        <div style={{display: 'flex'}}>
          <Button onClick={() => incrementVote()} text="vote" />
          <Button onClick={() => setRandomAnecdote()} text="next anecdote" />
        </div>
        <Header text="Anecdote with most votes" />
        <Anecdote votes={votes} selected={maxVote} anecdotes={anecdotes} />
      </div>
  )
}

export default App