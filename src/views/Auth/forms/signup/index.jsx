import React from 'react'
import {
    Input,
    Button,
    Toolbar,
    Container,
    TextField,
    Typography,
    makeStyles,
    InputLabel,
    IconButton,
    FormControl,
    InputAdornment,
    Grid,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@material-ui/icons';


const useStyles = makeStyles({
    root:{
        width:'100%',
        height:'100%',
        display:'flex',
        flexDirection:'column',
        padding:'0px 50px',
    },
    header:{
        margin:'auto 0 10px 0',
        '& .MuiTypography-h3':{
            fontSize:'2.2rem',
        },
        '& .MuiTypography-subtitle2':{
            margin:'20px 0 10px 0',
        },
    },

    body:{
        display:'flex',
        flexWrap:'wrap',
        '& .MuiFormControl-root':{ maxWidth:250, },
        '& .MuiFormControl-root:nth-child(odd)':{ marginRight:'auto',marginBottom:20, },
        '& > .legend':{ display:'flex', flexBasis:'100%', padding:'10px 0', marginBottom:10, },
    },
    Button:{
        marginLeft:'auto',
        marginBottom:'auto',
        textTransform:'none',
        '& .MuiTypography-root':{
            color:'#fff',
            fontSize:'1.3em',
            fontWeight:'lighter',
        },
    },
    Toolbar:{ marginTop:'auto', justifyContent:'center', },
});

export default function SignIn(){
    const [ showPass, setShowPass ] = React.useState(null);
    const classes = useStyles();
    return (<Container className={classes.root}>
        <div className={classes.header}>
            <Typography color="primary" variant="h3">Regístrate ahora</Typography>
            <Typography color="primary" variant="subtitle2">
                Completa los campos a continuación.
            </Typography>
        </div>
        <div className={classes.body}>
            <TextField color="primary" fullWidth id="input-user" label="Usuario" />
            <FormControl fullWidth>
                <InputLabel htmlFor="input-password">Contraseña</InputLabel>
                <Input id="input-password"
                    type={showPass?'text':'password'}
                    defaultValue=""
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={()=>setShowPass(!showPass)}>
                                {showPass ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>} />
            </FormControl>
            <TextField color="primary" fullWidth id="input-name" label="Nombres" />
            <TextField color="primary" fullWidth id="input-lastname" label="Apellidos" />
            <TextField color="primary" fullWidth id="input-document" label="Cedula" />
            <TextField color="primary" fullWidth id="input-age" label="Edad" />
            <div className="legend">
                Al continuar acepto las <a href="#">políticas de uso de datos y privacidad.</a>
            </div>
            <div className="legend">
                <Button variant="contained" disableElevation color="primary" className={classes.Button}>
                    <Typography color="inherit" component="span">Continuar</Typography>
                </Button>
            </div>
            <div className="legend">
                Al continuar acepto las <a href="#">políticas de uso de datos y privacidad.</a>
            </div>
        </div>
        <Toolbar className={classes.Toolbar}>
            ¿Ya tienes una cuenta? &nbsp; <Typography component={Link} to="/signin">Ingresa</Typography>
        </Toolbar>
    </Container>);
}