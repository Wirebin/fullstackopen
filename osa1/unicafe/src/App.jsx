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

const StatisticLine = (props) => {
  return (
      <tbody>  
        <tr>
          <td>{props.text}</td>
          <td>{props.value}</td>
        </tr>
      </tbody>
  )
}

const Statistics = (props) => {
  const good = props.feedback.good
  const neutral= props.feedback.neutral
  const bad = props.feedback.bad
  const all = good + neutral + bad
  const average = (good - bad) / all
  const positive = (good / all) * 100

  if (all > 0) {
    return (
      <table>
        <StatisticLine text="good:" value={good} />
        <StatisticLine text="neutral:" value={neutral} />
        <StatisticLine text="bad:" value={bad} />
        <StatisticLine text="all:" value={all} />
        <StatisticLine text="average:" value={average} />
        <StatisticLine text="positive:" value={`${positive} %`} />
      </table>
    )
  }
  return (
    <div>
      No feedback given
    </div>
  )
}

const App = () => {
  // tallenna napit omaan tilaansa
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)
  const feedback = {
    good, neutral, bad
  }

  const increaseGood = () => setGood(good + 1)
  const increaseNeutral = () => setNeutral(neutral + 1)
  const increaseBad = () => setBad(bad + 1)

  return (
    <div>
      <Header text="give feedback" />
      <div style={{display: 'flex'}}>
        <Button onClick={() => increaseGood()} text="good" />
        <Button onClick={() => increaseNeutral()} text="neutral" />
        <Button onClick={() => increaseBad()} text="bad" />
      </div>
      <Header text="statistics" />
      <Statistics feedback={feedback} />
    </div>
  )
}

export default App