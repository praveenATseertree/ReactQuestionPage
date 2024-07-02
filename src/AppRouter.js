import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Home from './Home';
import About from './About';

const AppRouter = () => (
    <Router>
        <Switch>
            <Route exact path="/home" component={Home} />
            <Route exact path="/about" component={About} />
        </Switch>
    </Router>
);

export default AppRouter;
