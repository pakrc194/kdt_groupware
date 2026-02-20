import React from 'react';

function DashAttendence({ atdc }) {
  if (!atdc) return <div className="no-data">오늘의 근무 정보가 없습니다.</div>;

  // 상태 코드에 따른 한글명 및 색상 정의
  const statusMap = {
    'PRESENT': { label: '정상', color: 'green' },
    'ABSENT': { label: '결근', color: 'red' },
    'LEAVE': { label: '연차', color: 'blue' },
    'OFF': { label: '휴무', color: 'gray' },
    'BUSINESS_TRIP': { label: '출장', color: 'purple' }
  };

  const currentStatus = statusMap[atdc.atdcSttsCd] || { label: atdc.atdcSttsCd, color: 'black' };

  // 시간 포맷팅 함수 (ISO string에서 시:분만 추출)
  const formatTime = (dtm) => {
    if (!dtm) return "-- : --";
    const date = new Date(dtm);
    return date.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
  };

  return (
    <div className="atdc-container">
      <div className="atdc-header">
        <span className="wrk-nm-badge">{atdc.wrkNm}</span>
        <span className={`stts-badge ${currentStatus.color}`}>{currentStatus.label}</span>
      </div>
      
      <div className="atdc-body">
        <div className="time-box">
          <label>출근 시간</label>
          <span className={atdc.clkInDtm ? "active" : ""}>{formatTime(atdc.clkInDtm)}</span>
        </div>
        <div className="time-divider"></div>
        <div className="time-box">
          <label>퇴근 시간</label>
          <span className={atdc.clkOutDtm ? "active" : ""}>{formatTime(atdc.clkOutDtm)}</span>
        </div>
      </div>
    </div>
  );
}

export default DashAttendence;