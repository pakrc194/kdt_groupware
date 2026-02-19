import React, { useEffect, useRef, useState } from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';
import AttendCheckModal from './modals/AttendCheckModal';
import EditAprvLine from './modals/EditAprvLine';
import { fetcher } from '../../../shared/api/fetcher';
import InputForm from './InputForm';
import { useParams } from 'react-router-dom';

const DrftContent = ({docFormType, docFormId, docLine, setDocLine, inputList, setInputList, docLoc, setDocLoc, docEmp, setDocEmp}) => {
    const {sideId} = useParams();
    const ORDER = {
        DRFT: 0,
        DRFT_REF: 1,
        MID_ATRZ: 2,
        MID_REF: 3,
        LAST_ATRZ: 4,
    };
    
    const [isAttendCheckOpen, setIsAttendCheckOpen] = useState(false);
    const [drftDate, setDrftDate] = useState({
        docStart: "",
        docEnd: "",
    });

    const [docRole, setDocRole] = useState();

    const initDocLineRef = useRef(null);

    const fn_attendCheck = () => {
        if(drftDate.docStart!="" && drftDate.docEnd!="") {
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
                aprvPrcsEmpNm: addLine.empNm,
                roleSeq: 0, 
            }
            ];

        next.sort((a, b) => (ORDER[a.roleCd] ?? 999) - (ORDER[b.roleCd] ?? 999));

        const refCounters = { DRFT_REF: 0, MID_REF: 0 };

        const resequenced = next.map(item => {
            if (item.roleCd === "DRFT_REF" || item.roleCd === "MID_REF") {
                refCounters[item.roleCd] += 1;
                return { ...item, roleSeq: refCounters[item.roleCd] };
            }
            return { ...item, roleSeq: 0 };
            });

            return resequenced;
        });
    };
    useEffect(() => {
        
    }, [docLine]);

    useEffect(()=>{
        // console.log("child inputList", inputList);
    },[inputList]);

    useEffect(()=> {
        
        if(sideId == "draft") {
            fetcher(`/gw/aprv/AprvDocInpt/${docFormId}`).then(setInputList)
        } else {
            if(inputList==null) {
                fetcher(`/gw/aprv/AprvDocInpt/${docFormId}`).then(setInputList)
            }
        }

        if (docLine?.length > 0) {
            initDocLineRef.current = docLine;
        }

    },[docFormId])

    const fn_resetLine = () => {
        setDocLine(initDocLineRef.current)
    }

    return (
        <div className="draftContent">
            <div className="drft-unit">
                <div className="drft-unit-top">
                    <div className="drft-label">결재선</div>
                    <div className="drft-unit-action">
                        <Button onClick={fn_editLine} docLine={docLine}>결재선 변경</Button>
                        <Button onClick={fn_resetLine} style={{marginLeft: '8px'}}>초기화</Button>
                    </div>
                </div>
                <div className="drft-control">
                    <ApprovalLine docLine={docLine} />
                </div>
            </div>

            {docFormType === "근태" && (
                <div className="drft-unit">
                    <div className="drft-unit-top">
                        <div className="drft-label">근태 확인</div>
                        <div className="drft-unit-action">
                            <Button type="primary" onClick={fn_attendCheck}>연차 조회</Button>
                        </div>
                    </div>
                </div>
            )}

            {inputList.map((v, k) => (
                <InputForm
                    key={k}
                    drftDate={drftDate}
                    setDrftDate={setDrftDate}
                    inputForm={v}
                    inputList={inputList}
                    setInputList={setInputList}
                    docLoc={docLoc}
                    setDocLoc={setDocLoc}
                    docEmp={docEmp}
                    setDocEmp={setDocEmp}
                    docRole={docRole}
                    setDocRole={setDocRole}
                />
            ))}

            {isEditLineOpen && (
                <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk} />
            )}

            {isAttendCheckOpen && (
                <AttendCheckModal
                    drftDate={drftDate}
                    onClose={fn_attendCheckClose}
                    onOk={fn_attendCheckOk}
                />
            )}
        </div>
    );

};

export default DrftContent;