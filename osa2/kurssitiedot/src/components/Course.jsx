const Header = (props) => <h2>{props.course}</h2>

const Content = (props) => (
  <div>
    {props.parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

const Part = (props) => (
  <p>
    {props.part.name} {props.part.exercises}
  </p>
)

const Total = (props) => <p><b>Number of exercises {props.total}</b></p>

const Course = (props) => {
  const name = props.course.name
  const parts = props.course.parts
  const total = parts.reduce((sum, part) => sum + part.exercises, 0)

  return (
    <div>
      <Header course={name} />
      <Content parts={parts} />
      <Total total={total} />
    </div>
  )
}

export default Course