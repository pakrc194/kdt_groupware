import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/Button';
import CompListModal from './modals/CompListModal';
import { fetcher } from '../../../shared/api/fetcher';
import SelectDeptModal from './modals/SelectDeptModal';
import { getSchedTypeLabel } from '../../../shared/func/formatLabel';

const InputForm = ({drftDate, setDrftDate, inputForm, inputList, setInputList, docLoc, setDocLoc, docRole, setDocRole}) => {
    const [isLocOpen, setIsLocOpen] = useState(false);
    const [locList, setLocList] = useState([]);
    
    const [schedType, setSchedType] = useState();

    const [isSelectDeptOpen, setIsSelectDeptOpen] = useState(false);
    
    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));

    const [selectDeptList, setSelectDeptList] = useState([]);


    const getDeptNamesByIds = (list, ids) => {
        console.log("list :",list)
        console.log("ids : ",ids)

        if (!ids) return "";

        const idArray = String(ids).split(',').map(id => id.trim());

        const names = idArray.map(id => {
            const found = list.find(item => String(item.deptId) === id);
            return found ? found.deptName : null;
        });

        return names.filter(name => name !== null).join(', ');
    };


    useEffect(()=>{
        if (!drftDate?.docStart || !drftDate?.docEnd) return;


        fetcher("/gw/aprv/AprvLocFilterList",{
            method:"POST",
            body:{
                docStart:drftDate.docStart,
                docEnd:drftDate.docEnd
            }
        }).then(res=>{
            console.log("fetch AprvLocList : ", res)
            setLocList(res)
        })

        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptNm == "docLoc") {
                    return {...v, docInptVl: v.docInptRmrk};
                }
                return v;
            })
        )

    },[drftDate?.docStart, drftDate?.docEnd])

    useEffect(() => {
        if (!docRole) return;

        setSelectDeptList([]);
        setInputList(prev =>
            prev.map(v => (
            v.docInptNm === "docSchedType"
                ? { ...v, docInptVl: "" }
                : v
            ))
        );
    }, [docRole]);

    const fn_locClick = () => {
        if(drftDate.docStart!=null && drftDate.docEnd!=null) {
            setIsLocOpen(true);
        } else {
            alert("기간 선택하세요")
        }
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
        
        if (name === "docRole") {
            setDocRole(value);
        }

        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptNm == name) {
                    return {...v, docInptVl: value} ;
                }
                return v;
            })
        )

        if(type=="date") {
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
    const fn_selectDeptOk = (selectDept) => {
        console.log("fn_selectDeptOk", selectDept)
        setSelectDeptList(selectDept);
        let schedType = ""
        setInputList(prev=> 
            prev.map(v=>{
                if(v.docInptNm == "docSchedType") {
                    let deptVal = ""
                    for(let i=0; i<selectDept.length; i++) {
                        deptVal=="" ? deptVal=selectDept[i].deptId : deptVal+=","+selectDept[i].deptId
                        
                    }
                    schedType = deptVal;
                    return {...v, docInptVl: deptVal};
                }
                return v;
            })
        )

        
        console.log("inpt",inputList)


        const docRole = inputList.find(v=>v.docInptNm==="docRole")?.docInptVl;
        const docStart = inputList.find(v=>v.docInptNm==="docStart")?.docInptVl;
        const docEnd = inputList.find(v=>v.docInptNm==="docEnd")?.docInptVl;
        
        
        let drftEmpId=0;
        let deptId = 0;

        let ids = schedType?.includes(',')? schedType.split(',') : [schedType];

        if(docRole==="DEPT") {
            ids = schedType?.includes(',')? schedType.split(',') : [schedType];
            drftEmpId = myInfo.empId;
        } else if(docRole=="COMPANY") {
            drftEmpId = myInfo.drftEmpId;
            ids = [myInfo.drftEmpId]
        }

        console.log("일정확인 ",docRole, schedType, drftEmpId, ids)

        if(drftEmpId==null)
            return;

        if(docRole === "PERSONAL") {
            fetcher("/gw/aprv/AprvEmpAnnlLv", {
                method:"POST",
                body: {
                    role : docRole,
                    ids : ids,
                    deptId: deptId,
                    year:2026
                }
            }).then(res => {
                console.log("fetch AprvEmpAnnlLv",res)
                setAttendList(res)
            })
            
            fetcher("/gw/aprv/AprvDutyScheDtl",{
                    method:"POST",
                    body:{
                        role : docRole,
                        ids : ids,
                        deptId: deptId,
                        docStart:docStart,
                        docEnd:docEnd
                    }
            }).then(res=>{
                setDutyList(res)
            })
            

            fetcher("/gw/aprv/AprvSchedList",{
                method:"POST",
                body:{
                    role : docRole,
                    ids : ids,
                    deptId: deptId,
                    docStart:docStart,
                    docEnd:docEnd
                }
            }).then(res=>{
                console.log("fetch AprvSchedList",res)
                setSchedList(res)
            })
        }


        setIsSelectDeptOpen(false);
    }

    const fn_empClick = () => {
        fetcher(`/gw/aprv/AprvEmpListFilter?filterNm=DEPT_ID&filterVl=2`)
        .then(res=>{

        })
    }

    const FieldWrapper = ({ title, action, children, extra }) => (
        <div className="drft-unit">
            <div className="drft-unit-top">
                <div className="drft-label">{title}</div>
                {action && <div className="drft-unit-action">{action}</div>}
            </div>
            <div className="drft-control">{children}</div>
            {extra && <div className="drft-unit-extra">{extra}</div>}
        </div>
    );

    const label = inputForm?.docInptLbl || "";
    const type = inputForm?.docInptType;

    switch (type) {
        case "TEXTAREA":
            return (
                <FieldWrapper title={label}>
                    <textarea
                        className="drft-textarea"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                        rows={4}
                    />
                </FieldWrapper>
            );

        case "SELECT":
            const options = (inputForm?.docInptRmrk ? String(inputForm.docInptRmrk) : "")
                .split(",")
                .map((v) => v.trim())
                .filter(Boolean);

            return (
                <FieldWrapper title={label}>
                    <select
                        className="drft-select"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                    >
                        <option value="" disabled>선택</option>
                        {options.map((v, k) => (
                            <option key={k} value={v}>{getSchedTypeLabel(v)}</option>
                        ))}
                    </select>
                </FieldWrapper>
            );

        case "DATE":
            return (
                <FieldWrapper title={label}>
                    <input
                        className="drft-input"
                        type="date"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                    />
                </FieldWrapper>
            );

        case "LOCATION": {
            const locId = inputForm?.docInptRmrk;
            return (
                <FieldWrapper
                    title={label}
                    action={!locId && <Button variant="primary" onClick={fn_locClick}>장소 선택</Button>}
                    extra={isLocOpen && (
                        <CompListModal
                            onClose={fn_locClose}
                            onOk={fn_locOk}
                            itemList={locList}
                            itemNm={"locNm"}
                            title={"선택"}
                            okMsg={"불러오기"}
                        />
                    )}
                >
                    <input className="drft-input" value={docLoc?.locNm || ""} readOnly />
                </FieldWrapper>
            );
        }

        case "CHECKBOX": {
            if (!docRole || docRole === "COMPANY") return null;
            
            const hasWarn = (attendList?.length > 0) || (schedList?.length > 0);

            return (
                <FieldWrapper
                    title={label}
                    action={<Button variant="primary" onClick={fn_selectDeptClick}>담당자 선택</Button>}
                    extra={
                        <>
                            {isSelectDeptOpen && (
                                <SelectDeptModal
                                    onClose={fn_selectDeptClose}
                                    onOk={fn_selectDeptOk}
                                    schedType={docRole}
                                    selectDeptList = {selectDeptList}
                                    title={"선택"}
                                    okMsg={"불러오기"}
                                />
                            )}
                            {hasWarn && (
                                <div className="warnBox">
                                    <div className="warnTitle">경고</div>
                                    {attendList?.length > 0 && (
                                        <div className="warnSection">
                                            <div className="warnSectionTitle">근태</div>
                                            {attendList.map((att, k) => (
                                                <div className="warnItem" key={k}>
                                                    <div className="warnItemTitle">{att.empNm} 연차</div>
                                                    <div className="warnItemBody">{att.remLv}/{att.occrrLv}</div>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                    {schedList?.length > 0 && (
                                        <div className="warnSection">
                                            <div className="warnSectionTitle">일정</div>
                                            {schedList.map((group, k) => (
                                                <div key={k} className="warnGroup">
                                                    {Array.isArray(group) && group.map((s, kk) => (
                                                        <div className="warnItem" key={kk}>
                                                            {s.empNm} / {s.schedTitle} / {s.schedStartDate?.substring(0, 10)}~{s.schedEndDate?.substring(0, 10)}
                                                        </div>
                                                    ))}
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </>
                    }
                >
                <input className="drft-input" name={inputForm.docInptNm} value={
                    getDeptNamesByIds(selectDeptList, inputForm.docInptVl) || ""} readOnly />
                </FieldWrapper>
            );
        }

        default: // 일반 TEXT
            return (
                <FieldWrapper title={label}>
                    <input
                        className="drft-input"
                        type="text"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                    />
                </FieldWrapper>
            );
    }
}
export default InputForm;
