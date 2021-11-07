import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import "./App.css";
import Login from "./Screens/Login";
import Proposals from "./Screens/Proposals";
import Draft from "./Screens/Draft";
import Deliberate from "./Screens/Deliberate";

function App() {
  const [user, setUser] = useState("");
  const [colour, setColour] = useState("red");
  const [userColourConfirmed, setUserColourConfirmed] = useState(false);

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <Login
              user={user}
              setUser={setUser}
              colour={colour}
              setColour={setColour}
              setUserColourConfirmed={setUserColourConfirmed}
            />
          }
        />
        <Route
          path="/draft/:draftProposalId"
          element={<Draft user={user} colour={colour} />}
        />
        <Route
          path="/deliberate/:proposalId"
          element={<Deliberate user={user} colour={colour} />}
        />
        <Route
          path="/proposals"
          element={<Proposals user={user} colour={colour} />}
        />
        <Route
          path="/"
          element={
            userColourConfirmed ? (
              <Navigate to="/proposals" />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
