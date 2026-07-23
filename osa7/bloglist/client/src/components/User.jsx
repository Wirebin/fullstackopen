import { BlogTable, BlogLink } from "./Styles";

const User = ({ userInfo }) => {
  if (!userInfo) return null;

  return (
    <div>
      <h1>{userInfo.name}</h1>
      <h2>Added blogs</h2>
      <BlogTable>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Url</th>
          </tr>
        </thead>
        <tbody>
          {userInfo.blogs
            .sort((a, b) => b.likes - a.likes)
            .map((blog) => (
              <tr key={blog.id}>
                <td>
                  <BlogLink to={`/blogs/${blog.id}`}>{blog.title}</BlogLink>
                </td>
                <td>{blog.author}</td>
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

export default User;
