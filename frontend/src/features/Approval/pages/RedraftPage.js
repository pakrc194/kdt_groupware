import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';
import RedrftContent from '../components/RedrftContent';

const RedraftPage = () => {
    const {sideId, draft, docId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    const navigate = useNavigate();

    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [inputList, setInputList] = useState([]);
    const [docLine, setDocLine] = useState([
        {
            aprvPrcsEmpId:myInfo.empId,
            roleCd:"DRFT",
            roleSeq:"0"
        }
    ])
    const [docLoc, setDocLoc] = useState({
        locNm: '장소 선택'
    });
    const [docEmp, setDocEmp] = useState({
        locNm: '담당자 지정'
    });
    const [docTitle, setDocTitle] = useState("");
    const [docVerList, setDocVerList] = useState([]);
    const [rejectData, setRejectData] = useState("");

    const [docVer, setDocVer] = useState();

    useEffect(()=>{
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res=>{
            setDocLine(res)
            if(res.filter(v=>v.aprvPrcsStts=='REJECTED').length>0) {
                setRejectData(res.filter(v=>v.aprvPrcsStts=='REJECTED')[0])
            }
        })
        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(setInputList)
        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res=>{
            setAprvDocDetail(res)
            setDocVer(res.aprvDocVer)
            setDocTitle(res.aprvDocTtl)
        })
    },[docId])

    useEffect(()=> {
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


    const fn_drftCancel = () => {

    }
    const fn_tempSave = () => {
        
    }
    const fn_drftConfirm = () => {
        const drftDoc = {
            drftEmpId:myInfo.empId,
            docFormId:aprvDocDetail.docFormId,
            aprvDocNo:aprvDocDetail.aprvDocNo,
            aprvDocTtl:docTitle
        }
        console.log("basic : ",drftDoc);
        console.log("line : ",docLine);
        console.log("form inpt", inputList);

        fetcher("/gw/aprv/AprvDrftUpload", 
            {
                method:"POST",
                body: {
                    drftDocReq : drftDoc,
                    drftLineReq : docLine,
                    drftInptReq : inputList
                }        
            }
        ).then(res=>{
            console.log(res)
            alert("기안 작성 완료")
            navigate(`/approval/${sideId}`)
        })
    }
    const fn_verChange = (e) => {
        console.log(e.target.value)
        let drftId = e.target.value;
        setDocVer(drftId)
        navigate(`/approval/${sideId}/${draft}/${drftId}`)
    }

    return (
        <>
            <h4>재기안</h4>
            <div className="draftForm basicForm" >
                <div>문서 제목 <input type="text" name="docTitle" value={docTitle || ""} onChange={(e)=>setDocTitle(e.target.value)}/></div>
                <div>파일 첨부 <input type="file" name="docFile"/></div>
            </div>
            <br/>
            
            <div className="draftForm">
                <RedrftContent docLine={docLine} docFormId={aprvDocDetail.docFormId} setDocLine={setDocLine} 
                    inputList={inputList} setInputList={setInputList}
                    docLoc={docLoc} setDocLoc={setDocLoc}
                    docEmp={docEmp} setDocEmp={setDocEmp}/>
                
                {rejectData.aprvPrcsEmpId && <div>
                    <h3>반려사유</h3>
                    {rejectData.empNm}/{rejectData.rjctRsn}
                </div>}

                {docVerList.length>0 && 
                    <select name="docVer" value={docVer || ""} onChange={fn_verChange}>
                        {docVerList.map((v, k)=><option key={k} value={v.aprvDocId}>{v.aprvDocVer}</option>)}
                    </select>
                }
            </div>

            
            <div>
                <Button variant='secondary' onClick={fn_drftCancel}>취소</Button>
                <Button variant='secondary' onClick={fn_tempSave}>임시 저장</Button>
                <Button variant='primary' onClick={fn_drftConfirm}>기안</Button>
            </div>
        </>
    );
};

export default RedraftPage;