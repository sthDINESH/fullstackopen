export const getAnecdotes = async () => {
    const baseUrl = 'http://localhost:3001/anecdotes'
    const response = await fetch(baseUrl)
    if (!response.ok){
        throw new Error('Could not fetch anecdotes')
    }
    return await response.json()
}