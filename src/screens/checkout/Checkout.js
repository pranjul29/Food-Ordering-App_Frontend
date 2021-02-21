import React, {Component} from 'react';
import Stepper from '@material-ui/core/Stepper';
import Step from '@material-ui/core/Step';
import StepLabel from '@material-ui/core/StepLabel';
import StepContent from '@material-ui/core/StepContent';
import {
  Button,
  Divider,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  IconButton,
  InputLabel,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  withStyles
} from '@material-ui/core';
import Typography from '@material-ui/core/Typography';
import Input from '@material-ui/core/Input';
import GridList from '@material-ui/core/GridList';
import GridListTile from '@material-ui/core/GridListTile';
import PropTypes from 'prop-types';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import Paper from '@material-ui/core/Paper';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';
import CardHeader from '@material-ui/core/CardHeader';
import FilledInput from '@material-ui/core/FilledInput';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import CloseIcon from '@material-ui/icons/Close';
import {Redirect} from 'react-router-dom'
import 'font-awesome/css/font-awesome.min.css';


import Header from '../../common/header/Header';
import '../checkout/Checkout.css'

const styles = (theme => ({

  actionContainer: {
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(2),
    marginRight: theme.spacing(1),
  },
  stepperBlock: {
    'padding-top': '0px',
    '@media (max-width:600px)': {
      'padding': '0px',
    }
  },
  changeContainer: {
    padding: theme.spacing(3),
  },
  tab: {
    "font-weight": 500,
    '@media (max-width:600px)': {
      width: '50%',
    }
  },
  gridList: {
    flexWrap: 'nowrap',
    transform: 'translateZ(0)',
  },
  gridListTile: {
    textAlign: 'left',
    margin: '30px 0px 20px 0px',
    'border-style': 'solid',
    'border-width': '0.5px 3px 3px 0.5px',
    'border-radius': '10px',
    'padding': '8px',
  },
  newAddressForm: {
    width: '60%',
    'padding': '20px',
    textAlign: 'left',
  },
  couponInput: {
    'width': '200px',
    '@media(min-width:1300px)': {
      width: '250px',
    },
    '@media(max-width:600px)': {
      width: '200px',
    }
  },
}))

const TabContainer = function (props) {
  return (
    <Typography className={props.className} component="div">
      {props.children}
    </Typography>
  )
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired
}

class Checkout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      activeStep: 0,
      steps: this.getSteps(),
      value: 0,
      accessToken: sessionStorage.getItem('access-token'),
      addresses: [],
      currentSelectedAddress: "",
      newAddressFlatBuildingName: "",
      newAddressFlatBuildingNameRequired: "dispNone",
      newAddressLocality: "",
      newAddressLocalityRequired: "dispNone",
      newAddressCity: "",
      newAddressCityRequired: "dispNone",
      selectedState: "",
      stateRequired: "dispNone",
      newAddressPincode: "",
      newAddressPincodeRequired: "dispNone",
      pincodeValidationText: "dispNone",
      allStataes: [],
      selectedPaymentMethod: "",
      paymentMethods: [],
      cartItems: props.location.cartItems ? props.location.cartItems : [],
      restaurantDetails: props.location.restaurantDetails ? props.location.restaurantDetails : {name: null},
      coupon: null,
      discountCouponName: "",
      discountCouponNameRequired: "dispNone",
      discountCouponNameValidationText: "dispNone",
      snackBarOpen: false,
      snackBarMessage: "",
      transition: Fade,
      noOfColumn: 3,
      isLoggedIn: sessionStorage.getItem('access-token') !== null,
    }


  }

  getSteps = () => {
    return ['Delivery', 'Payment'];
  }

  nextButtonHandler = () => {
    if (this.state.value === 0) {
      if (this.state.currentSelectedAddress !== "") {
        let activeStep = this.state.activeStep;
        activeStep++;
        this.setState({
          ...this.state,
          activeStep: activeStep,
        });
      } else {
        this.setState({
          ...this.state,
          snackBarOpen: true,
          snackBarMessage: "Select Address"
        })
      }
    }
    if (this.state.activeStep === 1) {
      if (this.state.selectedPaymentMethod === "") {
        let activeStep = this.state.activeStep;
        this.setState({
          ...this.state,
          activeStep: activeStep,
          snackBarOpen: true,
          snackBarMessage: "Select Payment",
        })
      }
    }
  }

  backButtonHandler = () => {
    let activeStep = this.state.activeStep;
    activeStep--;
    this.setState({
      ...this.state,
      activeStep: activeStep,
    });
  }

  changeButtonHandler = () => {
    this.setState({
      ...this.state,
      activeStep: 0,
    });
  }

  tabChangeHandler = (event, value) => {
    this.setState({
      value,
    });
  }

  radioPaymentChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedPaymentMethod: event.target.value,
    })
  }

  componentDidMount() {
    if (this.state.isLoggedIn) {
      this.getAllAddressForUser();

      let statesData = null;
      let xhrStates = new XMLHttpRequest();
      let that = this;
      xhrStates.addEventListener("readystatechange", function () {
        if (xhrStates.readyState === 4 && xhrStates.status === 200) {
          let states = JSON.parse(xhrStates.responseText).states;
          that.setState({
            ...that.state,
            allStataes: states,
          })
        }
      })
      xhrStates.open('GET', this.props.baseUrl + 'states');
      xhrStates.send(statesData);


      let paymentData = null;
      let xhrPayment = new XMLHttpRequest();
      xhrPayment.addEventListener("readystatechange", function () {
        if (xhrPayment.readyState === 4 && xhrPayment.status === 200) {
          let payment = JSON.parse(xhrPayment.responseText).paymentMethods;
          that.setState({
            ...that.state,
            paymentMethods: payment,
          })
        }
      })
      xhrPayment.open('GET', this.props.baseUrl + 'payment');
      xhrPayment.send(paymentData);

      window.addEventListener('resize', this.setGridListColumn);
    }
  }


  componentWillUnmount() {
    window.removeEventListener('resize', this.updateCardsGridListCols);
  }


  getAllAddressForUser = () => {
    let data = null;
    let that = this;
    let xhrAddress = new XMLHttpRequest();

    xhrAddress.addEventListener('readystatechange', function () {
      if (xhrAddress.readyState === 4 && xhrAddress.status === 200) {
        let responseAddresses = JSON.parse(xhrAddress.responseText).addresses;
        let addresses = [];
        if (responseAddresses != null) {
          responseAddresses.forEach(responseAddress => {
            let address = {
              id: responseAddress.id,
              city: responseAddress.city,
              flatBuildingName: responseAddress.flat_building_name,
              locality: responseAddress.locality,
              pincode: responseAddress.pincode,
              state: responseAddress.state,
              selected: false,
            }
            addresses.push(address)
          })
        }
        that.setState({
          ...that.state,
          addresses: addresses
        })
      }
    })

    xhrAddress.open('GET', this.props.baseUrl + 'address/customer');
    xhrAddress.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
    xhrAddress.send(data);

  }

  setGridListColumn = () => {
    if (window.innerWidth <= 600) {
      this.setState({
        ...this.state,
        noOfColumn: 2
      });
    } else {
      this.setState({
        ...this.state,
        noOfColumn: 3
      });
    }
  }

  saveAddressHandler = () => {
    if (this.saveAddressFormValidation()) {
      let newAddressData = JSON.stringify({
        "city": this.state.newAddressCity,
        "flat_building_name": this.state.newAddressFlatBuildingName,
        "locality": this.state.newAddressLocality,
        "pincode": this.state.newAddressPincode,
        "state_uuid": this.state.selectedState,
      })

      let xhrSaveAddress = new XMLHttpRequest();
      let that = this;

      xhrSaveAddress.addEventListener("readystatechange", function () {
        if (xhrSaveAddress.readyState === 4 && xhrSaveAddress.status === 201) {
          that.setState({
            ...that.state,
            value: 0,

          })
          that.getAllAddressForUser();
        }
      })

      xhrSaveAddress.open('POST', this.props.baseUrl + 'address')
      xhrSaveAddress.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
      xhrSaveAddress.setRequestHeader("Content-Type", "application/json");
      xhrSaveAddress.send(newAddressData);
    }
  }

  saveAddressFormValidation = () => {
    let newAddressFlatBuildingNameRequired = "dispNone";
    let newAddressCityRequired = "dispNone";
    let newAddressLocalityRequired = "dispNone";
    let stateRequired = "dispNone";
    let newAddressPincodeRequired = "dispNone";
    let pincodeValidationText = "dispNone";
    let saveAddressFormValid = true;

    if (this.state.newAddressFlatBuildingName === "") {
      newAddressFlatBuildingNameRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.newAddressLocality === "") {
      newAddressLocalityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.selectedState === "") {
      stateRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.newAddressCity === "") {
      newAddressCityRequired = "dispBlock";
      saveAddressFormValid = false;
    }

    if (this.state.newAddressPincode === "") {
      newAddressPincodeRequired = "dispBlock";
      saveAddressFormValid = false;
    }
    if (this.state.newAddressPincode !== "") {
      var pincodePattern = /^\d{6}$/;
      if (!this.state.newAddressPincode.match(pincodePattern)) {
        pincodeValidationText = "dispBlock";
        saveAddressFormValid = false;
      }
    }
    this.setState({
      ...this.state,
      newAddressFlatBuildingNameRequired: newAddressFlatBuildingNameRequired,
      newAddressCityRequired: newAddressCityRequired,
      newAddressLocalityRequired: newAddressLocalityRequired,
      stateRequired: stateRequired,
      newAddressPincodeRequired: newAddressPincodeRequired,
      pincodeValidationText: pincodeValidationText,
    })

    return saveAddressFormValid
  }

  inputNewAddressFlatBuildingNameChangeHandler = (event) => {
    this.setState({
      ...this.state,
      newAddressFlatBuildingName: event.target.value,
    })
  }

  inputNewAddressLocalityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      newAddressLocality: event.target.value,
    })
  }

  inputNewAddressCityChangeHandler = (event) => {
    this.setState({
      ...this.state,
      newAddressCity: event.target.value,
    })
  }

  selectStateChangeHandler = (event) => {
    this.setState({
      ...this.state,
      selectedState: event.target.value,
    })
  }

  inputNewAddressPincodeChangeHandler = (event) => {
    this.setState({
      ...this.state,
      newAddressPincode: event.target.value,
    })
  }

  inputNewAddressCouponNameChangeHandler = (event) => {
    this.setState({
      ...this.state,
      discountCouponName: event.target.value,
    })
  }

  applyButtonHandler = () => {
    let isCouponNameValid = true;
    let discountCouponNameRequired = "dispNone";
    let discountCouponNameValidationText = "dispNone";
    if (this.state.discountCouponName === "") {
      isCouponNameValid = false;
      discountCouponNameRequired = "dispBlock";
      this.setState({
        discountCouponNameRequired: discountCouponNameRequired,
        discountCouponNameValidationText: discountCouponNameValidationText,
      })
    }

    if (isCouponNameValid) {
      let couponData = null;
      let that = this;
      let xhrCoupon = new XMLHttpRequest();
      xhrCoupon.addEventListener("readystatechange", function () {
        if (xhrCoupon.readyState === 4) {
          if (xhrCoupon.status === 200) {
            let coupon = JSON.parse(xhrCoupon.responseText)
            that.setState({
              ...that.state,
              coupon: coupon,
            })
          } else {
            that.setState({
              ...that.state,
              discountCouponNameValidationText: "dispBlock",
              discountCouponNameRequired: "dispNone"
            })
          }
        }
      })

      xhrCoupon.open('GET', this.props.baseUrl + '/order/coupon/' + this.state.discountCouponName)
      xhrCoupon.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
      xhrCoupon.setRequestHeader("Content-Type", "application/json");
      xhrCoupon.setRequestHeader("Cache-Control", "no-cache");
      xhrCoupon.send(couponData);
    }

  }


  placeOrderButtonHandler = () => {
    let item_quantities = [];
    this.state.cartItems.forEach(cartItem => {
      item_quantities.push({
        'item_id': cartItem.id,
        'price': cartItem.totalAmount,
        'quantity': cartItem.quantity,
      });
    })
    let newOrderData = JSON.stringify({ //Creating the data as required.
      "address_id": this.state.currentSelectedAddress,
      "bill": Math.floor(Math.random() * 100),
      "coupon_id": this.state.coupon !== null ? this.state.coupon.id : "",
      "discount": this.getDiscountedAmount(),
      "item_quantities": item_quantities,
      "payment_id": this.state.selectedPaymentMethod,
      "restaurant_id": this.state.restaurantDetails.id,
    })
    console.log(newOrderData);
    let that = this;
    let xhrOrder = new XMLHttpRequest();
    xhrOrder.addEventListener("readystatechange", function () {
      if (xhrOrder.readyState === 4) {
        if (xhrOrder.status === 201) {
          let responseOrder = JSON.parse(xhrOrder.responseText)
          that.setState({
            ...that.state,
            snackBarOpen: true,
            snackBarMessage: "Order placed successfully! Your order ID is " + responseOrder.id,
          });
        } else {
          that.setState({
            ...that.state,
            snackBarOpen: true,
            snackBarMessage: "Unable to place your order! Please try again!",
          });
        }
      }
    })
    xhrOrder.open('POST', this.props.baseUrl + 'order')
    xhrOrder.setRequestHeader('authorization', 'Bearer ' + this.state.accessToken)
    xhrOrder.setRequestHeader('Content-Type', 'application/json');
    xhrOrder.send(newOrderData);
  }


  addressSelectedHandler = (addressId) => {
    let addresses = this.state.addresses;
    let currentSelectedAddress = "";
    addresses.forEach(address => {
      if (address.id === addressId) {
        address.selected = true;
        currentSelectedAddress = address.id;
      } else {
        address.selected = false;
      }
    })
    this.setState({
      ...this.state,
      addresses: addresses,
      currentSelectedAddress: currentSelectedAddress
    })
  }

  getItemTotal = () => {
    let subTotal = 0;
    this.state.cartItems.forEach(cartItem => {
      subTotal = subTotal + cartItem.totalAmount;
    })
    return subTotal;
  }

  getDiscountedAmount = () => {
    let discountAmount = 0;
    if (this.state.coupon !== null) {
      discountAmount = (this.getItemTotal() * this.state.coupon.percent) / 100;
      return discountAmount
    }
    return discountAmount;
  }

  getNetTotal = () => {
    let netAmount = this.getItemTotal() - this.getDiscountedAmount();
    return netAmount;
  }

  snackBarClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    this.setState({
      ...this.state,
      snackBarMessage: "",
      snackBarOpen: false,
    })
  }

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
    const {classes} = this.props;
    return (
      <div>

        {this.redirectToHome()}
        <Header baseUrl={this.props.baseUrl} showHeaderSearchField={false}
                logoutAndRedirectToHome={this.logoutAndRedirectToHome}/>
        <div className="checkout-box-container">
          <div className="stepper-block-container">
            <Stepper activeStep={this.state.activeStep} orientation="vertical" className={classes.stepperBlock}>
              {this.state.steps.map((label, index) => (
                <Step key={label}>
                  <StepLabel>{label}</StepLabel>
                  <StepContent>
                    {index === 0 ?
                      <div className="address-container">
                        <Tabs className="existing-new-address-tabs" value={this.state.value}
                              onChange={this.tabChangeHandler}>
                          <Tab label="EXISTING ADDRESS" className={classes.tab}/>
                          <Tab label="NEW ADDRESS" className={classes.tab}/>
                        </Tabs>
                        {this.state.value === 0 &&
                        <TabContainer>
                          {this.state.addresses.length !== 0 ?
                            <GridList className={classes.gridList} cols={this.state.noOfColumn} spacing={2}
                                      cellHeight='auto'>
                              {this.state.addresses.map(address => (
                                <GridListTile className={classes.gridListTile} key={address.id}
                                              style={{borderColor: address.selected ? "rgb(224,37,96)" : "white"}}>
                                  <div className="tile-grid-list-container">
                                    <Typography variant="body1" component="p">{address.flatBuildingName}</Typography>
                                    <Typography variant="body1" component="p">{address.locality}</Typography>
                                    <Typography variant="body1" component="p">{address.city}</Typography>
                                    <Typography variant="body1" component="p">{address.state.state_name}</Typography>
                                    <Typography variant="body1" component="p">{address.pincode}</Typography>
                                    <IconButton style={{float: "right"}} className="address-check-button"
                                                onClick={() => this.addressSelectedHandler(address.id)}>
                                      <CheckCircleIcon style={{color: address.selected ? "green" : "grey"}}/>
                                    </IconButton>
                                  </div>
                                </GridListTile>
                              ))}
                            </GridList>
                            :
                            <Typography variant="body1" component="p">There are no saved addresses! You can save an
                              address using the 'New Address' tab or using your ‘Profile’ menu option.</Typography>
                          }
                        </TabContainer>
                        }
                        {this.state.value === 1 &&
                        <TabContainer className={classes.newAddressForm}>
                          <FormControl required style={{width: "200px"}} className="form-control">
                            <InputLabel htmlFor="flat-building-name">Flat / Building No.</InputLabel>
                            <Input id="flat-building-name" className="input-fields"
                                   flatbuildingname={this.state.newAddressFlatBuildingName} fullWidth={true}
                                   onChange={this.inputNewAddressFlatBuildingNameChangeHandler}
                                   value={this.state.newAddressFlatBuildingName}/>
                            <FormHelperText className={this.state.newAddressFlatBuildingNameRequired}>
                              <span className="red">required</span>
                            </FormHelperText>
                          </FormControl>
                          <br/>
                          <br/>
                          <FormControl required style={{width: "200px"}} className="form-control">
                            <InputLabel htmlFor="locality">Locality</InputLabel>
                            <Input id="locality" className="input-fields" locality={this.state.newAddressLocality}
                                   fullWidth={true} onChange={this.inputNewAddressLocalityChangeHandler}
                                   value={this.state.newAddressLocality}/>
                            <FormHelperText className={this.state.newAddressLocalityRequired}>
                              <span className="red">required</span>
                            </FormHelperText>
                          </FormControl>
                          <br/>
                          <br/>
                          <FormControl required style={{width: "200px"}} className="form-control">
                            <InputLabel htmlFor="city">City</InputLabel>
                            <Input id="city" className="input-fields" type="text" city={this.state.newAddressCity}
                                   fullWidth={true} onChange={this.inputNewAddressCityChangeHandler}
                                   value={this.state.newAddressCity}/>
                            <FormHelperText className={this.state.newAddressCityRequired}>
                              <span className="red">required</span>
                            </FormHelperText>
                          </FormControl>
                          <br/>
                          <br/>
                          <FormControl required style={{width: "200px"}} className="form-control">
                            <InputLabel htmlFor="state">State</InputLabel>
                            <Select id="state" style={{width: "100%"}} className="select-field"
                                    state={this.state.selectedState} onChange={this.selectStateChangeHandler}
                                    MenuProps={{style: {marginTop: '50px', maxHeight: '300px'}}}
                                    value={this.state.selectedState}>
                              {this.state.allStataes.map(state => (
                                <MenuItem value={state.id} key={state.id}>{state.state_name}</MenuItem>
                              ))}
                            </Select>
                            <FormHelperText className={this.state.stateRequired}>
                              <span className="red">required</span>
                            </FormHelperText>
                          </FormControl>
                          <br/>
                          <br/>
                          <FormControl required style={{width: "200px"}} className="form-control">
                            <InputLabel htmlFor="pincode">Pincode</InputLabel>
                            <Input id="pincode" className="input-fields" pincode={this.state.newAddressPincode}
                                   fullWidth={true} onChange={this.inputNewAddressPincodeChangeHandler}
                                   value={this.state.newAddressPincode}/>
                            <FormHelperText className={this.state.newAddressPincodeRequired}>
                              <span className="red">required</span>
                            </FormHelperText>
                            <FormHelperText className={this.state.pincodeValidationText}>
                              <span className="red">Pincode must contain only numbers and must be 6 digits long</span>
                            </FormHelperText>
                          </FormControl>
                          <br/>
                          <br/>
                          <br/>
                          <Button variant="contained" style={{fontWeight: "400", width: "150px"}}
                                  className="form-button" color="secondary" onClick={this.saveAddressHandler}>SAVE
                            ADDRESS</Button>
                        </TabContainer>
                        }
                      </div>
                      :
                      <div className="payment-container">
                        <FormControl component="fieldset" className={classes.radioFormControl}>
                          <FormLabel component="legend">
                            Select Mode of Payment
                          </FormLabel>
                          <RadioGroup aria-label="payment" name="payment" value={this.state.selectedPaymentMethod}
                                      onChange={this.radioPaymentChangeHandler}>
                            {this.state.paymentMethods.map(payment => (
                              <FormControlLabel key={payment.id} value={payment.id} control={<Radio/>}
                                                label={payment.payment_name}/>
                            ))
                            }
                          </RadioGroup>
                        </FormControl>
                      </div>
                    }


                    <div className={classes.actionContainer}>
                      <div>
                        <Button
                          disabled={this.state.activeStep === 0}
                          onClick={this.backButtonHandler}
                          className={classes.button}
                        >
                          Back
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={this.nextButtonHandler}
                          className={classes.button}
                        >
                          {this.state.activeStep === this.state.steps.length - 1 ? 'Finish' : 'Next'}
                        </Button>
                      </div>
                    </div>
                  </StepContent>
                </Step>
              ))}
            </Stepper>
            {this.state.activeStep === this.state.steps.length && (
              <Paper square elevation={0} className={classes.changeContainer}>
                <Typography>View the summary and place your order now!</Typography>
                <Button onClick={this.changeButtonHandler} className={classes.button}>
                  Change
                </Button>
              </Paper>
            )}

          </div>
          <div className="summary-block-container">
            <Card className={classes.summary}>
              <CardHeader
                title="Summary"
                titleTypographyProps={{
                  variant: 'h5'
                }}
                style={{marginLeft: "10px", marginRight: "10px"}}
              />
              <CardContent
                style={{paddingTop: "0px", marginRight: "10px", marginLeft: "10px"}}
              >

                <Typography variant='subtitle1' component='p'
                            style={{fontSize: "18px", color: "rgb(85,85,85)", margin: "10px 0px"}}
                            className="restaurant-name">{this.state.restaurantDetails.name}</Typography>
                {this.state.cartItems.map(cartItem => (
                  <div className="menu-item-container" key={cartItem.id}>
                    <i className="fa fa-stop-circle-o" aria-hidden="true"
                       style={{color: cartItem.itemType === "NON_VEG" ? "#BE4A47" : "#5A9A5B"}}/>
                    <Typography variant="subtitle1" component="p" style={{marginLeft: "10px", color: "grey"}}
                                className="menu-item-name"
                                id="summary-menu-item-name">{cartItem.name[0].toUpperCase() + cartItem.name.slice(1)}</Typography>
                    <Typography variant="subtitle1" component="p"
                                style={{marginLeft: "auto", marginRight: "30px", color: "grey"}}
                                className="item-quantity">{cartItem.quantity}</Typography>
                    <div className="item-price-summary-container">
                      <i className="fa fa-inr" aria-hidden="true" style={{color: 'grey'}}/>
                      <Typography variant="subtitle1" component="p" className={classes.itemPrice}
                                  id="summary-item-price">{cartItem.totalAmount.toFixed(2)}</Typography>
                    </div>
                  </div>
                ))}
                <div className="discount-coupon-container">
                  <FormControl className={classes.formControlCoupon}>
                    <InputLabel htmlFor="coupon">Coupon Code</InputLabel>
                    <FilledInput id="coupon" className={classes.couponInput} value={this.state.discountCouponName}
                                 onChange={this.inputNewAddressCouponNameChangeHandler} placeholder="Ex: FLAT30"/>
                    <FormHelperText className={this.state.discountCouponNameRequired}>
                      <span className="red">required</span>
                    </FormHelperText>
                    <FormHelperText className={this.state.discountCouponNameValidationText}>
                      <span className="red">invalid coupon</span>
                    </FormHelperText>
                  </FormControl>
                  <Button variant="contained" color="default" style={{height: "40px"}} className="apply-button"
                          onClick={this.applyButtonHandler} size="small">APPLY</Button>
                </div>
                <div className="amount-label-container">
                  <Typography variant="subtitle2" component="p" style={{color: 'grey'}}>Sub Total</Typography>
                  <div className="total-amount">
                    <i className="fa fa-inr" aria-hidden="true" style={{color: 'grey'}}/>
                    <Typography variant="subtitle1" component="p" style={{color: 'grey'}}
                                id="summary-net-amount">{this.getItemTotal().toFixed(2)}</Typography>
                  </div>
                </div>
                <div className="amount-label-container">
                  <Typography variant="subtitle2" component="p" className={classes.netAmount}
                              style={{color: 'grey'}}>Discount</Typography>
                  <div className="total-amount">
                    <i className="fa fa-inr" aria-hidden="true" style={{color: 'grey'}}/>
                    <Typography variant="subtitle1" component="p" style={{color: 'grey'}}
                                id="summary-net-amount">{this.getDiscountedAmount().toFixed(2)}</Typography>
                  </div>
                </div>

                <Divider style={{margin: "10px 0px"}} className="divider"/>
                <div className="amount-label-container">
                  <Typography variant="subtitle2" component="p" className={classes.netAmount}>Net Amount</Typography>
                  <div className="total-amount">
                    <i className="fa fa-inr" aria-hidden="true" style={{color: 'grey'}}/>
                    <Typography variant="subtitle1" component="p" className={classes.itemPrice}
                                id="summary-net-amount">{this.getNetTotal().toFixed(2)}</Typography>
                  </div>
                </div>

                <Button variant="contained" color='primary' fullWidth={true} style={{fontWeight: "400"}}
                        className="place-order-button" onClick={this.placeOrderButtonHandler}>PLACE ORDER</Button>

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
            open={this.state.snackBarOpen}
            autoHideDuration={4000}
            onClose={this.snackBarClose}
            TransitionComponent={this.state.transition}
            ContentProps={{
              'aria-describedby': 'message-id',
            }}
            message={<span id="message-id">{this.state.snackBarMessage}</span>}
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

export default withStyles(styles)(Checkout);
