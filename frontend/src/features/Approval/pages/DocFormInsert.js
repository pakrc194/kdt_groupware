import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ApprovalLine from '../components/ApprovalLine';
import Button from '../../../shared/components/Button';
import EditAprvLine from '../components/modals/EditAprvLine';
import { fetcher } from '../../../shared/api/fetcher';
import './DocFormInsert.css';

const DocFormInsert = () => {
    const navigate = useNavigate();
    const ORDER = { DRFT: 0, DRFT_REF: 1, MID_ATRZ: 2, MID_REF: 3, LAST_ATRZ: 4 };

    const [docFormNm, setDocFormNm] = useState("");
    const [docFormCd, setDocFormCd] = useState("");
    const [docFormType, setDocFormType] = useState("");
    const [docAtrzType, setDocAtrzType] = useState("");
    const [docAtrzStts, setDocAtrzStts] = useState("");
    const [isLocUsed, setIsLocUsed] = useState("Y");
    const [docLine, setDocLine] = useState([]);
    const [isEditLineOpen, setIsEditLineOpen] = useState(false);
    const [docTextArea, setDocTextArea] = useState("");
    const [deptList, setDeptList] = useState([])

    const [selectedDepts, setSelectedDepts] = useState([]);
    useEffect(() => {
        //fetcher(`/gw/aprv/AprvLocList`).then(setLocList);
        fetcher(`/gw/aprv/AprvDeptList`).then(setDeptList);
    }, []);


    const handleDeptCheck = (deptId) => {
        setSelectedDepts(prev => {
            if (prev.includes(deptId)) {
                return prev.filter(id => id !== deptId); // 이미 있으면 제거 (체크 해제)
            } else {
                return [...prev, deptId]; // 없으면 추가 (체크)
            }
        });
    };

    const fn_editLine = () => setIsEditLineOpen(true);
    const fn_editLineClose = () => setIsEditLineOpen(false);
    const fn_editLineOk = (addLine) => {
        setIsEditLineOpen(false);
        setDocLine(prev => {
            const next = [...prev, {
                roleCd: addLine.roleCd,
                aprvPrcsEmpId: addLine.empId,
                aprvPrcsEmpNm: addLine.empNm,
                roleSeq: 0,
            }];
            next.sort((a, b) => (ORDER[a.roleCd] ?? 999) - (ORDER[b.roleCd] ?? 999));
            const refCounters = { DRFT_REF: 0, MID_REF: 0 };
            return next.map(item => {
                if (item.roleCd === "DRFT_REF" || item.roleCd === "MID_REF") {
                    refCounters[item.roleCd] += 1;
                    return { ...item, roleSeq: refCounters[item.roleCd] };
                }
                return { ...item, roleSeq: 0 };
            });
        });
    };

    const fn_resetLine = () => {
        setDocLine([])
    }

    const fn_formOk = () => {
        if(!docLine.find(v=>v.roleCd=="LAST_ATRZ")) return alert("최종 결재자가 없습니다.");
        const upperCaseReg = /^[A-Z]{2}$/;
        if (!upperCaseReg.test(docFormCd)) {
            return alert("양식 코드는 영어 대문자 2자리여야 합니다. (예: VA, BT)");
        }
        
        if(!docFormNm || !docFormCd || !docFormType) return alert("필수 정보를 입력해주세요.");
        
        const docDepts = selectedDepts.join(",");


        fetcher(`/gw/aprv/AprvFormCreate`, {
            method: "POST",
            body: { docFormNm, docFormCd, docFormType, docLine, isLocUsed, docTextArea, docDepts }
        }).then(res => {
            if (res.res === "success") {
                alert("양식 등록 완료");
                navigate("/approval/docFormBox");
            } else {
                alert("양식 등록 실패");
            }
        });
    };

    return (
        <div className="form-reg-container">
            <div className="form-reg-header">
                <nav className="breadcrumb">양식보관함 &gt; <strong>양식등록</strong></nav>
                <h2>새 결재 양식 등록</h2>
            </div>

            <div className="form-reg-body">
                {/* 기본 정보 - 세로 한 행씩 배치 */}
                <section className="form-section">
                    <h3 className="section-subtitle">기본 정보</h3>
                    <div className="form-vertical-layout">
                        <div className="form-group-row">
                            <label>양식 제목</label>
                            <input 
                                placeholder="예: 연차 신청서"
                                value={docFormNm} 
                                onChange={(e) => setDocFormNm(e.target.value)} 
                            />
                        </div>
                        <div className="form-group-row">
                            <label>양식 코드</label>
                            <input 
                                placeholder="2글자 영어 입력(예: VA)"
                                value={docFormCd} 
                                onChange={(e) => setDocFormCd(e.target.value)} 
                            />
                        </div>
                        <div className="form-group-row">
                            <label>문서 유형</label>
                            <select value={docFormType} onChange={(e) => setDocFormType(e.target.value)}>
                                <option value="" disabled>선택하세요</option>
                                {/* <option value="근태">근태</option> */}
                                <option value="일정">일정</option>
                                <option value="일반">일반</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* ✅ 사용 부서 선택 추가 */}
                <section className="form-section animated-fade">
                    <h3 className="section-subtitle">양식 사용 가능 부서 선택 (미선택 시 전체)</h3>
                    <div className="checkbox-group" style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        {deptList.map((dept, index) => (
                            <label key={index} className="checkbox-item" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                <input
                                    type="checkbox"
                                    checked={selectedDepts.includes(dept.deptId)}
                                    onChange={() => handleDeptCheck(dept.deptId)}
                                />
                                <span>{dept.deptName}</span> {/* 서버에서 주는 부서 이름 필드명에 맞게 수정 */}
                            </label>
                        ))}
                    </div>
                </section>


                {/* 결재선 설정 */}
                <section className="form-section">
                    <div className="section-title-wrap">
                        <h3 className="section-subtitle">결재선 설정</h3>
                        <Button variant="outline" onClick={fn_editLine}>결재선 추가</Button>
                        <Button variant="outline" onClick={fn_resetLine}>결재선 초기화</Button>
                    </div>
                    <div className="approval-line-viewer">
                        <ApprovalLine docLine={docLine} />
                    </div>
                    {isEditLineOpen && (
                        <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk} />
                    )}
                </section>

                {/* 일정 옵션 */}
                {docFormType === "일정" && (
                    <section className="form-section animated-fade">
                        <h3 className="section-subtitle">일정 관리 옵션 (장소)</h3>
                        <div className="radio-group">
                            <label className="radio-item">
                                <input 
                                    type="radio" 
                                    name="locUsage" 
                                    value="Y" 
                                    checked={isLocUsed === "Y"} 
                                    onChange={(e) => setIsLocUsed(e.target.value)} 
                                />
                                <span>사용함</span>
                            </label>
                            <label className="radio-item">
                                <input 
                                    type="radio" 
                                    name="locUsage" 
                                    value="N" 
                                    checked={isLocUsed === "N"} 
                                    onChange={(e) => setIsLocUsed(e.target.value)} 
                                />
                                <span>사용 안함</span>
                            </label>
                        </div>
                    </section>
                )}

                {/* 근태 옵션 */}
                {docFormType === "근태" && (
                    <section className="form-section animated-fade">
                        <h3 className="section-subtitle">근태 관리 옵션</h3>
                        <div className="form-vertical-layout">
                            <div className="form-group-row">
                                <label>처리 방식</label>
                                <select value={docAtrzType} onChange={(e) => setDocAtrzType(e.target.value)}>
                                    <option value="" disabled>선택</option>
                                    <option>추가</option><option>수정</option><option>삭제</option>
                                </select>
                            </div>
                            <div className="form-group-row">
                                <label>상태 정의</label>
                                <select value={docAtrzStts} onChange={(e) => setDocAtrzStts(e.target.value)}>
                                    <option value="" disabled>선택</option>
                                    <option>휴가</option><option>출장</option><option>출근</option><option>결근</option>
                                </select>
                            </div>
                        </div>
                    </section>
                )}

                {docFormType === "일반" && (
                    <section className="form-section animated-fade">
                        <div className="section-header-flex">
                            <h3 className="section-subtitle">일반 양식 본문 설정</h3>
                            <span className="helper-text">기안자가 작성할 기본 레이아웃이나 안내 문구를 입력하세요.</span>
                        </div>
                        
                        <div className="textarea-wrapper">
                            <textarea 
                                className="doc-large-textarea"
                                placeholder="여기에 양식의 기본 내용을 입력하세요... (예: 1. 목적, 2. 상세내용 등)"
                                value={docTextArea} 
                                onChange={(e) => setDocTextArea(e.target.value)} 
                            />
                        </div>
                    </section>
                )}
            </div>

            <div className="form-reg-footer">
                <Button variant="secondary" onClick={() => navigate(-1)}>취소</Button>
                <Button variant="primary" onClick={fn_formOk}>양식 등록 완료</Button>
            </div>
        </div>
    );
};

export default DocFormInsert;