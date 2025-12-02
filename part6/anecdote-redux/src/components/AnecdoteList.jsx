import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { setNotification } from "../reducers/notificationReducer"
import { initializeAnecdotes, voteAnecdote } from "../reducers/anecdoteReducer"

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
        dispatch(initializeAnecdotes())
    }, [dispatch])

    const anecdotes = useSelector(state => {
        return state.filter 
            ? state.anecdotes.filter(anecdote => anecdote.content.includes(state.filter))
            : state.anecdotes
    })

    const vote = id => {
        console.log('vote', id)
        dispatch(voteAnecdote(id))
        dispatch(setNotification(`You voted '${anecdotes.find(a=>a.id === id).content}'`, 5))
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
