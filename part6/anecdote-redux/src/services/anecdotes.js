const baseUrl = 'http://localhost:3001/anecdotes'
const getAll = async () => {
    const response = await fetch(baseUrl)

    if (!response.ok){
        throw new Error('Could not fetch anecdotes')
    }

    const anecdotes = await response.json()
    console.log(anecdotes)

    return anecdotes
} 

const create = async (content) => {
    const response = await fetch(baseUrl, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({content, votes: 0})
    })

    if (!response.ok){
        console.log(response)
        throw new Error('Could not create a new anecdote')
    }

    return (await response).json()
}

const update = async (anecdote) => {
    const response = await fetch(`${baseUrl}/${anecdote.id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(anecdote)
    })

    if(!response.ok) {
        throw new Error('Could not vote')
    }

    return await response.json()
}

export default { getAll, create, update }