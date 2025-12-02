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

export default { getAll }