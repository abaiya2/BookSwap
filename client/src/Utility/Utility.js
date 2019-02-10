import * as jwtDecode from 'jwt-decode';

export function loadToken() {
  if (!localStorage['id_token']) {
    return '';
  } else {
    return localStorage.getItem('id_token');
  }
}

export function isLoggedIn() {
  var token = loadToken();
  if (token == '') {
    return false;
  }
  var currentTime = Date.now().valueOf() / 1000;
  try {
    var decToken = jwtDecode(token);
    if (decToken.exp < currentTime) {
      return false;
    } else {
      return true;
    }
  } catch(err) {
    console.log(err);
  }
}
