import React, {Component} from 'react';
import Header from '../../common/header/Header';

import Grid from '@material-ui/core/Grid';
import {withStyles} from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActionArea from '@material-ui/core/CardActionArea';
import CardContent from '@material-ui/core/CardContent';
import CardMedia from '@material-ui/core/CardMedia';
import Typography from '@material-ui/core/Typography';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';


import './Home.css';

const styles = (theme => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper
  },

  /*restaurantGrid: {
      "padding": "20px",
      "margin-left": "0.5%",
      "margin-right": "0.5%",
      transform: 'translateZ(0)',
      cursor: 'pointer',
  },*/
  restaurantGridCard: {
    '@media (min-width: 1200px)': {

      'flex-grow': '0',
      'max-width': '25%',
      'flex-basis': '25%',
    },

    '@media (min-width: 960px) and (max-width:1200px)': {
      'flex-grow': '0',
      'max-width': '33%',
      'flex-basis': '33%',
    },
  },

  restaurantCard: {
    height: "500px",
    '@media (min-width: 1300px)': {
      height: "500px",
    },
    '@media (min-width: 960px) and (max-width:1300px)': {
      height: "375px",
    }
  },

  restaurantMedia: {
    height: "40%",
    width: "100%",
  },
  restaurantTitle: {
    "font-size": "25px",
    '@media (min-width: 1300px)': {
      "font-size": "45px",
    },
    '@media (min-width: 960px) and (max-width:1300px)': {
      "font-size": "40px",
    },
    '@media (max-width: 960px)': {
      "font-size": "30px",
    },
    '@media (max-width: 600px)': {
      "font-size": "30px",
    }
  },
  restaurantCategory: {
    "font-size": "16px",
    "margin-bottom": "2px",
    '@media (min-width: 1300px)': {
      "font-size": "22px",
    },
    '@media (min-width: 960px) and (max-width:1300px)': {
      "font-size": "20px",
    },
    '@media (max-width: 960px)': {
      "font-size": "18px",
    },
    '@media (max-width: 600px)': {
      "font-size": "16px",
    }

  },
  PriceForTwoText: {
    '@media (min-width: 601px)': {
      "font-size": "110%",
    },
    '@media (max-width: 600px)': {
      "font-size": "70%",
    },
  },


  restaurantCardContent: {
    '@media (min-width: 601px)': {
      "padding": "10px",
      "margin-left": "20px",
      "margin-right": "20px",
      "height": "20%",
    },
    '@media (max-width: 600px)': {
      "padding": "2px",
      "margin-left": "5px",
      "margin-right": "5px",
      "height": "20%",
    },
    "display": "flex",
    "align-items": "center",
  },
  restaurantCardContentArea: {
    "display": "flex",
    "height": "100%",
    "flex-direction": "column",
    "align-items": "normal",
    "justify-content": "space-between",
  }

}))

class Home extends Component {
  constructor() {
    super()
    this.state = {
      restaurant: [],
      isSearchOn: false,
    }
  }

  componentDidMount() {
    let data = null;
    let xhrRestaurant = new XMLHttpRequest();
    let that = this;
    xhrRestaurant.addEventListener("readystatechange", function () {
      if (xhrRestaurant.readyState === 4 && xhrRestaurant.status === 200) {
        let restaurant = JSON.parse(xhrRestaurant.responseText)
        that.setState({
          restaurant: restaurant.restaurants
        });
      }
    })
    xhrRestaurant.open("GET", this.props.baseUrl + "restaurant")
    xhrRestaurant.send(data)
  }


  filterRestaurantBySearchHandler = (searchRestaurant, searchOn) => {
    let allRestaurantInfo = [];
    if (searchOn) {
      if (!this.state.isSearchOn) {
        allRestaurantInfo = this.state.restaurant;
        this.setState({
          restaurant: searchRestaurant,
          allRestaurantData: allRestaurantInfo,
          isSearchOn: true,
        })
      } else {
        this.setState({
          ...this.state,
          restaurant: searchRestaurant,
        })
      }
    } else {
      allRestaurantInfo = this.state.allRestaurantData;
      this.setState({
        restaurant: allRestaurantInfo,
        isSearchOn: false,
      });
    }
  }


  restaurantCardClickHandler = (restaurantId) => {
    this.props.history.push('/restaurant/' + restaurantId);
  }

  render() {
    const {classes} = this.props;
    return (
      <div>
        <Header baseUrl={this.props.baseUrl} showHeaderSearchField={true}
                filterRestaurantBySearchHandler={this.filterRestaurantBySearchHandler}/>
        <div className="flex-container">
          <Grid container spacing={3} wrap="wrap" alignContent="center" className="restaurantGrid">
            {this.state.restaurant !== null ? this.state.restaurant.map(currentRestaurant => (
                <Grid key={currentRestaurant.id} item xs={12} sm={6} md={3} className={classes.restaurantGridCard}>
                  <Card className={classes.restaurantCard}>
                    <CardActionArea className={classes.restaurantCardContentArea}
                                    onClick={() => this.restaurantCardClickHandler(currentRestaurant.id)}>
                      <CardMedia
                        className={classes.restaurantMedia}
                        image={currentRestaurant.photo_URL}
                        title={currentRestaurant.restaurant_name}
                      />
                      <CardContent className={classes.restaurantCardContent}>
                        <Typography className={classes.restaurantTitle} variant="h5" component="h2">
                          {currentRestaurant.restaurant_name}
                        </Typography>
                      </CardContent>
                      <CardContent className={classes.restaurantCardContent}>
                        <Typography variant="subtitle1" component="p" className={classes.restaurantCategory}>
                          {currentRestaurant.categories}
                        </Typography>
                      </CardContent>
                      <CardContent className={classes.restaurantCardContent}>
                        <div className="card-footer">
                                                <span className="restaurantRating">
                                                    <span>
                                                        <FontAwesomeIcon icon="star" size="lg" color="white"/>
                                                    </span>
                                                    <Typography variant="caption"
                                                                component="p">{currentRestaurant.customer_rating}</Typography>
                                                    <Typography variant="caption"
                                                                component="p">({currentRestaurant.number_customers_rated})</Typography>
                                                </span>
                          <span className="restaurantPriceForTwo">
                                                    <Typography variant="caption" component="p"
                                                                style={{fontSize: '14px'}}>
                                                        <i className="fa fa-inr" aria-hidden="true"/>
                                                      {currentRestaurant.average_price} for Two
                                                    </Typography>
                                                </span>
                        </div>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </Grid>
              ))
              : <Typography variant='body1' component='p'>
                No restaurant with given name.
              </Typography>
            }
          </Grid>
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Home);
