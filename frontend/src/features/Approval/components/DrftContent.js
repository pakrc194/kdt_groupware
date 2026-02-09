import React, { useEffect, useState } from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';
import AttendCheckModal from './modals/AttendCheckModal';
import EditAprvLine from './modals/EditAprvLine';
import { fetcher } from '../../../shared/api/fetcher';
import InputForm from './InputForm';

const DrftContent = ({docFormType, docFormId, docLine, setDocLine, inputList, setInputList, docLoc, setDocLoc, docEmp, setDocEmp}) => {
    const ORDER = {
        DRFT: 0,
        DRFT_REF: 1,
        MID_ATRZ: 2,
        MID_REF: 3,
        LAST_ATRZ: 4,
    };
    
    const [isAttendCheckOpen, setIsAttendCheckOpen] = useState(false);
    const [drftDate, setDrftDate] = useState({})
    const [docRole, setDocRole] = useState();

    const fn_attendCheck = () => {
        if(drftDate.docStart!=null && drftDate.docEnd!=null) {
            setIsAttendCheckOpen(true)
        } else {
            alert("기간 선택하세요")
        }
        
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
        setIsEditLineOpen(false);

        setDocLine(prev => {
            const next = [
            ...prev,
            {
                roleCd: addLine.roleCd,
                aprvPrcsEmpId: addLine.empId,
                roleSeq: 0, // 아래에서 다시 계산
            }
            ];

        // 1) 고정 순서로 정렬
        next.sort((a, b) => (ORDER[a.roleCd] ?? 999) - (ORDER[b.roleCd] ?? 999));

        // 2) REF 들만 roleSeq 다시 매기기 (DRFT_REF, MID_REF 각각 1..n)
        const refCounters = { DRFT_REF: 0, MID_REF: 0 };

        const resequenced = next.map(item => {
            if (item.roleCd === "DRFT_REF" || item.roleCd === "MID_REF") {
                refCounters[item.roleCd] += 1;
                return { ...item, roleSeq: refCounters[item.roleCd] };
            }
            // 결재자들은 roleSeq 0(또는 null)로
            return { ...item, roleSeq: 0 };
            });

            return resequenced;
        });
    };


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
                {docFormType === "근태" && <Button type="primary" onClick={fn_attendCheck}>근태 확인</Button>}
                
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

export default DrftContent;