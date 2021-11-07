import React from "react";
import { Link } from "react-router-dom";

const Login = ({
  user,
  setUser,
  colour,
  setColour,
  setUserColourConfirmed,
}) => {
  return (
    <div className="login-container">
      <h1>{process.env.REACT_APP_GROUP_NAME}</h1>
      <div className="name-and-colour-container">
        <div>
          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
          ></input>
          <div>
            <button value="red" onClick={(e) => setColour(e.target.value)}>
              red
            </button>
            <button
              value="lightgreen"
              onClick={(e) => setColour(e.target.value)}
            >
              green
            </button>
            <button value="blue" onClick={(e) => setColour(e.target.value)}>
              blue
            </button>
            <button
              value="mediumpurple"
              onClick={(e) => setColour(e.target.value)}
            >
              purple
            </button>
          </div>
          <p
            style={{
              color: colour ? colour : "black",
            }}
          >
            {user}
          </p>
        </div>
        <Link to="/">
          <button
            className="go-button"
            onClick={() => setUserColourConfirmed(true)}
          >
            Go
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Login;
