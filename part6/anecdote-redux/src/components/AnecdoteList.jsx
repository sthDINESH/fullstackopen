import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { addVote, setAnecdotes } from "../reducers/anecdoteReducer"
import { setNotification, clearNotification } from "../reducers/notificationReducer"
import anecdotesServices from "../services/anecdotes"

const Anecdote = ({ anecdote, handleVote }) => {
    return (
        <>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote.id)}>vote</button>
          </div>
        </>
    )
}

const AnecdoteList = () => {
    const dispatch = useDispatch()

    useEffect(() => {
        anecdotesServices.getAll().then(anecdotes => dispatch(setAnecdotes(anecdotes)))
    }, [dispatch])

    const anecdotes = useSelector(state => {
        return state.filter 
            ? state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
            : state.anecdotes
    })

    const vote = id => {
        console.log('vote', id)
        dispatch(addVote(id))
        dispatch(setNotification(`You voted '${anecdotes.find(a=>a.id === id).content}'`))
        setTimeout(() => dispatch(clearNotification()), 5000)
    }

    return (
        <>
        {anecdotes.map(anecdote => 
            <div key={anecdote.id}>
                <Anecdote anecdote={anecdote} handleVote={vote}/>
            </div>
        )}
        </>
    )
}

export default AnecdoteList
