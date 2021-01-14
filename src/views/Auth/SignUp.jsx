import React from 'react'
import {
    Button,
    Toolbar,
    Checkbox,
    Container,
    TextField,
    Typography,
    makeStyles,
    IconButton,
    InputAdornment,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import useHooks from './../../utils/InputsHelper';

const useStyles = makeStyles(theme=>({
    root:{
        width:'100%',
        height:'100%',
        display:'flex',
        padding:'0px 50px',
        flexDirection:'column',
    },
    header:{
        marginTop:'auto',
        '& .MuiTypography-h3':{ fontSize:'2.2rem', },
        '& .MuiTypography-subtitle2':{ margin:'20px 0 10px 0', },
        [theme.breakpoints.down('xs')]:{
            color:'white',
            margin:'70px 0 0',
            '& .MuiTypography-h3':{ display:'none', },
            '& .MuiTypography-subtitle2':{ color:'inherit',fontSize:16, margin:'20px 0 auto 0',},
        },
    },
    body:{
        display:'flex',
        flexWrap:'wrap',
        '& .MuiFormControl-root':{ width:250, marginBottom:20, },
        '& .MuiFormControl-root:nth-child(odd)':{ marginRight:'auto', },
        '& > .legend':{ padding:'10px 0', margin:'10px 0'},
        '& > .legend:last-child':{ display:'flex', flexBasis:'100%', marginTop:0, },
        [theme.breakpoints.down('xs')]:{
            '& .MuiIconButton-root':{ color:'white',fontWeight:300 },
            '& .MuiTextField-root':{
                width:'100%',
                color:'white',
                fontWeight:300,
                maxWidth:'unset',
                '& .MuiInputBase-root, & label, & input':{color:'inherit',fontWeight:'inherit'},
                '& .MuiInputBase-root:before,& .MuiInputBase-root:after':{ borderBottomColor:'white', },
            },
            '& .MuiFormControl-root + .legend':{ margin:'0 auto'},
            '& > .legend':{ padding:0, margin:'20px 0 0', },
        },
    },
    Button:{
        marginLeft:'auto',
        marginBottom:'auto',
        textTransform:'none',
        '& .MuiTypography-root':{ color:'#fff', fontSize:'1.3em', fontWeight:'lighter', },
    },
    Toolbar:{ marginTop:'auto', justifyContent:'center', },
}));
export default function SignUp(req){
    const classes = useStyles();
    const [ showPass, setShowPass ] = React.useState(null);
    const [ checked, setChecked ] = React.useState(false);
    const { inputProps, validate, inputs, } = useHooks();
    return (<Container className={classes.root}>
        <div className={classes.header}>
            <Typography color="primary" variant="h3">Regístrate ahora</Typography>
            <Typography color="primary" variant="subtitle2"> Completa los campos a continuación. </Typography>
        </div>
        <div className={classes.body}>
            <TextField {...inputProps('username')} label="Por favor crea un nombre de usuario" />
            <TextField {...inputProps('password')} label="Por favor crea una contraseña"
                type={showPass?'text':'password'}
                InputProps={{
                    endAdornment:(<InputAdornment position="end">
                        <IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>setShowPass(!showPass)}>
                            {showPass ? <Visibility /> : <VisibilityOff />}
                        </IconButton>
                    </InputAdornment>)
                }}
            />
            <TextField {...inputProps('cedula')} color="primary" label="Cédula" type="number" />
            <TextField {...inputProps('age')} color="primary" label="Edad" type="number" />
            <TextField {...inputProps('name')} color="primary" label="Nombres"
                InputProps={{disabled:!('name' in inputs)}}
                InputLabelProps={{className:('name' in inputs)?'MuiInputLabel-shrink':''}}
            />
            <TextField {...inputProps('lastname')} color="primary" label="Apellidos"
                InputProps={{disabled:!('lastname' in inputs)}}
                InputLabelProps={{className:('lastname' in inputs)?'MuiInputLabel-shrink':''}}
            />
            <div className="legend">
                <Checkbox color="primary" disableRipple checked={checked} onChange={()=>setChecked(!checked)} inputProps={{ 'aria-label': 'Terms' }} />
                Acepto las &nbsp;<strong href="#">políticas de uso de datos y privacidad.</strong>
            </div>
            <div className="legend">
                <Button component={Link} to="/signup-more" color="primary" className={classes.Button} variant="contained" disabled={!validate('username','password','name','lastname','cedula','age')}>
                    <Typography color="inherit" component="span">Continuar</Typography>
                </Button>
            </div>
        </div>
        <Toolbar className={classes.Toolbar}>
            ¿Ya tienes una cuenta? &nbsp; <Typography component={Link} to="/signin">Ingresa</Typography>
        </Toolbar>
    </Container>);
}