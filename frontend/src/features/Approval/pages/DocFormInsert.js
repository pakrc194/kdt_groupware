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
    const [locList, setLocList] = useState([]);
    const [docLine, setDocLine] = useState([]);
    const [isEditLineOpen, setIsEditLineOpen] = useState(false);

    useEffect(() => {
        fetcher(`/gw/aprv/AprvLocList`).then(setLocList);
    }, []);

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

    const fn_formOk = () => {
        if(!docFormNm || !docFormCd || !docFormType) return alert("필수 정보를 입력해주세요.");
        fetcher(`/gw/aprv/AprvFormCreate`, {
            method: "POST",
            body: { docFormNm, docFormCd, docFormType, docLine }
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
                                placeholder="FORM_CODE_01"
                                value={docFormCd} 
                                onChange={(e) => setDocFormCd(e.target.value)} 
                            />
                        </div>
                        <div className="form-group-row">
                            <label>문서 유형</label>
                            <select value={docFormType} onChange={(e) => setDocFormType(e.target.value)}>
                                <option value="" disabled>선택하세요</option>
                                <option value="근태">근태</option>
                                <option value="일정">일정</option>
                                <option value="일반">일반</option>
                            </select>
                        </div>
                    </div>
                </section>

                {/* 결재선 설정 */}
                <section className="form-section">
                    <div className="section-title-wrap">
                        <h3 className="section-subtitle">결재선 설정</h3>
                        <Button variant="outline" onClick={fn_editLine}>결재선 추가/수정</Button>
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
                        <div className="checkbox-grid">
                            {locList.map((v, k) => (
                                <label key={k} className="checkbox-item">
                                    <input type="checkbox" name="docLoc" value={v.locId} />
                                    <span>{v.locNm}</span>
                                </label>
                            ))}
                            <label className="checkbox-item none-option">
                                <input type="checkbox" name="docLoc" value="empty" />
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
            </div>

            <div className="form-reg-footer">
                <Button variant="secondary" onClick={() => navigate(-1)}>취소</Button>
                <Button variant="primary" onClick={fn_formOk}>양식 등록 완료</Button>
            </div>
        </div>
    );
};

export default DocFormInsert;