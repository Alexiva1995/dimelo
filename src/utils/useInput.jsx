import React from 'react'
import { merge } from 'lodash';
import firebase from '../config/firebase'
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';


let Inputs = {
    cedula:{name:'cedula', value:'', error:null,unique:true, },
    name:{name:'name', value:'', error:null, },
    lastname:{name:'lastname', value:'', error:null, },

    username:{name:'username', value:'', error:null,unique:true, },
    password:{name:'password', value:'', error:null, },
    email:{name:'email', value:'', error:null,unique:true, },
    age:{name:'age', value:'', error:null, },

    departamento:{name:'departamento', value:'', error:null, },
    municipio:{name:'municipio', value:'', error:null, },
    comuna:{name:'comuna', value:'', error:null, },
    direccion:{name:'direccion', value:'', error:null, },
    phone:{name:'phone', value:'', error:null, },
    movil:{name:'movil', value:'', error:null, },


    voting_dep:{name:'voting_dep', value:'', error:null, },
    voting_mun:{name:'voting_mun', value:'', error:null, },
    voting_point:{name:'voting_point', value:'', error:null, },
    voting_table:{name:'voting_table', value:'', error:null, },
    voting_leader:{name:'voting_leader', value:'', error:null, },

    people_depend:{name:'people_depend', value:'', error:null, },
    people_join:{name:'people_join', value:'', error:null, },
};



export default function useInput(){
    const [inputs, _reset] = React.useState(Inputs);
    const [loading, setLoading] = React.useState(false);
    const setInputs = newObject=>_reset({...(Inputs=merge(Inputs, newObject))});
    const setInput = (key, newObject)=>setInputs({[key]:newObject});
    const setError = (key,error)=>setInput(key,{error});
    const unsetError = (key)=>setError(key,null);
    const ErrorsOf = (..._keys)=>{
        const keys = _keys.flat();
        return Object.entries(inputs).reduce((_, [key, {error}])=>(
            ((!keys.length || keys.indexOf(key)>-1)&&error)?_.concat(error):_
        ),[])
    };
    const hasLoad = (promise)=>{
        setLoading(true);
        return promise.then(e=>{
            setLoading(false);
            return e;
        });
    };
    return {
        inputs,
        setInput,
        loading,
        setLoading,
        setError,
        unsetError,
        setInputs,
        ErrorsOf,
        hasLoad,
        firestore:firebase.app('firestore').firestore(),
        hasErrors:(..._keys)=>Boolean(ErrorsOf(..._keys).length>0),
        InputField:({type='text',InputProps={}, onChange=()=>{},...props})=>{
            const input = inputs[props.name];
            const [showPass,setShowPass] = React.useState(false);
            input.ref = input.ref || React.createRef();
            props.error = Boolean(input.error);
            props.helperText = input.error||'';
            props.onChange = ({target:{value}})=>{
                input.value=value;
                return onChange(input.value);
            };
            if(type==='password'){
                InputProps.endAdornment = (<InputAdornment position="end"
                    children={<IconButton
                        aria-label="toggle password visibility"
                        onClick={()=>setShowPass(!showPass)}
                        children={showPass?<Visibility/>:<VisibilityOff/>}
                    />} />);
                    props.inputProps = merge((props.inputProps||{}), {
                        style:{ textAlign:'center', },
                    });
            }
            return <TextField variant="outlined" {...props} InputProps={InputProps} type={showPass?'text':type} defaultValue={input.value} />
        },
    };
}