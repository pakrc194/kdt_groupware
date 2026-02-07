import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';

const AttendCheckModal = ({onClose, onOk, drftDate}) => {
    const [attend, setAttend] = useState({});
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);

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

        console.log(drftDate.docStart.replaceAll("-", ""), drftDate.docEnd.replaceAll("-", ""))

        fetcher("/gw/aprv/AprvDutyScheDtl",{
                method:"POST",
                body:{
                    empId:empId,
                    docStart:drftDate.docStart.replaceAll("-", ""),
                    docEnd:drftDate.docEnd.replaceAll("-", "")
                }
        }).then(res=>{
            setDutyList(res)
        })

        fetcher("/gw/aprv/AprvSchedList",{
                method:"POST",
                body:{
                    empId:empId,
                    docStart:drftDate.docStart.replaceAll("-", ""),
                    docEnd:drftDate.docEnd.replaceAll("-", "")
                }
        }).then(res=>{
            console.log("fetch AprvSchedList",res)
            setSchedList(res)
        })

    },[])

    return (
        <Modal
            title={`기간 확인 ${empNm}`}
            message={<>
                <h4>{attend.baseYy} 연차 개수</h4>
                {attend.remLv}/{attend.occrrLv}
                <hr/>
                {drftDate.docStart}~{drftDate.docEnd}<br/>
                {dutyList.map((v,k)=>(
                    <div key={k}>
                        {v.scheId}/{v.dutyYmd}/{v.wrkCd}
                    </div>
                ))}
                <hr/>
                <h4>일정</h4>
                {schedList.map((v,k)=>(
                    <div key={k}>
                        {v.schedTitle}/{v.schedStartDate.substring(0, 10)}/{v.schedEndDate.substring(0, 10)}/{v.schedType}
                    </div>
                ))}
            </>}
            onClose={onClose}
            onOk={onOk}
            okMsg={"확인"}
        />
    );
};

export default AttendCheckModal;
