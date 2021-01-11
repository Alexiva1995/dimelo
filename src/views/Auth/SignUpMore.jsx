import React from 'react'
import clsx from 'clsx';
import {
    Button,
    Toolbar,
    Container,
    TextField,
    Typography,
    makeStyles,
    withStyles,
} from '@material-ui/core'
import WatermarkIMG from '../../dist/images/watermark.svg';
import BrandPNG from '../../dist/images/brand.svg';
import { Link } from 'react-router-dom';
import {
    FiberManualRecord,
} from '@material-ui/icons';
import { InputHooks } from './SignUp';



const useStyles = makeStyles(theme=>({
    root:{
        display:'flex',
        minHeight:'100vh',
        backgroundColor:`${theme.palette.primary.dark}`,
        backgroundImage:`url(${WatermarkIMG})`,
        backgroundSize:200,
        backgroundRepeat:'space',
        '& a':{textDecoration:'none', color:'inherit'},
    },
    container:{
        color:'#FFF',
        display:'flex',
        borderRadius:20,
        margin:'20px auto',
        padding:'0 50px',
        flexDirection:'column',
        justifyContent:'flex-start',
        backgroundColor:theme.palette.primary.main,
        '& > img':{ maxWidth:200, margin:'0 auto', marginTop:30, },
    },
    header:{
        marginTop:30,
        display:'flex',
        flexWrap:'wrap',
        alignItems:'center',
        '& > span':{ marginLeft:'auto', textDecoration:'underline', fontWeight:100, cursor:'pointer',},
        '& .MuiTypography-subtitle2':{
            marginTop:10,
            fontSize:'1.175rem',
            fontWeight:'300',
        },
    },
    body:{ margin:'auto 0', _marginTop:30, },
    hasStep:{
        display:'flex',
        flexWrap:'wrap',
        '& .MuiFormControl-root':{ maxWidth:'45%', minWidth:200, },
        '& .MuiFormControl-root:nth-child(odd)':{ marginRight:'auto',marginBottom:20, },
        '& > .legend':{ display:'flex', flexBasis:'100%', padding:'10px 0', marginBottom:10, },
        '&:not(.active)':{ display:'none', },
        '&:last-child':{ 
            '& .MuiFormControl-root':{ maxWidth:'unset', minWidth:200, },
            
        },
    },
    actions:{
        display:'flex',
        textAlign:'center',
        flexDirection:'column',
        '& .MuiButton-root':{ color:'#fff', marginLeft:'auto', },
        '& .MuiButton-containedPrimary':{backgroundColor:'#1c4f75',},
        '& .MuiSvgIcon-root':{ fontSize:15, },
        '& > .active-step-0':{ '& .MuiSvgIcon-root:nth-child(1)':{color:theme.palette.secondary.main} },
        '& > .active-step-1':{ '& .MuiSvgIcon-root:nth-child(2)':{color:theme.palette.secondary.main} },
        '& > .active-step-2':{ '& .MuiSvgIcon-root:nth-child(3)':{color:theme.palette.secondary.main} },
    },
    footer:{
        width:'100%',
        fontWeight:'300',
        justifyContent:'center',
    },
}));

const InputWhite = withStyles({
  root: {
    '& label.MuiFormLabel-root': { color: 'white', fontWeight:300, },
    '& .MuiInput-underline:before, & .MuiInput-underline:after': { borderBottomColor: 'white', },
    '& .MuiInput-input': { color:'white', fontWeight:300, },
  },
})(TextField);


export default function SignUpMore(req){
    const classes = useStyles();
    const { inputs, inputProps, validate, setErrors } = InputHooks();
    const [ activeStep, setActiveStep ] = React.useState(0);
    const [ globalError, setGlobalError ] = React.useState('');

    const handleBack = ()=>{
        if(activeStep===0) req.history.goBack();
        else setActiveStep(n=>n-1);
    };
    const handleSignUp = ()=>{
        return fetch("http://dimelo.vip/dimelo/api/auth/register",{
            headers:new Headers({
                "Accept":"application/json",
                "Content-Type":"application/json",
            }),
            method: 'POST',
            body: JSON.stringify(inputs),
            redirect: 'follow',
        }).then(response => response.json()).then((data)=>{
            if(data.errors){
                setGlobalError(data.message);
                Object.keys(data.errors).forEach(key=>setErrors(key, data.errors[key][0]));
            }
        });
    };
    return (<div className={classes.root}>
        <Container maxWidth="sm" className={classes.container}>
            <img alt="Brand" src={BrandPNG} className={classes.brand} />
            <div className={classes.header}>
                <Typography variant="h5" color="initial">Un poco mas...</Typography>
                <span onClick={handleBack}>Volver</span>
                <Typography variant="subtitle2" color="initial">
                    Completa estos campos adicionales para terminar el registro.
                </Typography>
            </div>
            <div className={classes.body}>
                <div className={clsx(classes.hasStep,{active:activeStep===0})}>
                    <InputWhite {...inputProps('address')} fullWidth id="input-address" label="Direccion" />
                    <InputWhite {...inputProps('reside_municipality')} fullWidth id="input-address" label="Municipio donde resides" />
                    <InputWhite {...inputProps('commune')} fullWidth id="input-address" label="Comuna o corregimiento" />
                    <InputWhite {...inputProps('neighborhood')} fullWidth id="input-address" label="Barrio" />
                    <InputWhite {...inputProps('phone')} fullWidth id="input-address" label="Telefono fijo" type="number"/>
                    <InputWhite {...inputProps('cell_phone')} fullWidth id="input-address" label="Celular" type="number" />
                    <InputWhite {...inputProps('email')} fullWidth id="input-address" label="Correo electrónico" type="email" />
                </div>
                <div className={clsx(classes.hasStep,{active:activeStep===1})}>
                    <InputWhite {...inputProps('voting_municipality')} fullWidth id="input-address" label="Municipio donde votas" />
                    <InputWhite {...inputProps('voting_point')} fullWidth id="input-address" label="Puesto de votacion" />
                    <InputWhite {...inputProps('voting_table')} fullWidth id="input-address" label="Mesa de votacion" />
                </div>
                <div className={clsx(classes.hasStep,{active:activeStep>=2})}>
                    <InputWhite {...inputProps('number_people_legal_age')} fullWidth id="input-address" label="¿Cuentas personas de su nucleo familiar son mayores de edad?" type="number" />
                    <InputWhite {...inputProps('number_people_accompany_to_vote')} fullWidth id="input-address" label="¿Con cuantas personas usted cuenta para que nos acompañen en la votacion?" type="number" inputProps={{style:{marginTop:15}}} />
                </div>
            </div>
            {globalError&&(<Toolbar className={classes.footer}>
                <Typography variant="body2">{globalError}</Typography>
            </Toolbar>)}
            <div className={classes.actions}>
                <div className={`active-step-${activeStep}`}> <FiberManualRecord /> <FiberManualRecord /> <FiberManualRecord /> </div>
                { activeStep<2 ? <Button variant="contained" disabled={validate(false)} color="primary" onClick={()=>setActiveStep(prev=>prev+1)}>Continuar</Button> : null}
                { activeStep>=2? <Button variant="contained" disabled={validate()} color="secondary" onClick={handleSignUp} >
                    <Typography color="inherit" component="span">Registrate</Typography>
                </Button>:null}
            </div>
            <Toolbar className={classes.footer}>
                ¿Ya tienes una cuenta?&nbsp;<Typography component={Link} to="/signin">Ingresa</Typography>
            </Toolbar>        
        </Container>
    </div>);

}