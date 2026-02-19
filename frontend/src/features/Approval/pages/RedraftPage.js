import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';
import RedrftContent from '../components/RedrftContent';
import './VerTable.css'
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
        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(res=>{
            
            setInputList(res)
        })
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
        // console.log("basic : ",drftDoc);
        // console.log("line : ",docLine);
        // console.log("form inpt", inputList);

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
            alert("기안 작성 완료")
            navigate(`/approval/${sideId}`)
        })
    }
    const fn_verChange = (e) => {
        // console.log(e.target.value)
        let drftId = e.target.value;
        setDocVer(drftId)
        navigate(`/approval/${sideId}/${draft}/${drftId}`)
    }

    return (
        <>
            <h4>반려함 &gt; 재기안</h4>
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
                
                {rejectData?.aprvPrcsEmpId && <div>
                    <h3>반려사유</h3>
                    {rejectData.aprvPrcsEmpNm}/{rejectData.rjctRsn}
                </div>}

                

                <div className="section history-section">
                    <table className="history-table">
                    <thead>
                        <tr>
                            <th>버전</th>
                            <th>문서제목</th>
                            <th>기안일자</th>
                            <th>반려일자</th>
                            <th>반려사유</th>
                        </tr>
                    </thead>
                    <tbody>
                    {docVerList.length > 0 ? (
                        docVerList.map((aprvDoc, k) => {
                        const isCurrent = String(aprvDoc.aprvDocId) === String(docId);

                        return (
                            <tr
                            key={k}
                            className={isCurrent ? "current-doc-row" : ""}
                            >
                            <td>{aprvDoc.aprvDocVer}</td>

                            <td>
                                {isCurrent ? (
                                <span className="current-doc-title">
                                    {aprvDoc.aprvDocTtl}
                                </span>
                                ) : (
                                <Link to={`/approval/${sideId}/redrft/${aprvDoc.aprvDocId}`}>
                                    {aprvDoc.aprvDocTtl}
                                </Link>
                                )}
                            </td>

                            <td>{aprvDoc.aprvDocDrftDt.substring(0,8)}</td>
                            <td>{aprvDoc.aprvDocAtrzDt?.substring(0,8)}</td>
                            <td>{aprvDoc.rjctRsn}</td>
                            </tr>
                        );
                        })
                    ) : (
                        <tr>
                        <td colSpan="7" className="no-data">데이터가 없습니다.</td>
                        </tr>
                    )}
                    </tbody>
                    </table>
                </div>
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