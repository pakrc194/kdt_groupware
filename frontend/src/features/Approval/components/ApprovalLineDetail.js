import React, { useEffect, useState } from 'react';
import './ApprovalLine.css';
import Modal from '../../../shared/components/Modal';
import { fetcher } from '../../../shared/api/fetcher';
import ReferModal from './modals/ReferModal';
import AtrzModal from './modals/AtrzModal';
import formatToYYMMDD from '../../../shared/func/formatToYYMMDD';
import { useNavigate, useParams } from 'react-router-dom';

const ApprovalLineDetail = ({aprvLine, setRejectData, inptList, docDetail}) => {
    const {docId} = useParams();
    const navigate = useNavigate();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    const [selectedEmp, setSelectedEmp] = useState(null);
    const [openModal, setOpenModal] = useState(""); 

    const [lineData, setLineData] = useState([]);

    console.log("inptList: ", inptList);
    console.log("docDetail: ", docDetail);

    useEffect(()=>{
        console.log(aprvLine);
        setLineData(aprvLine);

    },[aprvLine]) 

    const fn_close = () => setOpenModal("");

    const fn_ok = (aprvEmpId, roleCd, prcsRes="") => {
        setOpenModal("")
        console.log(docId, aprvEmpId, roleCd)
        
        let stts= "APPROVED"
        if(roleCd.includes("REF")) {
            stts = "READ"
        } else if(roleCd==="LAST_ATRZ") {
            stts = "COMPLETED"
        }

        let nextNm = null;
        let nextId = 0;
        if(roleCd==="MID_ATRZ") {
            nextNm = aprvLine.filter(v=>v.roleCd==="LAST_ATRZ")[0].empNm;
            nextId = aprvLine.filter(v=>v.roleCd==="LAST_ATRZ")[0].aprvPrcsEmpId;
        }

        let rjctRsn = null
        if(prcsRes.prcs == "rjct") {
            stts = "REJECTED"
            nextNm = null
            nextId = 0;
            rjctRsn = prcsRes.rjctRsn
        }


        console.log("fn_ok --")
        console.log(prcsRes.prcs+", "+prcsRes.rjctRsn)
        console.log(`
                aprvDocId : ${docId},
                aprvPrcsEmpId : ${aprvEmpId},
                aprvPrcsStts : ${stts},
                nextEmpId: ${nextId},
                nextEmpNm: ${nextNm},
                rjctRsn: ${rjctRsn}
            `)

        fetcher("/gw/aprv/AprvPrcs", {
            method: "POST",
            body: {
                aprvDocId : docId,
                aprvPrcsEmpId : aprvEmpId,
                roleCd : roleCd,
                aprvPrcsStts : stts,
                nextEmpId: nextId,
                nextEmpNm: nextNm,
                rjctRsn: rjctRsn
            }
        }).then(console.log)
        
        const date = formatToYYMMDDHHMMSS(new Date());

        setLineData(prev =>
            prev.map(item =>
            item.aprvPrcsEmpId === aprvEmpId && item.roleCd === roleCd
                ? { ...item, aprvPrcsDt: date }
                : item
            )
        );
        
        if(prcsRes.prcs!=="rjct") {
            if(roleCd==="LAST_ATRZ") {
                if(docDetail.docFormType==="근태") {
                    fn_attendCheck();
                } else if(docDetail.docFormType==="일정") {
                    fn_schedCheck();
                } else if(docDetail.docFormType==="근무") {
                    fn_dutyCheck();
                }
            }
        } else {
            alert(`반려처리 : ${rjctRsn} `)
        }

        

        
        navigate(0);
    }

    const fn_dutyCheck = async () => {
        const dutyId = inptList[0]?.docInptVl;
        if (!dutyId) {
            alert("근무표 식별 번호가 없습니다.");
            return;
        }

        try {
            const res = await fetcher("/gw/duty/confirmDuty", {
                method: "POST",
                body: { dutyId: dutyId }
            });
            alert(res.message);
        } catch (error) {
            console.error("근무표 확정 에러 상세:", error);
            alert(`[결재 실패] ${error.message}`);
        }
    };


    const fn_schedCheck = () => {
        console.log(inptList)
        //{inptList}
        let docSched = inptList.filter(v=>v.docInptNm=="docSchedType")[0].docInptVl
        let docRole = inptList.filter(v=>v.docInptNm=="docRole")[0].docInptVl
        let schedEmpId = docDetail.drftEmpId;
        let deptId = docDetail.deptId;
        switch(docRole) {
            case "COMPANY" :
                schedEmpId = docDetail.drftEmpId;
                deptId = docDetail.deptId;
                break;
            case "DEPT" :
                schedEmpId = docDetail.drftEmpId;
                deptId = docSched;
                break;
            case "PERSONAL" :
                schedEmpId = docSched;
                deptId = docDetail.deptId;
                break;
            default : 
                break;
        }
        console.log(inptList)

        console.log(`body--
            schedTitle : ${docDetail.aprvDocTtl},
            schedStartDate : ${inptList.filter(v=>v.docInptNm=="docStart")[0].docInptVl},
            schedEndDate : ${inptList.filter(v=>v.docInptNm=="docEnd")[0].docInptVl},
            schedType : ${docRole},
            schedDetail : ${inptList.filter(v=>v.docInptNm=="docTxtArea")[0].docInptVl},
            schedLoc : ${inptList.filter(v=>v.docInptNm=="docLoc")[0].docInptVl},
            schedEmpId : ${schedEmpId},
            schedAuthorId : ${myInfo.empId},
            schedDeptId : ${deptId}
        `)


        fetcher("/gw/aprv/AprvSchedUpload", {
            method:"POST",
            body:{
                schedTitle : docDetail.aprvDocTtl,
                schedStartDate : inptList.filter(v=>v.docInptNm=="docStart")[0].docInptVl,
                schedEndDate : inptList.filter(v=>v.docInptNm=="docEnd")[0].docInptVl,
                schedType : docRole,
                schedDetail : inptList.filter(v=>v.docInptNm=="docTxtArea")[0].docInptVl,
                schedLoc : inptList.filter(v=>v.docInptNm=="docLoc")[0].docInptVl,
                schedEmpId : schedEmpId,
                schedAuthorId : myInfo.empId,
                schedDeptId : deptId
            }
        }).then(res => {
            alert("일정 등록 완료")
        })
    }
    const fn_attendCheck = () => {
        let docStart = inptList.find(v=>v.docInptNm=="docStart").docInptVl
        let docEnd = inptList.find(v=>v.docInptNm=="docEnd").docInptVl

        console.log(`attend check-- 
            empId : ${docDetail.drftEmpId}
            docStart:${docStart}    
            docEnd:${docEnd}    
            
        `)
        fetcher(`/gw/aprv/AprvAttendUpload`,{
            method:"POST",
            body: {
                empId : docDetail.drftEmpId,
                docStart: docStart,
                docEnd: docEnd,
            }
        }).then(res => {
            alert("근태 등록 완료")
        })
    }


    const formatToYYMMDDHHMMSS = (date) => {
        const yy = String(date.getFullYear());
        const mm = String(date.getMonth() + 1).padStart(2, '0');
        const dd = String(date.getDate()).padStart(2, '0');
        const hh = String(date.getHours()).padStart(2, '0');
        const mi = String(date.getMinutes()).padStart(2, '0');
        const ss = String(date.getSeconds()).padStart(2, '0');

        return `${yy}${mm}${dd}${hh}${mi}${ss}`;
    };


    if (!aprvLine) {
        return <div>결재선 정보를 불러오는 중...</div>;
    }
    const roleMap = {
        DRFT : "기안자",
        DRFT_REF : "참조자",
        MID_ATRZ : "중간 결재자",
        MID_REF : "중간 참조자",
        LAST_ATRZ : "최종 결재자"
    }

    return (
        <>  
            {/* <button onClick={fn_schedCheck}>일정 등록</button>
            <button onClick={fn_attendCheck}>근태 등록</button> */}
            <div className='approvalLine'>
                {lineData.map((v, k)=> {
                    return (
                        <div className='empInfo' key={k}>
                            <div>{roleMap[v.roleCd]}</div>
                            <div onClick={()=>{
                                if(v.aprvPrcsEmpId == myInfo.empId) {
                                    if(v.aprvPrcsDt!=null && v.aprvPrcsDt!="") {
                                        alert("이미 결재처리된 문서입니다")
                                    } else {
                                        setSelectedEmp(v)
                                        setOpenModal(v.roleCd)
                                    }
                                    
                                }
                            }}>
                                    {v.aprvPrcsEmpNm}
                            </div>
                            <div>
                                {v.aprvPrcsDt && formatToYYMMDD(v.aprvPrcsDt)}
                            </div>
                        </div>
                    )
                })}
                {openModal.includes("REF") &&
                    <ReferModal onClose={fn_close} onOk={()=>fn_ok(selectedEmp.aprvPrcsEmpId, selectedEmp.roleCd, "")}/> }
                {openModal.includes("ATRZ") &&
                    <AtrzModal onClose={fn_close} onOk={(prcsRes)=>fn_ok(selectedEmp.aprvPrcsEmpId, selectedEmp.roleCd, prcsRes)}/> }

            </div>
        </>
    );



   
};

export default ApprovalLineDetail;