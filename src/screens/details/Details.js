import React, {Component} from 'react';
import Header from '../../common/header/Header';
import Typography from '@material-ui/core/Typography';
import {CardContent, withStyles} from '@material-ui/core';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';
import Card from '@material-ui/core/Card';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import CardHeader from '@material-ui/core/CardHeader';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';

import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-free-regular';


import "./Details.css"

const styles = (theme => ({

  cartTotalItemButton: {
    padding: '10px',
    'border-radius': '0',
    color: '#fdd835',
    '&:hover': {
      'background-color': '#ffee58',
    }
  },
}))

class Details extends Component {
  constructor() {
    super()
    this.state = {
      currentRestaurantDetails: [],
      categories: [],
      cartItems: [],
      totalAmount: 0,
      snackBarVisible: false,
      snackBarText: "",
      transition: Fade,
      badgeDisplayToggle: false,
    }
  }

  componentDidMount() {
    let data = null;
    let that = this;
    let xhrRestaurantDetails = new XMLHttpRequest()


    xhrRestaurantDetails.addEventListener("readystatechange", function () {
      if (xhrRestaurantDetails.readyState === 4 && xhrRestaurantDetails.status === 200) {
        let response = JSON.parse(xhrRestaurantDetails.responseText);
        let categoriesName = [];
        //Creating array of category.
        response.categories.forEach(category => {
          categoriesName.push(category.category_name);
        });
        let currentRestaurantDetails = {
          id: response.id,
          name: response.restaurant_name,
          photoURL: response.photo_URL,
          avgCost: response.average_price,
          rating: response.customer_rating,
          noOfCustomerRated: response.number_customers_rated,
          locality: response.address.locality,
          categoriesName: categoriesName.toString(),
        }
        let categories = response.categories;
        that.setState({
          ...that.state,
          currentRestaurantDetails: currentRestaurantDetails,
          categories: categories,

        })
      }

    })

    xhrRestaurantDetails.open('GET', this.props.baseUrl + 'restaurant/' + this.props.match.params.id)
    xhrRestaurantDetails.send(data);

  }

  addItemButtonHandler = (item) => {
    let cartItems = this.state.cartItems;
    let itemPresentInCart = false;
    cartItems.forEach(cartItem => {
      if (cartItem.id === item.id) {
        itemPresentInCart = true;
        cartItem.quantity++;
        cartItem.totalAmount = cartItem.price * cartItem.quantity;
      }
    })
    if (!itemPresentInCart) {
      let cartItem = {
        id: item.id,
        name: item.item_name,
        price: item.price,
        totalAmount: item.price,
        quantity: 1,
        itemType: item.item_type,
      }
      cartItems.push(cartItem);
    }
    let totalAmount = 0;
    cartItems.forEach(cartItem => {
      totalAmount = totalAmount + cartItem.totalAmount;
    })

    this.setState({
      ...this.state,
      cartItems: cartItems,
      snackBarVisible: true,
      snackBarText: "Item added to cart!",
      totalAmount: totalAmount,

    })
  }

  minusItemButtonHandler = (item) => {
    let cartItems = this.state.cartItems;
    let index = cartItems.indexOf(item);
    let itemRemoved = false;
    cartItems[index].quantity--;
    if (cartItems[index].quantity === 0) {
      cartItems.splice(index, 1);
      itemRemoved = true;
    } else {
      cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity;
    }

    let totalAmount = 0;
    cartItems.forEach(cartItem => {
      totalAmount = totalAmount + cartItem.totalAmount;
    })

    this.setState({
      ...this.state,
      cartItems: cartItems,
      snackBarVisible: true,
      snackBarText: itemRemoved ? "Item removed from cart!" : "Item quantity decreased by 1!",
      totalAmount: totalAmount,

    })
  }

  cartAddButtonHandler = (item) => {
    let cartItems = this.state.cartItems;
    let index = cartItems.indexOf(item);
    cartItems[index].quantity++;
    cartItems[index].totalAmount = cartItems[index].price * cartItems[index].quantity;

    let totalAmount = 0;
    cartItems.forEach(cartItem => {
      totalAmount = totalAmount + cartItem.totalAmount;
    })

    this.setState({
      ...this.state,
      cartItems: cartItems,
      snackBarVisible: true,
      snackBarText: "Item quantity increased by 1!",
      totalAmount: totalAmount,

    })
  }

  checkoutButtonHandler = () => {
    let cartItems = this.state.cartItems;
    let isLoggedIn = sessionStorage.getItem("access-token") == null ? false : true;
    if (cartItems.length === 0) {
      this.setState({
        ...this.state,
        snackBarVisible: true,
        snackBarText: "Please add an item to your cart!",
      })
    } else if (!isLoggedIn) {
      this.setState({
        ...this.state,
        snackBarVisible: true,
        snackBarText: "Please login first!",
      })
    } else {
      this.props.history.push({
        pathname: '/checkout',
        cartItems: this.state.cartItems,
        restaurantDetails: this.state.currentRestaurantDetails,
      })
    }
  }

  snackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      ...this.state,
      snackBarText: "",
      snackBarVisible: false,
    })
  }

  toggleBadgeDisplay = () => {
    this.setState({
      ...this.state,
      badgeDisplayToggle: !this.state.badgeDisplayToggle,
    })
  }

  render() {
    const {classes} = this.props;
    return (

      <div>
        <Header baseUrl={this.props.baseUrl} showHeaderSearchField={false}
                changeBadgeDisplay={this.toggleBadgeDisplay}/>
        <div className="restaurant-info-container">
          <div>
            <img src={this.state.currentRestaurantDetails.photoURL} alt="Restaurant" height="215px" width="275px"/>
          </div>
          <div className="restaurant-info">
            <div className="restaurant-name">
              <Typography variant="h5" component="h5"
                          className="restaurant-name">{this.state.currentRestaurantDetails.name}</Typography>
              <Typography variant="subtitle1" component="p"
                          className={classes.restaurantLocation}>{this.state.currentRestaurantDetails.locality}</Typography>
              <Typography variant="subtitle1" component="p"
                          className="restaurant-category">{this.state.currentRestaurantDetails.categoriesName}</Typography>
            </div>
            <div className="restaurant-review-rating-cost-container">
              <div className="restaurant-review-rating-container">
                <div className="restaurant-review-rating">
                  <FontAwesomeIcon icon="star" size="sm" color="black"/>
                  <Typography variant="subtitle1"
                              component="p">{this.state.currentRestaurantDetails.rating}</Typography>
                </div>
                <Typography variant="caption" component="p" className="text-rating-cost">AVERAGE RATING BY {<span
                  className="restaurant-NoOfReviews">{this.state.currentRestaurantDetails.noOfCustomerRated}</span>} CUSTOMERS</Typography>
              </div>
              <div className="restaurant-avg-meal-cost-container">
                <div className="restaurant-avg-meal-cost">
                  <i className="fa fa-inr" aria-hidden="true"></i>
                  <Typography variant="subtitle1" component="p"
                              className="avg-cost">{this.state.currentRestaurantDetails.avgCost}</Typography>
                </div>
                <Typography variant="caption" component="p" className="text-rating-cost">AVERAGE COST FOR TWO
                  PEOPLE</Typography>
              </div>
            </div>
          </div>
        </div>
        <div className="cart-menu-details-container">

          <div className="menu-details-cart">
            {this.state.categories.map(category => (
              <div key={category.id}>
                <Typography variant="overline" component="p"
                            className={classes.categoryName}>{category.category_name}</Typography>
                <Divider/>
                {category.item_list.map(item => (
                  <div className='menu-item-container' key={item.id}>
                    <FontAwesomeIcon icon="circle" size="sm"
                                     color={item.item_type === "NON_VEG" ? "#BE4A47" : "#5A9A5B"}/>
                    <Typography variant="subtitle1" component="p" style={{margin: "0px 0px 0px 20px"}}
                                className="menu-item-name">{item.item_name[0].toUpperCase() + item.item_name.slice(1)}</Typography>
                    <div className="item-cost">
                      <i className="fa fa-inr" aria-hidden="true"/>
                      <Typography variant="subtitle1" component="p"
                                  className="item-cost">{item.price.toFixed(2)}</Typography>
                    </div>
                    <IconButton className="add-button" aria-label="add" onClick={() => this.addItemButtonHandler(item)}>
                      <AddIcon/>
                    </IconButton>
                  </div>
                ))}
              </div>
            ))}
          </div>
          <div className="my-cart-card">
            <Card className={classes.myCart}>
              <CardHeader
                avatar={
                  <Avatar aria-label="shopping-cart" style={{
                    color: "black",
                    backgroundColor: "white",
                    width: "60px",
                    height: "50px",
                    marginLeft: "-20px"
                  }} className="shopping-cart">
                    <Badge badgeContent={this.state.cartItems.length} color="primary" showZero={true}
                           invisible={this.state.badgeDisplayToggle} className={classes.badge}>
                      <ShoppingCartIcon/>
                    </Badge>
                  </Avatar>
                }
                title="My Cart"
                titleTypographyProps={{
                  variant: 'h6'
                }}
                style={{paddingBottom: "0px", marginLeft: "10px", marginRight: "10px"}}
                className="cart-header"
              />
              <CardContent style={{paddingTop: "0px", marginLeft: "10px", marginRight: "10px"}}>
                {this.state.cartItems.map(cartItem => (
                  <div className="menu-item-cart-container" key={cartItem.id}>
                    <i className="fa fa-stop-circle-o" aria-hidden="true"
                       style={{color: cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B"}}/>
                    <Typography variant="subtitle1" component="p" style={{margin: "0px 0px 0px 20px", width: "150px"}}
                                className="menu-item-name"
                                id="cart-menu-item-name">{cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}</Typography>
                    <div className="quantity-container">
                      <IconButton className={classes.cartTotalItemButton} id="minus-button" aria-label="remove"
                                  onClick={() => this.minusItemButtonHandler(cartItem)}>
                        <FontAwesomeIcon icon="minus" size="xs" color="black"/>
                      </IconButton>
                      <Typography variant="subtitle1" component="p"
                                  className={classes.itemQuantity}>{cartItem.quantity}</Typography>
                      <IconButton className={classes.cartTotalItemButton} aria-label="add"
                                  onClick={() => this.cartAddButtonHandler(cartItem)}>
                        <FontAwesomeIcon icon="plus" size="xs" color="black"/>
                      </IconButton>
                    </div>
                    <div className="item-cost">
                      <i className="fa fa-inr" aria-hidden="true" style={{color: 'grey'}}/>
                      <Typography variant="subtitle1" component="p" className="item-cost"
                                  id="cart-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                    </div>
                  </div>
                ))}
                <div className="cart-total-amount-container">
                  <Typography variant="subtitle2" component="p" style={{fontWeight: "bold"}} className="total-amount">TOTAL
                    AMOUNT</Typography>
                  <div className="cart-total-cost">
                    <i className="fa fa-inr" aria-hidden="true"/>
                    <Typography variant="subtitle1" component="p" className="item-cost"
                                id="cart-total-price">{this.state.totalAmount.toFixed(2)}</Typography>
                  </div>
                </div>

                <Button variant="contained" color='primary' fullWidth={true} style={{fontWeight: "400"}}
                        className="checkout-button" onClick={this.checkoutButtonHandler}>CHECKOUT</Button>

              </CardContent>

            </Card>
          </div>
        </div>
        <div>
          <Snackbar
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
            open={this.state.snackBarVisible}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
            TransitionComponent={this.state.transition}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackBarText}</span>}
            action={
              <IconButton color='inherit' onClick={this.snackBarClose}>
                <CloseIcon/>
              </IconButton>
            }
          />
        </div>
      </div>
    )
  }
}

export default withStyles(styles)(Details);
