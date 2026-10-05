const Header = (props) => {

  return (
    <h1>{props.course.name}</h1>
  )
}

const Part = (props) => {
  return <p>{props.name} {props.exercises}</p>
}

const Content = (props) => {
  return (
    <div>
      {props.parts.map((part) => {
        return <Part key={part.name} name={part.name} exercises={part.exercises} />
      })}
    </div>
  )
}

const Total = (props) => {
  return (
    <p><b>total of {props.course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises</b></p>
  )
}

const Course = (props) => {
  return (
    <div>
      <Header course={props.course} />
      <Content parts={props.course.parts} />
      <Total course={props.course}></Total>
    </div>
  )
}

const App = () => {
  const courses = [
    {
      name: 'Half Stack application development',
      id: 1,
      parts: [
        {
          name: 'Fundamentals of React',
          exercises: 10,
          id: 1
        },
        {
          name: 'Using props to pass data',
          exercises: 7,
          id: 2
        },
        {
          name: 'State of a component',
          exercises: 14,
          id: 3
        },
        {
          name: 'Redux',
          exercises: 11,
          id: 4
        }
      ]
    },
    {
      name: 'Node.js',
      id: 2,
      parts: [
        {
          name: 'Routing',
          exercises: 3,
          id: 1
        },
        {
          name: 'Middlewares',
          exercises: 7,
          id: 2
        }
      ]
    }
  ]

  return courses.map((course) => { return <Course course={course} /> })
}
export default App