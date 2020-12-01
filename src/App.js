import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";

import Quiz from './quiz/Home'
import Home from './first/Home'
import Void from './void/containers/Game'
import Puzzle from './puzzle/js/components/app'

export default function App() {
  return (
    <Router>
      <div>


        <Switch>
          <Route path="/quiz">
            <Quiz />
          </Route>
          <Route path="/void">
            <Void boardSize={11} playerSize={25} />
          </Route>
          <Route path="/puzzle">
            <Puzzle />
          </Route>
          <Route path="/">
            <Home />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}