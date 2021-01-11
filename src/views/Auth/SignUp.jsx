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



const InputsHelperBackup = {
    inputs:{
        username:'arcaela',
        password:'arcaelas123',
        name:'Alejandro',
        lastname:'Reyes',
        cedula:"26001714",
        age:"25",

        address:'Venezuela',
        reside_municipality:'Caroni',
        commune:'Cachamay',
        neighborhood:'Orinoco',
        phone:'02869224896',
        cell_phone:'04144709840',
        email:'arcaela12@gmail.com',

        voting_municipality:'Cachamay',
        voting_point:'Caroni',
        voting_table:'No lo se',

        number_people_legal_age:"1",
        number_people_accompany_to_vote:"1",
    },
    errors:{},
};
function InputHooks(){
    const [inputs,_setInputs] = React.useState(InputsHelperBackup.inputs);
    const setInputs = (key, value)=>{InputsHelperBackup.inputs[key]=value;return _setInputs(prev=>({...prev,...InputsHelperBackup.inputs}));};
    const [errors,_setErrors] = React.useState(InputsHelperBackup.errors);
    const setErrors = (key, value)=>{InputsHelperBackup.errors[key]=value;return _setErrors(prev=>({...prev,...InputsHelperBackup.errors}));};
    const requires = [];
    const inputProps = (key)=>{
        requires.push(key);
        return {
            name:key,
            required:true,
            fullWidth:true,
            id:`input-${key}`,
            defaultValue:inputs[key],
            error:Boolean(errors[key]),
            ...(key!=='password'?{helperText:errors[key]}:{}),
            onChange:({target:{name, value}})=>setInputs(name, value),
            onBlur:({target:{name, value}})=>{
                if((['email','username','cedula']).indexOf(name)>=0){
                    setErrors(name, null);
                    fetch(`https://dimelo.vip/dimelo/api/auth/chek-${name}`, {
                        method: 'POST',
                        redirect: 'follow',
                        body: JSON.stringify(inputs),
                        headers: new Headers({ "Accept":"application/json", "Content-Type":"application/json" }),
                    })
                    .then(response => response.json(),err=>({...err,_error:true}))
                    .then((data)=>{
                        if(data._error || (data.message && data.message.indexOf('navailable')>=0))
                            setErrors(name, data.message);
                    })
                }
            },
        };
    };
    const validate = (onlyErrors=false)=>{
        const empty = requires.filter(e=>!(e in inputs)).length>0;
        const fails = Object.values(errors).filter(e=>e).length>0;
        return onlyErrors?!fails:(!fails&&!empty);
    };
    return {
        inputs,
        setInputs,
        errors,
        setErrors,
        validate,
        inputProps,
    };
}


export { InputHooks };
export default function SignUp(req){
    const { inputs, inputProps, validate } = InputHooks();
    const classes = useStyles();
    const [ showPass, setShowPass ] = React.useState(null);
    return (<Container className={classes.root}>
        <div className={classes.header}>
            <Typography color="primary" variant="h3">Regístrate ahora</Typography>
            <Typography color="primary" variant="subtitle2">
                Completa los campos a continuación.
            </Typography>
        </div>
        <div className={classes.body}>
            <TextField {...inputProps('username')} label="Usuario" color="primary" />
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
            <TextField {...inputProps('name')} color="primary" label="Nombres" />
            <TextField {...inputProps('lastname')} color="primary" label="Apellidos" />
            <TextField {...inputProps('cedula')} inputProps={{maxLength:10}} color="primary" label="Cedula" type="number" />
            <TextField {...inputProps('age')} color="primary" label="Edad" type="number" />
            <div className="legend">
                Al continuar acepto las&nbsp;<strong href="#">políticas de uso de datos y privacidad.</strong>
            </div>
            <div className="legend">
                <Button variant="contained" disabled={validate()} disableElevation color="primary" className={classes.Button} onClick={()=>req.history.push('/signup-more', inputs)}>
                    <Typography color="inherit" component="span">Continuar</Typography>
                </Button>
            </div>
        </div>
        <Toolbar className={classes.Toolbar}>
            ¿Ya tienes una cuenta? &nbsp; <Typography component={Link} to="/signin">Ingresa</Typography>
        </Toolbar>
    </Container>);
}