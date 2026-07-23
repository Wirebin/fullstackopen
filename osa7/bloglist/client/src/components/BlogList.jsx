import { useBlogs } from "../store";
import { BlogLink, BlogTable } from "./Styles";

const BlogList = () => {
  const blogs = useBlogs();

  return (
    <div>
      <h2>Blogs</h2>
      <BlogTable>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Likes</th>
            <th>Url</th>
          </tr>
        </thead>
        <tbody>
          {blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <BlogLink to={`/blogs/${blog.id}`}>{blog.title}</BlogLink>
                </td>
                <td>{blog.author}</td>
                <td>{blog.likes}</td>
                <td>
                  <a
                    href={blog.url.startsWith("http") ? blog.url : `https://${blog.url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {blog.url}
                  </a>
                </td>
              </tr>
            ))}
        </tbody>
      </BlogTable>
    </div>
  );
};

export default BlogList;
