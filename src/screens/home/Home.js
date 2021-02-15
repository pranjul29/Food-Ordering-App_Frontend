import React, { Component } from "react";
import Header from "../../common/header/Header";

class Home extends Component {
  constructor() {
    super();
    this.state = {
      searchResults: [],
    };
  }

  getSearchResults = (text) => {
    let data = null;
    let xhr = new XMLHttpRequest();
    let that = this;
    xhr.addEventListener("readystatechange", function() {
      if (this.readyState === 4 && this.status === 200) {
        that.setState({
          searchResults: JSON.parse(this.responseText).restaurants,
        });
      }
      else if(this.readyState === 4)
        if(JSON.parse(this.responseText).code === 'RNF-001')
          that.setState({searchResults: []})
    });
    xhr.open("GET", this.props.baseUrl + "/restaurant/name/" + text);
    xhr.setRequestHeader("Cache-Control", "no-cache");
    xhr.send(data);
  };

  render() {
    let displayRestaurants = this.state.searchResults;
    return (
      <div>
        <Header
          baseUrl={this.props.baseUrl}
          getSearchResults={this.getSearchResults}
        />
        {displayRestaurants === null || displayRestaurants.length === 0 ? (
          <div>
              No restaurant with the given name.
          </div>
        ) : (
          <div>
            {displayRestaurants.map((temp) => {
              return <div key={temp.id}>{temp.restaurant_name}</div>;
            })}
          </div>
        ) }
      </div>
    );
  }
}

export default Home;
