import { createSlice } from "@reduxjs/toolkit"
import anecdotesService from "../services/anecdotes"

// const anecdotesAtStart = [
//   'If it hurts, do it more often',
//   'Adding manpower to a late software project makes it later!',
//   'The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
//   'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
//   'Premature optimization is the root of all evil.',
//   'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.'
// ]

// const getId = () => (100000 * Math.random()).toFixed(0)

// const asObject = anecdote => {
//   return {
//     content: anecdote,
//     id: getId(),
//     votes: 0
//   }
// }

// const initialState = anecdotesAtStart.map(asObject)

const anecdotesSlice = createSlice({
  name: 'anecdotes',
  initialState: [],
  reducers: {
    addVote(state, action){
      return state.map(s => 
        s.id === action.payload.id ? action.payload: s
      ).toSorted((a,b) => b.votes - a.votes)
    },
    createAnecdote(state, action) {
      state.push(action.payload)
      return state
    },
    setAnecdotes(state, action){
      return action.payload
    },
  }
})

const { setAnecdotes, createAnecdote, addVote } = anecdotesSlice.actions

export const initializeAnecdotes = () => {
  return async (dispatch) => {
    const anecdotes = await anecdotesService.getAll()
    dispatch(setAnecdotes(anecdotes.sort((a,b) => b.votes-a.votes )))
  } 
}

export const appendAnecdote = (content) => {
  return async (dispatch) => {
    const savedAnecdote = await anecdotesService.create(content)
    dispatch(createAnecdote(savedAnecdote))
  }
}

export const voteAnecdote = (id) => {
  return async (dispatch, getState) => {
    const anecdote = getState().anecdotes.find(a => a.id === id)
    const updatedAnecdote = await anecdotesService.update({...anecdote, votes: anecdote.votes + 1})
    dispatch(addVote(updatedAnecdote))
  }
}

export default anecdotesSlice.reducer