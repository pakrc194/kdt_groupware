import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';
import AttendContent from '../components/AttendContent';

const ApprovalDetail = () => {
    const {sideId, docId} = useParams();
    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [inputList, setInputList] = useState([]);
    const [aprvLine, setAprvLine] = useState([]);

    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);
    const [docVerList, setDocVerList] = useState([]);
    const [rejectData, setRejectData] = useState({});
    const [drftDate, setDrftDate] = useState({});
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    
    const navigate = useNavigate();

    useEffect(()=>{
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res=>{
            setAprvLine(res)
            setRejectData(res.find(v=>v.aprvPrcsStts=='REJECTED'))
        })

        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(res => {
            const drftStart = res.find(v=>v.docInptNm=="docStart")
            const drftEnd = res.find(v=>v.docInptNm=="docEnd")
            setDrftDate({
                docStart : drftStart.docInptVl,
                docEnd : drftEnd.docInptVl
            })

            const role = res.find(v=>v.docInptNm=="docRole");
            if(role!=null) {
                const ids = res.find(v=>v.docInptNm=="docSchedType")
                let idsVl = ""
                fetcher(`/gw/aprv/AprvRoleVl`, {
                    method:"POST",
                    body:{
                        role: role?.docInptVl,
                        ids : ids?.docInptVl
                    }
                }).then(vv => {
                    console.log("fetch AprvRoleVl : ",vv);
                    if(role.docInptVl=="PERSONAL") {
                        vv.map(v=>{
                            idsVl+=v.empNm+" "
                        })
                    } else if(role.docInptVl=="DEPT") {
                        vv.map(v=>{
                            idsVl+=v.deptName+" "
                        })
                    }
                    console.log("idsVl", idsVl)
                    ids.docInptVl = idsVl;
                })
            }

            

            setInputList(res)
        })

        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res=>{
            console.log("detail ", res)
            setAprvDocDetail(res)
        })
    },[docId])

    useEffect(()=>{
       

        if(aprvDocDetail.docFormType=="일정") {
            fn_warnSched();
        } else if(aprvDocDetail.docFormType=="근태") {
            fn_warnAttend();
        }


        fetcher(`/gw/aprv/AprvDocVerList`, {
            method:"POST",
            body: {
                docNo:aprvDocDetail.aprvDocNo
            }
        }).then(res=>{
            console.log(res)
            setDocVerList(res);
        })

    },[aprvDocDetail])

    const fn_warnAttend = () => {
        const docRole = "duty"
        const ids = [aprvDocDetail.drftEmpId]
        const deptId = null
        const docStart = inputList.find(v=>v.docInptNm==="docStart")?.docInptVl.replaceAll('-',"");
        const docEnd = inputList.find(v=>v.docInptNm==="docEnd")?.docInptVl.replaceAll('-',"");


        console.log("warnAttend", ids, docStart, docEnd)

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

    const fn_warnSched = () => {
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
    }

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
                            <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:v.docInptVl, name:v.docInptNm, option:v.docInptRmrk}}/>
                        </div>
                    )}
                </div>

                {rejectData?.aprvPrcsEmpId && <div>
                    <h3>반려사유</h3>
                    {rejectData.aprvPrcsEmpNm}/{rejectData.rjctRsn}
                </div>}

                <div>
                    <AttendContent attendList={attendList} dutyList={dutyList} schedList={schedList} drftDate={drftDate}/>
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