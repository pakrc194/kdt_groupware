import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';
import AttendContent from '../components/AttendContent';
import DutyForm from './DutyForm';
import './ApprovalDetail.css'
import { formatToKor } from '../../../shared/func/formatToDate';

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


    const schedFilter = {};

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
            // console.log("inptList ",res)
        })

        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res=>{
            // console.log("detail ", res)
            setAprvDocDetail(res)
        })

        fetcher(`/gw/aprv/AprvDocFile/${docId}`).then(res=>{
            // console.log("file ", res)
            setDocFile(res)
        })

        fetcher(`/gw/aprv/AprvLocList`).then(res=>{
            // console.log("AprvLocList", res)
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
            // console.log("verList",res)
            setDocVerList(res);
        })

        const docRole = inputList.find(v=>v.docInptNm==="docRole")
        // console.log("docRole", docRole)
        if(docRole!=null) {
            if(docRole.docInptVl=="PERSONAL") {
                fetcher(`/gw/aprv/AprvDeptEmpList`).then(res=>{
                        res.map(v=>{
                            schedFilter[v.empId] = v.empNm
                        })
                        // console.log("personal", schedFilter)
                        setVlFilter(schedFilter)
                    });
            } else if(docRole.docInptVl=="DEPT") {
                fetcher(`/gw/aprv/AprvDeptList`).then(res=>{
                    res.map(v=>{
                        schedFilter[v.deptId] = v.deptName
                    })
                    // console.log("dept", schedFilter)
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


        // console.log("warnAttend", ids, docStart, docEnd)

        fetcher("/gw/aprv/AprvEmpAnnlLv", {
            method:"POST",
            body: {
                role : docRole,
                ids : ids,
                deptId: deptId,
                year:2026
            }
        }).then(res => {
            // console.log("fetch AprvEmpAnnlLv",res)
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
            // console.log("fetch AprvSchedList",res)
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

        // console.log("일정확인 ",docRole, schedType, drftEmpId, ids)

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
                // console.log("fetch AprvEmpAnnlLv",res)
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
                // console.log("fetch AprvSchedList",res)
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
            // console.log(`fetch AprvDrftDelete ${res.res}`)
            alert("기안 취소 되었습니다.")
            navigate(`/approval/${sideId}`);
        })
    }
    const fn_verChange = (item) => {
        
        navigate(`/approval/rejectBox/detail/${item.aprvDocId}`)
    }

    return (
        <div className="aprv-detail-wrapper">
            {/* 상단 경로 안내 */}
            <div className="aprv-detail-path">
                전자결재 &rsaquo; {sideTitleMap[sideId]} &rsaquo; <strong>{aprvDocDetail.aprvDocTtl}</strong>
            </div>

            {/* 실제 문서 용지 영역 */}
            <div className="aprv-detail-paper">
                <h1 className="aprv-detail-title">{aprvDocDetail.aprvDocTtl}</h1>

                <div className="aprv-detail-top-section">
                    {/* 왼쪽: 기본 정보 테이블 */}
                    <table className="aprv-detail-meta-table">
                        <tbody>
                            <tr>
                                <th>문서번호</th>
                                <td>{aprvDocDetail.aprvDocNo}</td>
                            </tr>
                            <tr>
                                <th>기안자</th>
                                <td>{aprvDocDetail.drftEmpNm}</td>
                            </tr>
                            <tr>
                                <th>기안일시</th>
                                <td>{formatToKor(aprvDocDetail.aprvDocDrftDt)}</td>
                            </tr>
                        </tbody>
                    </table>

                    {/* 오른쪽: 결재선 컴포넌트 */}
                    <div className="aprv-detail-line-box">
                        <ApprovalLineDetail 
                            aprvLine={aprvLine} 
                            setRejectData={setRejectData} 
                            inptList={inputList} 
                            docDetail={aprvDocDetail}
                        />
                    </div>
                </div>

                {/* 문서 본문 입력 항목 */}
                <div className="aprv-detail-content">
                    {inputList.map((v, k) => {
                        let content = null;
                        switch (v.docInptNm) {
                            case "docRole":
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: docRoleMap[v.docInptVl], name: v.docInptNm, option: v.docInptRmrk }} />;
                                break;
                            case "docDuty":
                                content = <DutyForm dutyId={v.docInptVl} />;
                                break;
                            case "docSchedType":
                                let values = v.docInptVl;
                                if (!values || !vlFilter) return null;
                                let tt = values.split(',').map(sc => vlFilter[sc]).join(', ');
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: tt, name: v.docInptNm, option: v.docInptRmrk }} />;
                                break;
                            case "docLoc":
                                if (!locFilter) return null;
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: locFilter[v.docInptVl], name: v.docInptNm, option: v.docInptRmrk }} />;
                                break;
                            default:
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: v.docInptVl, name: v.docInptNm, option: v.docInptRmrk }} />;
                        }
                        return <div key={k} className="aprv-detail-row">{content}</div>;
                    })}
                </div>

                {/* 첨부파일 */}
                {docFile && (
                    <div className="aprv-detail-file-section">
                        <h4><i className="fas fa-paperclip"></i> 첨부파일</h4>
                        <a className="file-link" href={`http://192.168.0.36:8080/board/download/${docFile.fileId}`}>
                            {docFile.originName}
                        </a>
                    </div>
                )}

                {/* 반려 사유 */}
                {rejectData?.aprvPrcsEmpId && (
                    <div className="aprv-reject-box">
                        <h3><i className="fas fa-exclamation-circle"></i> 반려 사유</h3>
                        <p><strong>{rejectData.aprvPrcsEmpNm}</strong>: {rejectData.rjctRsn}</p>
                    </div>
                )}

                {/* 근태 정보 (필요시) */}
                {aprvDocDetail?.aprvDocStts !== "COMPLETE" && (
                    <div className="aprv-detail-extra">
                        <AttendContent attendList={attendList} dutyList={dutyList} schedList={schedList} drftDate={drftDate} />
                    </div>
                )}

                {/* 반려함일 경우 버전 히스토리 */}
                {sideId === "rejectBox" && (
                    <div className="section history-section">
                        <h3 className="sub-title">문서 수정 이력</h3>
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
                                            <tr key={k} className={isCurrent ? "current-doc-row" : ""}>
                                                <td>v{aprvDoc.aprvDocVer}</td>
                                                <td className="txt-left">
                                                    {isCurrent ? (
                                                        <span className="current-doc-title">{aprvDoc.aprvDocTtl}</span>
                                                    ) : (
                                                        <Link to={`/approval/${sideId}/detail/${aprvDoc.aprvDocId}`}>{aprvDoc.aprvDocTtl}</Link>
                                                    )}
                                                </td>
                                                <td>{aprvDoc.aprvDocDrftDt.substring(0, 10)}</td>
                                                <td>{aprvDoc.aprvDocAtrzDt?.substring(0, 10)}</td>
                                                <td>{aprvDoc.rjctRsn}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="5" className="no-data">데이터가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* 하단 고정 버튼 바 */}
            <div className="aprv-detail-actions">
                <Button variant='secondary' onClick={fn_list}>목록으로</Button>
                {sideId === "rejectBox" && <Button variant='primary' onClick={fn_redraft}>재기안 작성</Button>}
                {(!isApproved && aprvDocDetail.drftEmpId == myInfo.empId) && <Button variant='danger' onClick={fn_drftCancel}>기안 취소</Button>}
            </div>
        </div>
    );
};

export default ApprovalDetail;