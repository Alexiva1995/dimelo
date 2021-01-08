import React from 'react'
import { Button, Checkbox, Container, FormControl, Grid, IconButton, Input, InputAdornment, InputLabel, makeStyles, TextField, Toolbar, Typography } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { Link } from 'react-router-dom';


const useStyles = makeStyles({
    root:{
        width:'100%',
        marginTop:'auto',
    },
    FormControl:{
        '& > .MuiFormControl-root':{
            marginTop:30,
        },

    },
    Checkbox:{
        width:'100%',
        margin:'40px 0px',
    },
    Button:{
        color:'#fff',
        fontSize:'1.3em',
        textTransform:'none',
        marginBottom:'auto',
    },
    Toolbar:{
        width:'100%',
        marginTop:'auto',
        justifyContent:'center',
    },
});

export default function SignIn(){
    const [ showPass, setShowPass ] = React.useState(null);
    const classes = useStyles();
    return (<Container maxWidth="xs">
    <Grid container direction="column" alignItems="center" justify="flex-end" className={classes.root}>
        <Grid item xs={12}>
            <Typography color="primary" variant="h3">Iniciar sesión</Typography>
            <div className={classes.FormControl}>
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
            </div>
            <Grid container justify="space-between" className={classes.Checkbox}>
                <Grid item>
                    <Checkbox color="primary" inputProps={{ 'aria-label': 'primary checkbox' }} /> Recordarme
                </Grid>
                <Grid item> <a href="/forgot"> Olvide mi contraseña </a> </Grid>
            </Grid>
            <Button variant="contained" disableElevation color="secondary" fullWidth className={classes.Button}>
                <Typography color="inherit" component="span">Ingresar</Typography>
            </Button>
        </Grid>
    </Grid>
    <Toolbar className={classes.Toolbar}>
        ¿Aun no tienes una cuenta? &nbsp; <Typography component={Link} to="/signup">Registrate</Typography>
    </Toolbar>        
    </Container>);
}