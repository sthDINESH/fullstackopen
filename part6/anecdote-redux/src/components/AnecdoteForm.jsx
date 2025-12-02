import { useDispatch } from "react-redux"
import { createAnecdote } from "../reducers/anecdoteReducer"
import { setNotification, clearNotification } from "../reducers/notificationReducer"
import anecdoteServices from '../services/anecdotes'

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const newAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        console.log("New Anecdote:", content)
        anecdoteServices.create(content).then(newAnecdote => dispatch(createAnecdote(newAnecdote)))
        dispatch(setNotification(`Added '${content}'`))
        event.target.anecdote.value = null
        setTimeout(() => dispatch(clearNotification()), 5000)
  }
    return (
        <>
            <h2>create new</h2>
            <form onSubmit={newAnecdote}>
                <div>
                    <input name="anecdote"/>
                </div>
                <button>create</button>
            </form>
        </>
        
    )
}

export default AnecdoteForm