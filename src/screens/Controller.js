import React, { Component } from "react";
import { BrowserRouter as Router, Route } from "react-router-dom";
import Home from "../screens/home/Home";
import Details from "./details/Details";

class Controller extends Component {
  constructor() {
    super();
    this.state = {
      baseUrl: "http://localhost:8080/api",
      user: null,
      restaurants: [],
    };
  }

  componentDidMount = () => {
    let data = null;
    let xhr = new XMLHttpRequest();
    let that = this;
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4 && this.status === 200) {
        that.setState({
          restaurants: JSON.parse(this.responseText).restaurants,
        });
      }
    });
    xhr.open("GET", this.state.baseUrl + "/restaurant");
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
  };

  setUser = (loggedInUser) => {
    this.setState({user: loggedInUser})
    console.log(loggedInUser)
  }

  render() {
    return (
      <div>
        <Router>
          <Route
            exact
            path="/"
            render={(props) => (
              <Home
                {...props}
                baseUrl={this.state.baseUrl}
                displayRestaurants={this.state.restaurants}
                setUser={this.setUser}
                user={this.state.user}
              />
            )}
          />
          {/*<Route exact path='/'>
                        <Home baseUrl={this.state.baseUrl} displayRestaurants={this.state.restaurants}/>

                    </Route>*/}
          <Route
            path="/restaurant/:id"
            render={(props) => <Details {...props} baseUrl={this.baseUrl} />}
          />
        </Router>
      </div>
    );
  }
}

export default Controller;
