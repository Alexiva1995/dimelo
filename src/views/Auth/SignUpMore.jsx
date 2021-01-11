import React from 'react'
import { makeStyles, Container, Typography, Toolbar } from '@material-ui/core'
import WatermarkIMG from '../../dist/images/watermark.svg';
import BrandPNG from '../../dist/images/brand.svg';
import { Link } from 'react-router-dom';



const useStyles = makeStyles(theme=>({

    root:{
        display:'flex',
        minWidth:'100vw',
        minHeight:'100vh',
        backgroundColor:`${theme.palette.primary.dark}`,
        backgroundImage:`url(${WatermarkIMG})`,
        backgroundSize:200,
        backgroundRepeat:'space',
        '& a':{textDecoration:'none', color:'inherit'},
    },

    content:{
        color:'#FFF',
        display:'flex',
        borderRadius:20,
        margin:'30px auto',
        padding:'30px 50px',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:theme.palette.primary.main,
    },

    brand:{ maxWidth:200, margin:'0 auto', },
    label:{
        marginTop:30,
        '& .MuiTypography-subtitle2':{
            marginTop:20,
            fontSize:'1.175rem',
            fontWeight:'300',
        },
    },
    stepers:{
        
    },
    footer:{
        width:'100%',
        fontWeight:'300',
        marginTop:'auto',
        justifyContent:'center',
    },
}));




export default function SignUpMore(req){
    const classes = useStyles();
    const [ inputs, setInput ] = React.useState(req.location.state);
    const inputProps = (key)=>({
        defaultValue:inputs[key],
        onChange:({target:{value}})=>setInput(prev=>({...prev, [key]:value})),
    });


    return (<div className={classes.root}>
        <Container maxWidth="sm" className={classes.content}>
            <img alt="Brand" src={BrandPNG} className={classes.brand} />
            <div className={classes.label}>
                <Typography variant="h5" color="initial">Un poco mas...</Typography>
                <Typography variant="subtitle2" color="initial">
                    Completa estos campos adicionales para terminar el registro.
                </Typography>
            </div>
            <div className={classes.stepers}>



            </div>
            <Toolbar className={classes.footer}>
                ¿Ya tienes una cuenta?&nbsp;<Typography component={Link} to="/login">Ingresa</Typography>
            </Toolbar>        
        </Container>
    </div>)
}