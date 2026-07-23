import { Button, FormInput } from "./Styles";
import { useBlogControls, useUserControls, useNotificationControls, useUser } from "../store";
import { useNavigate } from "react-router-dom";
import { useField } from "../hooks";

const AddBlogForm = ({ user }) => {
  const { addBlog } = useBlogControls();
  const { notify } = useNotificationControls();
  const { logoutUser } = useUserControls();
  const navigate = useNavigate();

  const titleField = useField("text", "Title");
  const authorField = useField("text", "Author");
  const urlField = useField("text", "Url");

  const createBlog = async (event) => {
    event.preventDefault();
    try {
      await addBlog(
        {
          title: titleField.inputProps.value,
          author: authorField.inputProps.value,
          url: urlField.inputProps.value,
        },
        user,
      );

      navigate("/");
      notify("New blog entry successfully created.", "success");

      titleField.reset();
      authorField.reset();
      urlField.reset();
    } catch (err) {
      if (err.response && err.response.status === 401) {
        logoutUser();
        notify("Your session has expired. Please log in again.", "error");
      } else {
        notify("Title, author and url are needed for a blog entry.", "error");
      }
    }
  };

  return (
    <div>
      <h2>Create a new blog</h2>
      <form onSubmit={createBlog}>
        <label>
          <FormInput {...titleField.inputProps} />
        </label>
        <br />

        <label>
          <FormInput {...authorField.inputProps} />
        </label>
        <br />

        <label>
          <FormInput {...urlField.inputProps} />
        </label>
        <br />

        <Button type="submit">Create</Button>
      </form>
    </div>
  );
};

export default AddBlogForm;
