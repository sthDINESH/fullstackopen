const _ = require('lodash');


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

const mostBlogs = (blogs) => {
    if(blogs.length == 0) return {}
    const authorBlogs = _.countBy(blogs, 'author')
    const maxAuthor = _.maxBy(Object.keys(authorBlogs), (a) => authorBlogs[a])
    return {
        author: maxAuthor,
        blogs: authorBlogs[maxAuthor],
    }
}

const mostLikes = (blogs) => {
    if(blogs.length == 0) return {}
    const authorLikes = _.reduce(blogs, (result, blog)=>{
        result[blog.author] = (result[blog.author] || 0) + blog.likes
        return result
    }, {})
    const maxAuthor = _.maxBy(Object.keys(authorLikes), (a)=>authorLikes[a])
    return {
        author: maxAuthor,
        likes: authorLikes[maxAuthor],
    }
}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs,
    mostLikes,
}