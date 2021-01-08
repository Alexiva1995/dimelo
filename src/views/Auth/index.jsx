import React from 'react'
import {
    Grid,
    Hidden,
    makeStyles,
    Typography,
} from '@material-ui/core';
import WatermarkIMG from '../../dist/images/watermark.svg';
import BrandIMG from '../../dist/images/brand.svg';
import { Switch, Route } from 'react-router-dom';

import SignIn from './forms/signin';
import SignUp from './forms/signup';



const useStyles = makeStyles(theme=>({
    root:{
        width:'100vw',
        height:'100vh',
    },
    gridLeft:{
        padding:'100px 83px',
        backgroundRepeat:'no-repeat',
        backgroundSize:'250px, 520px',
        backgroundColor:theme.palette.primary.main,
        backgroundImage:`url(${BrandIMG}), url(${WatermarkIMG})`,
        backgroundPosition:'bottom 30px right 30px, left bottom',
        '& .MuiTypography-root':{
            color:'#fff',
            cursor:'default',
        },
        '& .MuiTypography-h3':{
            font:'normal normal bold 50px/71px Source Sans Pro',
        },
        '& .MuiTypography-subtitle2':{
            font:'normal normal 300 20px/25px Source Sans Pro',
        },
    },
    gridRight:{
        margin:'auto',
        color:'#43425D',
        cursor:'default',
        fontWeight:'300',
        height:'100%',
        '& a':{ textDecoration:'none',color:'inherit' },
        '& > .MuiContainer-root':{
            height:'100%',
            display:'flex',
            flexDirection:'column',
        },
    },
}));
export default function Login(req){
    const classes = useStyles();
    return (<Grid container className={classes.root}>
        <Hidden smDown>
            <Grid item xs={12} md={6} className={classes.gridLeft}>
                <Typography variant="h3">Bienvenido</Typography>
                <Typography variant="subtitle2">
                    {req.path==='/sigin' ? '¡Bienvenido! Por favor, ingrese a su cuenta.' : 'Completa el registro.'}
                </Typography>
            </Grid>
        </Hidden>
        <Grid item xs={12} md={6} className={classes.gridRight}>
            <Switch>
                <Route path="/signin" component={SignIn} />
                <Route path="/signup" component={SignUp} />
                {/* <Route path="/forgot" /> */}
            </Switch>
        </Grid>
    </Grid>);
}