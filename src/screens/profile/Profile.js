import React, {Component} from 'react';
import {Typography} from '@material-ui/core';
import Header from "../../common/header/Header";
import {Redirect} from 'react-router-dom'


class Profile extends Component {

  constructor() {
    super();
    this.state = {
      isLoggedIn: sessionStorage.getItem('access-token') === null ? false : true
    }
  }

  //This method is called every time the page is rendered to check if the customer is logged in if not then redirected to the home page.
  redirectToHome = () => {
    if (!this.state.isLoggedIn) {
      return <Redirect to="/"/>
    }
  }
  logoutAndRedirectToHome = () => {
    this.setState({
      ...this.state,
      isLoggedIn: false,
    })
  }


  render() {
    return (
      <div>
        {this.redirectToHome()}
        <Header baseUrl={this.props.baseUrl} logoutAndRedirectToHome={this.logoutAndRedirectToHome}/>
        <Typography variant="h3" component="h3">Profile Page</Typography>
      </div>
    )
  }
}

export default Profile;
