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

export default { getAll, create }