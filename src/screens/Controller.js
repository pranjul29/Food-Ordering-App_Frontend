import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../screens/home/Home'

class Controller extends Component {
    constructor() {
        super();
        this.state = {
            baseUrl : "http://localhost:8080/api",
            restaurants : []
        }
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
    }

    render() {
        return(
            <div>
                <Router>
                    <Route exact path='/'>
                        <Home baseUrl={this.state.baseUrl} displayRestaurants={this.state.restaurants}/>
                    </Route>
                </Router>
            </div>
        );
    }
}

export default Controller;