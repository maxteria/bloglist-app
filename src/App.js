import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import blogService from './services/blogs'
import loginService from './services/login'
import Togglable from './components/Togglable'
import BlogForm from './components/BlogForm'
import LoginForm from './components/LoginForm'
import Footer from './components/Footer'

function App () {
  const [blogs, setBlogs] = useState([])
  const [notification, setNotification] = useState(null)
  const [user, setUser] = useState(null)
  const blogFormRef = useRef()
  const loginFormRef = useRef()

  useEffect(() => {
    const getAllBlogs = async () => {
      const blogs = await blogService.getAll()
      setBlogs(blogs)
    }

    getAllBlogs().catch((error) => {
      console.log(error)
    })
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (credentials) => {
    try {
      const user = await loginService.login(credentials)

      loginFormRef.current.toggleVisibility()

      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )

      blogService.setToken(user.token)

      setUser(user)
    } catch (exception) {
      console.log('wrong credentials')
      setNotification('wrong credentials')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    setUser(null)
    setNotification(`Good by dear ${user.name}`)
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const createBlog = async (blogObject) => {
    try {
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))

      blogFormRef.current.toggleVisibility()

      setNotification(`New blog ${returnedBlog.title} added`)
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    } catch (exception) {
      console.log(exception)
      setNotification('New blog error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const deleteBlog = async (blogObject) => {
    try {
      await blogService.remove(blogObject)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
    } catch (exception) {
      console.log(exception)
      setNotification('Delete error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  const likeBlog = async (blogObject) => {
    if (user === null) {
      setNotification('You must be logged to like')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
      return
    }
    try {
      const returnedBlog = await blogService.update(blogObject)
      setBlogs(blogs.map(blog => blog.id !== returnedBlog.id ? blog : returnedBlog))
    } catch (exception) {
      console.log(exception)
      setNotification('Like error')
      setTimeout(() => {
        setNotification(null)
      }, 5000)
    }
  }

  return (
    <>
      {/* notification area */}
      {notification !== null && <div>{notification}</div>}

      {/* login area */}
      {user !== null && <p>{user.name} logged in <button onClick={handleLogout}>logout</button></p>}

      {/* loging form */}
      {user === null &&
        <Togglable buttonLabel='login' ref={loginFormRef}>
          <h2>Log in to application</h2>
          {user === null && <LoginForm handleLogin={handleLogin} />}
        </Togglable>
      }

      <h1>Bloglist APP</h1>

      {/* blog form */}
      {user !== null &&
        <Togglable buttonLabel='new blog' ref={blogFormRef}>
          <h2>Create new</h2>
          <BlogForm createBlog={createBlog} />
        </Togglable>
      }

      {/* blog list */}
      <div id='blogs'>
        {
          blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <Blog
                key={blog.id}
                blog={blog}
                like={likeBlog}
                deleteBlog={deleteBlog}
                user={user}
              />
            ))
        }

        {blogs.length === 0 && <p>No blogs</p>}
      </div>
      <Footer />
    </>
  )
}

export default App
