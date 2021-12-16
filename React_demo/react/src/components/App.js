import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Home from "./Home";
import Login from "./Login";
import Register from "./Register";
import Profile from "./MyProfile";
import Forum from "./Forum";
import EditProfile from "./EditProfile"
import AllPost from "./AllPost"
import EditPost from "./EditPost"
import MessageContext from "../contexts/MessageContext";
import { getUser, removeUser, setUser } from "../data/user.repository";
import { login, logout } from "../data/user.repository";

export default function App() {
  const [user, updateUser] = useState(getUser());
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if(message === null)
      return;

    const id = setTimeout(() => setMessage(null), 5000);

    return () => clearTimeout(id);
  }, [message]);

  useEffect(() => {
    login();
    return () => {
      logout();
    }
  }, [])

  const loginUser = async (user) => {
    setUser(user);
    updateUser(user);
    await login();
  };

  const logoutUser = async () => {
    logout();
    removeUser();
    updateUser(null);
  };
//app will catch the current user to use methods natural
  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Switch>
          <Route path="/">
            <MessageContext.Provider value={{ message, setMessage }}>
              <Navbar user={user} logoutUser={logoutUser} />
              <main role="main">
                <div className="container my-3">
                  <Switch>
                    <Route path="/login">
                      <Login loginUser={loginUser} />
                    </Route>
                    <Route path="/register">
                      <Register loginUser={loginUser} />
                    </Route>
                    <Route path="/profile">
                      <Profile logoutUser={logoutUser} />
                    </Route>
                    <Route path="/editprofile">
                      <EditProfile/>
                    </Route>
                    <Route path="/forum">
                      <Forum user={user} />
                    </Route>
                    <Route path="/allpost">
                      <AllPost user={user}/>
                    </Route>
                    <Route path="/editPost/:post_id" render={props => {
                      return <EditPost {...props.match.params}/>
                    }} />
                    <Route path="/">
                      <Home user={user} />
                    </Route>
                  </Switch>
                </div>
              </main>
            </MessageContext.Provider>
          </Route>
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}
