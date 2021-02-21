import React, { Component } from 'react';
import { Typography } from '@material-ui/core';
import Header from "../../common/header/Header";


class Profile extends Component {


    render(){
        return(
            <div>
            <Header baseUrl={this.props.baseUrl}/>
            <Typography variant="h3" component="h3">Profile Page</Typography>
            </div>
        )
    }
}

export default Profile;