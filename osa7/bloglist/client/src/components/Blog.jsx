import { useState, useEffect } from "react";
import { Card, FormInput, GrayText, LikeButton, RemoveButton, Button, Comment } from "./Styles";
import { useBlogControls, useUserControls, useNotificationControls } from "../store";
import { useNavigate } from "react-router-dom";

const Blog = ({ blog, user }) => {
  const [likes, setLikes] = useState(0);
  const [newComment, setNewComment] = useState("");
  const { likeBlog, addComment, deleteBlog } = useBlogControls();
  const { notify } = useNotificationControls();
  const { logoutUser } = useUserControls();
  const navigate = useNavigate();

  useEffect(() => {
    if (blog) {
      setLikes(blog.likes);
    }
  }, [blog]);

  if (!blog) return;

  const handleLike = async () => {
    try {
      likeBlog(blog.id);
    } catch (err) {
      notify("Failed to like blog, try again.", "error");
    }
  };

  const externalUrl = blog.url.startsWith("http") ? blog.url : `https://${blog.url}`;

  const handleComment = async (event) => {
    event.preventDefault();
    try {
      await addComment(blog.id, {
        comment: newComment,
      });
      setNewComment("");
    } catch (err) {
      if (err.response && err.response.data.error === "comment missing") {
        notify("Cannot add an empty comment.", "error");
      } else {
        notify("Failed to add comment, try again.", "error");
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteBlog(id);
      navigate("/");
      notify("Blog deleted succesfully.", "success");
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logoutUser();
        notify("Your session has expired. Please log in again.", "error");
      } else {
        notify("Failed to delete blog, try again.", "error");
      }
    }
  };

  return (
    <Card className="blog">
      <h2 style={{ margin: "0.5em 0" }}>{blog.title}</h2>

      <GrayText>by {blog.author}</GrayText>

      <a
        style={{ display: "block", margin: "0.8em 0", wordBreak: "break-word" }}
        href={externalUrl}
        target="_blank"
        rel="noopener noreferrer"
      >
        {blog.url}
      </a>

      <GrayText>Added by {blog.user.name}</GrayText>

      <div>
        <span style={{ fontSize: "1.2em", marginRight: "0.4em" }}>{likes} likes</span>

        {user && (
          <>
            <LikeButton style={{ marginLeft: 8 }} onClick={handleLike}>
              Like
            </LikeButton>

            {blog.user.username === user.username && (
              <RemoveButton
                onClick={() => {
                  if (window.confirm("Do you want to delete this blog?")) {
                    handleDelete(blog.id);
                  }
                }}
              >
                Remove
              </RemoveButton>
            )}
          </>
        )}
      </div>

      <div>
        <h3 style={{ marginBottom: "2px" }}>Comments</h3>
        {user && (
          <form style={{ marginBottom: "10px" }} onSubmit={handleComment}>
            <FormInput
              value={newComment}
              onChange={(event) => setNewComment(event.target.value)}
              placeholder="Add a comment"
            />
            <Button type="submit">ADD COMMENT</Button>
          </form>
        )}
        {blog.comments.map((comment) => (
          <Comment key={comment._id}>{comment.content}</Comment>
        ))}
      </div>
    </Card>
  );
};

export default Blog;
