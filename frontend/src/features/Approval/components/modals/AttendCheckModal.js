import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';

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

        console.log(drftDate.docStart.replaceAll("-", ""), drftDate.docEnd.replaceAll("-", ""))

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
                {attendList.map((attend,k)=>(
                    <div key={k}>
                        <h4>{attend.baseYy} 연차 개수</h4>
                        {attend.remLv}/{attend.occrrLv}
                        <hr/>
                    </div>))}

                {dutyList?.length>0 && <div>
                    {drftDate.docStart}~{drftDate.docEnd}<br/>
                    {dutyList.map(v=>(
                        v.map((vv,kk)=>(
                            <div key={kk}>
                                {vv.empNm}/{vv.deptName}/{vv.dutyYmd}/{vv.wrkCd}
                            </div>
                        ))
                    ))}
                    <hr/>
                </div>}   
                    
                {schedList?.length > 0 && <div>
                    <h4>일정</h4>
                    {schedList.map((v,k)=>(
                        <div key={k}>
                            {v.map((vv, kk)=>(
                                <div key={kk}>{vv.empNm}/{vv.schedTitle}/{vv.schedStartDate.substring(0, 10)}/{vv.schedEndDate.substring(0, 10)}/{vv.schedType}</div>
                            ))} 
                        </div>
                    ))}
                </div>}
            </>}
            onClose={onClose}
            onOk={onOk}
            okMsg={"확인"}
        />
    );
};

export default AttendCheckModal;
