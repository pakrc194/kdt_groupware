import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';

const ApprovalDetail = () => {
    const {sideId, docId} = useParams();
    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [inputList, setInputList] = useState([]);
    const [aprvLine, setAprvLine] = useState([]);

    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);

    const [rejectData, setRejectData] = useState({});

    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));

    const navigate = useNavigate();

    useEffect(()=>{
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res=>{
            setAprvLine(res)
            if(res.filter(v=>v.aprvPrcsStts=='REJECTED').length>0) {
                setRejectData(res.filter(v=>v.aprvPrcsStts=='REJECTED')[0])
            }
        })

        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(setInputList)

        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res=>{
            console.log("detail ", res)
            setAprvDocDetail(res)
        })
    },[docId])

    useEffect(()=>{
        const docRole = inputList.find(v=>v.docInptNm==="docRole")?.docInptVl;
        const schedType = inputList.find(v=>v.docInptNm==="docSchedType")?.docInptVl;
        const docStart = inputList.find(v=>v.docInptNm==="docStart")?.docInptVl;
        const docEnd = inputList.find(v=>v.docInptNm==="docEnd")?.docInptVl;
        
        
        let drftEmpId=0;
        let deptId = 0;

        let ids = schedType?.includes(',')? schedType.split(',') : [schedType];


        if(docRole==="DEPT") {
            ids = schedType?.includes(',')? schedType.split(',') : [schedType];
            drftEmpId = aprvDocDetail.drftEmpId;
        } else if(docRole=="COMPANY") {
            drftEmpId = aprvDocDetail.drftEmpId;
            ids = [aprvDocDetail.drftEmpId]
        }




        console.log("일정확인 ",docRole, schedType, drftEmpId, ids)

        if(drftEmpId==null)
            return;

        if(docRole === "PERSONAL") {
            fetcher("/gw/aprv/AprvEmpAnnlLv", {
                method:"POST",
                body: {
                    role : docRole,
                    ids : ids,
                    deptId: deptId,
                    year:2026
                }
            }).then(res => {
                console.log("fetch AprvEmpAnnlLv",res)
                setAttendList(res)
            })
            
            fetcher("/gw/aprv/AprvDutyScheDtl",{
                    method:"POST",
                    body:{
                        role : docRole,
                        ids : ids,
                        deptId: deptId,
                        docStart:docStart,
                        docEnd:docEnd
                    }
            }).then(res=>{
                setDutyList(res)
            })
            

            fetcher("/gw/aprv/AprvSchedList",{
                method:"POST",
                body:{
                    role : docRole,
                    ids : ids,
                    deptId: deptId,
                    docStart:docStart,
                    docEnd:docEnd
                }
            }).then(res=>{
                console.log("fetch AprvSchedList",res)
                setSchedList(res)
            })
        }

        

    },[aprvDocDetail])


    const fn_list = () => {
        navigate(`/approval/${sideId}`)
    }
    const fn_redraft = () => {
        navigate(`/approval/${sideId}/redrft/${docId}`)
    }

    return (
        <>
            <h4>전자결재 > 결재함 > {aprvDocDetail.aprvDocTtl}</h4>
            <div className="draftForm" >
                <div><h1>{aprvDocDetail.aprvDocTtl}</h1></div>
                <div>문서번호 {aprvDocDetail.aprvDocNo}</div>
                <div>기안자 {aprvDocDetail.drftEmpNm}</div>
                <div>기안일시 {aprvDocDetail.aprvDocDrftDt}</div>
                <div>결재선 <ApprovalLineDetail aprvLine={aprvLine} setRejectData={setRejectData} inptList={inputList} docDetail={aprvDocDetail}/></div>
                <div>
                    {inputList.map((v, k)=>
                        <div key={k}>
                            <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:v.docInptVl,name:v.docInptNm, option:v.docInptRmrk}}/>
                        </div>
                    )}
                </div>
                {rejectData.aprvPrcsEmpId && <div>
                    <h3>반려사유</h3>
                    {rejectData.empNm}/{rejectData.rjctRsn}
                </div>}



                <div>
                    <h3>경고</h3>
                    {attendList.length>0 && attendList.map((attend, k)=>(
                        <div key={k}>
                            <h4>{attend.empNm} {attend.baseYy} 연차 개수</h4>
                            {attend.remLv}/{attend.occrrLv}
                            <hr/>
                            {"2026-02-06"}~{"2026-02-08"}<br/>
                            {dutyList.map((v,k)=>(
                                <div key={k}>
                                    {v.scheId}/{v.dutyYmd}/{v.wrkCd}
                                </div>
                            ))}
                            <hr/>
                        </div>
                    ))}
                    
                    
                    <h4>일정</h4>
                    {schedList.map((v,k)=>(
                        <div key={k}>
                            {v.map((vv, kk)=>(
                                <div key={kk}>{vv.empNm}/{vv.schedTitle}/{vv.schedStartDate.substring(0, 10)}/{vv.schedEndDate.substring(0, 10)}/{vv.schedType}</div>
                            ))} 
                        </div>
                    ))}
                </div>
            </div>
            
            <br/>
            <br/>

            <div>
                <Button variant='secondary' onClick={fn_list}>뒤로</Button>
                {sideId=="rejectBox" && <Button variant='primary' onClick={fn_redraft}>재기안</Button>}
            </div>
        </>
    );
};

export default ApprovalDetail;