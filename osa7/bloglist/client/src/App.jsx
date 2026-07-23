import { useState, useEffect } from "react";
import { StyleLink, NavBar, NavLeft, NavRight, LogoutButton } from "./components/Styles";
import Blog from "./components/Blog";
import User from "./components/User";
import BlogList from "./components/BlogList";
import UserList from "./components/UserList";
import LoginForm from "./components/LoginForm";
import AddBlogForm from "./components/AddBlogForm";
import ErrorBoundary from "./components/ErrorBoundary";
import Notification from "./components/Notification";
import blogService from "./services/blogs";
import usersService from "./services/users";
import { getUser } from "./services/persistentUser";

import "./index.css";
import { Routes, Route, useMatch, useNavigate } from "react-router-dom";
import {
  useBlogControls,
  useBlogs,
  useUser,
  useUserControls,
  useNotificationControls,
} from "./store";

const App = () => {
  const user = useUser();
  const { setUserToStore, logoutUser } = useUserControls();
  const [users, setUsers] = useState([]);
  const blogs = useBlogs();
  const { setBlogs } = useBlogControls();
  const { notify } = useNotificationControls();
  const navigate = useNavigate();

  useEffect(() => {
    blogService.getAll().then((blogs) => setBlogs(blogs));
    usersService.getAll().then((users) => setUsers(users));
  }, []);

  useEffect(() => {
    const loggedUserJSON = getUser();
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      setUserToStore(user);
      blogService.setToken(user.token);
    }
  }, []);

  const handleLogout = (event) => {
    if (event) {
      event.preventDefault();
    }
    logoutUser();
    navigate("/");
    notify("Successfully logged out.");
  };

  const blogMatch = useMatch("/blogs/:id");
  const blog = blogMatch ? blogs.find((b) => b.id === blogMatch.params.id) : null;
  const userMatch = useMatch("/users/:id");
  const userInfo = userMatch ? users.find((u) => u.id === userMatch.params.id) : null;

  return (
    <div>
      <NavBar>
        <NavLeft>Blog App</NavLeft>
        <NavRight>
          <StyleLink to="/">BLOGS</StyleLink>
          <StyleLink to="/users">USERS</StyleLink>
          {!user && <StyleLink to="/login">LOGIN</StyleLink>}
          {user && (
            <>
              <StyleLink to="/create">CREATE</StyleLink>
              <LogoutButton onClick={(event) => handleLogout(event)}>LOGOUT</LogoutButton>
            </>
          )}
        </NavRight>
      </NavBar>

      <Notification />

      <ErrorBoundary>
        <Routes>
          <Route path="*" element={<h2>404 - Page not found</h2>} />
          <Route path="/" element={<BlogList />} />
          <Route path="/users" element={<UserList users={users} />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/blogs/:id" element={<Blog blog={blog} user={user} />} />
          <Route path="/users/:id" element={<User userInfo={userInfo} />} />
          <Route path="/create" element={<AddBlogForm user={user} />} />
        </Routes>
      </ErrorBoundary>
    </div>
  );
};

export default App;
