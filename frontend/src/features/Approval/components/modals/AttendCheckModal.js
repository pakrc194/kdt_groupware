import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';

const AttendCheckModal = ({onClose, onOk, drftDate}) => {
    const [attend, setAttend] = useState({});
    const empId = localStorage.getItem("EMP_ID");
    const empNm = localStorage.getItem("EMP_NM");
    useEffect(()=>{
        fetcher("/gw/aprv/AprvEmpAnnlLv", {
            method:"POST",
            body: {
                empId:empId,
                year:2026
            }
        }).then(res => {
            
            setAttend(res)
        })
        console.log("check 날짜 ㅣ ",drftDate)
    },[])

    return (
        <Modal
            title={`기간 확인 ${empNm}`}
            message={<>
                <h4>{attend.baseYy} 연차 개수</h4>
                {attend.remLv}/{attend.occrrLv}
                <hr/>
                {drftDate.drftStart}~{drftDate.drftEnd}<br/>

            </>}
            onClose={onClose}
            onOk={onOk}
            okMsg={"확인"}
        />
    );
};

export default AttendCheckModal;
