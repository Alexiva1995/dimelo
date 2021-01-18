import React from 'react'
import {
    Button,
    Select,
    Toolbar,
    MenuItem,
    Typography,
    makeStyles,
    FormControl,
    FormHelperText,
    CircularProgress,
    Container,
    ClickAwayListener,
    Tooltip,
    IconButton,
} from '@material-ui/core';
import { FiberManualRecord, Info, } from '@material-ui/icons';
import { Link } from 'react-router-dom';

import useInput from '../../utils/useInput'
import geoColombia from '../../utils/location';
import BrandPNG from '../../dist/images/brand.svg';
import WatermarkDarkIMG from '../../dist/images/watermark-dark.svg';



const ucfirst = str=>str.toLowerCase().replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, $1=>$1.toUpperCase());
const Wizard = async ([step, setStep], inputsHooks, request)=>{
    const {
        inputs,
        setInputs,
        setError,
        setLoading,
        firestore,
        hasErrors,
    } = inputsHooks;
    switch(step){
        case 0:
            if(!inputs.cedula.value) return setError('cedula','Se requiere una cédula de identidad');
            setLoading(true);
            const [exists, client] = await Promise.all([
                firestore.collection('users').where('cedula','==',inputs.cedula.value).get(),
                fetch("https://api.misdatos.com.co/api/co/consultarNombres",{
                    method:'POST',
                    redirect:'follow',
                    headers:new Headers({
                        "Authorization":([
                            'pytbdolghyc8ptsuoi9ummmafx3m4fspp6thjaidvzvv59cd',
                            'z1akfvfy9i06900h82qs6y240x485hqmnbrqqrovbjt1rzam',
                            '4bzh3stgicr5ik27x4036jd17z1dytzeqmfit3obw46r34xl',
                        ]).sort(()=>Math.random()-0.5)[0],
                        "Content-Type":"application/x-www-form-urlencoded",
                    }),
                    body:new URLSearchParams({ documentType:"CC", documentNumber:inputs.cedula.value, }),
                }).then(res=>res.ok?res.json():null)
                .then(res=>(res&&res.data)?(res.data.firstName?res.data:null):null)
            ]);
            await setInputs({
                cedula:{ error:!exists.empty?'La cedula ya está registrada':(!client?'Cedula incorrecta':null) },
                name:{value:client?client.firstName:inputs.name.value},
                lastname:{value:client?client.lastName:inputs.lastname.value},
            });
            if(!inputs.cedula.error && inputs.name.value) setStep(p=>p+1);
            setLoading(false);
            break;
        case 1:
            const {username,password,email} = inputs;
            await setInputs({
                username:{ error:!username.value?'Se requiere un nombre de usuario':( username.value.match(/[^a-zA-Z0-9]/gi)?'Solo se admiten caracteres alfanuméricos':null ), },
                password:{ error: !password.value?'Contraseña necesaria':( password.value.length<6?'Debe tener al menos 6 caracteres':null ) },
                email:{ error:!email.value?'Se requiere un correo electrónico':( !email.value.match(/^[\w-.]+@([\w-]+.)+[\w-]{2,4}$/)?'Formato incorrecto':null ) },
            })
            if(!username.error && !password.error && !email.error){
                setLoading(true);
                const finds = await Promise.all([
                    firestore.collection('users').where('username','==', username.value).get(),
                    firestore.collection('users').where('email','==', email.value).get(),
                ]);
                await setInputs({
                    username:{error:!finds[0].empty?'Nombre de usuario en uso':null},
                    email:{error:!finds[1].empty?'Email en uso':null},
                });
                if(!username.error && !email.error){
                    setStep(1);
                    setLoading(false);
                    request.history.replace('/signup-more');
                }
            }
            break;
        case 2:
            await setInputs({
                departamento:{error:!inputs.departamento.value?'Selecciona un departamento':null},
                municipio:{error:!inputs.municipio.value?'Selecciona un municipio':null},
                direccion:{error:(!inputs.direccion.value||inputs.direccion.value.length<6)?'Se debe indicar la direccion':null},
                phone:{error:!inputs.phone.value?'Se requiere numero de teléfono':(
                    inputs.phone.value.match(/\D+/gi)?'Solo se admiten números':null
                )},
                movil:{error:!inputs.movil.value?'Se requiere numero de celular':(
                    inputs.movil.value.match(/\D+/gi)?'Solo se admiten números':null
                )},
            });
            if(!hasErrors('departamento','municipio','direccion','phone','movil'))
                setStep(n=>n+1);
            break;
        case 3:
            await setInputs({
                voting_dep:{error:!inputs.voting_dep.value?'Selecciona un departamento':null},
                voting_mun:{error:!inputs.voting_mun.value?'Selecciona un municipio':null},
                voting_point:{error:(!inputs.voting_point.value)?'¿Cuál es tu puesto de votación?':null},
                voting_table:{error:!inputs.voting_table.value?'¿Cuál es tu mesa de votación?':(
                    inputs.voting_table.value.match(/\D+/gi)?'Solo se admiten números':null
                )},
                voting_leader:{error:!inputs.voting_leader.value?'¿Quién es tu lider?':null},
            });
            if(!hasErrors('voting_dep','voting_mun','voting_point','voting_table','voting_leader'))
                setStep(n=>n+1);
            break;
        case 4:
            await setInputs({
                people_depend:{error:!inputs.people_depend.value?'Te agradecemos una respuesta':null},
                people_join:{error:(!inputs.people_join.value)?'Se requiere una respuesta':null},
            });
            if(!hasErrors('people_depend','people_join')){
                setLoading(true);
                const json = Object.values(inputs).reduce((_, {name,value})=>{
                    _[name]=value;
                    return _;
                },{});
                firestore.collection('users').doc().set(json).then(async ()=>{
                    await setInputs(Object.keys(inputs).reduce((_, k)=>{
                        _[k]={value:'',error:null};
                        return _;
                    },{}));
                    await setLoading(false);
                    await setStep(n=>n+1);
                });
            }
            break;
        default:
            break;
    }
};





const useStyles = makeStyles(theme=>({
    root:{
        width:'100%',
        height:'100%',
        display:'flex',
        padding:'0px 50px',
        flexDirection:'column',
    },
    header:{
        margin:'auto 0',
        '& .MuiTypography-h3':{ fontSize:'2.2rem', },
        '& .MuiTypography-subtitle2':{ fontSize:'1.3rem', margin:'20px 0 10px 0', },
        [theme.breakpoints.down('xs')]:{
            color:'white',
            margin:'90px 0 0',
            '& .MuiTypography-h3':{ _display:'none', color:'white', fontSize:20 },
            '& .MuiTypography-subtitle2':{ color:'inherit',fontSize:16, margin:'0px 0 auto 0',},
        },
    },
    body:{
        margin:'auto',
        alignItems:'center',
        '& [role="tabpanel"]:not([hidden])':{
            display:'flex',
            flexWrap:'wrap',
            '& .MuiFormControl-root':{
                width:250,
                maxWidth:'45%',
                marginBottom:20,
                '&:nth-child(odd)':{ marginRight:'auto', },
                '&:only-child':{ width:250, maxWidth:'99%', margin:'auto', },
            },
            '& > .legend':{
                '& > .MuiCheckbox-root':{ padding:0,marginRight:10, },
                flexGrow: 1,
                marginTop:20,
                display: 'flex',
                alignItems: 'center',
            },
            [theme.breakpoints.down('xs')]:{
                '& .MuiIconButton-root':{ color:'white',fontWeight:300 },
                '& .MuiFormControl-root':{
                    width:'100%',
                    fontWeight:300,
                    maxWidth:'unset',
                    '& .MuiInputBase-root, & label, & input, & .MuiFormHelperText-root':{color:'inherit',fontWeight:'inherit'},
                    '& fieldset':{ borderColor:'white', },
                },
                '& .MuiFormControl-root + .legend':{ margin:'5px auto'},
                '& > .legend':{ display:'block', marginTop:30, },
            },
        },
    },
    actions:{
        width:'100%',
        display:'flex',
        flexDirection:'row',
        alignItems:'center',
        '& span:first-child':{ flexGrow:1, },
        '& .MuiButton-root':{ marginLeft:'auto', },
        '& .MuiTypography-root':{ color:'#fff', fontSize:'1.3em', fontWeight:'lighter', textTransform:'none',},
    },
    Toolbar:{ justifyContent:'center', },
}));
function SignUp(req){
    const classes = useStyles();
    const [step, setStep] = React.useState(0);
    const Mutator = useInput();
    const { inputs, loading, InputField, } = Mutator;
    const Step = ({index,...props})=>(<div
        {...props}
        role="tabpanel"
        hidden={step !== index}
        id={`step-tabpanel-${index}`}
        aria-labelledby={`step-tab-${index}`}
    />);
    return (<div className={classes.root}>
        <div className={classes.header}>
            <Typography color="primary" variant="h3">{
                inputs.name.value ? `¡Hola ${ucfirst(inputs.name.value)}!` : 'Regístrate ahora'
            }</Typography>
            <Typography color="primary" variant="subtitle2">
                {inputs.name.value?'Por favor continúa con el registro...':'Completa los campos a continuación.'}
            </Typography>
        </div>
        <div className={classes.body}>
            <Step index={0}>
                <InputField name="cedula" label='Por favor indica tu cédula' variant="outlined" placeholder="# # # # # # # #" inputProps={{style:{textAlign:'center'}}} />
            </Step>
            <Step index={1}>
                <InputField name="username" label="Crea un nombre de usuario" placeholder={`Ejemplo: ${inputs.name.value.toLowerCase().replace(/\s+/gi,'_')}`} />
                <InputField name="password" label="Crea una contraseña" placeholder="* * * * * * * *" type="password" />
                <InputField name="email" label="Dirección de correo electrónico" placeholder={`${inputs.name.value.toLowerCase().replace(/\s+/gi,'_')}@ejemplo.com`} type="email" />
                <InputField name="age" label="¿Cuál es tu edad?" type="number" />
            </Step>
        </div>
        <div className={classes.actions}>
            {step===0 && (<span>Al continuar aceptas nuestras <strong href="#">políticas de uso de datos y privacidad.</strong></span>)}
            <Button onClick={()=>Wizard([step,setStep], Mutator, req)} color="primary" className={classes.Button} variant="contained" disabled={loading}>
                {loading?<CircularProgress size={20}/>:(<Typography color="inherit" component="span">Continuar</Typography>)}
            </Button>
        </div>
        <Toolbar className={classes.Toolbar}>
            ¿Ya tienes una cuenta? &nbsp; <Typography component={Link} to="/signin">Ingresa</Typography>
        </Toolbar>
    </div>);
}









const useMoreStyles = makeStyles(theme=>({
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
        display:'flex',
        flexWrap:'wrap',
        alignItems:'center',
        margin:'30px 0 auto',
        '& .MuiTypography-h5':{ fontSize:'1.5rem',flexGrow:1, },
        '& > span':{ textDecoration:'underline', fontWeight:100, cursor:'pointer',},
        '& .MuiTypography-subtitle2':{ minWidth:'100%',marginTop:10, fontSize:'1rem', fontWeight:'300', },
    },
    body:{
        margin:'auto',
        alignItems:'center',
        '& [role="tabpanel"]:not([hidden])':{
            display:'flex',
            flexWrap:'wrap',
            '& .MuiFormControl-root':{
                width:250,
                maxWidth:'45%',
                marginBottom:20,
                '& .MuiInputBase-root:not(.Mui-error) fieldset':{ borderColor:'white', },
                '&:nth-child(odd)':{ marginRight:'auto', },
                '&:only-child':{ width:250, maxWidth:'99%', margin:'auto', },
            },
            '& .MuiIconButton-root':{ color:'white',fontWeight:100 },
            ['& .MuiInputBase-root ,& label ,& input'
            +',& .MuiFormHelperText-root:not(.Mui-error)']:{
                color:'inherit',
                fontWeight:100,
            },
            '&:last-child':{
                display:'block',
                '& .MuiFormControl-root':{
                    width:'100%',
                    fontWeight:100,
                    maxWidth:'unset',
                    '& label':{
                        fontSize:'.9rem',
                    },
                },
            },

            [theme.breakpoints.down('xs')]:{
                '& .MuiFormControl-root':{
                    width:'100%',
                    fontWeight:100,
                    maxWidth:'unset',
                },
            },
        },
    },
    actions:{
        display:'flex',
        textAlign:'center',
        marginTop:'auto',
        flexDirection:'column',
        '& .MuiButton-root':{ color:'#fff', marginLeft:'auto', },
        '& .MuiButton-containedPrimary':{backgroundColor:'#1c4f75',},
        '& .MuiSvgIcon-root':{ fontSize:15, },
        '& > .active-step-2':{ '& .MuiSvgIcon-root:nth-child(1)':{color:theme.palette.secondary.main} },
        '& > .active-step-3':{ '& .MuiSvgIcon-root:nth-child(2)':{color:theme.palette.secondary.main} },
        '& > .active-step-4':{ '& .MuiSvgIcon-root:nth-child(3)':{color:theme.palette.secondary.main} },
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
    const classes = useMoreStyles();
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

function SignupMore(req){
    const classes = useMoreStyles();
    const [step, setStep] = React.useState(2);
    const [tooltip, setTooltip] = React.useState(false);
    const Mutator = useInput();
    const {
        inputs,
        loading,
        setInput,
        setInputs,
        InputField,
        firestore,
    } = Mutator;
    const [leaders, setLeaders] = React.useState([]);
    if(!leaders.length)
        firestore.collection('leaders')
            .get().then(snap=>setLeaders(snap.docs.map(l=>l.data().name)));
    const handleBack = ()=>(step===2)?req.history.replace('/signup'):setStep(n=>n-1);
    const handleInfo = ()=>{
        setTooltip(!tooltip);
        if(tooltip) window.open('https://wsp.registraduria.gov.co/censo/consultar/','_blank');
    };
    const Step = ({index,...props})=>(<div
        {...props}
        role="tabpanel"
        hidden={step !== index}
        id={`step-tabpanel-${index}`}
        aria-labelledby={`step-tab-${index}`}
    />);
    if(step>4) return <div className={classes.root} children={<WelcomeComponent />} />;
    return (<div className={classes.root}>
        <Container maxWidth="sm" className={classes.container}>            
            <img alt="Brand" src={BrandPNG} className={classes.brand} />
            <div className={classes.header}>
                <Typography variant="h5" color="initial">{step<4?'Un poco más...':'¡Casi terminamos!'}</Typography>
                <span onClick={handleBack}>Volver</span>
                <Typography variant="subtitle2" color="initial">
                    {step<4?'Completa estos campos para continuar el registro':'Solo faltan estos campos...'}
                </Typography>
            </div>
            <div className={classes.body}>
                <Step index={2}>
                    <FormControl variant="outlined" error={Boolean(inputs.departamento.error)}>
                        <FormHelperText id="label-dep">{inputs.departamento.error || 'Departamento donde resides'}</FormHelperText>
                        <Select labelId="label-dep" value={inputs.departamento.value||'Selecciona'} onChange={({target:{value}})=>setInputs({departamento:{value},municipio:{value:'Selecciona'}})}>
                            {(['Selecciona']).concat(geoColombia.dep.all).map((name,key)=>(
                                <MenuItem key={key} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" error={Boolean(inputs.municipio.error)} disabled={!inputs.departamento.value}>
                        <FormHelperText id="label-mun">{inputs.municipio.error || 'Municipio donde resides'}</FormHelperText>
                        <Select labelId="label-mun" value={inputs.municipio.value || 'Selecciona'} onChange={({target:{value}})=>setInput('municipio',{value})}>
                            {(!inputs.departamento.value?['Selecciona']
                                :geoColombia.dep.getMunOf(inputs.departamento.value)).map((name, key)=>(
                                    <MenuItem key={key} value={name}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <InputField name="comuna" label="Comuna o Corregimiento (Si Aplica)" InputLabelProps={{style:{fontSize:13}}} />
                    <InputField name="direccion" label="Dirección de residencia" />
                    <InputField name="phone" label="Teléfono fijo" type="number" />
                    <InputField name="movil" label="Teléfono celular" type="number" />
                </Step>
                <Step index={3}>
                    <FormControl variant="outlined" error={Boolean(inputs.voting_dep.error)}>
                        <FormHelperText id="label-voting_dep">{inputs.voting_dep.error || 'Departamento donde votas'}</FormHelperText>
                        <Select labelId="label-voting_dep" value={inputs.voting_dep.value||'Selecciona'} onChange={({target:{value}})=>setInputs({voting_dep:{value},voting_mun:{value:'Selecciona'}})}>
                            {(['Selecciona']).concat(geoColombia.dep.all).map((name,key)=>(
                                <MenuItem key={key} value={name}>{name}</MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl variant="outlined" error={Boolean(inputs.voting_mun.error)} disabled={!inputs.voting_dep.value}>
                        <FormHelperText id="label-voting_mun">{inputs.voting_mun.error || 'Municipio donde votas'}</FormHelperText>
                        <Select labelId="label-voting_mun" value={inputs.voting_mun.value || 'Selecciona'} onChange={({target:{value}})=>setInput('voting_mun',{value})}>
                            {(!inputs.voting_dep.value?['Selecciona']
                                :geoColombia.dep.getMunOf(inputs.voting_dep.value)).map((name, key)=>(
                                    <MenuItem key={key} value={name}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                    <InputField name="voting_point" label="Puesto de votación" InputProps={{
                        endAdornment:(<ClickAwayListener onClickAway={()=>setTooltip(false)}>
                            <Tooltip
                                PopperProps={{ disablePortal:true, }}
                                interactive
                                open={tooltip}
                                title={<div>
                                <Typography color="secondary" variant="h6" component="div">IMPORTANTE</Typography>
                                <Typography color="inherit" variant="subtitle2">
                                    Si no tienes clara esta información, haz click de nuevo en este botón para acceder a la página de la Registraduría.
                                </Typography>
                                </div>} arrow placement="top-start">
                              <IconButton onClick={handleInfo} color="inherit" children={<Info />} />
                            </Tooltip>
                        </ClickAwayListener>),
                    }} />
                    <InputField name="voting_table" label="Mesa de votación" type="number" />
                    <FormControl variant="outlined" error={Boolean(inputs.voting_leader.error)} disabled={!leaders.length}>
                        <FormHelperText id="label-mun">{inputs.voting_leader.error || '¿Quién es tu líder?'}</FormHelperText>
                        <Select labelId="label-mun" value={inputs.voting_leader.value || leaders[0] || 'Selecciona'} onChange={({target:{value}})=>setInput('voting_leader',{value})}>
                            {(!leaders.length?['Selecciona']:leaders).map((name, key)=>(
                                <MenuItem key={key} value={name}>{name}</MenuItem>))}
                        </Select>
                    </FormControl>
                </Step>
                <Step index={4}>
                    <InputField name="people_depend" label="¿Cuántas personas de su núcleo familiar son mayores de edad?" type="number" />
                    <InputField name="people_join" label="Número de personas con las que contarías para que nos acompañen en la votación" type="number" />
                </Step>
            </div>
            <div className={classes.actions}>
                <div className={`active-step-${step}`}> <FiberManualRecord /> <FiberManualRecord /> <FiberManualRecord /> </div>
                <Button variant="contained" color={step<4?'primary':'secondary'} onClick={()=>Wizard([step,setStep], Mutator, req)} disabled={loading}>
                    {loading
                    ?<CircularProgress style={{color:'white'}} size={20}/>
                    :(step<4?'Continuar':<Typography color="inherit" component="span" children='Registrate' />)}
                </Button>
            </div>
            <Toolbar className={classes.footer}>
                ¿Ya tienes una cuenta?&nbsp;<Typography component={Link} to="/signin">Ingresa</Typography>
            </Toolbar>            
        </Container>
    </div>);
}

export {
    SignUp,
    SignupMore,
};