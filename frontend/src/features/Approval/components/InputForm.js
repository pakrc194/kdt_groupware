import React, { useEffect, useState } from 'react';

const InputForm = ({drftDate, setDrftDate, inputForm, setInputList}) => {
    
    const fn_change = (e)=>{
        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptLbl == e.target.name) {
                    return {...v, docInptVl: e.target.value} ;
                }
                return v;
            })
        )
        
        //console.log(inputForm)
        
        //inputForm["value"]=e.target.value;

        
        if(e.target.type=="date") {
            console.log("changeDate",e.target.name,":",e.target.value);
            let targetName = "drftStart"
            if(e.target.name.includes("종료")) {
                targetName = "drftEnd"
            }

             setDrftDate(prev => ({
                ...prev,
                [targetName]: e.target.value
            }));
        }
    }

    switch(inputForm.docInptType) {
        case 'SELECT' :
            return (
                <>
                    {inputForm.docInptLbl}<select name={inputForm.docInptLbl} value={inputForm.docInptVl ||""} onChange={fn_change}>
                        {inputForm.docInptRmrk.split(',').map((v, k)=><option key={k} value={v}>{v}</option>)}
                    </select>
                </>
            )
        case 'DATE' :
            return (
                <>
                    {inputForm.docInptLbl}<input name={inputForm.docInptLbl} type={inputForm.docInptType} value={inputForm.docInptVl||""} onChange={fn_change}/>
                </>
            )
        default : 
            return (
                <>
                    {inputForm.docInptLbl}<input name={inputForm.docInptLbl} type={inputForm.docInptType} value={inputForm.docInptVl||""} onChange={fn_change}/>
                </>
            )
    }
};

export default InputForm;