import clsx from 'clsx';
import React from 'react'
import { Link } from 'react-router-dom';
import InputHooks from './InputsHelper';
import BrandPNG from '../../dist/images/brand.svg';
import { FiberManualRecord, } from '@material-ui/icons';
import WatermarkDarkIMG from '../../dist/images/watermark-dark.svg';
import {
    Button,
    Toolbar,
    Container,
    TextField,
    Typography,
    makeStyles,
    withStyles,
} from '@material-ui/core'



const useStyles = makeStyles(theme=>({
    root:{
        display:'flex',
        minHeight:'100vh',
        backgroundSize:200,
        backgroundRepeat:'space',
        backgroundColor:`${theme.palette.primary.dark}`,
        backgroundImage:`url(${WatermarkDarkIMG})`,
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
        '& > img':{ maxWidth:200, margin:'30px auto 0', },
        [theme.breakpoints.down('xs')]:{
            backgroundColor:'transparent',
            '& > img':{ margin:'0 auto', },
        },
    },
    header:{
        marginTop:30,
        display:'flex',
        flexWrap:'wrap',
        alignItems:'center',
        '& > span':{ marginLeft:'auto', textDecoration:'underline', fontWeight:100, cursor:'pointer',},
        '& .MuiTypography-subtitle2':{ marginTop:10, fontSize:'1.175rem', fontWeight:'300', },
        [theme.breakpoints.down('xs')]:{
            '& .MuiTypography-subtitle2':{ marginTop:0, fontSize:'.87rem',},
        },
    },
    hasStep:{
        display:'flex',
        flexWrap:'wrap',
        '& .MuiFormControl-root':{ maxWidth:'45%', minWidth:200, },
        '& .MuiFormControl-root:nth-child(odd)':{ marginRight:'auto',marginBottom:20, },
        '&:not(.active)':{ display:'none', },
        '&:last-child':{
            '& .MuiFormControl-root':{ maxWidth:'100%',},
            '& label + .MuiInput-formControl':{marginTop:35,},
        },
        [theme.breakpoints.down('xs')]:{
            '& .MuiFormControl-root':{ maxWidth:'unset', },
        },
    },
    actions:{
        display:'flex',
        textAlign:'center',
        margin:'auto 0',
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


const WelcomeComponent =  withStyles(theme=>({
    root:{
        margin:'auto',
        color:'#FFF',
        borderRadius:20,
        padding:'20px',
        display:'flex',
        flexDirection:'column',
        alignContent:'center',
        justifyContent:'center',
        textAlign:'center',
        backgroundColor:theme.palette.primary.main,
        '& > img':{ maxWidth:200, margin:'0 auto', marginTop:30, },
        '& > .MuiTypography-h5':{ margin:'20px auto', },
        '& > .MuiButton-root':{ margin:'40px auto',color:'#fff' },
        '& > .MuiTypography-subtitle2':{ },
    },
}))(function WelcomeComponent(){
    const classes = useStyles();
    return (<Container maxWidth="xs" className={classes.containerWelcome}>
        <img alt="Brand" src={BrandPNG} className={classes.brand} />
        <Typography variant="h5" color="initial">¡Registro exitoso!</Typography>
        <Typography variant="subtitle2" color="initial">
            Gracias por completar el registro.
        </Typography>
        <Button color="secondary" variant="contained" component={Link} to="/signup">
            <Typography color="inherit" component="span">
                Registrar otra persona
            </Typography>
        </Button>
    </Container>);
});



export default function SignUpMore(req){
    const classes = useStyles();
    const { inputs, inputProps, isLocked, setErrors, resetInputs } = InputHooks(req.location.state);
    const [ activeStep, setActiveStep ] = React.useState(0);
    const [ globalError, setGlobalError ] = React.useState('');
    const [ welcome, setWelcome ] = React.useState(false);
    const handleBack = ()=>{
        if(activeStep===0) req.history.goBack();
        else setActiveStep(n=>n-1);
    };
    const handleSignUp = ()=>{
        return fetch("https://dimelo.vip/dimelo/api/auth/register",{
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
            else{
                fetch("https://dimelo.vip/dimelo/api/auth/logout", {
                    method: 'GET',
                    headers:{
                        "Accept":"application/json",
                        "Content-Type":"application/x-www-form-urlencoded",
                        "Authorization":`Bearer ${data.access_token}`,
                    },
                    redirect: 'follow'
                })
                .then((data)=>{
                    resetInputs(()=>setWelcome(data));
                })
            }
        });
    }
    return (<div className={classes.root}>
        {welcome?(<WelcomeComponent />):(<Container maxWidth="sm" className={classes.container}>
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
                    <InputWhite {...inputProps('address')} label="Direccion" />
                    <InputWhite {...inputProps('reside_municipality')} label="Municipio donde resides" />
                    <InputWhite {...inputProps('commune')} label="Comuna o corregimiento" />
                    <InputWhite {...inputProps('neighborhood')} label="Barrio" />
                    <InputWhite {...inputProps('phone')} label="Telefono fijo" type="number"/>
                    <InputWhite {...inputProps('cell_phone')} label="Celular" type="number" />
                    <InputWhite {...inputProps('email')} label="Correo electrónico" type="email" />
                </div>
                <div className={clsx(classes.hasStep,{active:activeStep===1})}>
                    <InputWhite {...inputProps('voting_municipality')} label="Municipio donde votas" />
                    <InputWhite {...inputProps('voting_point')} label="Puesto de votacion" />
                    <InputWhite {...inputProps('voting_table')} label="Mesa de votacion" />
                </div>
                <div className={clsx(classes.hasStep,{active:activeStep>=2})}>
                    <InputWhite {...inputProps('number_people_legal_age')} label="¿Cuentas personas de su nucleo familiar son mayores de edad?" type="number" />
                    <InputWhite {...inputProps('number_people_accompany_to_vote')} label="¿Con cuantas personas usted cuenta para que nos acompañen en la votacion?" type="number" />
                </div>
            </div>
            {globalError&&(<Toolbar className={classes.footer}>
                <Typography variant="body2">{globalError}</Typography>
            </Toolbar>)}
            <div className={classes.actions}>
                <div className={`active-step-${activeStep}`}> <FiberManualRecord /> <FiberManualRecord /> <FiberManualRecord /> </div>
                { activeStep<2 ? <Button variant="contained" disabled={isLocked(false)} color="primary" onClick={()=>setActiveStep(prev=>prev+1)}>Continuar</Button> : null}
                { activeStep>=2? <Button variant="contained" disabled={isLocked()} color="secondary" onClick={handleSignUp} >
                    <Typography color="inherit" component="span">Registrate</Typography>
                </Button>:null}
            </div>
            <Toolbar className={classes.footer}>
                ¿Ya tienes una cuenta?&nbsp;<Typography component={Link} to="/signin">Ingresa</Typography>
            </Toolbar>        
        </Container>)}
    </div>);

}