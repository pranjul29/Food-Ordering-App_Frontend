import React, { Component } from 'react';
import FastfoodIcon from '@material-ui/icons/Fastfood';
import SearchIcon from '@material-ui/icons/Search';
import Input from '@material-ui/core/Input';
import { withStyles } from '@material-ui/core/styles';
import InputAdornment from '@material-ui/core/InputAdornment';
import Button from '@material-ui/core/Button';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Modal from 'react-modal';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography'
import PropTypes from 'prop-types';
import Snackbar from '@material-ui/core/Snackbar';
import Fade from '@material-ui/core/Fade';
import { MenuList } from '@material-ui/core';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import {Link, Redirect} from 'react-router-dom';
import { FormControl, InputLabel, FormHelperText } from '@material-ui/core';

import './Header.css';

const styles = (theme => ({
    searchText: {
        'color': 'white',
        '&:after': {
            borderBottom: '2px solid white',
        }
    },
    menuItems: {
        "text-decoration": "none",
        "color": "black",
        "text-decoration-underline": "none",
        "padding-top": "0px",
        "padding-bottom": "0px",
    },

}))
const customStyles = {
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)'
    }
};

const TabContainer = function (props) {
    return (
        <Typography component="div" style={{ padding: '0px', textAlign: 'center' }}>
            {props.children}
        </Typography>
    )
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired
}

class Header extends Component {
    constructor() {
        super();
        this.state = {
            isLoginRegisterModalOpen: false,
            isMenuOpen: false,
            value: 0,
            loginContactNumber: "",
            loginContactNumberRequired: "dispNone",
            loginFormPassword: "",
            loginFormPasswordRequired: "dispNone",
            signupFormFirstName: "",
            signupFormFirstNameRequired: "dispNone",
            signupFormLastName: "",
            email: "",
            signupFormEmailRequired: "dispNone",
            invalidEmail: "dispNone",
            signUpPassword: "",
            signUpPasswordRequired: "dispNone",
            signUpContactNo: "",
            signUpContactNoRequired: "dispNone",
            inValidLoginContact: "dispNone",
            invalidPassword: "dispNone",
            notRegisteredContact: "dispNone",
            validPasswordHelpText: "dispNone",
            contactNoRegistered: "dispNone",
            contactHelpText: "dispNone",
            snackBarOpen: false,
            snackBarMessage: "",
            transition: Fade,
            loggedIn: sessionStorage.getItem('access-token') === null ? false : true,
            loggedInName: sessionStorage.getItem('customer-name'),

        }

    }


    closeLoginRegisterModalHandler = () => {
        this.setState({
            ...this.state,
            isLoginRegisterModalOpen: false
        })
        if(this.props.changeBadgeDisplay){
            this.props.changeBadgeDisplay();
        }
    }

    loginButtonOnClickHandler = () => {
        this.setState({
            ...this.state,
            isLoginRegisterModalOpen: true,
            loginContactNumber: "",
            loginContactNumberRequired: "dispNone",
            loginFormPassword: "",
            loginFormPasswordRequired: "dispNone",
            signupFormFirstName: "",
            signupFormFirstNameRequired: "dispNone",
            signupFormLastName: "",
            email: "",
            signupFormEmailRequired: "dispNone",
            invalidEmail: "dispNone",
            signUpPassword: "",
            signUpPasswordRequired: "dispNone",
            signUpContactNo: "",
            signUpContactNoRequired: "dispNone",
            inValidLoginContact: "dispNone",
            invalidPassword: "dispNone",
            notRegisteredContact: "dispNone",
            validPasswordHelpText: "dispNone",
            contactNoRegistered: "dispNone",
            contactHelpText: "dispNone",
        })
        if(this.props.changeBadgeDisplay){
            this.props.changeBadgeDisplay();
        }
    }

    openProfileMenu = () => this.setState({
        ...this.state,
        isMenuOpen: !this.state.isMenuOpen
    })

    profileMenuButtonClickHandler = (event) => {
        this.state.anchorEl ? this.setState({ anchorEl: null }) : this.setState({ anchorEl: event.currentTarget });
        this.openProfileMenu();
    };

    loginContactNumberChangeHandler = (event) => {
        this.setState({
            ...this.state,
            loginContactNumber: event.target.value,
        })
    }

    loginPasswordChangeHandler = (event) => {
        this.setState({
            ...this.state,
            loginFormPassword: event.target.value,
        })
    }

    firstNameChangeHandler = (event) => {
        this.setState({
            ...this.state,
            signupFormFirstName: event.target.value,
        })
    }

    lastNameChangeHandler = (event) => {
        this.setState({
            ...this.state,
            signupFormLastName: event.target.value,
        })
    }

    emailChangeHandler = (event) => {
        this.setState({
            ...this.state,
            email: event.target.value,
        })
    }

    signUpFormPasswordChangeHandler = (event) => {
        this.setState({
            ...this.state,
            signUpPassword: event.target.value,
        })
    }

    signUpFormContactNoChangeHandler = (event) => {
        this.setState({
            ...this.state,
            signUpContactNo: event.target.value,
        })
    }

    inputSearchFieldChangeHandler = (event) => {
        let searchOn = true
        if (! (event.target.value === "")) {
            let dataRestaurant = null;
            let that = this
            let xhrSearchRestaurant = new XMLHttpRequest();

            xhrSearchRestaurant.addEventListener("readystatechange", function () {
                if (xhrSearchRestaurant.readyState === 4 && xhrSearchRestaurant.status === 200) {
                    const restaurant = JSON.parse(this.responseText).restaurants;
                    that.props.filterRestaurantBySearchHandler(restaurant,searchOn);
                }
            })

            xhrSearchRestaurant.open('GET', this.props.baseUrl + 'restaurant/name/' + event.target.value)
            xhrSearchRestaurant.setRequestHeader("Content-Type", "application/json");
            xhrSearchRestaurant.setRequestHeader("Cache-Control", "no-cache");
            xhrSearchRestaurant.send(dataRestaurant);

        }else{
            let restaurant =[];
            searchOn = false
            this.props.filterRestaurantBySearchHandler(restaurant,searchOn);

        }
    }

    loginSignupTabsChangeHandler = (event, value) => {
        this.setState({
            value
        });
    }

    loginButtonClickHandler = () => {

        if (this.loginFormValidation()) {
            let dataLogin = null;
            let xhrLogin = new XMLHttpRequest();
            let that = this;
            xhrLogin.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (xhrLogin.status === 200) {
                        let loginResponse = JSON.parse(this.responseText);
                        sessionStorage.setItem("uuid", JSON.parse(this.responseText).id);
                        sessionStorage.setItem("access-token", xhrLogin.getResponseHeader("access-token"));
                        sessionStorage.setItem("customer-name", loginResponse.first_name);
                        that.setState({
                            ...that.state,
                            loggedIn: true,
                            loggedInName: loginResponse.first_name,
                            snackBarMessage: "Logged in successfully!",
                            snackBarOpen: true,
                        })
                        that.closeLoginRegisterModalHandler();
                    } else if (xhrLogin.status === 401) {
                        let loginResponse = JSON.parse(this.responseText);
                        let notRegisteredContact = "dispNone"
                        let invalidPassword = "dispNone"
                        if (loginResponse.code === 'ATH-001') { 
                            notRegisteredContact = "dispBlock"
                        }
                        if (loginResponse.code === 'ATH-002') {
                            invalidPassword = "dispBlock"
                        }
                        that.setState({
                            ...that.state,
                            notRegisteredContact: notRegisteredContact,
                            invalidPassword: invalidPassword,
                        })
                    }
                }
            })
            xhrLogin.open("POST", this.props.baseUrl + "customer/login");
            xhrLogin.setRequestHeader("Authorization", "Basic " + window.btoa(this.state.loginContactNumber + ":" + this.state.loginFormPassword));
            xhrLogin.setRequestHeader("Content-Type", "application/json");
            xhrLogin.setRequestHeader("Cache-Control", "no-cache");
            xhrLogin.send(dataLogin);
        }

    }

    loginFormValidation = () => {
        let loginContactNumberRequired = "dispNone";
        let loginFormPasswordRequired = "dispNone";
        let inValidLoginContact = "dispNone";
        let isFormValid = true;
        if (this.state.loginContactNumber === "") {
            loginContactNumberRequired = "dispBlock";
            isFormValid = false;
        }
        if (this.state.loginFormPassword === "") {
            loginFormPasswordRequired = "dispBlock"
            isFormValid = false;
        }
        if (this.state.loginContactNumber !== "") {
            const contactNo = "[1-9][0-9]{9}";
            if (!this.state.loginContactNumber.match(contactNo)) {
                inValidLoginContact = "dispBlock"
                isFormValid = false;
            }
        }
        this.setState({
            loginContactNumberRequired: loginContactNumberRequired,
            loginFormPasswordRequired: loginFormPasswordRequired,
            inValidLoginContact: inValidLoginContact
        })
        return (isFormValid);
    }

    signUpButtonClickHandler = () => {

        if (this.signUpFormValidation()) {
            let dataSignUp = JSON.stringify({
                "contact_number": this.state.signUpContactNo,
                "email_address": this.state.email,
                "first_name": this.state.signupFormFirstName,
                "last_name": this.state.signupFormLastName,
                "password": this.state.signUpPassword
            });

            let xhrSignUp = new XMLHttpRequest();
            let that = this;
            xhrSignUp.addEventListener("readystatechange", function () {
                if (this.readyState === 4) {
                    if (xhrSignUp.status === 201) {
                        that.setState({
                            ...that.state,
                            value: 0,
                            snackBarMessage: "Registered successfully! Please login now!",
                            snackBarOpen: true,
                        })
                    }
                    if (xhrSignUp.status === 400) {
                        let responseData = JSON.parse(this.responseText)
                        if (responseData.code === 'SGR-001') {
                            that.setState({
                                ...that.state,
                                contactNoRegistered: "dispBlock"
                            })
                        }
                    }
                }
            });
            xhrSignUp.open("POST", this.props.baseUrl + "customer/signup");
            xhrSignUp.setRequestHeader("Content-Type", "application/json");
            xhrSignUp.setRequestHeader("Cache-Control", "no-cache");
            xhrSignUp.send(dataSignUp);
        }
    }

    signUpFormValidation = () => {
        let signupFormFirstNameRequired = "dispNone";
        let signupFormEmailRequired = "dispNone";
        let signUpPasswordRequired = "dispNone";
        let signUpContactNumberRequired = "dispNone";
        let validPasswordHelpText = "dispNone";
        let contactHelpText = "dispNone";
        let invalidEmail = "dispNone";
        let signUpFormValid = true;

        if (this.state.signupFormFirstName === "") {
            signupFormFirstNameRequired = "dispBlock";
            signUpFormValid = false;
        }
        if (this.state.email === "") {
            signupFormEmailRequired = "dispBlock";
            signUpFormValid = false;
        }
        if (this.state.email !== "") {

            if (!(/^\w+([-]?\w+)*@\w+([-]?\w+)*(\.\w+)+$/.test(this.state.email))) {
                invalidEmail = "dispBlock"
                signUpFormValid = false;
            }
        }
        if (this.state.signUpContactNo === "") {
            signUpContactNumberRequired = "dispBlock";
            signUpFormValid = false;
        }
        if (this.state.signUpContactNo !== "") {
          const contactNo = "[1-9][0-9]{9}";
          if (!this.state.signUpContactNo.match(contactNo)) {
                contactHelpText = "dispBlock"
                signUpFormValid = false;
            }
        }
        if (this.state.signUpPassword === "") {
            signUpPasswordRequired = "dispBlock";
            signUpFormValid = false;
        }
        if (this.state.signUpPassword !== "") {
            if (!this.isPasswordValid(this.state.signUpPassword)) {
                validPasswordHelpText = "dispBlock"
                signUpFormValid = false;

            }
        }
        this.setState({
            signupFormFirstNameRequired: signupFormFirstNameRequired,
            signupFormEmailRequired: signupFormEmailRequired,
            contactHelpText: contactHelpText,
            signUpPasswordRequired: signUpPasswordRequired,
            signUpContactNoRequired: signUpContactNumberRequired,
            invalidEmail: invalidEmail,
            validPasswordHelpText: validPasswordHelpText,
        })
        return (signUpFormValid);

    }

    isPasswordValid = (password) => {
        let lowerCase = false;
        let upperCase = false;
        let number = false;
        let specialCharacter = false;


        if (password.length < 8) {
            return false;
        }

        if (password.match("(?=.*[0-9]).*")) {
            number = true;
        }

        if (password.match("(?=.*[a-z]).*")) {
            lowerCase = true;
        }
        if (password.match("(?=.*[A-Z]).*")) {
            upperCase = true;
        }
        if (password.match("(?=.*[#@$%&*!^]).*")) {
            specialCharacter = true;
        }

        if (lowerCase && upperCase) {
            if (specialCharacter && number) {
                return true;
            }
        } else {
            return false;
        }
        return false;
    }

    snackBarCloseClickHandler = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        this.setState({
            ...this.state,
            snackBarMessage: "",
            snackBarOpen: false,
        })
    }

    onLogoutButtonClickHandler = () => {
        let logoutData = null;
        let that = this
        let xhrLogout = new XMLHttpRequest();
        xhrLogout.addEventListener("readystatechange", function () {
            if (xhrLogout.readyState === 4 && xhrLogout.status === 200) {
                sessionStorage.removeItem("uuid"); //Clearing uuid
                sessionStorage.removeItem("access-token"); //Clearing access-token
                sessionStorage.removeItem("customer-name"); //Clearing customer-name
                that.setState({
                    ...that.state,
                    loggedIn: false,
                    isMenuOpen: !that.state.isMenuOpen,
                });

                if (that.props.logoutAndRedirectToHome) {
                    that.props.logoutAndRedirectToHome();
                }
            }

        })

        xhrLogout.open('POST', this.props.baseUrl + 'customer/logout');
        xhrLogout.setRequestHeader('authorization', 'Bearer ' + sessionStorage.getItem('access-token'));
        xhrLogout.send(logoutData);


    }
    redirectToHome = () => {
            return <Redirect to="/" />
    }

    render() {
        const { classes } = this.props;
        return (
            <div>
                <header className="page-header">
                    <FastfoodIcon className="page-logo" fontSize="large" htmlColor="white" onClick={this.redirectToHome}/>
                    {this.props.showHeaderSearchField === true &&
                        <span className="header-search-box">
                            <Input className={classes.searchText}
                                startAdornment={
                                    <InputAdornment position="start">
                                        <SearchIcon id="search-icon" htmlColor="white"/>
                                    </InputAdornment>
                                }
                                fullWidth={true} placeholder="Search by Restaurant Name" onChange={this.inputSearchFieldChangeHandler} />
                        </span>
                    }

                    {this.state.loggedIn !== true ?
                        <Button className="header-login-button" size="large" variant="contained" onClick={this.loginButtonOnClickHandler}>
                            <AccountCircle className="header-login-button-icon" />
                            LOGIN
                        </Button>
                        : <Button className="header-profile-button" style={{color: "#c2c2c2"}} size="large" variant="text" onClick={this.profileMenuButtonClickHandler}>
                            <AccountCircle className="header-profile-button-icon" htmlColor="#c2c2c2" />
                            {this.state.loggedInName}
                        </Button>
                    }
                    <Menu id="profile-menu" anchorEl={this.state.anchorEl} open={this.state.isMenuOpen} onClose={this.profileMenuButtonClickHandler}>
                        <MenuList className="menu-list">
                            <Link to={"/profile"} className={classes.menuItems} underline="none" color={"default"}>
                                <MenuItem className={classes.menuItems} onClick={this.onMyProfileClicked} disableGutters={false}>My profile</MenuItem>
                            </Link>
                            <MenuItem className="menu-items" onClick={this.onLogoutButtonClickHandler}>Logout</MenuItem>
                        </MenuList>
                    </Menu>
                </header>
                <Modal
                    ariaHideApp={false}
                    isOpen={this.state.isLoginRegisterModalOpen}
                    contentLabel="Login"
                    onRequestClose={this.closeLoginRegisterModalHandler}
                    style={customStyles}
                >
                    <Tabs className="header-login-modal-tabs" value={this.state.value} onChange={this.loginSignupTabsChangeHandler}>
                        <Tab label="LOGIN" className="login-signup-tab" />
                        <Tab label="SIGNUP" className="login-signup-tab" />
                    </Tabs>

                    {this.state.value === 0 &&
                        <TabContainer>
                            <FormControl required className="model-form-control">
                                <InputLabel htmlFor="login-contact-no">Contact No.</InputLabel>
                                <Input id="login-contact-no" className="input-fields" fullWidth={true} type="text" logincontactno={this.state.loginContactNumber} onChange={this.loginContactNumberChangeHandler} value={this.state.loginContactNumber} />
                                <FormHelperText className={this.state.loginContactNumberRequired}>
                                    <span className='red'>required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.inValidLoginContact}>
                                    <span className="red">Invalid Contact</span>
                                </FormHelperText>

                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className="model-form-control">
                                <InputLabel htmlFor="login-password">Password</InputLabel>
                                <Input id="login-password" className="input-fields" type="password" loginpassword={this.state.loginFormPassword} fullWidth={true} onChange={this.loginPasswordChangeHandler} value={this.state.loginFormPassword} />
                                <FormHelperText className={this.state.loginFormPasswordRequired}>
                                    <span className='red'>required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.invalidPassword}>
                                    <span className="red">Invalid Credentials</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.notRegisteredContact}>
                                    <span className="red">This contact number has not been registered!</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button variant="contained" className="header-form-button" color="primary" onClick={this.loginButtonClickHandler}>LOGIN</Button>
                        </TabContainer>
                    }
                    {this.state.value === 1 &&
                        <TabContainer>
                            <FormControl required className="model-form-control">
                                <InputLabel htmlFor="first-name">First Name</InputLabel>
                                <Input id="first-name" className="input-fields" firstname={this.state.signupFormFirstName} fullWidth={true} onChange={this.firstNameChangeHandler} value={this.state.signupFormFirstName} />
                                <FormHelperText className={this.state.signupFormFirstNameRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl className="model-form-control">
                                <InputLabel htmlFor="last-name">Last Name</InputLabel>
                                <Input id="last-name" className="input-fields" lastname={this.state.signupFormLastName} fullWidth={true} onChange={this.lastNameChangeHandler} value={this.state.signupFormLastName} />
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className="model-form-control">
                                <InputLabel htmlFor="email">Email</InputLabel>
                                <Input id="email" className="input-fields" type="email" email={this.state.email} fullWidth={true} onChange={this.emailChangeHandler} value={this.state.email} />
                                <FormHelperText className={this.state.signupFormEmailRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.invalidEmail}>
                                    <span className="red">Invalid Email</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className="model-form-control">
                                <InputLabel htmlFor="sign-up-password">Password</InputLabel>
                                <Input id="sign-up-password" className="input-fields" type="password" signuppassword={this.state.signUpPassword} fullWidth={true} onChange={this.signUpFormPasswordChangeHandler} value={this.state.signUpPassword} />
                                <FormHelperText className={this.state.signUpPasswordRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.validPasswordHelpText}>
                                    <span className="red">Password must contain at least one capital letter, one small letter, one number, and one special character</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <FormControl required className="model-form-control">
                                <InputLabel htmlFor="sign-up-contactNo">Contact No.</InputLabel>
                                <Input id="sign-up-contactNo" className="input-fields" signupcontactno={this.state.signUpContactNo} fullWidth={true} onChange={this.signUpFormContactNoChangeHandler} value={this.state.signUpContactNo} />
                                <FormHelperText className={this.state.signUpContactNoRequired}>
                                    <span className="red">required</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.contactHelpText}>
                                    <span className="red">Contact No. must contain only numbers and must be 10 digits long</span>
                                </FormHelperText>
                                <FormHelperText className={this.state.contactNoRegistered}>
                                    <span className="red">This contact number is already registered! Try other contact number.</span>
                                </FormHelperText>
                            </FormControl>
                            <br />
                            <br />
                            <br />
                            <Button variant="contained" className="header-form-button" color="primary" onClick={this.signUpButtonClickHandler}>SIGNUP</Button>
                        </TabContainer>
                    }
                </Modal>
                <div>
                    <Snackbar
                        anchorOrigin={{
                            vertical: 'bottom',
                            horizontal: 'left',
                        }}
                        open={this.state.snackBarOpen}
                        autoHideDuration={4000}
                        onClose={this.snackBarCloseClickHandler}
                        TransitionComponent={this.state.transition}
                        ContentProps={{
                            'aria-describedby': 'message-id',
                        }}
                        message={<span id="message-id">{this.state.snackBarMessage}</span>}
                    />
                </div>

            </div>

        )
    }
}

export default withStyles(styles)(Header);  
