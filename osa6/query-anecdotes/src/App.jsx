import Anecdotes from './components/Anecdotes'
import Notification from './components/Notification'

const App = () => {
  return (
    <div>
      <h3>Anecdote app</h3>
      <Notification />
      <Anecdotes />
    </div>
  )
}

export default App