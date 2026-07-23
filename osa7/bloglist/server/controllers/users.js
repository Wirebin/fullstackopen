const usersRouter = require("express").Router();
const bcrypt = require("bcrypt");
const User = require("../models/user");

// Get all accounts
usersRouter.get("/", async (request, response, next) => {
  try {
    const users = await User.find({}).populate("blogs", {
      url: 1,
      title: 1,
      author: 1,
      id: 1,
    });

    response.json(users);
  } catch (err) {
    next(err);
  }
});

// Create account
usersRouter.post("/", async (request, response, next) => {
  const { username, name, password } = request.body;
  const saltRounds = 10;

  if (!username || !password) {
    return response.status(400).json({ error: "Missing field: username or password" });
  } else if (username.length < 3) {
    return response.status(400).json({ error: "Username needs to be at least 3 characters long" });
  } else if (password.length < 3) {
    return response.status(400).json({ error: "Password needs to be at least 3 characters long" });
  }

  try {
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({
      username: username,
      name: name,
      passhash: passwordHash,
    });

    const savedUser = await user.save();
    return response.status(201).json(savedUser);
  } catch (err) {
    next(err);
  }
});

module.exports = usersRouter;
