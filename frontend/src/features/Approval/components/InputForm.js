import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/Button';
import CompListModal from './modals/CompListModal';
import { fetcher } from '../../../shared/api/fetcher';
import SelectDeptModal from './modals/SelectDeptModal';

const InputForm = ({drftDate, setDrftDate, inputForm, setInputList, docLoc, setDocLoc}) => {
    const [isLocOpen, setIsLocOpen] = useState(false);
    const [locList, setLocList] = useState([]);
    
    const [isSelectDeptOpen, setIsSelectDeptOpen] = useState(false);
    

    useEffect(()=>{
        //console.log("InputForm type : ",inputForm.docInptType)

    },[])

    const fn_locClick = () => {
        fetcher("/gw/aprv/AprvLocList",{
            method:"POST",
            body:{
                docStart:drftDate.docStart,
                docEnd:drftDate.docEnd
            }
        }).then(res=>{
            console.log("fetch AprvLocList : ", res)
            setLocList(res)

            setIsLocOpen(true);
        })

    }
    const fn_locClose = () => {
        setIsLocOpen(false);
    }
    const fn_locOk = (item) => {
        setIsLocOpen(false);
        setDocLoc(prev=>{
            return {...prev, locId:item.locId, locNm:item.locNm}
        })

        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptNm == "docLoc") {
                    return {...v, docInptVl: item.locId} ;
                }
                return v;
            })
        )

        //console.log("fn_locOk ", docLoc)
    }


    const fn_change = (e)=>{
        const {type, name, value, checked} = e.currentTarget;
        console.log(type, name, value, checked)
        
        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptNm == name) {
                    return {...v, docInptVl: value} ;
                }
                return v;
            })
        )

        if(type=="date") {
            console.log("dd")
            setDrftDate(prev=>{ 
                return {...prev, [`${name}`]: value} ;
            })
        }
    }

    const fn_selectDeptClick = () => {
        setIsSelectDeptOpen(true);
    }
    const fn_selectDeptClose = () => {
        setIsSelectDeptOpen(false);
    }
    const fn_selectDeptOk = (isCompany, selectDept) => {
        console.log("fn_selectDeptOk", selectDept)
        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptNm == "docSchedType") {
                    if(isCompany) {
                        return {...v, docInptVl: "company"};
                    } else {
                        let deptVal = ""
                        for(let i=0; i<selectDept.length; i++) {
                            deptVal=="" ? deptVal=selectDept[i].deptId : deptVal+=","+selectDept[i].deptId
                        }
                        return {...v, docInptVl: deptVal};
                    }
                }
                return v;
            })
        )
        setIsSelectDeptOpen(false);
    }


    switch(inputForm.docInptType) {
        case 'SELECT' :
            return (
                <>
                    {inputForm.docInptLbl}<select name={inputForm.docInptNm} value={inputForm.docInptVl ||""} onChange={fn_change}>
                        <option value="" disabled>선택</option>
                        {inputForm.docInptRmrk.split(',').map((v, k)=><option key={k} value={v}>{v}</option>)}
                    </select>
                </>
            )
        case 'RADIO' :
            return (
                <>
                    <div>일정 공유
                        <input type="text" name="docSchedType" value={inputForm.docInptVl || ""} readOnly/>
                        <Button variant="primary" onClick={fn_selectDeptClick}>범위 선택</Button>
                        {isSelectDeptOpen && 
                            <SelectDeptModal onClose={fn_selectDeptClose} onOk={fn_selectDeptOk}
                                title={"선택"} okMsg={"불러오기"}/>}
                    </div>
                </>
            )
        case 'DATE' :
            return (
                <>
                    {inputForm.docInptLbl}<input name={inputForm.docInptNm} type={inputForm.docInptType} value={inputForm.docInptVl||""} onChange={fn_change}/>
                </>
            )
        case 'TEXTAREA' :
            return (
                <>
                    {inputForm.docInptLbl}<br/>
                    <textarea name={inputForm.docInptNm} type={inputForm.docInptType} value={inputForm.docInptVl||""} onChange={fn_change}/>
                </>
            )
        case 'LOCATION' :
            return (
                <>
                    <div>장소
                        <input type="text" name="docTitle" value={docLoc.locNm} readOnly/>
                        <Button variant="primary" onClick={fn_locClick}>장소 선택</Button>
                        {isLocOpen && 
                            <CompListModal onClose={fn_locClose} onOk={fn_locOk} itemList={locList} 
                                itemNm={"locNm"} title={"선택"} okMsg={"불러오기"}/>}
                    </div>
                </>
            )
        default : 
            return (
                <>
                    {inputForm.docInptLbl}<input name={inputForm.docInptNm} type={inputForm.docInptType} value={inputForm.docInptVl||""} onChange={fn_change}/>
                </>
            )
    }
};

export default InputForm;