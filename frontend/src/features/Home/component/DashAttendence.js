import React from 'react';
import dayjs from 'dayjs';

function DashAttendence({ atdc }) {
  if (!atdc) return <div className="no-data">오늘의 근무 정보가 없습니다.</div>;

  // 상태 코드에 따른 한글명 및 색상 정의
  const statusMap = {
    'PRESENT': { label: '출근', color: 'green' },
    'ABSENT': { label: '결근', color: 'red' },
    'LEAVE': { label: '연차', color: 'blue' },
    'OFF': { label: '휴무', color: 'gray' },
    'BUSINESS_TRIP': { label: '출장', color: 'purple' }
  };

  const currentStatus = statusMap[atdc.atdcSttsCd] || { label: atdc.atdcSttsCd, color: 'black' };

  return (
    <div className="atdc-container">
      <div className="atdc-header">
        <span className="wrk-nm-badge">{atdc.wrkNm} {dayjs(atdc.strtTm).format('HH:mm')} ~ {dayjs(atdc.endTm).format('HH:mm')}</span>
        <span className={`stts-badge ${currentStatus.color}`}>{currentStatus.label}</span>
      </div>
      
      <div className="atdc-body">
        <div className="time-box">
          <label>출근 시간</label>
          <span className={atdc.clkInDtm ? "active" : ""}>{dayjs(atdc.clkInDtm).format('HH:mm')}</span>
        </div>
        <div className="time-divider"></div>
        <div className="time-box">
          <label>퇴근 시간</label>
          <span className={atdc.clkOutDtm ? "active" : ""}>{dayjs(atdc.clkOutDtm).format('HH:mm')}</span>
        </div>
      </div>
    </div>
  );
}

export default DashAttendence;