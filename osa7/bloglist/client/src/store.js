import { create } from "zustand";
import blogService from "./services/blogs";
import loginService from "./services/login";
import { saveUser, removeUser } from "./services/persistentUser";

const useNotificationStore = create((set) => ({
  data: {
    message: null,
    messageType: null,
  },
  actions: {
    notify: (message, messageType = "success", timeout = 5000) => {
      set({
        data: {
          message,
          messageType,
        },
      });
      setTimeout(() => {
        set({
          data: {
            message: null,
            messageType: null,
          },
        });
      }, timeout);
    },
  },
}));

export const useNotification = () => useNotificationStore((state) => state.data);
export const useNotificationControls = () => useNotificationStore((state) => state.actions);

const useBlogStore = create((set, get) => ({
  blogs: [],
  actions: {
    setBlogs: (blogs) => {
      set({ blogs });
    },
    addBlog: async (blogObject, user) => {
      const newBlog = await blogService.createBlog(blogObject);
      const normalizedBlog = {
        ...newBlog,
        user: newBlog.user?.name
          ? newBlog.user
          : { id: newBlog.user, name: user.name, username: user.username },
      };
      set((state) => ({ blogs: state.blogs.concat(normalizedBlog) }));
    },
    addComment: async (id, comment) => {
      const updatedBlog = await blogService.addComment(id, comment);
      set((state) => ({
        blogs: state.blogs.map((b) => (b.id !== id ? b : updatedBlog)),
      }));
    },
    likeBlog: async (id) => {
      const blogs = get().blogs;
      const blog = blogs.find((b) => b.id === id);
      const updatedBackend = {
        ...blog,
        user: blog.user.id,
        likes: blog.likes + 1,
      };
      await blogService.updateBlog(blog.id, updatedBackend);

      const updatedFrontend = {
        ...updatedBackend,
        user: blog.user,
      };
      set((state) => ({ blogs: state.blogs.map((b) => (b.id !== id ? b : updatedFrontend)) }));
    },
    deleteBlog: async (id) => {
      await blogService.deleteBlog(id);
      set((state) => ({ blogs: state.blogs.filter((blog) => blog.id !== id) }));
    },
  },
}));

export const useBlogs = () => useBlogStore((state) => state.blogs);
export const useBlogControls = () => useBlogStore((state) => state.actions);

const useUserStore = create((set) => ({
  user: null,
  actions: {
    setUserToStore: (user) => set({ user }),
    clearUserFromStore: () => set({ user: null }),
    loginUser: async ({ username, password }) => {
      const user = await loginService.login({ username, password });

      saveUser(user);
      blogService.setToken(user.token);
      set({ user });
      return user;
    },
    logoutUser: () => {
      removeUser();
      set({ user: null });
    },
  },
}));

export const useUser = () => useUserStore((state) => state.user);
export const useUserControls = () => useUserStore((state) => state.actions);
