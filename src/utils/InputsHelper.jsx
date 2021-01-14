import React from 'react'
import locationHelper from './location'
const CurrentValues = {
    inputs:{},
    errors:{},
    verifiable:['cedula','username','email'],
    inputsName:[
        'username',
        'password',
        'name',
        'lastname',
        'cedula',
        'age',
        'address',
        // 'commune',
        'neighborhood',
        'phone',
        'cell_phone',
        'email',
        'voting_point',
        'voting_table',
        'number_people_legal_age',
        'number_people_accompany_to_vote',
    ],
};


function useHooks(){
    const [loading, setLoading] = React.useState(false);
    const [inputs,resetInputs] = React.useState(CurrentValues.inputs);
    const setInputs = (key, value)=>{CurrentValues.inputs[key]=value;resetInputs(prev=>({...prev,...CurrentValues.inputs})); return value;};
    const [errors,resetErrors] = React.useState(CurrentValues.errors);
    const setErrors = (key, value)=>{CurrentValues.errors[key]=value;resetErrors(prev=>({...prev,...CurrentValues.errors})); return value;};
    const fetchAPI = function fetchAPI(apiName, {body,method='POST',...props}){
        setLoading(true);
        return fetch(`https://dimelo.vip/dimelo/api/${apiName.replace(/\/+/gi,'/')}`,{
            method,
            redirect: 'follow',
            headers: new Headers({ "Accept":"application/json", "Content-Type":"application/json" }),
            [method.toLowerCase()==='post'?'body':'data']:JSON.stringify(body),
            ...props,
        })
        .then(res=>res.json())
        .finally(()=>setLoading(false))
    };
    const LoadName = CC=>{
        const key = ([
            'pytbdolghyc8ptsuoi9ummmafx3m4fspp6thjaidvzvv59cd',
            'z1akfvfy9i06900h82qs6y240x485hqmnbrqqrovbjt1rzam',
            '4bzh3stgicr5ik27x4036jd17z1dytzeqmfit3obw46r34xl',
        ])[Math.round(Math.random()*(3-1)+1)-1];
        return fetch("https://api.misdatos.com.co/api/co/consultarNombres", {
            method:'POST',
            redirect:'follow',
            headers:new Headers({
                "Authorization":key,
                "Content-Type":"application/x-www-form-urlencoded",
            }),
            body:new URLSearchParams({ documentType:"CC", documentNumber:CC, }),
        })
        .then((res)=>res.ok?res.json():null)
        .then(data=>data?data.data:null);
    };

    return {
        inputs,
        errors,
        loading,
        fetchAPI,
        setInputs,
        setErrors,
        setLoading,
        resetInputs:(value)=>resetInputs(CurrentValues.inputs=value),
        resetErrors:(value)=>resetErrors(CurrentValues.errors=value),
        locationHelper,
        validate(...keys){
            return Boolean((keys.length?keys:CurrentValues.inputsName)
            .flat().filter(name=>(errors[name] || !inputs[name])).length===0);
        },
        hasError(...keys){
            const key = (keys.length?keys:CurrentValues.inputsName).flat()
            .filter(name=>(errors[name] || !inputs[name]));
            return key.length ? key : false;
        },
        
        inputProps:key=>({
            name:key,
            id:`input-${key}`,
            defaultValue:inputs[key],
            error:Boolean(errors[key]),
            ...((['voting_point','commune']).indexOf(key)<0?{helperText:errors[key]}:{}),
            onChange({target:{name, value}}){
                let error = null;
                if(!value.trim()) error = `Se requiere ${name}`;
                else if(CurrentValues.verifiable.indexOf(name)>=0){
                    if(name==='cedula'&&(value.length<6||value.length>10||value.match(/[^0-9]/gi)))
                        error = 'Debe tener de 6 y 10 caracteres numericos.';
                }
                setErrors(name, error);
                setInputs(name, value);
            },
            onBlur:({target:{name}})=>{
                const error = errors[name];
                if(CurrentValues.verifiable.indexOf(name)>=0){
                    setErrors(name, 'Verificando...');
                    fetchAPI(`auth/chek-${name}`,{ body:inputs })
                    .then(response=>{
                        if(!response.status) setErrors(name, `${name} ya está en el registro.`);
                        else if(name!=='cedula') setErrors(name, error);
                        LoadName(inputs.cedula)
                        .then(client=>{
                            resetInputs(p=>({
                                ...p,
                                name:client?client.firstName:'',
                                lastname:client?client.lastName:'',
                            }))
                            document.getElementById('input-name').value = client?client.firstName:(inputs.name || '');
                            document.getElementById('input-lastname').value = client?client.lastName:(inputs.lastname || '');
                        }).finally(()=>setErrors(name, null))
                    });
                }
            },
        }),
    };
};
export default useHooks;
export { CurrentValues, }