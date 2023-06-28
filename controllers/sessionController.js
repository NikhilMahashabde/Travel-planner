import bcrypt from "bcrypt";
import User from "../model/user.js";

const verifyLoggedIn = (request, response) => {
  if (request.session.email) {
    response.json({ message: "user successfully logged in" });
  } else {
    response.status(401).json({ message: "user is not logged in" });
    return;
  }
};

//Logout
const handleLogout = (request, response) => {
  request.session.destroy();
  response.json({ message: "Logout success" });
};

//login
const handleLogin = (request, response) => {
  console.log("request.body on login:", request.body);
  const { email, password } = request.body;
  //filed missing
  if (!email || !password) {
    response.status(400).json({ message: "Missing Email or Password" });
    return;
  }

  User.findOne({ email: email }).then((user) => {
    if (user) {
      //compare input password and existing password match
      const isValidPassword = bcrypt.compareSync(password, user.passwordHash);

      //if it matched
      if (isValidPassword) {
        request.session.email = email;
        request.session.user = user;
        response.json({
          message: "Logged in Successfully",
          name: user.name,
          email: user.email,
        });
      } else {
        response.status(401).json({ message: "Incorrect password" });
      }
    } else {
      response.status(401).json({ message: "User could not be found" });
    }
  });
};

export { handleLogin, handleLogout, verifyLoggedIn };
