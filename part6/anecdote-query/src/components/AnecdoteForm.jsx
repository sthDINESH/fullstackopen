import { useMutation, useQueryClient } from "@tanstack/react-query"
import { appendAnecdote } from "../requests"
import { useContext } from "react"
import NotificationContext from "../NotificationContext"

const AnecdoteForm = () => {
  const queryClient = useQueryClient()
  const { notificationDispatch } = useContext(NotificationContext)

  const newAnecdoteMutation = useMutation({
    mutationFn: appendAnecdote,
    onSuccess: (newAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], [...anecdotes, newAnecdote])
      notificationDispatch({
        type: 'SET_MESSAGE',
        payload: `new anecdote '${newAnecdote.content}' created`
      })
      setTimeout(()=>notificationDispatch({type:'CLEAR_MESSAGE'}), 5000)
    } 
  })

  const onCreate = (event) => {
    event.preventDefault()
    const content = event.target.anecdote.value
    event.target.anecdote.value = ''
    console.log('new anecdote')
    newAnecdoteMutation.mutate(content)
  }

  return (
    <div>
      <h3>create new</h3>
      <form onSubmit={onCreate}>
        <input name="anecdote" />
        <button type="submit">create</button>
      </form>
    </div>
  )
}

export default AnecdoteForm
