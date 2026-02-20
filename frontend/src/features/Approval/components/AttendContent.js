import React, { useMemo, useState, useEffect } from 'react';
import './AttendContent.css'

const AttendContent = ({docRole="PERSONAL", title = "", idList = [], attendList = [], dutyList = [], schedList = [], drftDate = {} }) => {
    const [selectedId, setSelectedId] = useState(null);

    // 1. 개인(PERSONAL) 모드일 때만 데이터를 ID별로 묶음
    const matchedData = useMemo(() => {
        //if (docRole !== "PERSONAL") return []; // 개인 모드가 아니면 빈 배열
        if (!idList || !Array.isArray(idList)) return [];

        const safeDuty = Array.isArray(dutyList) ? dutyList.flat() : [];
        const safeSched = Array.isArray(schedList) ? schedList.flat() : [];

        return idList.map(id => {
            const targetId = String(id);
            return {
                id: id,
                attend: attendList?.find(a => String(a?.empId) === targetId) || null,
                duty: safeDuty.filter(d => String(d?.empId) === targetId),
                sched: safeSched.filter(s => String(s?.empId) === targetId)
            };
        });
    }, [idList, attendList, dutyList, schedList, docRole]);

    // 2. 초기 탭 선택 (PERSONAL 모드 전용)
    useEffect(() => {
        if (docRole === "PERSONAL" && matchedData.length > 0 && !selectedId) {
            setSelectedId(matchedData[0].id);
        }
    }, [matchedData, selectedId, docRole]);


    // ==========================================
    // 렌더링 분기: 부서 / 회사 모드 (DEPT / COMPANY)
    // ==========================================
    if (docRole === "DEPT" || docRole === "COMPANY") {
        const safeSched = Array.isArray(schedList) ? schedList.flat() : [];
        if (safeSched.length === 0) return null; // 일정이 없으면 그리지 않음

        return (
            <div className="attend-modal-container group-mode">
                <h3 className="user-name-title">🏢 {title || (docRole === "DEPT" ? "부서 일정 현황" : "전사 일정 현황")}</h3>
                <div className="attend-section">
                    <h4 className="section-title">일정 목록 ({drftDate?.docStart || '-'} ~ {drftDate?.docEnd || '-'})</h4>
                    <div className="data-list">
                        {safeSched.map((v, k) => (
                            <div className="data-item schedule" key={`group-sched-${k}`}>
                                {/* 부서 일정일 때는 부서명을 보여주는 것이 좋습니다 */}
                                {docRole === "DEPT" && v.deptName && <span className="dept-badge">{v.deptName}</span>}
                                <span className="title">{v.schedTitle}</span>
                                <span className="period">
                                    {v.schedStartDate?.substring(0, 10)} ~ {v.schedEndDate?.substring(0, 10)}
                                </span>
                                <span className="type-badge blue">{v.schedType}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }


    // ==========================================
    // 렌더링 분기: 개인 모드 (PERSONAL) - 기존 로직 유지
    // ==========================================
    if (idList.length > 0 && matchedData.length === 0) {
        return <div className="attend-modal-container">데이터를 분석 중입니다...</div>;
    }

    const hasAnyData = matchedData.some(user => user.attend || user.duty.length > 0 || user.sched.length > 0);
    if (!hasAnyData) return null;

    return (
        <div className="attend-modal-container personal-mode">
            {title && <h3 className="user-name-title" style={{marginBottom: '10px'}}>{title}</h3>}
            
            {/* 1. 상단 사용자 선택 탭 */}
            <div className="user-selector-tabs">
                {matchedData.map((user) => {
                    const userName = user.duty[0]?.empNm || user.sched[0]?.empNm || user.attend?.empNm || `ID:${user.id}`;
                    return (
                        <button
                            key={user.id}
                            className={`user-tab-btn ${String(selectedId) === String(user.id) ? 'active' : ''}`}
                            onClick={() => setSelectedId(user.id)}
                        >
                            {userName}
                        </button>
                    );
                })}
            </div>

            <hr className="tab-divider" />

            {/* 2. 선택된 사용자의 상세 내용만 표시 */}
            {matchedData
                .filter(user => String(user.id) === String(selectedId))
                .map((user) => (
                <div key={user.id} className="user-attend-group animated-fade-in">
                    <h3 className="user-name-title" style={{fontSize: '14px', color: '#666'}}>
                        👤 {user.duty[0]?.empNm || user.sched[0]?.empNm || user.attend?.empNm || `사용자(${user.id})`} 상세 현황
                    </h3>

                    {/* 연차 섹션 */}
                    {user.attend && (
                        <div className="attend-section">
                            <h4 className="section-title">{user.attend.baseYy} 연차 현황</h4>
                            <div className="leave-count">
                                <span className="current">{user.attend.remLv ?? 0}</span> / 
                                <span className="total">{user.attend.occrrLv ?? 0}</span>
                            </div>
                        </div>
                    )}

                    {/* 근태 상세 */}
                    {user.duty.length > 0 && (
                        <div className="attend-section">
                            <h4 className="section-title">근태 상세 ({drftDate?.docStart || '-'} ~ {drftDate?.docEnd || '-'})</h4>
                            <div className="data-list">
                                {user.duty.map((v, k) => (
                                    <div className="data-item" key={`${v.dutyYmd}-${k}`}>
                                        <span className="date">{v.dutyYmd}</span>
                                        <span className="dept">{v.deptName}</span>
                                        <span className="type-badge">{v.wrkCd}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* 일정 상세 */}
                    {user.sched.length > 0 && (
                        <div className="attend-section">
                            <h4 className="section-title">개인 일정</h4>
                            <div className="data-list">
                                {user.sched.map((v, k) => (
                                    <div className="data-item schedule" key={`${v.schedTitle}-${k}`}>
                                        <span className="title">{v.schedTitle}</span>
                                        <span className="period">
                                            {v.schedStartDate?.substring(0, 10)} ~ {v.schedEndDate?.substring(0, 10)}
                                        </span>
                                        <span className="type-badge blue">{v.schedType}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default AttendContent;