import { Button, LoginInput } from "./Styles";
import { useField } from "../hooks";
import { useNavigate } from "react-router-dom";
import { useUserControls, useNotificationControls } from "../store";

const LoginForm = () => {
  const username = useField("text", "Username");
  const password = useField("password", "Password");
  const { loginUser } = useUserControls();
  const { notify } = useNotificationControls();
  const navigate = useNavigate();

  const onSubmit = async (event) => {
    event.preventDefault();
    //loginUser(username.inputProps.value, password.inputProps.value);

    try {
      await loginUser({
        username: username.inputProps.value,
        password: password.inputProps.value,
      });
      navigate("/");
      username.reset();
      password.reset();
    } catch {
      notify("Wrong credentials, try again.", "error");
    }
  };

  return (
    <div>
      <h2>Log in to application</h2>
      <form onSubmit={onSubmit}>
        <div>
          <label>
            <LoginInput {...username.inputProps} />
          </label>
        </div>
        <div>
          <label>
            <LoginInput {...password.inputProps} />
          </label>
        </div>
        <Button type="submit">Login</Button>
      </form>
    </div>
  );
};

export default LoginForm;
