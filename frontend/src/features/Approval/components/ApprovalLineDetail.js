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
    const empId = Number(localStorage.getItem("EMP_ID"))
    const empDeptId = Number(localStorage.getItem("DEPT_ID"))

    const [selectedEmp, setSelectedEmp] = useState(null);
    const [openModal, setOpenModal] = useState(""); 

    const [lineData, setLineData] = useState([]);


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

        navigate(0);
    }

    const fn_schedCheck = () => {
        console.log(inptList)
        //{inptList}
        let docSched = inptList.filter(v=>v.docInptNm=="docSchedType")[0].docInptVl
        let docRole = inptList.filter(v=>v.docInptNm=="docRole")[0].docInptVl
        let schedEmpId = empId;
        let deptId = empDeptId;
        switch(docRole) {
            case "COMPANY" :
                schedEmpId = empId;
                deptId = empDeptId;
                break;
            case "DEPT" :
                schedEmpId = empId;
                deptId = docSched;
                break;
            case "PERSONAL" :
                schedEmpId = docSched;
                deptId = empDeptId;
                break;
            default : 
                break;
        }
        console.log(inptList)

        //empId = 1;
        deptId = 2;
        console.log(`body--
            schedTitle : ${docDetail.aprvDocTtl},
            schedStartDate : ${inptList.filter(v=>v.docInptNm=="docStart")[0].docInptVl},
            schedEndDate : ${inptList.filter(v=>v.docInptNm=="docEnd")[0].docInptVl},
            schedType : ${docRole},
            schedDetail : ${inptList.filter(v=>v.docInptNm=="docTxtArea")[0].docInptVl},
            schedLoc : ${inptList.filter(v=>v.docInptNm=="docLoc")[0].docInptVl},
            schedEmpId : ${schedEmpId},
            schedAuthorId : ${empId},
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
                schedAuthorId : empId,
                schedDeptId : deptId
            }
        })
    }
    const fn_attendCheck = () => {

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

    return (
        <>  
            <button onClick={fn_schedCheck}>일정 등록</button>
            <button onClick={fn_attendCheck}>근태 등록</button>
            <div className='approvalLine'>
                {lineData.map((v, k)=> {
                    return (
                        <div className='empInfo' key={k}>
                            <div>{v.roleCd}</div>
                            <div onClick={()=>{
                                setSelectedEmp(v)
                                setOpenModal(v.roleCd)
                            }}>
                                    {v.empNm}
                            </div>
                            {v.aprvPrcsDt && <div>{formatToYYMMDD(v.aprvPrcsDt)}</div>}
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