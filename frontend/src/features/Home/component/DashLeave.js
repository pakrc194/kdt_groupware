import React from "react";

function DashLeave({ leave }) {
  if (!leave) return <div>연차 데이터 로딩 중...</div>;

  return (
    <div className="leave-flex">
      <div className="leave-box">
        <label>부여</label>
        <span>{leave.totalDays}</span>
      </div>
      <div className="leave-box">
        <label>사용</label>
        <span>{leave.usedDays}</span>
      </div>
      <div className="leave-box blue">
        <label>잔여</label>
        <span>{leave.leftDays}</span>
      </div>
    </div>
  );
}

export default DashLeave;
