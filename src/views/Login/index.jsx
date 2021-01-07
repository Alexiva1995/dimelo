import React from 'react'
import {
    Grid,
    makeStyles,
    Typography,
    TextField,
    Hidden,
    Button,
} from '@material-ui/core';

import WatermarkIMG from '../../dist/images/watermark.svg';
import BrandIMG from '../../dist/images/brand.svg';

const useStyles = makeStyles(theme=>({
    root:{
        width:'100vw',
        height:'100vh',
        ' & > .MuiGrid-item':{ height:'100%', },
        fontFamily:'Source Sans Pro',
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
        maxHeight:386,
        display:'flex',
        background:'#f00',
        flexDirection:'column',
        maxWidth:'fit-content',
        padding:'10px 20px',
        justifyContent:'space-between',
        // color:'#43425D',
        // cursor:'default',
        // fontWeight:'300',
        // '& a':{ textDecoration:'none',color:'inherit' },
        // '& .MuiInputLabel-formControl:not(.Mui-focused)':{ fontSize:15, },
        // '& > .MuiFormControl-root':{ marginTop:10, display:'flex', flexGrow:1, },
    },

}));



export default function Login(){
    const classes = useStyles();
    return (<Grid container className={classes.root}>
        <Hidden smDown>
            <Grid item md={6} className={classes.gridLeft}>
                <Typography variant="h3">Bienvenido</Typography>
                <Typography variant="subtitle2">¡Bienvenido! Por favor, ingrese a su cuenta.</Typography>
            </Grid>
        </Hidden>

        <Grid item xs={12} md={6} className={classes.gridRight}>
            <Typography color="primary" variant="h3">Iniciar sesión</Typography>
              <TextField color="primary" fullWidth id="input-user" label="Usuario" />
              <TextField color="primary" fullWidth id="input-user" label="Contraseña" />
              <Grid container>
                <Grid item xs={6}> <a href="/forgot"> Recordarme </a> </Grid>
                <Grid item xs={6}> <a href="/forgot"> Olvide mi contraseña </a> </Grid>
              </Grid>
              <Button>

              </Button>
        </Grid>

    </Grid>);
}