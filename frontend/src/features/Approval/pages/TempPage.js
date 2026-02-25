import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';
import CompListModal from '../components/modals/CompListModal';
import DrftContent from '../components/DrftContent';

const TempPage = () => {
    const navigate = useNavigate();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const { sideId, docId } = useParams();

    // --- [State] ---
    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [docTitle, setDocTitle] = useState("");
    const [docLine, setDocLine] = useState([
        {
            aprvPrcsEmpId: myInfo.empId,
            aprvPrcsEmpNm: myInfo.empNm,
            roleCd: "DRFT",
            roleSeq: "0"
        }
    ]);
    const [docForm, setDocForm] = useState({ docFormNm: '양식 선택' });
    const [docLoc, setDocLoc] = useState({ locNm: '장소 선택' });
    const [docEmp, setDocEmp] = useState({ locNm: '담당자 지정' });
    
    const [inputList, setInputList] = useState([]);
    const [formList, setFormList] = useState([]);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isAttendConfirm, setIsAttendConfirm] = useState(false); // 근태 확인 상태 추가

    // --- [Effect] 초기 데이터 로드 ---
    useEffect(() => {
        if (!docId) return;

        // 1. 저장된 입력값 로드
        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(setInputList);

        // 2. 문서 상세 정보 로드 (제목 등)
        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res => {
            setAprvDocDetail(res);
            setDocTitle(res.aprvDocTtl);
        });
    }, [docId]);

    // 3. 전체 양식 목록 로드
    useEffect(() => {
        fetcher("/gw/aprv/AprvDocFormList").then(setFormList);
    }, []);

    // 4. 문서 상세 정보와 양식 목록이 매칭되면 현재 양식 설정
    useEffect(() => {
        if (!aprvDocDetail?.docFormId || !formList?.length) return;
        const ttForm = formList.find(v => v.docFormId === aprvDocDetail.docFormId);
        if (ttForm) setDocForm(ttForm);
    }, [aprvDocDetail?.docFormId, formList]);

    // 5. 양식에 따른 기본 결재선 로드 (기존 저장된 결재선이 없을 경우를 대비하거나 초기화용)
    useEffect(() => {
        const formId = docForm?.docFormId;
        if (!formId) return;

        fetcher(`/gw/aprv/AprvDocFormLine/${formId}`)
            .then(res => {
                setDocLine(prev => {
                    const drafter = prev?.find(v => v.roleCd === "DRFT");
                    return drafter ? [drafter, ...res] : [
                        { aprvPrcsEmpId: myInfo.empId, aprvPrcsEmpNm: myInfo.empNm, roleCd: "DRFT", roleSeq: "0" },
                        ...res
                    ];
                });
            })
            .catch(e => console.error("fetch formLine error:", e));
    }, [docForm?.docFormId]);

    // --- [Functions] ---

    const fn_formClick = () => {
        setIsFormOpen(true);
    };

    const fn_formClose = () => setIsFormOpen(false);

    const fn_formOk = (form) => {
        fetcher(`/gw/aprv/AprvDocFormLine/${form.docFormId}`)
            .then(res => {
                const drafter = {
                    aprvPrcsEmpId: myInfo.empId,
                    aprvPrcsEmpNm: myInfo.empNm,
                    roleCd: "DRFT",
                    roleSeq: "0"
                };
                setDocLine([drafter, ...res]);
                setDocForm(form);
                // 양식 변경 시 입력 항목 초기화
                fetcher(`/gw/aprv/AprvDocInpt/${form.docFormId}`).then(setInputList);
                setIsFormOpen(false);
            });
    };

    const fn_drftConfirm = () => {
        // 유효성 검사
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
            docFormId: docForm.docFormId,
            aprvDocNo: aprvDocDetail.aprvDocNo, // 기존 문서 번호 유지
            aprvDocTtl: docTitle
        };

        fetcher("/gw/aprv/AprvDrftUpload", {
            method: "POST",
            body: {
                drftDocReq: drftDoc,
                drftLineReq: docLine,
                drftInptReq: inputList
            }
        }).then(() => {
            alert("기안이 완료되었습니다.");
            navigate("/approval/draftBox");
        });
    };

    const fn_tempSave = () => {
        const drftDoc = {
            drftEmpId: myInfo.empId,
            docFormId: docForm.docFormId,
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
            alert("임시 저장이 완료되었습니다.");
            navigate(`/approval/${sideId}`);
        });
    };

    const fn_drftCancel = () => navigate(`/approval/${sideId}`);

    return (
        <div className="drft-container">
            <header className="drft-header">
                <h2 className="drft-page-title">임시저장함 <span className="sep">›</span> 문서 작성</h2>
            </header>

            <main className="drft-main">
                {/* 1. 기본정보 설정 */}
                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">기본정보</h3>
                    </div>
                    <div className="drft-card-body">
                        <div className="drft-unit">
                            <div className="drft-unit-top"><label className="drft-label">문서 제목</label></div>
                            <div className="drft-control">
                                <input 
                                    className="drft-input" 
                                    type="text" 
                                    value={docTitle || ""} 
                                    onChange={(e) => setDocTitle(e.target.value)} 
                                />
                            </div>
                        </div>
                        
                    </div>
                </section>

                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">양식</h3>
                    </div>
                    <div className="drft-card-body">
                        <div className="drft-unit">
                            <div className="drft-unit-top">
                                <label className="drft-label">양식 선택</label>
                                <div className="drft-unit-action">
                                    <Button variant="primary" onClick={fn_formClick}>양식 선택</Button>
                                </div>
                            </div>
                            <div className="drft-control">
                                <input
                                    className="drft-input"
                                    type="text"
                                    name="docFormNm"
                                    value={docForm?.docFormNm || ""}
                                    readOnly
                                    placeholder="양식을 선택하세요"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                {/* 2. 상세 작성 내용 (DrftContent 활용) */}
                {docForm?.docFormId && (
                    <section className="drft-card">
                        <div className="drft-card-header">
                            <h3 className="drft-card-title">작성내용</h3>
                        </div>
                        <div className="drft-card-body">
                            <DrftContent 
                                docFormType={docForm.docFormType} 
                                docFormId={docForm.docFormId} 
                                docLine={docLine} 
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
                )}
            </main>

            {/* 하단 액션 바 */}
            <div className="actionBar">
                <Button variant='secondary' onClick={fn_drftCancel}>취소</Button>
                <Button variant='secondary' onClick={fn_tempSave}>임시 저장</Button>
                <Button variant='primary' onClick={fn_drftConfirm}>기안</Button>
            </div>

            {/* 양식 선택 모달 */}
            {isFormOpen && (
                <CompListModal 
                    onClose={fn_formClose} 
                    onOk={fn_formOk} 
                    itemList={formList} 
                    itemNm={"docFormNm"} 
                    title={"양식선택"} 
                    okMsg={"불러오기"} 
                />
            )}
        </div>
    );
};

export default TempPage;