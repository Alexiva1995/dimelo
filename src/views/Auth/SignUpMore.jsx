import clsx from 'clsx';
import React from 'react'
import { Link } from 'react-router-dom';
import BrandPNG from '../../dist/images/brand.svg';
import { FiberManualRecord,Info, } from '@material-ui/icons';
import WatermarkDarkIMG from '../../dist/images/watermark-dark.svg';
import {
    Button,
    IconButton,
    Toolbar,
    Container,
    TextField,
    Typography,
    makeStyles,
    Select,
    Tooltip,
    MenuItem,
    InputLabel,
    FormControl,
    CircularProgress,
    ClickAwayListener,
} from '@material-ui/core'
import useHooks from './../../utils/InputsHelper';
import locationHooks from './../../utils/location';



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
        margin:'30px 0 10px',
        display:'flex',
        flexWrap:'wrap',
        alignItems:'center',
        '& > span':{ marginLeft:'auto', textDecoration:'underline', fontWeight:100, cursor:'pointer',},
        '& .MuiTypography-subtitle2':{ marginTop:10, fontSize:'1.175rem', fontWeight:'300', },
        [theme.breakpoints.down('xs')]:{ '& .MuiTypography-subtitle2':{ marginTop:0, fontSize:'.87rem',}, },
    },
    hasStep:{
        display:'flex',
        flexWrap:'wrap',
        '&:not(.active)':{ display:'none', },
        '& .MuiFormControl-root':{
            width:'45%',
            color:'white',
            fontWeight:300,
            '&:nth-child(odd)':{ marginRight:'auto',},
            '& .MuiInputBase-root, & label, & input':{color:'inherit',fontWeight:'inherit'},
            '& .MuiInputBase-root:before,& .MuiInputBase-root:after':{ borderBottomColor:'white', },
        },
        '&:last-child':{
            '& .MuiFormControl-root':{ maxWidth:'100%',},
            '& label + .MuiInput-formControl':{marginTop:35,},
        },
        [theme.breakpoints.down('xs')]:{
            '& .MuiFormControl-root':{
                marginBottom:10,
                width:'100%',
                maxWidth:'unset',
            },
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

    welcome:{
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

}));


function WelcomeComponent(){
    const classes = useStyles();
    return (<Container maxWidth="xs" className={classes.welcome}>
        <img alt="Brand" src={BrandPNG} />
        <Typography variant="h5" color="initial">¡Registro exitoso!</Typography>
        <Typography variant="subtitle2" color="initial">
            Gracias por completar el registro. <br/>
            A tu correo electrónico te llegará una notificación. </Typography>
        <Button color="secondary" variant="contained" component={Link} to="/signup" style={{marginTop:10}}>
            <Typography color="inherit" component="span">
                Registrar otra persona
            </Typography>
        </Button>
    </Container>);
};


export default function SignUpMore(req){
    const classes = useStyles();
    const [ activeStep, setActiveStep ] = React.useState(0);
    const [ welcome, setWelcome ] = React.useState(false);
    const [ tooltip, setTooltip ] = React.useState(false);
    const {
        inputs, setInputs, resetInputs,
        errors, hasError, resetErrors,
        loading, fetchAPI,
        inputProps,
    } = useHooks();
    const handleInfo = ()=>{
        setTooltip(!tooltip);
        if(tooltip) window.open('https://wsp.registraduria.gov.co/censo/consultar/','_blank');
    };
    const GlobalError = Object.values(errors)[0] || null;
    const municipios = locationHooks.dep.getMunOf('antioquia');
    const groups = [
        [ 'address', 'commune', 'neighborhood', 'phone', 'cell_phone', 'email', ],
        [ 'voting_municipality', 'voting_point', 'voting_table', ],
        [ 'number_people_legal_age', 'number_people_accompany_to_vote', ]
    ];
    const handleBack = ()=>(activeStep===0)?req.history.goBack():setActiveStep(n=>n-1);
    const handleSignUp = ()=>fetchAPI('auth/register',{body:inputs}).then(data=>{
        if(data.errors)
            resetErrors(Object.entries(data.errors).reduce((err, [key, values])=>{
                err[key]=values[0];
                return err;
            },{}));
        else fetchAPI("auth/logout", {
                method: 'GET',
                headers:{
                    "Authorization":`Bearer ${data.access_token}`,
                    "Accept":"application/json", "Content-Type":"application/x-www-form-urlencoded",
                },
            }).then(()=>{ setWelcome(data); resetInputs({_o:12}); });
    });
    if(welcome) return (<div className={classes.root}> <WelcomeComponent /> </div>);
    return (<div className={classes.root}>
        <Container maxWidth="sm" className={classes.container}>            
            <img alt="Brand" src={BrandPNG} className={classes.brand} />
            <div className={classes.header}>
                <Typography variant="h5" color="initial">Un poco más...</Typography>
                <span onClick={handleBack}>Volver</span>
                <Typography variant="subtitle2" color="initial">
                    Completa estos campos adicionales para terminar el registro.
                </Typography>
            </div>
            <div className={classes.body}>
                <div className={clsx(classes.hasStep,{active:activeStep===0})}>
                    <TextField {...inputProps('address')} label="Dirección" />
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Municipio donde resides</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={inputs.reside_municipality || municipios[0] }
                            onChange={({target:{value}})=>{
                                resetInputs(p=>({...p, reside_municipality:value, voting_municipality:value, }));
                            }}>
                        {municipios.map((n,k)=>(<MenuItem key={k} value={n}>{n}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <TextField {...inputProps('commune')} label="Comuna o corregimiento" />
                    <TextField {...inputProps('neighborhood')} label="Barrio" />
                    <TextField {...inputProps('phone')} label="Teléfono fijo" type="number"/>
                    <TextField {...inputProps('cell_phone')} label="Celular" type="number" />
                    <TextField {...inputProps('email')} label="Correo Electrónico" type="email" />
                </div>
                <div className={clsx(classes.hasStep,{active:activeStep===1})}>
                    <FormControl>
                        <InputLabel id="demo-simple-select-label">Municipio donde votas</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={inputs.voting_municipality || municipios[0]}
                            onChange={({target:{value}})=>setInputs('voting_municipality', value)}
                        >
                        {municipios.map((n,k)=>(<MenuItem key={k} value={n}>{n}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <TextField {...inputProps('voting_point')} label="Puesto de votación"
                        InputProps={{
                            endAdornment:(<ClickAwayListener onClickAway={()=>setTooltip(false)}>
                                <Tooltip
                                    PopperProps={{
                                        disablePortal:true,
                                    }}
                                    interactive
                                    open={tooltip}
                                    title={<div>
                                    <Typography color="secondary" variant="h6" component="div">IMPORTANTE</Typography>
                                    <Typography color="inherit" variant="subtitle2">
                                        Si no tienes clara esta información, en este enlace puedes acceder a la página de la Registraduría.
                                    </Typography>
                                    </div>} arrow placement="top-start">
                                  <IconButton onClick={handleInfo} color="inherit" children={<Info />} />
                                </Tooltip>
                            </ClickAwayListener>),                            
                        }}
                        />
                    <TextField {...inputProps('voting_table')} label="Mesa de votación" type="number" />
                </div>
                <div className={clsx(classes.hasStep,{active:activeStep>=2})}>
                    <TextField {...inputProps('number_people_legal_age')} label="¿Cuántas personas de su núcleo familiar son mayores de edad?" type="number" />
                    <TextField {...inputProps('number_people_accompany_to_vote')} label="Número de personas con las que usted contaría para que nos acompañen en la votación" type="number" />
                </div>
            </div>
            {GlobalError&&(<Toolbar style={{textAlign:'center'}}>{GlobalError}</Toolbar>)}
            <div className={classes.actions}>
                <div className={`active-step-${activeStep}`}> <FiberManualRecord /> <FiberManualRecord /> <FiberManualRecord /> </div>
                {activeStep<2?(<Button variant="contained" color="primary" onClick={()=>setActiveStep(p=>p+1)} disabled={loading || Boolean(hasError(groups[activeStep]))} >
                    Continuar
                </Button>):null}
                {activeStep>=2?(<Button variant="contained" color='secondary' onClick={handleSignUp} disabled={ loading || Boolean(hasError()) }>
                    {loading?<CircularProgress size={32}/>:(<Typography color="inherit" component="span">Registrate</Typography>)}
                </Button>):null}
            </div>
            <Toolbar className={classes.footer}>
                ¿Ya tienes una cuenta?&nbsp;<Typography component={Link} to="/signin">Ingresa</Typography>
            </Toolbar>            
        </Container>
    </div>);
}