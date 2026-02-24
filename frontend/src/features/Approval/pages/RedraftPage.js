import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';
import RedrftContent from '../components/RedrftContent';
import './VerTable.css'

const RedraftPage = () => {
    const { sideId, draft, docId } = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const navigate = useNavigate();

    // --- [State] DraftPage와 동일하게 동기화 ---
    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [docTitle, setDocTitle] = useState("");
    const [docLine, setDocLine] = useState([]);
    const [inputList, setInputList] = useState([]);
    const [docLoc, setDocLoc] = useState({ locNm: '장소 선택' });
    const [docEmp, setDocEmp] = useState({ locNm: '담당자 지정' });
    const [selectedFiles, setSelectedFiles] = useState([]); // 파일 상태 추가
    const [isAttendConfirm, setIsAttendConfirm] = useState(false); // 근태 확인 상태 추가
    
    const [docVerList, setDocVerList] = useState([]);
    const [rejectData, setRejectData] = useState(null);

    // --- [Effect] 데이터 로드 ---
    useEffect(() => {
        // 결재선 및 반려 데이터
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res => {
            setDocLine(res);
            const rejected = res.find(v => v.aprvPrcsStts === 'REJECTED');
            if (rejected) setRejectData(rejected);
        });
        // 입력값 데이터
        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(res => {
            setInputList(res);
        });
        // 문서 상세 정보
        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res => {
            setAprvDocDetail(res);
            setDocTitle(res.aprvDocTtl);
        });
    }, [docId]);

    useEffect(() => {
        if (aprvDocDetail.aprvDocNo && aprvDocDetail.aprvDocNo.length>2) {
            fetcher(`/gw/aprv/AprvDocVerList`, {
                method: "POST",
                body: { 
                    empId: myInfo.empId,
                    docNo: aprvDocDetail.aprvDocNo 
                }
            }).then(res => setDocVerList(res));
        }
    }, [aprvDocDetail]);

    // --- [Functions] 로직 동기화 ---

    // 1. 결재선 초기화 (양식의 기본 결재선으로 복구)
    const fn_lineReset = () => {
        if (!aprvDocDetail.docFormId) return;
        
        if (window.confirm("현재 설정된 결재선을 양식 기본값으로 초기화하시겠습니까?")) {
            fetcher(`/gw/aprv/AprvDocFormLine/${aprvDocDetail.docFormId}`)
            .then(res => {
                const drafter = {
                    aprvPrcsEmpId: myInfo.empId,
                    aprvPrcsEmpNm: myInfo.empNm,
                    roleCd: "DRFT",
                    roleSeq: "0"
                };
                setDocLine([drafter, ...res]);
                alert("결재선이 초기화되었습니다.");
            });
        }
    };

    const FileUpload = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };

    const fn_uploadTest = (newDocId) => {
        const formData = new FormData();
        formData.append("aprvDocId", newDocId);
        selectedFiles.forEach((file) => {
            formData.append("docFile", file);
        });

        fetcher(`/gw/aprv/AprvFileUpload`, {
            method: "POST",
            body: formData
        }).then(() => {
            alert("재기안 작성 완료");
            navigate(`/approval/draftBox`);
        });
    };

    const fn_drftConfirm = () => {
        // 유효성 검사 (DraftPage 로직 복사)
        if (!myInfo?.empId) return alert("회원정보가 없습니다");
        if (!docTitle?.trim()) return alert("문서 제목을 입력하세요");
        
        const docRole = inputList.find(v => v.docInptNm === "docRole");
        const docStart = inputList.find(v => v.docInptNm === "docStart");
        const docEnd = inputList.find(v => v.docInptNm === "docEnd");
        const docLocInput = inputList.find(v => v.docInptNm === "docLoc");

        if (docRole && docRole.docInptVl == null) return alert("담당을 선택해주세요");
        if (docStart && docStart.docInptVl == null) return alert("시작날짜를 선택해주세요");
        if (docEnd && docEnd.docInptVl == null) return alert("종료날짜를 선택해주세요");
        if (aprvDocDetail.docFormType === "근태" && !isAttendConfirm) return alert("근태를 조회하세요");
        if (docLocInput && docLocInput.docInptVl == null) return alert("장소를 선택해주세요");

        const drftDoc = {
            drftEmpId: myInfo.empId,
            docFormId: aprvDocDetail.docFormId,
            aprvDocNo: aprvDocDetail.aprvDocNo,
            aprvDocTtl: docTitle
        };

        fetcher("/gw/aprv/AprvDrftUpload", {
            method: "POST",
            body: {
                drftDocReq: drftDoc,
                drftLineReq: docLine,
                drftInptReq: inputList
            }
        }).then(res => {
            let newId = res.result.drftDocReq.aprvDocId;
            if (selectedFiles.length > 0) {
                fn_uploadTest(newId);
            } else {
                alert("재기안 작성 완료");
                navigate(`/approval/draftBox`);
            }
        });
    };

    const fn_tempSave = () => {
        const drftDoc = {
            drftEmpId: myInfo.empId,
            docFormId: aprvDocDetail.docFormId,
            aprvDocNo: aprvDocDetail.aprvDocNo,
            aprvDocTtl: docTitle
        };

        fetcher("/gw/aprv/AprvDrftTemp", {
            method: "POST",
            body: {
                drftDocReq: drftDoc,
                drftInptReq: inputList
            }
        }).then(() => {
            alert("임시저장 완료")
            navigate(`/approval/tempBox`);
        });
    };

    const fn_drftCancel = () => {
        navigate(`/approval/${sideId}`);
    };

    return (
        <div className="drft-container">
            <header className="drft-header">
                <h2 className="drft-page-title">{sideId=="tempBox"?"임시저장함" : "반려함"} <span className="sep">›</span> 재기안</h2>
            </header>

            <main className="drft-main">
                {/* 1. 기본정보 카드 */}
                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">기본정보</h3>
                    </div>
                    <div className="drft-card-body">
                        <div className="drft-unit">
                            <div className="drft-unit-top">
                                <label className="drft-label">문서 제목</label>
                            </div>
                            <div className="drft-control">
                                <input
                                    className="drft-input"
                                    type="text"
                                    name="docTitle"
                                    value={docTitle || ""}
                                    onChange={(e) => setDocTitle(e.target.value)}
                                    placeholder="문서 제목을 입력하세요"
                                />
                            </div>
                        </div>
                        <div className="drft-unit">
                            <div className="drft-unit-top">
                                <label className="drft-label">파일첨부</label>
                            </div>
                            <div className="drft-control">
                                <div className="drft-file-box">
                                    <input className="drft-file-input" type="file" name="docFile" onChange={FileUpload} multiple />
                                    {selectedFiles?.length > 0 && (
                                        <ul className="fileList">
                                            {selectedFiles.map((file, idx) => (
                                                <li key={idx} className="fileItem">{file.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 반려사유 */}
                {rejectData && (
                    <section className="drft-card">
                        <div className="drft-card-header">
                            <h3 className="drft-card-title" style={{color: '#e74c3c'}}>반려사유</h3>
                        </div>
                        <div className="drft-card-body">
                            <div className="drft-unit">
                                <strong>{rejectData.aprvPrcsEmpNm}</strong>: {rejectData.rjctRsn}
                            </div>
                        </div>
                    </section>
                )}

                {/* 3. 작성내용 카드 */}
                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">작성내용</h3>
                    </div>
                    <div className="drft-card-body">
                        <RedrftContent 
                            docLine={docLine} 
                            docFormId={aprvDocDetail.docFormId} 
                            docFormType={aprvDocDetail.docFormType}
                            setDocLine={setDocLine} 
                            inputList={inputList} 
                            setInputList={setInputList}
                            docLoc={docLoc} 
                            setDocLoc={setDocLoc}
                            docEmp={docEmp} 
                            setDocEmp={setDocEmp}
                            isAttendConfirm={isAttendConfirm}
                            setIsAttendConfirm={setIsAttendConfirm}
                        />
                    </div>
                </section>
                {docVerList.length > 0 && 
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
                                {docVerList.map((aprvDoc, k) => {
                                    const isCurrent = String(aprvDoc.aprvDocId) === String(docId);
                                    return (
                                        <tr key={k} className={isCurrent ? "current-doc-row" : ""}>
                                            <td>{aprvDoc.aprvDocVer}</td>
                                            <td>
                                                {isCurrent ? (
                                                    <span className="current-doc-title">{aprvDoc.aprvDocTtl}</span>
                                                ) : (
                                                    <Link to={`/approval/${sideId}/redrft/${aprvDoc.aprvDocId}`}>
                                                        {aprvDoc.aprvDocTtl}
                                                    </Link>
                                                )}
                                            </td>
                                            <td>{aprvDoc.aprvDocDrftDt?.substring(0, 8)}</td>
                                            <td>{aprvDoc.aprvDocAtrzDt?.substring(0, 8) || '-'}</td>
                                            <td>{aprvDoc.rjctRsn}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>}
            </main>

            <div className="actionBar">
                <Button variant='secondary' onClick={fn_drftCancel}>취소</Button>
                <Button variant='secondary' onClick={fn_tempSave}>임시 저장</Button>
                <Button variant='primary' onClick={fn_drftConfirm}>기안</Button>
            </div>
        </div>
    );
};

export default RedraftPage;