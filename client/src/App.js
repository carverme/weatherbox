import React, { Component } from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import axios from 'axios';
import Login from './Login';
import Signup from './Signup';
import {UserProfile} from './UserProfile';
import MenuAppBar from './MenuAppBar';


class App extends Component {
  constructor(props) {
    super(props)
      this.state = {
        token: '',
        user: null
        //set additional state if needed
      }
      this.liftTokenToState = this.liftTokenToState.bind(this)
      this.logout = this.logout.bind(this)
      this.checkForLocalToken = this.checkForLocalToken.bind(this)
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
      if (!token || token === 'undefined') {
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
    //is this where to add axios call to weather api?
  }

    render() {
      let user = this.state.user
      if (user) {
        return (
          <Router>
            <div className="App">
              <UserProfile user={user} logout={this.logout} />
              //build this userprofile into the MenuAppBar?
              //add additional routes here.
            </div>
          </Router>
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
