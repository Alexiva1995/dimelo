import React from 'react'
import {
    Input,
    Button,
    Toolbar,
    Checkbox,
    Container,
    TextField,
    withStyles,
    Typography,
    makeStyles,
    InputLabel,
    IconButton,
    FormControl,
    InputAdornment,
} from '@material-ui/core';
import { Link } from 'react-router-dom';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import InputHooks from './InputsHelper';

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
        '& .MuiFormControl-root':{ width:250, },
        '& .MuiFormControl-root:nth-child(odd)':{ marginRight:'auto',marginBottom:20, },
        '& > .legend':{ padding:'10px 0', margin:'10px 0'},
        '& > .legend:last-child':{ display:'flex', flexBasis:'100%', marginTop:0, },
        [theme.breakpoints.down('xs')]:{
            '& .MuiFormControl-root':{ width:'100%', maxWidth:'unset', },
            '& .MuiInputBase-root:before,& .MuiInputBase-root:after,':{ borderBottomColor:'white', },
            '& .MuiFormLabel-root,& .MuiInputBase-root input,& .MuiIconButton-root':{ color:'white',fontWeight:300 },
            '& > .legend':{
                padding:0,
                margin:'20px 0 0',
                '& .MuiCheckbox-root':{ padding:0,marginRight:10, },
            },
            '& > .legend:last-child':{ margin:'10px 0 0', },
        },
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
}));
const InputWhite = withStyles(theme=>({
    root: {
        [theme.breakpoints.down('xs')]:{
            '& label.MuiFormLabel-root': { color: 'white', fontWeight:300, },
            '& .MuiInput-underline:before, & .MuiInput-underline:after': { borderBottomColor: 'white', },
            '& .MuiInput-input': { color:'white', fontWeight:300, },
        },
    },
}))(TextField);
export default function SignUp(req){
    const classes = useStyles();
    const [ showPass, setShowPass ] = React.useState(null);
    const [ checked, setChecked ] = React.useState(false);
    const { inputProps, isLocked, CurrentValues } = InputHooks();
    return (<Container className={classes.root}>
        <div className={classes.header}>
            <Typography color="primary" variant="h3">Regístrate ahora</Typography>
            <Typography color="primary" variant="subtitle2">
                Completa los campos a continuación.
            </Typography>
        </div>
        <div className={classes.body}>
            <InputWhite {...inputProps('username')} label="Usuario" color="primary" />
            <FormControl>
                <InputLabel htmlFor="input-password">Contraseña</InputLabel>
                <Input { ...inputProps('password') } type={showPass?'text':'password'}
                    endAdornment={
                        <InputAdornment position="end">
                            <IconButton
                            aria-label="toggle password visibility"
                            onClick={()=>setShowPass(!showPass)}>
                                {showPass ? <Visibility /> : <VisibilityOff />}
                            </IconButton>
                        </InputAdornment>} />
            </FormControl>
            <InputWhite {...inputProps('name')} color="primary" label="Nombres" />
            <InputWhite {...inputProps('lastname')} color="primary" label="Apellidos" />
            <InputWhite {...inputProps('cedula')} inputProps={{maxLength:10}} color="primary" label="Cedula" type="number" />
            <InputWhite {...inputProps('age')} color="primary" label="Edad" type="number" />
            <div className="legend">
                <Checkbox color="primary" disableRipple checked={checked} onChange={()=>setChecked(!checked)} inputProps={{ 'aria-label': 'Terms' }} />
                Al continuar acepto las&nbsp;<strong href="#">políticas de uso de datos y privacidad.</strong>
            </div>
            <div className="legend">
                <Button variant="contained" disabled={isLocked()} disableElevation color="primary" className={classes.Button} onClick={()=>req.history.push('/signup-more', CurrentValues)}>
                    <Typography color="inherit" component="span">Continuar</Typography>
                </Button>
            </div>
        </div>
        <Toolbar className={classes.Toolbar}>
            ¿Ya tienes una cuenta? &nbsp; <Typography component={Link} to="/signin">Ingresa</Typography>
        </Toolbar>
    </Container>);
}