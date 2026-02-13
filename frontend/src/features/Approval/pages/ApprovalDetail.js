import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';
import AttendContent from '../components/AttendContent';
import DutyForm from './DutyForm';

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
    const [isApproved, setIsApproved] = useState(false);

    const [docFile, setDocFile] = useState({});


    const schedFilter = useState({});

    const [vlFilter, setVlFilter] = useState();
    const [locFilter, setLocFilter] = useState();


    const sideTitleMap = {
        approvalBox: "결재함",
        drftBox: "기안함",
        draftBox: "기안함",
        refBox: "참조함",
        tempBox: "임시저장함",
        rejectBox: "반려함",
    };
    const docRoleMap = {
        PERSONAL : "팀원",
        DEPT:"팀",
        COMPANY:"회사"
    }
    

    const navigate = useNavigate();

    useEffect(()=>{
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res=>{
            setAprvLine(res)
            setRejectData(res.find(v=>v.aprvPrcsStts=='REJECTED'))
            res.find(v=>{
                if(v.roleCd!="DRFT" && v.aprvPrcsDt!=null) {
                    setIsApproved(true)
                }
            })
        })

        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(res => {
            const drftStart = res.find(v=>v.docInptNm=="docStart")
            const drftEnd = res.find(v=>v.docInptNm=="docEnd")
            if(drftStart!=null && drftEnd!=null) {
                setDrftDate({
                    docStart : drftStart.docInptVl,
                    docEnd : drftEnd.docInptVl
                })
            }        

            setInputList(res)
            console.log("inptList ",res)
        })

        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res=>{
            console.log("detail ", res)
            setAprvDocDetail(res)
        })

        fetcher(`/gw/aprv/AprvDocFile/${docId}`).then(res=>{
            console.log("file ", res)
            setDocFile(res)
        })

        fetcher(`/gw/aprv/AprvLocList`).then(res=>{
            console.log("AprvLocList", res)
            let resFilter={}
            res.map((v)=> {
                resFilter[v.locId] = v.locNm
            })
            setLocFilter(resFilter)
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
            console.log("verList",res)
            setDocVerList(res);
        })

        const docRole = inputList.find(v=>v.docInptNm==="docRole")
        console.log("docRole", docRole)
        if(docRole!=null) {
            if(docRole.docInptVl=="PERSONAL") {
                fetcher(`/gw/aprv/AprvDeptEmpList`).then(res=>{
                        res.map(v=>{
                            schedFilter[v.empId] = v.empNm
                        })
                        console.log("personal", schedFilter)
                        setVlFilter(schedFilter)
                    });
            } else if(docRole.docInptVl=="DEPT") {
                fetcher(`/gw/aprv/AprvDeptList`).then(res=>{
                    res.map(v=>{
                        schedFilter[v.deptId] = v.deptName
                    })
                    console.log("dept", schedFilter)
                    setVlFilter(schedFilter)
                });        
            }
        }
    },[aprvDocDetail])


    const fn_warnAttend = () => {
        const docRole = "duty"
        const ids = [aprvDocDetail.drftEmpId]
        const deptId = null
        const docStart = inputList.find(v=>v.docInptNm==="docStart")?.docInptVl?.replaceAll('-',"");
        const docEnd = inputList.find(v=>v.docInptNm==="docEnd")?.docInptVl?.replaceAll('-',"");


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

    const fn_drftCancel = () => {
        fetcher(`/gw/aprv/AprvDrftDelete`,{
            method:"POST",
            body:{
                docId : docId
            }
        }).then(res => {
            console.log(`fetch AprvDrftDelete ${res.res}`)
            alert("기안 취소 되었습니다.")
            navigate(`/approval/${sideId}`);
        })
    }
    const fn_verChange = (e) => {
        let verId = e.target.value;
        // let verDoc = docVerList.find(v=>v.aprvDocVer.docVer == verId)
        // navigate(`/approval/rejectBox/detail/${verDoc.aprvDocId}`)
    }

    return (
        <>
            <h4>전자결재 &gt; {sideTitleMap[sideId]} &gt; {aprvDocDetail.aprvDocTtl}</h4>
            <div className="draftForm" >
                <div><h1>{aprvDocDetail.aprvDocTtl}</h1></div>
                <div>문서번호 {aprvDocDetail.aprvDocNo}</div>
                <div>기안자 {aprvDocDetail.drftEmpNm}</div>
                <div>기안일시 {aprvDocDetail.aprvDocDrftDt}</div>
                <div>결재선 <ApprovalLineDetail aprvLine={aprvLine} setRejectData={setRejectData} inptList={inputList} docDetail={aprvDocDetail}/></div>
                <div>
                    {inputList.map((v, k)=> {
                        switch(v.docInptNm) {
                            case "docRole":
                                return <div key={k}>
                                    <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:docRoleMap[v.docInptVl], name:v.docInptNm, option:v.docInptRmrk}}/>
                                </div>
                            case "docDuty":
                                return <div key={k}>
                                    <DutyForm dutyId={v.docInptVl}/>
                                </div>
                            case "docSchedType":
                                let values = v.docInptVl
                                console.log("return inptList ", values, vlFilter)
                                let tt = ""
                                if(values==null || vlFilter==null) {
                                    return <></>
                                }

                                for(const sc of values.split(',')) {
                                    tt=="" ? tt=vlFilter[sc] : tt+=","+vlFilter[sc]
                                }
                                return <div key={k}>
                                    <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:tt, name:v.docInptNm, option:v.docInptRmrk}}/>
                                </div>
                            case "docLoc":
                                if(locFilter==null)
                                    return <></>    

                                return <div key={k}>
                                    <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:locFilter[v.docInptVl], name:v.docInptNm, option:v.docInptRmrk}}/>
                                </div>
                            default:
                                return <div key={k}>
                                    <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:v.docInptVl, name:v.docInptNm, option:v.docInptRmrk}}/>
                                </div>
                        }
                    })}
                </div>
                {docFile && <div>
                    <h4>첨부파일</h4>
                    <a href={`http://192.168.0.36:8080/board/download/${docFile.fileId}`}>{docFile.originName}</a>
                </div>}

                {rejectData?.aprvPrcsEmpId && <div>
                    <h3>반려사유</h3>
                    {rejectData.aprvPrcsEmpNm}/{rejectData.rjctRsn}
                </div>}

                {aprvDocDetail?.aprvDocStts!="COMPLETE" && <div>
                   <AttendContent attendList={attendList} dutyList={dutyList} schedList={schedList} drftDate={drftDate}/>
                </div>}



                {docVerList.length>0 && 
                    <select name="docVer" value={aprvDocDetail.docVer || ""} onChange={fn_verChange}>
                        {docVerList.map((v, k)=><option key={k} value={v.aprvDocId}>{v.aprvDocVer}</option>)}
                    </select>
                }
            </div>
            
            <br/>
            <br/>

            <div>
                <Button variant='secondary' onClick={fn_list}>뒤로</Button>
                {sideId=="rejectBox" && <Button variant='primary' onClick={fn_redraft}>재기안</Button>}
                {(!isApproved && aprvDocDetail.drftEmpId==myInfo.empId )&& <Button variant='secondary' onClick={fn_drftCancel}>기안취소</Button>}
            </div>
        </>
    );
};

export default ApprovalDetail;