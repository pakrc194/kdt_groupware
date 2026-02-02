import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';

const ApprovalDetail = () => {
    const {docId} = useParams();
    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [inputList, setInputList] = useState([]);
    const [aprvLine, setAprvLine] = useState({});
    const navigate = useNavigate();

    useEffect(()=>{
        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(setAprvDocDetail)

        fetcher(`/gw/aprv/AprvLine/${docId}`).then(setAprvLine)

        fetcher(`/gw/aprv/DetailInptVl/${docId}`).then(setInputList)
    },[])

    const fn_list = () => {
        navigate("/approval/approvalBox")
    }

    return (
        <>
            <h4>전자결재 > 결재함 > {aprvDocDetail.aprvDocTtl}</h4>
            <div className="draftForm" >
                <div><h1>{aprvDocDetail.aprvDocTtl}</h1></div>
                <div>문서번호 {aprvDocDetail.aprvDocNo}</div>
                <div>기안자 {aprvDocDetail.drftEmpNm}</div>
                <div>기안일시 {aprvDocDetail.aprvDocDrftDt}</div>
                <div>결재선 <ApprovalLineDetail aprvLine={aprvLine} drafter={{empId:aprvDocDetail.drftEmpId, empNm:aprvDocDetail.drftEmpNm}}/></div>
                <div>
                    {inputList.map((v, k)=>
                        <div key={k}>
                        <DetailForm inputForm={{label:v.docInptLbl, type:v.docInptType, value:v.docInptVl, option:v.docInptRmrk}}/>
                        </div>
                    )}
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