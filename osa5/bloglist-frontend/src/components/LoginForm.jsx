import { useState } from 'react'
import { Button, LoginInput } from './Styles'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const onSubmit = (event) => {
    event.preventDefault()
    handleLogin({ username, password, setUsername, setPassword })
  }

  const hiddenLabel = {
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: "0",
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)"
  }

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <LoginInput
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
              placeholder='Username'
            />
          </label>
        </div>
        <div>
          <label>
            <LoginInput
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
              placeholder='Password'
            />
          </label>
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  )
}

export default LoginForm
