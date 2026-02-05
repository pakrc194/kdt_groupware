import React, { useEffect, useState } from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';
import AttendCheckModal from './modals/AttendCheckModal';
import EditAprvLine from './modals/EditAprvLine';
import { fetcher } from '../../../shared/api/fetcher';
import InputForm from './InputForm';

const AttendanceContent = ({docFormId, docLine, setDocLine, inputList, setInputList}) => {
    const [isAttendCheckOpen, setIsAttendCheckOpen] = useState(false);
    const [drftDate, setDrftDate] = useState({})

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
        console.log("editOk : ",addLine)
        setDocLine(prev => {
            return [...prev, {roleCd:addLine.roleCd, aprvPrcsEmpId:addLine.empId}]
        })

        //docLine
    }


    useEffect(()=> {
        fetcher(`/gw/aprv/AprvDocInpt/${docFormId}`).then(setInputList)
    },[docFormId])


    return (
        <>
            <div> 
                결재선 <Button onClick={fn_editLine}>결재선 추가</Button>
                <ApprovalLine docLine={docLine}/>
                {isEditLineOpen && <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk}/>}
            </div>
            <div>
                {inputList.map((v, k)=>
                    <div key={k}>
                        <InputForm drftDate={drftDate} setDrftDate={setDrftDate} setInputList={setInputList}
                            inputForm={v} />
                    </div>
                )}
            </div>


            <div>
                <Button type="primary" onClick={fn_attendCheck}>기간 확인</Button>
                {isAttendCheckOpen && <AttendCheckModal drftDate={drftDate}  
                        onClose={fn_attendCheckClose} onOk={fn_attendCheckOk} />}
            </div>
        </>
    );
};

export default AttendanceContent;