import React, { Component } from 'react';
import { Jumbotron, } from 'reactstrap';

class Home extends Component {

  render() {
    return (
      <div>
        <Jumbotron>
          <h1>BookSwap</h1>
          <p className='lead'>A book managing platform where you can add manage, and
          trade books</p>
        </Jumbotron>
      </div>
    );
  }
}

export default Home;
