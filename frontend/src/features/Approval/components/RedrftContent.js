import React, { useEffect, useState } from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';
import AttendCheckModal from './modals/AttendCheckModal';
import EditAprvLine from './modals/EditAprvLine';
import { fetcher } from '../../../shared/api/fetcher';
import InputForm from './InputForm';

const RedrftContent = ({docFormId, docLine, setDocLine, inputList, setInputList, docLoc, setDocLoc, docEmp, setDocEmp}) => {
    const [isAttendCheckOpen, setIsAttendCheckOpen] = useState(false);
    const [drftDate, setDrftDate] = useState({})
    const [docRole, setDocRole] = useState();

    useEffect(()=>{
        const docStart = inputList.find(v=>v.docInptNm=="docStart")?.docInptVl;
        const docEnd = inputList.find(v=>v.docInptNm=="docEnd")?.docInptVl;
        
        setDrftDate(prev=>{
            return {...prev, docStart:docStart, docEnd:docEnd}
        })
    },[inputList])

    const fn_attendCheck = () => {
        setIsAttendCheckOpen(true)
    }
    const fn_attendCheckClose = () => {
        setIsAttendCheckOpen(false)
    }
    const fn_attendCheckOk = () => {
        setIsAttendCheckOpen(false)
    }

    const [isEditLineOpen, setIsEditLineOpen] = useState(false);
    
    const fn_editLine = () => {
        setIsEditLineOpen(true)
    }
    const fn_editLineClose = () => {
        setIsEditLineOpen(false)
    }
    const fn_editLineOk = (addLine) => {
        setIsEditLineOpen(false)
        // console.log("editOk : ",addLine)
        setDocLine(prev => {

            // REF 개수 계산
            const refCount = prev.filter(v => v.roleCd?.includes("REF")).length;

            // roleSeq 결정
            const roleSeq =
            addLine.roleCd?.includes("REF") ? refCount + 1 : 0;

            return [...prev,
                {
                    roleCd: addLine.roleCd,
                    aprvPrcsEmpId: addLine.empId,
                    roleSeq: roleSeq
                }
            ];
        })
        //docLine
    }


    return (
        <>
            <div> 
                결재선 <Button onClick={fn_editLine}>결재선 추가</Button>
                <ApprovalLine docLine={docLine}/>
                {isEditLineOpen && <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk}/>}
            </div>
            <div>
                <Button type="primary" onClick={fn_attendCheck}>기간 확인</Button>
            </div>
            <div>
                {inputList.map((v, k)=>
                    <div key={k}>
                        <InputForm drftDate={drftDate} setDrftDate={setDrftDate} 
                            inputList={inputList} setInputList={setInputList} inputForm={v} 
                            docLoc={docLoc} setDocLoc={setDocLoc}
                            docEmp={docEmp} setDocEmp={setDocEmp}
                            docRole={docRole} setDocRole={setDocRole}/>
                    </div>
                )}
            </div>


            <div>
                {isAttendCheckOpen && <AttendCheckModal drftDate={drftDate}  
                        onClose={fn_attendCheckClose} onOk={fn_attendCheckOk} />}
            </div>
        </>
    );
};

export default RedrftContent;