import React, { useEffect, useState } from 'react';
import './ApprovalLine.css';
import Modal from '../../../shared/components/Modal';
import { fetcher } from '../../../shared/api/fetcher';

const ApprovalLineDetail = ({aprvLine, drafter}) => {
    const empId = Number(localStorage.getItem("EMP_ID"))

    const [aptzDate, setAptzDate] = useState();

    const [openModal, setOpenModal] = useState(null); 
// "REF" | "MID" | "MID_REF" | "LAST" | null

    const fn_name = (targetId, modalType) => {
        setOpenModal(modalType);
        // if (Number(empId) === Number(targetId)) {
        //     setOpenModal(modalType);
        // } else {
        //     setOpenModal(null);
        // }
    };

    const fn_close = () => setOpenModal(null);

    const fn_ok = async (aprvEmpId, modalType) => {
        setOpenModal(null)
        console.log(aprvLine.aprvDocId, empId, modalType)
        
        let stts= "APPROVED"
        if(modalType.includes("REF")) {
            stts = "READ"
        } else if(modalType==="LAST") {
            stts = "COMPLETED"
        }


        let nextNm = "";
        if(modalType==="MID") {
            nextNm = aprvLine.lastAtrzEmpNm;
        }
        fetcher("/gw/aprv/AprvPrcs", {
            method: "POST",
            body: {
                aprvDocId : aprvLine.aprvDocId,
                aprvPrcsEmpId : aprvEmpId,
                aprvPrcsStts : stts,
                nextEmpNm: nextNm,
            }
        }).then(console.log)

        const date = new Date().toISOString().slice(0, 10);
        setAptzDate(date)
    }

    if (!aprvLine) {
        return <div>결재선 정보를 불러오는 중...</div>;
    }

    return (
        <>
            <div className='approvalLine'>
                <div className='empInfo'>
                    <div>기안자</div>
                    <div>{drafter.empNm}</div>
                </div>
                {aprvLine.drftRefncEmp1Nm && <div className='empInfo'>
                    <div>참조자</div>
                    <div onClick={()=>fn_name(aprvLine.drftRefncEmp1Id, "REF")}>{aprvLine.drftRefncEmp1Nm}</div>
                    <div></div>
                    {openModal === "REF" && 
                    <Modal title="참조" onClose={fn_close} onOk={()=>fn_ok(aprvLine.lastAtrzEmpId, "REF")}/>}
                </div>}
                {aprvLine.midAtrzEmpNm && <div className='empInfo'>
                    <div>중간 결재자</div>
                    <div onClick={()=>fn_name(aprvLine.midAtrzEmpId, "MID")}>{aprvLine.midAtrzEmpNm}</div>
                    {openModal === "MID" && 
                        <Modal title="중간 결재" onClose={fn_close} onOk={()=>fn_ok(aprvLine.lastAtrzEmpId, "MID")}/>}
                </div>}
                {aprvLine.midRefncEmp1Nm && <div className='empInfo'>
                    <div>중간 참조자</div>
                    <div onClick={()=>fn_name(aprvLine.midRefncEmp1Id, "MID_REF")}>{aprvLine.midRefncEmp1Nm}</div>
                    {openModal === "MID_REF" && 
                        <Modal title="참조" onClose={fn_close} onOk={()=>fn_ok(aprvLine.midRefncEmp1Id, "MID_REF")} okMsg="확인"/>}
                </div>}
                <div className='empInfo'>
                    <div>최종 결재자</div>
                    <div onClick={()=>fn_name(aprvLine.lastAtrzEmpId, "LAST")}>{aprvLine.lastAtrzEmpNm}</div>
                    <div>{aptzDate}</div>
                    {openModal === "LAST" && 
                        <Modal title="최종 결재" onClose={fn_close} onOk={()=>fn_ok(aprvLine.lastAtrzEmpId, "LAST")} okMsg="확인"/>}
                </div>
            </div>
        </>
    );
};

export default ApprovalLineDetail;