import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';
import AttendContent from '../AttendContent';

const AttendCheckModal = ({onClose, onOk, drftDate}) => {
    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);

    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(()=>{
        fetcher("/gw/aprv/AprvEmpAnnlLv", {
            method:"POST",
            body: {
                ids:[myInfo.empId],
                year:2026
            }
        }).then(res => {
            setAttendList(res)
        })
        console.log("check 날짜 ㅣ ",drftDate)

        console.log(drftDate?.docStart?.replaceAll("-", ""), drftDate?.docEnd?.replaceAll("-", ""))

        fetcher("/gw/aprv/AprvDutyScheDtl",{
                method:"POST",
                body:{
                    ids:[myInfo.empId],
                    docStart:drftDate.docStart.replaceAll("-", ""),
                    docEnd:drftDate.docEnd.replaceAll("-", "")
                }
        }).then(res=>{
            console.log("dutySched : ", res)
            setDutyList(res)
        })

        fetcher("/gw/aprv/AprvSchedList",{
                method:"POST",
                body:{
                    ids:[myInfo.empId],
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
            title={`기간 확인 ${myInfo.empNm}`}
            message={<>
                <AttendContent attendList={attendList} dutyList={dutyList} schedList={schedList} drftDate={drftDate}/>
            </>}
            onClose={onClose}
            onOk={onOk}
            okMsg={"확인"}
        />
    );
};

export default AttendCheckModal;
