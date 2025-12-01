import { test, describe, expect } from 'vitest'
import deepFreeze from 'deep-freeze'
import { addVote, createAnecdote } from './anecdoteReducer'
import reducer from './anecdoteReducer'

describe('anecdoteReducer', () => {
    test('returns a new state with action VOTE', () => {
        const id = '1234'
        const state = [
            {
                content: 'If it hurts, do it more often',
                id: id,
                votes: 0,
            }
        ]
        const action = addVote(id)
        deepFreeze(state)
        expect(reducer(state, action)).toContainEqual({...state[0], votes: state[0].votes + 1})
    })

    test('returns a new state with action NEW_ANECDOTE', () => {
        const state = [
            {
                content: 'If it hurts, do it more often',
                id: 1234,
                votes: 0,
            }
        ]
        const action = createAnecdote('Test anecdote')
        deepFreeze(state)
        expect(reducer(state, action)).toHaveLength(2)
    })
})

