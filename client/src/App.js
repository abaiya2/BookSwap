import React, { Component } from 'react';


import { BrowserRouter, Route, Switch } from 'react-router-dom';

import Dashboard from './Components/Dashboard';
import Home from './Components/Home';
import Login from './Components/Login';
import Navigation from './Components/Navigation';
import Profile from './Components/Profile';
import Register from './Components/Register';
import Allbooks from './Components/Allbooks';

class App extends Component {
  render() {
    return (
      <div>
        <Navigation></Navigation>
        <BrowserRouter>
          <Switch>
            <Route exact path='/Dashboard' component={Dashboard}/>
            <Route exact path='/Profile' component={Profile}/>
            <Route exact path='/Register' component={Register}/>
            <Route exact path='/Login' component={Login}/>
            <Route exact path='/AllBooks' component={Allbooks}/>
            <Route exact path='/' component={Home}/>
          </Switch>
        </BrowserRouter>
      </div>
    );
  }
}

export default App;
