import React, { useMemo, useState, useEffect } from 'react';
import './AttendContent.css'

const AttendContent = ({ idList = [], attendList = [], dutyList = [], schedList = [], drftDate = {} }) => {
    // 🔥 현재 선택된 사용자의 ID를 관리하는 상태
    const [selectedId, setSelectedId] = useState(null);

    const matchedData = useMemo(() => {
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
    }, [idList, attendList, dutyList, schedList]);

    // 🔥 데이터가 로드되면 첫 번째 사용자를 자동으로 선택
    useEffect(() => {
        if (matchedData.length > 0 && !selectedId) {
            setSelectedId(matchedData[0].id);
        }
    }, [matchedData, selectedId]);

    if (idList.length > 0 && matchedData.length === 0) {
        return <div className="attend-modal-container">데이터를 분석 중입니다...</div>;
    }

    const hasAnyData = matchedData.some(user => user.attend || user.duty.length > 0 || user.sched.length > 0);
    if (!hasAnyData) {
        return ;
    }

    return (
        <div className="attend-modal-container">
            {/* 1. 상단 사용자 선택 탭 (이름 클릭 바) */}
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
                    <h3 className="user-name-title">
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