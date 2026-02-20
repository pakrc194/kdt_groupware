import React, { useEffect, useMemo, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import Select from "react-select";
import "../css/MyAttendanceRecodePage.css";

function MyAttendanceRecodePage() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [stats, setStats] = useState(null);
  const thisYear = new Date().getFullYear();
  const [currentYear, setCurrentYear] = useState(String(thisYear));

  
  const yearOptions = useMemo(() => {
    const startYear = 1950;
    const years = [];
    for (let y = thisYear; y >= startYear; y--) {
      years.push(String(y));
    }
    return years;
  }, [thisYear]);
  
  const options = yearOptions.map((year) => ({
    value: year,
    label: `${year}년`,
  }));
  
  const currentOption = options.find(opt => opt.value === currentYear) || options[0];

  useEffect(() => {
    // 백엔드에서 가공된 전체 데이터를 한 번에 호출
    const loadStats = async () => {
      try {
        setStats(null);
        const data = await fetcher(
          `/gw/atdc/myAtSt?year=${currentYear}&empId=${myInfo.empId}`,
        );
        setStats(data);
      } catch (error) {
        console.error("통계 데이터 로드 실패:", error);
      }
    };

    loadStats();
  }, [currentYear]);

  if (!stats)
    return <div className="loading">데이터를 불러오는 중입니다...</div>;

  const { summary, leaveInfo, leaveHistory } = stats;

  return (
    <div className="stats-container">
      <header className="stats-header">
        <h1>개인 근태 통계</h1>
        <Select
          options={options}
          value={currentOption}
          onChange={(opt) => setCurrentYear(opt.value)}
          // 내부적으로 max-height와 스크롤이 이미 구현되어 있음
        />
      </header>

      {/* 1. 상단 요약 카드 섹션 */}
      <div className="summary-grid">
        <div className="stat-card">
          <span className="label">연간 총 근무일</span>
          <span className="value">{summary.totalWorkDays}일</span>
        </div>

        {/* 무결근 일수 강조 */}
        <div className="stat-card streak-highlight">
          <span className="label">현재 개근 기록</span>
          <span className="value streak-value">{summary.streakDays}일차</span>
        </div>

        <div className="stat-card">
          <span className="label">주당 평균 근무시간</span>
          <span className="value">{summary.avgWeeklyHours}h</span>
        </div>
      </div>

      {/* 2. 연차 현황 섹션 */}
      <div className="section leave-section">
        <h3>연차 현황</h3>
        <div className="leave-stats">
          <div className="leave-item">
            총계: <strong>{leaveInfo.totalDays}</strong>
          </div>
          <div className="leave-item">
            사용: <strong>{leaveInfo.usedDays}</strong>
          </div>
          <div className="leave-item highlight">
            잔여: <strong>{leaveInfo.leftDays}</strong>
          </div>
        </div>
        <div className="progress-container">
          <div
            className="progress-bar"
            style={{
              width: `${(leaveInfo.usedDays / leaveInfo.totalDays) * 100}%`,
            }}
          ></div>
        </div>
      </div>

      {/* 3. 연차 사용 기록 리스트 */}
      <div className="section history-section">
        <h3>연차 사용 내역</h3>
        <table className="history-table">
          <thead>
            <tr>
              <th>사용 날짜</th>
              <th>상태</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {leaveHistory.length > 0 ? (
              leaveHistory.map((item, idx) => (
                <tr key={idx}>
                  <td>{item.leaveDate}</td>
                  <td>
                    <span className="badge-leave">{item.leaveType}</span>
                  </td>
                  <td>{item.status}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="no-data">
                  연차 사용 기록이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
export default MyAttendanceRecodePage;
