import { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, like, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = { border: 'solid 1px', padding: '10px', margin: '20px' }

  const handleLike = () => {
    const newBlog = {
      ...blog,
      likes: blog.likes + 1
    }

    like(newBlog)
  }

  const handleDelete = () => {
    if (window.confirm(`Remove blog ${blog.title} by ${blog.author}`)) {
      deleteBlog(blog)
    }
  }

  return (
    <div style={blogStyle} >

      {/* blog tittle and view button */}
      <div className='blog-title' >
        {blog.title} by <em>{blog.author}</em>
        <button onClick={() => setVisible(!visible)}>
          {visible ? 'hide' : 'view'}
        </button>
      </div>
      {visible && (
        <div className='blog-details'>
          {/* blog url */}
          <div>{blog.url}</div>

          {/* Like and like button */}
          <div>
            {blog.likes || 0} likes <button onClick={handleLike}>like</button>
          </div>

          <div>Added by {blog.user.name}</div>

          {/* remove btn */}
          {user && user.username === blog.user.username && (
            <button onClick={handleDelete}>remove</button>
          )}
        </div>
      )}
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  like: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object
}

export default Blog
