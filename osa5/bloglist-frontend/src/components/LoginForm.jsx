const LoginForm = ({
  username,
  password,
  setUsername,
  setPassword,
  handleLogin,
}) => {
  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <div>
          <label style={{ marginRight: 2 }}>
            Username:
            <input
              style={{ marginLeft: 10 }}
              type="text"
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div style={{ marginTop: 2, marginBottom: 2 }}>
          <label>
            Password:
            <input
              style={{ marginLeft: 10 }}
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  )
}

export default LoginForm
