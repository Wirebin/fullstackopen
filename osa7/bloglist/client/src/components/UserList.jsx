import { StyleTable, BlogLink } from "./Styles";

const UserList = ({ users }) => {
  return (
    <div>
      <h2>Users</h2>
      <StyleTable>
        <thead>
          <tr>
            <th>Name</th>
            <th>Username</th>
            <th>Blogs created</th>
          </tr>
        </thead>
        <tbody>
          {users
            .sort((a, b) => b.blogs.length - a.blogs.length)
            .map((user) => (
              <tr key={user.id}>
                <td>
                  <BlogLink to={`/users/${user.id}`}>{user.name}</BlogLink>
                </td>
                <td>{user.username}</td>
                <td>{user.blogs.length}</td>
              </tr>
            ))}
        </tbody>
      </StyleTable>
    </div>
  );
};

export default UserList;
