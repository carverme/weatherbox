import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import {UserProfile} from './UserProfile';
// import MenuAppBar from '@material-ui/core/MenuAppBar';

class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        token: '',
        user: null
      }
      this.checkForLocalToken = this.checkForLocalToken.bind(this)
      this.logout = this.logout.bind(this)
      this.liftTokenToState = this.liftTokenToState.bind(this)
    }

    liftTokenToState(data) {
      this.setState({
        token: data.token,
        user: data.user
      })
    }

    logout() {
      //Remove the token from localStorage
      localStorage.removeItem('mernToken')
      //Remove the user info from the state
      this.setState({
        token: '',
        user: null
      })
    }

    checkForLocalToken() {
      //Look in local storage for the token.
      let token = localStorage.getItem('mernToken')
      if (!token) {
        // there was no token.
        localStorage.removeItem('mernToken')
        this.setState({
          token: '',
          user: null
        })
      } else {
        //we did find a token in localStorage
        //send it to the back to be verified
        axios.post('/auth/me/from/token', {
          token
        }).then( result => {
          //Put the token in localStorage
          localStorage.setItem('mernToken', result.data.token)
          this.setState({
            token: result.data.token,
            user: result.data.user
          })
        }).catch( err => console.log(err) )
      }
    }

  componentDidMount() {
    this.checkForLocalToken()
  }

    render() {
      let user = this.state.user
      if (user) {
        return (
          <div className="App">
            <UserProfile user={user} logout={this.logout} />
          </div>
      );
    } else {
      return (
        <div className="App">
          <Signup liftToken={this.liftTokenToState} />
          <Login liftToken={this.liftTokenToState} />
        </div>
      )
    }
  }
}

export default App;
