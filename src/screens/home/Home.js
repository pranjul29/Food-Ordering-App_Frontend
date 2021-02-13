import React, { Component } from "react";
import Header from "../../common/header/Header";

class Home extends Component {
  render() {
    let displayRestaurants = this.props.displayRestaurants;
    return (
      <div>
        <Header
          baseUrl={this.props.baseUrl}
          filterRestaurants={this.props.filterRestaurants}
        />
        {displayRestaurants.length > 0 ? (
          <div>
            {displayRestaurants.map((temp) => {
              return <div key={temp.id}>{temp.restaurant_name}</div>;
            })}
          </div>
        ) : (
          <div>
              No restaurant with the given name.
          </div>
        )}
      </div>
    );
  }
}

export default Home;
