const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = async () => {
    const response = await fetch(baseUrl)
    if (!response.ok){
        throw new Error('Could not fetch anecdotes')
    }
    return await response.json()
}

export const appendAnecdote = async (content) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({content, votes: 0})
    })
    if(!response.ok){
        throw new Error('Could not create a new anecdote')
    }
    return await response.json()
}

export const updateVote = async (updatedAnecdote) => {
    const response = await fetch(`${baseUrl}/${updatedAnecdote.id}`,{
        method: 'PUT',
        headers:{
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(updatedAnecdote)
    })
    if(!response.ok){
        throw new Error('Could not update votes')
    }

    return await response.json()
}
