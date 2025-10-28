import { useState } from 'react'

const Button = ({onClick, text}) => <button onClick={onClick}>{text}</button>

const Display = ({text, value, unit=null}) => <p>{text} {value} {unit}</p>

const Statistics = (props) => {
  const {good, neutral, bad} = props
  
  const all = good + neutral + bad
  // score: good=1, neutral=0, bad=-1
  const average = all > 0 ? (good - bad ) / all : 0
  const positive = all > 0 ? (good * 100) / all : 0

  return (
    <>
      <h2>statistics</h2>
      <Display text="good" value={good} />
      <Display text="neutral" value={neutral} />
      <Display text="bad" value={bad} />
      <Display text="all" value={all} />
      <Display text="average" value={average} />
      <Display text="positive" value={positive} unit="%" />
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  const handleGood = () => setGood(good + 1)
  const handleNeutral = () => setNeutral(neutral + 1)
  const handleBad = () => setBad(bad + 1)

  return (
    <div>
      <h2>give feedback</h2>
      <Button onClick={handleGood} text="good" />
      <Button onClick={handleNeutral} text="neutral" />
      <Button onClick={handleBad} text="bad" />
      <Statistics good={good} neutral={neutral} bad={bad} />
    </div>
  )
}

export default App
