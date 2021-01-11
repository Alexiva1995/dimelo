import React from 'react'

const CurrentValues = {
    inputs:{
        // username:"arcaela99",
        // password:"arcaelas123",
        // name:"Alejandro",
        // lastname:"Reyes",
        // cedula:"26001714-3",
        // age:"25",

        // address:"Venezuela",
        // reside_municipality:"Caroni",
        // commune:"Cachamay",
        // neighborhood:"Orinoco",
        // phone:"02869224896",
        // cell_phone:"04144709840",
        // email:"arcaelareyes@gmail.com",

        // voting_municipality:"Cachamay",
        // voting_point:"Caroni",
        // voting_table:"No lo se",

        // number_people_legal_age:"1",
        // number_people_accompany_to_vote:"1",
    },
    errors:{},
};
export default function InputHooks(InitialValues=null){
    const InputsHelperBackup = InitialValues?InitialValues:CurrentValues;
    const [inputs,_setInputs] = React.useState(InputsHelperBackup.inputs);
    const setInputs = (key, value)=>{InputsHelperBackup.inputs[key]=value;return _setInputs(prev=>({...prev,...InputsHelperBackup.inputs}));};
    const [errors,_setErrors] = React.useState(InputsHelperBackup.errors);
    const setErrors = (key, value)=>{InputsHelperBackup.errors[key]=value;return _setErrors(prev=>({...prev,...InputsHelperBackup.errors}));};
    const requires = [];
    return {
        inputs,
        setInputs,
        resetInputs:_setInputs,
        resetErrors:_setErrors,
        CurrentValues:InputsHelperBackup,
        isLocked:(withEmptys=true)=>{
            const empty = requires.filter(key=>!inputs[key]).length>0;
            const fails = Object.values(errors).filter(e=>e).length>0;
            return withEmptys?(empty||fails):fails;
        },
        inputProps:(key)=>{
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
                            else setErrors(name, null);
                        })
                    }
                },
            };
        },
    };    
}