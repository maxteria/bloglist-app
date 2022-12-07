const Blog = ({blog}) => (
  <div className="blog">
    <h2>{blog.title}</h2>
    <p>{blog.author}</p>
    <p>{blog.url}</p>
    <p>{blog.likes}</p>
  </div>
)

export default Blog