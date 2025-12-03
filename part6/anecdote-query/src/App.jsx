import AnecdoteForm from './components/AnecdoteForm'
import Notification from './components/Notification'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getAnecdotes, updateVote } from './requests'

const App = () => {
  const queryClient = useQueryClient()
  
  const updateVoteMutation = useMutation({
    mutationFn: updateVote,
    onSuccess:(updatedAnecdote) => {
      const anecdotes = queryClient.getQueryData(['anecdotes'])
      queryClient.setQueryData(['anecdotes'], anecdotes.map(a => a.id === updatedAnecdote.id ? updatedAnecdote : a))
    }
  })

  const handleVote = (anecdote) => {
    console.log('vote')
    updateVoteMutation.mutate({...anecdote, votes: anecdote.votes + 1})
  }

  const { data, isError, isLoading } = useQuery({
    queryKey: ['anecdotes'],
    queryFn: getAnecdotes,
    retry: 1, 
  })

  if(isLoading){
    return (<div>Loading</div>)
  } else if (isError){
    return (<div>anecdote service not available due to problems in server</div>)
  }

  const anecdotes = data

  return (
    <div>
      <h3>Anecdote app</h3>

      <Notification />
      <AnecdoteForm />

      {anecdotes.map((anecdote) => (
        <div key={anecdote.id}>
          <div>{anecdote.content}</div>
          <div>
            has {anecdote.votes}
            <button onClick={() => handleVote(anecdote)}>vote</button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default App
