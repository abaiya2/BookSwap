import React, { Component } from 'react';
import {
  Button,
  Form,
  FormGroup,
  Input,
  Container,
  Collapse,
  CardBody,
  Card,
} from 'reactstrap';


class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.onSearchSubmit = this.onSearchSubmit.bind(this);
    this.searchForBook = this.searchForBook.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.getProfile = this.getProfile.bind(this);
    this.onBookSelect = this.onBookSelect.bind(this);
    this.generateBookId = this.generateBookId.bind(this);
    this.addBook = this.addBook.bind(this);
    this.toggleIncoming = this.toggleIncoming.bind(this);
    this.toggleOutgoing = this.toggleOutgoing.bind(this);
    this.cancelTrade = this.cancelTrade.bind(this);
    this.denyTrade = this.denyTrade.bind(this);
    this.makeTrade = this.makeTrade.bind(this);
    this.removeTrade = this.removeTrade.bind(this);
    this.state = {
      title: '',
      author: '',
      searchedBooks: [],
      userOwnedBooks: [],
      incoming: [],
      outgoing: [],
      userId: '',
      incomingCollapse: false,
      outgoingCollapse: false,
    };
  }

  toggleIncoming() {
    this.setState({incomingCollapse: !this.state.incomingCollapse});
  }

  toggleOutgoing() {
    this.setState({outgoingCollapse: !this.state.outgoingCollapse})
  }

  componentDidMount() {
    this.getProfile();
  }

  addBook(book) {
    fetch('http://localhost:8080/users/addBook', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(book)
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
    })
    .then(this.getProfile());
  }

  getProfile() {
    var token = localStorage.getItem('id_token');
    console.log("GETTING PROFILE");
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
      this.setState({incoming: response.user.incomingRequests});
      this.setState({outgoing: response.user.outgoingRequests});
      this.setState({userOwnedBooks: response.user.books});
    }).catch(err => {
      console.log(err);
    });
  }

  onSearchSubmit(event) {
    var book = {
      title: this.state.title,
      author: this.state.author,
    };
    console.log(book);
    this.searchForBook(book);
    event.preventDefault();
  }

  generateBookId() {
    return Math.random().toString(36).slice(2).substring(0,16).toUpperCase();
  }

  onBookSelect(key) {
    console.log(key);
    var selectedBook = this.state.searchedBooks[key];
    const bookId = this.generateBookId();
    const userId = this.state.userId;
    selectedBook.bookId = bookId;
    selectedBook.userId = userId;
    console.log(selectedBook);
    this.setState({searchedBooks: []});
    this.setState({title: ''});
    this.setState({author: ''});
    this.addBook(selectedBook);
  }

  searchForBook(book) {
    const title = book.title;
    const author = book.author;
    var titlePrefix = '';
    var authorPrefix = '';

    if (title != '') {
      titlePrefix = '+intitle:'
    }
    if (author != '') {
      authorPrefix = '+inauthor:'
    }
    if (title == '' && author == '') {
      console.log('No Search Parameters Entered');
    } else {
      const query =
        'https://www.googleapis.com/books/v1/volumes?q=' + titlePrefix + title
        + authorPrefix + author + '&maxResults=5';
        var searchQuery = query.split(' ').join('+');
        console.log(searchQuery);
        fetch(searchQuery, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json'
          }
        })
        .then(response => response.json())
        .then(response => {
          this.setState({searchedBook: response});
          var itemArr = response.items;
          console.log(itemArr);
          if (itemArr) {
            var bookArr = itemArr.map(item => {
              const bookInfo = item.volumeInfo;
              var imageLink;
              if (bookInfo.imageLinks) {
                imageLink = bookInfo.imageLinks.thumbnail;
              } else {
                imageLink = 'https://www.rulistings.com/Content/PlaceholderIcons/book_placeholder.png';
              }
              return {
                title: bookInfo.title,
                pageCount: bookInfo.pageCount,
                imgLink: imageLink,
              }
            });
            this.setState({searchedBooks: bookArr});
          }

        });
    }
  }

  handleChange(event) {
    var name = event.target.name;
    var value = event.target.value;
    this.setState({[name]: value});
  }

  cancelTrade(key) {
    console.log('Cancelling your request');
    var bookToCancel = this.state.outgoing[key];
    var bookArr = this.state.outgoing;
    bookArr.splice(key, 1);
    this.setState({outgoing: bookArr});
    console.log(this.state.outgoing);
    var bookInfo = {
      bookId: bookToCancel.bookId,
      ownerId: bookToCancel.owner,
      requesterId: this.state.userId
    };
    this.removeTrade(bookInfo);
  }

  denyTrade(key) {
    console.log('Denying this request');
    var bookToCancel = this.state.incoming[key];
    var bookArr = this.state.incoming;
    bookArr.splice(key, 1);
    this.setState({incoming: bookArr});
    console.log(this.state.incoming);
    var bookInfo = {
      bookId: bookToCancel.bookId,
      ownerId: this.state.userId,
      requesterId: bookToCancel.requester,
    };
    this.removeTrade(bookInfo);

  }

  makeTrade(key) {
    var bookToTrade = this.state.incoming[key];
    var bookArr = this.state.incoming;
    bookArr.splice(key, 1);
    this.setState({incoming: bookArr});
    var bookInfo = {
      title: bookToTrade.title,
      ownerId: this.state.userId,
      bookId: bookToTrade.bookId,
      imgLink: bookToTrade.imgLink,
      pageCount: bookToTrade.pageCount,
      requesterId: bookToTrade.requester
    };

    console.log(bookInfo);
    fetch('http://localhost:8080/users/validateTrade', {
      method: 'POST',
      redirect: 'follow',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(bookInfo)
    })
    .then(response => response.json())
    var indexOf = -1;
    for (var i = 0; i < this.state.userOwnedBooks.length; i++) {
      if (this.state.userOwnedBooks[i].bookId === bookToTrade.bookId) {
        indexOf = i;
        console.log(indexOf);
        break;
      }
    }
    var bookArr = this.state.userOwnedBooks;
    if (indexOf !== -1) {
      console.log(bookArr[indexOf]);
      bookArr.splice(indexOf, 1);
      this.setState({userOwnedBooks: bookArr});
    }
  }

  removeTrade(bookInfo) {
    fetch('http://localhost:8080/users/cancelTrade', {
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
      // if (response.success === true) {
      //   console.log('True');
      //   console.log(response.msg);
      // } else if (response.message === false) {
      //   console.log('False');
      //   console.log(response.msg);
      // }
    })
  }


  render() {
    var searchedBookList = this.state.searchedBooks;
    var searchedBooks;
    var incomingLength = '';
    var outgoingLength = '';
    if (this.state.userId !== '') {
      incomingLength = this.state.incoming.length;
      outgoingLength = this.state.outgoing.length;
    }

    if (searchedBookList) {
      searchedBooks = searchedBookList.map((item, i) => {
        return (
          <div key={i} className='bookItem'>
            <i onClick={() => this.onBookSelect(i)} className='fa fa-check searchIcon hoverIcon'></i>
            <img src={item.imgLink} alt='Book' />
          </div>
        )
      });
    }
    var userBooks = this.state.userOwnedBooks;

    var userOwnedBooks = userBooks.map((item, i) => {
      return (
        <div key={i} className='bookItem'>
          <img src={item.imgLink} alt='Book'/>
        </div>
      );
    })
    var incoming = this.state.incoming;
    var incomingRequests = incoming.map((item, i) => {
      return (
        <div key={i} className='requestItem'>
          <h2 className='requestBookTitle'>{item.title}</h2>
          <div className='requestIcons'>
            <i onClick={() => this.denyTrade(i)} className='fa fa-times'></i>
            <i onClick={() => this.makeTrade(i)} className='fa fa-check'></i>
          </div>
        </div>
      )
    });

    var outgoing = this.state.outgoing;
    var outgoingRequests = outgoing.map((item, i) => {
      return (
        <div key={i} className='requestItem'>
          <h2 className='requestBookTitle'>{item.title}</h2>
          <div className='requestIcons'>
            <i onClick={() => this.cancelTrade(i)} className='fa fa-times'></i>
          </div>
        </div>
      )
    });

    return (
      <div>
        <h1>Dashboard</h1>
        <Container>
          <Button className='requestButton' onClick={this.toggleIncoming} block>Incoming Requests: {incomingLength}</Button>
          <Collapse isOpen={this.state.incomingCollapse}>
            {incomingRequests}
          </Collapse>
        </Container>
        <Container >
          <Button className='requestButton' onClick={this.toggleOutgoing} block>Outgoing Requests: {outgoingLength}</Button>
          <Collapse isOpen={this.state.outgoingCollapse}>
            {outgoingRequests}
          </Collapse>
        </Container>
        <Container>
          <Form>
            <FormGroup>
              <Input type='text' name='title'
                onChange={this.handleChange}
                value={this.state.title}
                placeholder='Book Title'/>
            </FormGroup>
            <FormGroup>
              <Input type='text' name='author'
                onChange={this.handleChange}
                value={this.state.author}
                placeholder='Author'/>
            </FormGroup>
            <Button block onClick={this.onSearchSubmit}>Search for Book</Button>
          </Form>
        </Container>
        <Container>
          <div className='searchBookContainer'>
            {searchedBooks}
          </div>
          <div className='userBookContainer'>
            {userOwnedBooks}
          </div>

        </Container>
      </div>
    );
  }
}

export default Dashboard;
