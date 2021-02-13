import React, {Component} from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import Home from '../screens/home/Home'

class Controller extends Component {
    constructor() {
        super();
        this.state = {
            baseUrl : "http://localhost:8080/api",
            restaurants: [],
            filteredRestaurants: [],
            showFilteredRestaurants: false
        }
    }

    componentDidMount() {
        let data = null;
        let xhr = new XMLHttpRequest();
        let that = this;
        xhr.addEventListener("readystatechange", function () {
            if (this.readyState === 4) {
                that.setState({ restaurants: JSON.parse(this.responseText).restaurants});
            }
        });
        xhr.open("GET", this.state.baseUrl + "/restaurant");
        xhr.setRequestHeader("Cache-Control", "no-cache");
        xhr.send(data);
    }

    filterRestaurants = (str) => {
        this.setState({ filteredRestaurants: this.state.restaurants })
        str.trim().length > 0 ? this.setState({ showFilteredRestaurants: true }) : this.setState({ showFilteredRestaurants: false })
        let temp = this.state.restaurants;
        let filtered = temp.filter(restaurant => 
            restaurant.restaurant_name.toLowerCase().includes(str.trim().toLowerCase())
        )
        this.setState({ filteredRestaurants: filtered })
    }

    restaurantsToDisplay = () => {
        if(this.state.showFilteredRestaurants)
            return this.state.filteredRestaurants
        else
            return this.state.restaurants
    }

    render() {
        let displayRestaurants = this.restaurantsToDisplay();
        return(
            <div>
                <Router>
                    <Route exact path='/'>
                        <Home baseUrl={this.state.baseUrl} displayRestaurants={displayRestaurants} filterRestaurants={this.filterRestaurants}/>
                    </Route>
                </Router>
            </div>
        );
    }
}

export default Controller;