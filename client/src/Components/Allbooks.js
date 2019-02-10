import React, { Component } from 'react';

class Allbooks extends Component {
  constructor(props) {
    super(props);
    this.getAllBooks = this.getAllBooks.bind(this);
    this.requestBook = this.requestBook.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.makeBookRequest = this.makeBookRequest.bind(this);
    this.state = {
      books: [],
      userId: '',
    };
  }

  componentWillMount() {
    this.getAllBooks();
    this.getProfile();
  }

  getProfile() {
    var token = localStorage.getItem('id_token');
    fetch('http://localhost:8080/users/profile', {
      method: 'GET',
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      this.setState({userId: response.user._id});
    }).catch(err => {
      console.log(err);
    });
  }

  getAllBooks() {
    fetch('http://localhost:8080/users/getAllBooks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    .then(response => response.json())
    .then(response => {
      var bookList = [];
      var bookResponse = response.books;
      bookResponse.map(item => {
        var bookArr = item.books;
        bookArr.map(book => {
          bookList.unshift(book);
        });
      });
      this.setState({books: bookList});
      console.log(bookList);
    });
  }

  requestBook(key) {
    var requestedBook = this.state.books[key];
    if (this.state.userId === requestedBook.userId) {
      console.log("You already own this book");
    } else if (this.state.userId === '') {
      console.log("Please login to request a book");
    } else {
      console.log("Requesting Book");
      var bookInfo = {
        ownerId: requestedBook.userId,
        requesterId: this.state.userId,
        title: requestedBook.title,
        imgLink: requestedBook.imgLink,
        pageCount: requestedBook.pageCount,
        bookId: requestedBook.bookId,
      }
      this.makeBookRequest(bookInfo);
    }
  }

  makeBookRequest(bookInfo) {
    fetch('http://localhost:8080/users/requestTrade', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookInfo)
    })
    .then(response => response.json())
    .then(response => {
      if (response.success === true) {
        console.log('True');
        console.log(response.msg);
      } else if (response.message === false) {
        console.log('False');
        console.log(response.msg);
      }
    });
  }


  render() {
    var books = this.state.books;
    var bookList;
    if (books) {
      console.log(books.length);
      bookList = books.map((item, i) => {
        return (
          <div key={i} className='bookItem'>
            <i onClick={() => this.requestBook(i)} className='fa fa-exchange hoverIcon'></i>
            <img src={item.imgLink} alt='Book'/>
          </div>
        );
      })
    }

    return (
      <div>
        <h1>All Books</h1>
        {bookList}
      </div>
    );
  }
}

export default Allbooks;
