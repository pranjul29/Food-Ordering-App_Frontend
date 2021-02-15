import React, {Component} from "react";
import Header from "../../common/header/Header";
import Grid from '@material-ui/core/Grid';
import './Home.css';
import CardActionArea from "@material-ui/core/CardActionArea";
import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import withStyles from "@material-ui/core/styles/withStyles";
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import 'font-awesome/css/font-awesome.min.css';
import '@fortawesome/fontawesome-free-solid';
import '@fortawesome/fontawesome-svg-core';


const styles = (theme => ({
    root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
    },
    grid: { //style for the grid component
        "padding": "20px",
        "margin-left": "0.5%",
        "margin-right": "0.5%",
        transform: 'translateZ(0)',
        cursor: 'pointer',
    },
    media: { // style for the image in the card
        height: "40%",
        width: "100%",
        // paddingTop: '56.25%', // 16:9
    },
    cardContent: { // Styles for the card content
        "padding": "10px",
        "margin-left": "20px",
        "margin-right": "20px",
        "height": "20%",
        "display": "flex",
        "align-items": "center",
    },
    cardActionArea: { //Style for the Card action area button
        "display": "flex",
        "height": "100%",
        "flex-direction": "column",
        "align-items": "normal",
        "justify-content": "space-between",

    },
    gridCard: { //Style for the Grid card
        '@media (min-width: 1200px)': { //Making the code responsive to different screens
            'flex-grow': '0',
            'max-width': '25%',
            'flex-basis': '25%',
        },

        '@media (min-width: 960px) and (max-width:1200px)': { //Making the code responsive to different screens
            'flex-grow': '0',
            'max-width': '33%',
            'flex-basis': '33%',
        },

        '@media (max-width:960px)': { //Making the code responsive to different screens
            'flex-grow': '0',
            'max-width': '50%',
            'flex-basis': '50%',
        },
    },

    card: { //Style for the card and responsive code for different screen size
        height: "500px",
        '@media (min-width: 1300px)': { //Making the code responsive to different screens
            height: "500px",
        },
        '@media (min-width: 960px) and (max-width:1300px)': { //Making the code responsive to different screens
            height: "375px",
        },
        '@media (max-width:960px)': { //Making the code responsive to different screens
            height: "250px",
        }
    },

    title: { //Style for the Title in the Card
        "font-size": "25px",
        '@media (min-width: 1300px)': {
            "font-size": "40px",
        },
        '@media (min-width: 960px) and (max-width:1300px)': {
            "font-size": "30px",
        },
        '@media (max-width: 960px)': {
            "font-size": "20px",
        }
    },
    categories: { //Style for the categories in the card
        "font-size": "16px",
        '@media (min-width: 1300px)': {
            "font-size": "22px",
        },
        '@media (min-width: 960px) and (max-width:1300px)': {
            "font-size": "20px",
        },
        '@media (max-width: 960px)': {
            "font-size": "18px",
        }
    }
}))

class Home extends Component {

    restaurantCardClicked(id) {

    }

    render() {
        let displayRestaurants = this.props.displayRestaurants;
        const {classes} = this.props;
        return (
            <div>
                <Header
                    baseUrl={this.props.baseUrl}
                    filterRestaurants={this.props.filterRestaurants}
                />
                <div className="flex-container">
                    <Grid container spacing={3}>
                        {displayRestaurants.length > 0 ? (
                                displayRestaurants.map(restaurant => (
                                    <Grid key={restaurant.id} item xs={3} className={classes.gridCard}>
                                        <Card className={classes.card}>
                                            <CardActionArea className={classes.cardActionArea}
                                                            onClick={() => this.restaurantCardClicked(restaurant.id)}>
                                                <CardMedia
                                                    className={classes.media}
                                                    image={restaurant.photo_URL}
                                                    title={restaurant.restaurant_name}
                                                />
                                                <CardContent className={classes.cardContent}>
                                                    <Typography className={classes.title} variant="h5" component="h2">
                                                        {restaurant.restaurant_name}
                                                    </Typography>
                                                </CardContent>
                                                <CardContent className={classes.cardContent}>
                                                    <Typography variant="subtitle1" component="p"
                                                                className={classes.categories}>
                                                        {restaurant.categories}
                                                    </Typography>
                                                </CardContent>
                                                <CardContent className={classes.cardContent}>
                                                    <div className="card-bottom-info">
                                                <span className="rest-rating">
                                                    <span>
                                                        <FontAwesomeIcon icon="star" size="lg" color="white"/>
                                                    </span>
                                                    <Typography variant="caption"
                                                                component="p">{restaurant.customer_rating}</Typography>
                                                    <Typography variant="caption"
                                                                component="p">({restaurant.number_customers_rated})</Typography>
                                                </span>
                                                        <span className="rest-for-two">
                                                    <Typography variant="caption" component="p"
                                                                style={{fontSize: '14px'}}>
                                                        <i className="fa fa-inr" aria-hidden="true"></i>
                                                        {restaurant.average_price}
                                                    </Typography>
                                                    <Typography variant="caption" component="p"
                                                                style={{fontSize: '14px'}}>for two</Typography>
                                                </span>
                                                    </div>
                                                </CardContent>
                                            </CardActionArea>
                                        </Card>
                                    </Grid>
                                ))
                        ) : (
                            <div>
                                No restaurant with the given name.
                            </div>
                        )}
                    </Grid>
                </div>
            </div>
        );
    }


}

export default withStyles(styles)(Home);
