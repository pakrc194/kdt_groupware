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

    const [attend, setAttend] = useState({});
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);

    const [rejectData, setRejectData] = useState({});

    const empId = localStorage.getItem("EMP_ID");
    const empNm = localStorage.getItem("EMP_NM");

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
            setAprvDocDetail(res)
        })


    },[docId])

    useEffect(()=>{
        const drftEmpId = aprvDocDetail?.drftEmpId;

        if(drftEmpId==null)
            return;

        fetcher("/gw/aprv/AprvEmpAnnlLv", {
            method:"POST",
            body: {
                empId:drftEmpId,
                year:2026
            }
        }).then(res => {
            setAttend(res)
        })
        fetcher("/gw/aprv/AprvDutyScheDtl",{
                method:"POST",
                body:{
                    empId:drftEmpId,
                    docStart:"2026-02-06",
                    docEnd:"2026-02-08"
                }
        }).then(res=>{
            setDutyList(res)
        })
        fetcher("/gw/aprv/AprvSchedList",{
                method:"POST",
                body:{
                    empId:drftEmpId,
                    docStart:"2026-02-06",
                    docEnd:"2026-02-08"
                }
        }).then(res=>{
            console.log("fetch AprvSchedList",res)
            setSchedList(res)
        })
        

    },[aprvDocDetail])


    const fn_list = () => {
        navigate(`/approval/${sideId}`)
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
                    <h4>{aprvDocDetail.drftEmpNm} {attend.baseYy} 연차 개수</h4>
                    {attend.remLv}/{attend.occrrLv}
                    <hr/>
                    {"2026-02-06"}~{"2026-02-08"}<br/>
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
                </div>
            </div>
            
            <br/>
            <br/>

            <div>
                <Button variant='secondary' onClick={fn_list}>뒤로</Button>
            </div>
        </>
    );
};

export default ApprovalDetail;