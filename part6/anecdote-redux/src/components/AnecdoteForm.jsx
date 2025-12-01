import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const newAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        console.log("New Anecdote:", content)
        dispatch(createAnecdote(content))    
  }
    return (
        <form onSubmit={newAnecdote}>
        <div>
          <input name="anecdote"/>
        </div>
        <button>create</button>
      </form>
    )
}

export default AnecdoteForm