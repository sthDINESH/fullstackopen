const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => blogs.reduce((total, blog) => total + blog.likes, 0)

const favoriteBlog = (blogs) => {
    if (blogs.length === 0) {
        return {}
    } else {
        return blogs.reduce((favoriteBlog, blog)=>blog.likes > favoriteBlog.likes? blog : favoriteBlog, blogs[0])
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
}