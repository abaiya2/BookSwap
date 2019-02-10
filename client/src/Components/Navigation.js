import React, { Component } from 'react';
import {
  Collapse,
  Navbar,
  NavbarToggler,
  NavbarBrand,
  Nav,
  NavItem,
  NavLink,
} from 'reactstrap';

import { loadToken, isLoggedIn } from '../Utility/Utility';

class Navigation extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.logout = this.logout.bind(this);
    this.state = {
      isOpen: false,
      loggedIn: '',
      logoutState: 0,
    };
  }
  componentWillMount() {
    this.setState({loggedIn: isLoggedIn()});
  }

  logout() {
    localStorage.removeItem('id_token');
    this.setState({logoutState:1});
    setTimeout(() => {
      this.setState({logoutState: 0});
      window.location.replace('/Login');
    }, 1000);
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    var loggedIn = this.state.loggedIn;
    var profile, dashboard, logout, login, register;
    if (loggedIn) {
      dashboard = (
        <NavItem>
          <NavLink href="/Dashboard">Dashboard</NavLink>
        </NavItem>
      );
      profile = (
        <NavItem>
          <NavLink href="/Profile">Profile</NavLink>
        </NavItem>
      );
      logout = (
        <NavItem>
          <NavLink href="#" onClick={this.logout}>Logout</NavLink>
        </NavItem>
      );
    }
    else if (!loggedIn) {
      login = (
        <NavItem>
          <NavLink href="/Login">Login</NavLink>
        </NavItem>
      );
      register = (
        <NavItem>
          <NavLink href="/Register">Register</NavLink>
        </NavItem>
      );
    }

    return (
      <div>
        <Navbar color="light" light expand="md">
          <NavbarBrand href="/">bookswap</NavbarBrand>
          <NavbarToggler onClick={this.toggle} />
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar>
              <NavItem>
                <NavLink href='/AllBooks'>All Books</NavLink>
              </NavItem>
              {dashboard}
              {profile}
              {logout}
              {login}
              {register}
            </Nav>
          </Collapse>
        </Navbar>
      </div>
    );
  }
}

export default Navigation;
