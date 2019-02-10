import React, { Component } from 'react';
import { Button, Form, FormGroup, Label, Input, Container } from 'reactstrap';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      name: '',
      password: '',
      email: '',
      success: null,
      message: '',
    };

    this.validateEmail = this.validateEmail.bind(this);
    this.validateRegister = this.validateRegister.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.addUser = this.addUser.bind(this);
  }

  validateEmail(email) {
    var regexTest = new RegExp(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/);
    return regexTest.test(email);
  }

  validateRegister(user) {
    if (user.name === '' || user.username === '' || user.email === '' || user.password === '') {
      return false;
    } else {
      return true;
    }
  }

  onSubmit(event) {
    var errorFree = true;
    var user = {
      name: this.state.name,
      username: this.state.username,
      email: this.state.email,
      password: this.state.password
    };

    if (!this.validateRegister(user)) {
      console.log('All fields not entered');
      errorFree = false;
    } else if (!this.validateEmail(user.email)) {
      console.log('email is invalid');
      errorFree = false;
    }
    if (errorFree) {
      this.addUser(user);
    }
    event.preventDefault();
  }

  handleChange(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({[name]: value});
  }

  addUser(user) {
    fetch('http://localhost:8080/users/register', {
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
        this.setState({success: 1});
        this.setState({message: response.msg});
        setTimeout(() => {
          window.location.replace('/Login');
        }, 2000);
      } else {
        console.log(response.msg);
        this.setState({success: 2});
        this.setState({message: response.msg});
      }
    });
  }

  render() {
    return (
      <div>
        <h1>Register</h1>
        <Container>
          <Form>
            <FormGroup>
              <Input type="text" name="name" placeholder="Name"
                value={this.state.name}
                onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="email" placeholder="Email"
                value={this.state.email}
                onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Input type="text" name="username" placeholder="Username"
                value={this.state.username}
                onChange={this.handleChange}/>
            </FormGroup>
            <FormGroup>
              <Input type="password" name="password" placeholder="Password"
                value={this.state.password}
                onChange={this.handleChange}/>
            </FormGroup>
            <Button block onClick={this.onSubmit}>Register</Button>
          </Form>
        </Container>
      </div>
    );
  }
}

export default Register;
