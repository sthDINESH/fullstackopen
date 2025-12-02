import { useDispatch } from "react-redux"
import { appendAnecdote } from "../reducers/anecdoteReducer"
import { setNotification } from "../reducers/notificationReducer"

const AnecdoteForm = () => {
    const dispatch = useDispatch()

    const newAnecdote = (event) => {
        event.preventDefault()
        const content = event.target.anecdote.value
        dispatch(appendAnecdote(content))
        dispatch(setNotification(`Added '${content}'`, 5))
        event.target.anecdote.value = null
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