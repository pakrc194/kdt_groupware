import React, { useEffect, useState } from 'react';

const InputForm = ({inputForm}) => {
    const [inputData, setInputData] = useState("");

    useEffect(()=>{
        let dbDate = inputForm.value.toString();
        if(inputForm.type==="DATE") {
            dbDate = `${dbDate.substring(0,4)}-${dbDate.substring(4,6)}-${dbDate.substring(6,8)}`;
        }
        setInputData(dbDate)
    },[])

    const fn_change = (e)=>{
        setInputData(e.target.value)
    }

    switch(inputForm.type) {
        case 'SELECT' :
            return (
                <>
                    {inputForm.label}<select value={inputData} onChange={fn_change}>
                        {inputForm.option.split(',').map((v, k)=><option key={k} value={v}>{v}</option>)}
                    </select>
                </>
            )
        case 'DATE' :
            return (
                <>
                    {inputForm.label}<input type={inputForm.type} value={inputData} onChange={fn_change}/>
                </>
            )
        default : 
            return (
                <>
                    {inputForm.label}<input type={inputForm.type} value={inputData} onChange={fn_change}/>
                </>
            )
    }
};

export default InputForm;