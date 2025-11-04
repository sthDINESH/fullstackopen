const Course = ({course}) => (
  <>
    <Header course={course} />
    <Content course={course} />
    <Total course={course} />
  </>
)

const Header = ({course}) => <h2>{course.name}</h2>

const Content = ({course}) => (
  <div>
    {course.parts.map(part => <Part key={part.id} part={part} />)}
  </div>
)

const Part = ({part}) => (
  <p>
    {part.name} {part.exercises}
  </p>
)


const Total = ({course}) => (
  <p>
    <strong>
    total of {course.parts.reduce((sum, part) => sum + part.exercises, 0)} exercises
    </strong>
  </p>
)

export default Course