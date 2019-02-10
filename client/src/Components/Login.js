import React, { Component } from 'react';
import { Button, Form, FormGroup, Input, Container, Alert } from 'reactstrap';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      success: null,
      message: '',
    };

    this.storeAuthToken = this.storeAuthToken.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.authenticateUser = this.authenticateUser.bind(this);
  }

  storeAuthToken(token) {
    localStorage.setItem('id_token', token);
  }

  onSubmit(event) {
    var user = {
      username: this.state.username,
      password: this.state.password
    };
    this.authenticateUser(user);
    event.preventDefault();
  }

  handleChange(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({[name]: value});
  }

  authenticateUser(user) {
    fetch('http://localhost:8080/users/authenticate', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(user)
    })
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        console.log(response.msg);
        this.storeAuthToken(response.token);
        this.setState({success: 1});
        this.setState({message: response.msg});
        setTimeout(() => {
          window.location.replace('/Dashboard');
          this.setState({success: 0});
        }, 2000);
      } else if (response.success === false){
        console.log(response.msg);
        this.setState({success: 2});
        this.setState({message: response.msg});
        setTimeout(() => {
          this.setState({success: 0});
        }, 2000);
      }
    });
  }

  render() {
    var message;
    if (this.state.success === 0) {
      message = (
        <div></div>
      );
    }
    else if (this.state.success === 1) {
      message = (
        <Alert color="success">
          {this.state.message}
        </Alert>
      );
    } else if (this.state.success === 2) {
      message = (
        <Alert color="danger">
          {this.state.message}
        </Alert>
      )
    }

    return (
      <div>
        <h1>Login</h1>
        <Container>
          {message}
          <Form>
            <FormGroup>
              <Input type="username" name="username" placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}/>
            </FormGroup>
          </Form>
          <Button block onClick={this.onSubmit}>Login</Button>
        </Container>
      </div>
    );
  }
}

export default Login;
