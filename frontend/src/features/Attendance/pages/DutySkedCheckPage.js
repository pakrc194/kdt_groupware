import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/DutySkedDetail.css"; // 기존 CSS 활용

function DutySkedCheckPage() {
  const navigate = useNavigate();
  
  // 현재 날짜 기준 yyyy-MM 초기값 세팅
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 근무 코드별 스타일 (기존과 동일)
  const dutyStyles = {
    D: { color: "#e3f2fd", textColor: "#1976d2" },
    E: { color: "#f3e5f5", textColor: "#7b1fa2" },
    N: { color: "#fff3e0", textColor: "#ef6c00" },
    O: { color: "#eeeeee", textColor: "#9e9e9e" },
    WO: { color: "#e8f5e9", textColor: "#2e7d32" },
    OD: { color: "#fce4ec", textColor: "#c2185b" },
  };

  // 선택된 월의 일수 계산
  const getDaysInMonth = useCallback(() => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [selectedMonth]);

  const days = getDaysInMonth();

  // 데이터 로드 (월 변경 시마다 실행)
  useEffect(() => {
    const loadDutyData = async () => {
      try {
        setIsLoading(true);
        // trgtYmd 형식을 yyyyMM으로 변환하여 전달
        const ymd = selectedMonth.replace("-", "");
        const data = await fetcher(`/gw/duty/team-view?trgtYmd=${ymd}`);

        const empMap = {};
        data.details.forEach((item) => {
          if (!empMap[item.empId]) {
            empMap[item.empId] = {
              id: item.empId,
              name: item.empNm,
              group: item.grpNm,
              rotPtnCd: item.rotPtnCd,
              duties: {},
            };
          }
          const dayNum = parseInt(item.dutyYmd.substring(6, 8));
          empMap[item.empId].duties[dayNum] = item.wrkCd;
        });

        setEmployees(Object.values(empMap));
      } catch (error) {
        console.error("근무표 조회 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDutyData();
  }, [selectedMonth]);

  if (isLoading) return <div className="loading">근무표를 불러오는 중...</div>;

  return (
    <div className="duty-detail-page">
      {/* 1. 상단 바 (조회 페이지용 심플 헤더) */}
      <div className="page-header">
        <div className="header-left">
          <button className="btn-list" onClick={() => navigate(-1)}>이전으로</button>
        </div>
        <div className="header-center">
          <h2 className="view-title">{selectedMonth.split("-")[0]}년 {selectedMonth.split("-")[1]}월 근무 현황</h2>
        </div>
        <div className="header-right"></div>
      </div>

      {/* 2. 컨트롤 영역 (월 선택만 가능) */}
      <div className="page-controls">
        <div className="controls-left">
          <span className="label-text">조회 월 선택:</span>
          <input 
            type="month" 
            className="control-select" 
            value={selectedMonth} 
            onChange={(e) => setSelectedMonth(e.target.value)} 
          />
        </div>
        <div className="controls-right">
          <span className="info-text">* 본인 팀의 근무 일정만 조회됩니다.</span>
        </div>
      </div>

      {/* 3. 타임라인 컨테이너 (세로 스크롤 없이 전체 노출) */}
      <div className="timeline-container">
        <div className="timeline-scroll-viewport view-mode">
          <div className="timeline-wrapper">
            <div className="timeline-header">
              <div className="employee-info-cell header-cell">사원명 / 조</div>
              {days.map((d) => <div key={d} className="day-cell">{d}</div>)}
            </div>
            
            {employees.length > 0 ? (
              employees.map((emp) => (
                <div key={emp.id} className="employee-row">
                  <div className="employee-info-cell">
                    <span className="emp-name">{emp.name}</span>
                    <span className={`emp-group-tag ${emp.group || "none"}`}>
                      {emp.group ? `${emp.group}조` : "-"}
                    </span>
                  </div>
                  {days.map((day) => {
                    const type = emp.duties[day] || "-";
                    const style = dutyStyles[type] || { color: "transparent", textColor: "#ccc" };
                    return (
                      <div key={day} className="duty-cell">
                        <div 
                          className="duty-readonly-box"
                          style={{ backgroundColor: style.color, color: style.textColor }}
                        >
                          {type}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ))
            ) : (
              <div className="no-data">해당 월에 등록된 근무 데이터가 없습니다.</div>
            )}
          </div>
        </div>
      </div>

      {/* 저장 버튼 등 Footer 영역은 조회 페이지에서 제외 */}
    </div>
  );
}

export default DutySkedCheckPage;