import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import Admin from "./Admin"
import EditProfile from "./EditProfile"

export default function App() {
  const [message, setMessage] = useState(null);

  useEffect(() => {
    if(message === null)
      return;

    const id = setTimeout(() => setMessage(null), 5000);

    return () => clearTimeout(id);
  }, [message]);


  return (
    <div className="d-flex flex-column min-vh-100">
      <Router>
        <Navbar/>
        <Switch>
          <Route path="/edit/:username" render={props => {
            return (
              <EditProfile username={props.match.params.username}></EditProfile>
            )
          }} />
          <Route path="/">
            <Admin></Admin>
          </Route>
          
        </Switch>
        <Footer />
      </Router>
    </div>
  );
}
