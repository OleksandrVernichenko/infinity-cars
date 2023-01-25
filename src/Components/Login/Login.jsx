import * as React from "react";
import IconButton from "@mui/material/IconButton";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import FormControl from "@mui/material/FormControl";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import TextField from "@mui/material/TextField";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { createSelector } from "reselect";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";

import "./login.scss";
import logo from "../../assets/logo.png";
import face from "../../assets/facebook.png";
import yout from "../../assets/youtube.png";
import inst from "../../assets/instagram.png";
import {
  fetchUsers,
  userCreated,
  currentUserLogged,
  setLogged,
} from "../../actions";
import { useHttp } from "../../hooks/http.hook";

const Login = () => {
  const users = createSelector(
    (state) => state.users,
    (users) => {
      return {
        users,
      };
    }
  );
  const navigate = useNavigate();
  const [hasAccount, setHasAccount] = useState(false);

  const usersData = useSelector(users);

  const dispatch = useDispatch();
  const { request } = useHttp();

  useEffect(() => {
    dispatch(fetchUsers(request));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="login_page">
      <div className="user_left">
        <UserForm
          onClick={setHasAccount}
          hasAccount={hasAccount}
          user={usersData.users.users}
          navigate={navigate}
        />
      </div>
      <div className="login_page_logo">
        <div className="login_page_logo-inner">
          <img src={logo} alt="logo" />
          <p>{hasAccount ? "Login" : "Register"}</p>
          <span>Welcome to Autohunt</span>
          <ul>
            <li>
              <img src={face} alt="facebook" />
            </li>
            <li>
              <img src={inst} alt="instagram" />
            </li>
            <li>
              <img src={yout} alt="youtube" />
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const UserForm = (props) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");

  const { request } = useHttp();
  const dispatch = useDispatch();

  const onCreateUser = (e) => {
    e.preventDefault();
    const newUser = {
      name,
      password,
      email,
      isAdmin: false,
      phone,
      id: uuidv4(),
      photo: "https://drive.google.com/uc?id=1a0cLkSWfrV9_hgv6YZfSL0VrIvtYn1Df",
    };

    if (name.length < 3 && password.length < 3) {
      return;
    } else {
      request("http://localhost:3001/users", "POST", JSON.stringify(newUser))
        .then((res) => console.log(res, "User Created"))
        .then(dispatch(userCreated(newUser)))
        .catch((err) => console.log(err));

      setName("");
      setPassword("");
      setEmail("");
      setPhone("");
    }
  };

  const onLogin = (e) => {
    e.preventDefault();

    const loginUser = props.user.filter(
      (item) => item.email === email && item.password === password
    );
    dispatch(currentUserLogged(loginUser));

    if (loginUser.length !== 0) {
      dispatch(setLogged(true));

      //
      props.navigate("/admin");
    } else {
      dispatch(setLogged(false));
    }

    setEmail("");
    setPassword("");
  };

  return (
    <>
      <form
        style={{
          display: "flex",
          flexDirection: "column",
          width: 200,
          gap: 15,
        }}
        onSubmit={(e) => {
          props.hasAccount ? onLogin(e) : onCreateUser(e);
        }}
      >
        {props.hasAccount ? null : (
          <>
            Name
            <TextField
              sx={{ width: 500, background: "#152836" }}
              id="outlined-name"
              label="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </>
        )}
        Email
        <TextField
          sx={{ width: 500, background: "#152836" }}
          id="outlined-email"
          label="Email"
          value={email}
          type="email"
          onChange={(e) => setEmail(e.target.value)}
        />
        {props.hasAccount ? null : (
          <>
            Phone
            <TextField
              sx={{ width: 500, background: "#152836" }}
              id="outlined-phone"
              label="Phone"
              type={"number"}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </>
        )}
        Password
        <FormControl
          variant="outlined"
          sx={{ width: 500, background: "#152836" }}
        >
          <InputLabel htmlFor="password">Password</InputLabel>
          <OutlinedInput
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>
        <input
          type="submit"
          value={props.hasAccount ? "Login" : "Create My Account"}
          style={{
            background: "#152836",
            color: "white",
            border: "1px solid rgba(255, 255, 255, 0.23)",
            borderRadius: 3,
            width: 500,
            height: 56,
            textAlign: "center",
            fontWeight: 600,
            fontSize: 15,
            marginTop: 25,
            cursor: "pointer",
          }}
        />
      </form>
      <div className="login_active_link">
        {props.hasAccount ? (
          <>
            Don’t have an account?{" "}
            <button onClick={() => props.onClick(false)}>Create Account</button>
          </>
        ) : (
          <>
            Have an account already?{" "}
            <button onClick={() => props.onClick(true)}>Login here</button>
          </>
        )}
      </div>
    </>
  );
};

export default Login;
