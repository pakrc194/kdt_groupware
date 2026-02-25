import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/DutySkedView.css"; // 기존 상세 페이지 CSS와 공유

function DutySkedView() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const navigate = useNavigate();

  // 1. 초기 날짜 설정 (현재 년-월)
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [dutyData, setDutyData] = useState({ master: null, details: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [dutyGuides, setDutyGuides] = useState([]);

  const getWorkType = () => {
    if (myInfo?.deptId === 8) return "4조3교대";
    if (myInfo?.deptId === 7) return "4조2교대";
    return "사무";
  };

  const workType = getWorkType();
  const dutyOptions = {
    사무: ["WO", "OD", "O", "LV", "BT"],
    "4조2교대": ["D", "E", "O", "LV", "BT"],
    "4조3교대": ["D", "E", "N", "O", "LV", "BT"],
  };

  // 근무 코드별 색상 스타일
  const dutyStyles = {
    D: { color: "#e3f2fd", textColor: "#1976d2" },
    E: { color: "#f3e5f5", textColor: "#7b1fa2" },
    N: { color: "#fff3e0", textColor: "#ef6c00" },
    O: { color: "#eeeeee", textColor: "#9e9e9e" },
    WO: { color: "#e8f5e9", textColor: "#2e7d32" },
    OD: { color: "#fce4ec", textColor: "#c2185b" },
    LV: { color: "#e0f2fe", textColor: "#0369a1" }, // 하늘색 계열
    BT: { color: "#fef3c7", textColor: "#92400e" }, // 연주황 계열
  };

  // 2. 선택된 월의 날짜 배열 생성 (1~28/30/31)
  const days = useCallback(() => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [selectedMonth])();

  // 3. 백엔드 데이터 호출 (Map<String, Object> 구조 대응)
  const loadDutyView = async () => {
    try {
      setIsLoading(true);
      // 백엔드 trgtYmd 형식에 맞춰 '-' 제거 (2026-02 -> 202602)
      const ymd = selectedMonth.replace("-", "");

      const dutyCodes = await fetcher(`/gw/duty/workTypeCodes`)
      setDutyGuides(dutyCodes); // 가이드 정보 저장

      // 백엔드 Controller의 @GetMapping("view") 호출
      const data = await fetcher(
        `/gw/duty/view?trgtYmd=${ymd}&deptId=${myInfo.deptId}`,
      );

      if (data) {
        // --- 정렬 로직 시작 ---
        const sortedDetails = [...data.details].sort((a, b) => {
          const groupOrder = { A: 1, B: 2, C: 3, D: 4 };

          // grpNm이 null이면 아주 큰 숫자를 주어 후순위로 보냄
          const orderA = groupOrder[a.grpNm] || 99;
          const orderB = groupOrder[b.grpNm] || 99;

          if (orderA !== orderB) {
            return orderA - orderB; // 조별 정렬 (A -> B -> C -> D -> null)
          }

          // 같은 조 내에서는 이름순으로 정렬 (선택 사항)
          return a.empNm.localeCompare(b.empNm);
        });
        // --- 정렬 로직 끝 ---

        setDutyData({
          master: data.master,
          details: sortedDetails,
        });
      } else {
        // 데이터가 없는 경우 (Service에서 null 리턴 시)
        setDutyData({ master: null, details: [] });
      }
    } catch (error) {
      console.error("근무표 조회 실패:", error);
      setDutyData({ master: null, details: [] });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadDutyView();
  }, [selectedMonth]);

  // 데이터 가공 (정렬된 순서를 유지하며 사원별로 묶기)
  const renderRows = () => {
    const { details } = dutyData;
    if (!details || details.length === 0) return null;

    // 정렬된 details에서 중복 없는 사원 정보 리스트 추출 (순서 보장)
    const sortedEmployees = [];
    const seenEmpIds = new Set();

    details.forEach((item) => {
      if (!seenEmpIds.has(item.empId)) {
        seenEmpIds.add(item.empId);
        sortedEmployees.push({
          id: item.empId,
          name: item.empNm,
          group: item.grpNm,
          pattern: item.rotPtnCd,
        });
      }
    });

    // 모든 근무 데이터를 맵에 저장 (빠른 조회를 위함)
    const dutyMap = details.reduce((acc, curr) => {
      const key = `${curr.empId}-${parseInt(curr.dutyYmd.slice(-2))}`;
      acc[key] = curr.wrkCd;
      return acc;
    }, {});

    // 정렬된 사원 리스트를 기준으로 렌더링
    return sortedEmployees.map((emp) => (
      <div key={emp.id} className="employee-row">
        <div className="employee-info-cell">
          <span className="emp-name">{emp.name}</span>
          <span className={`emp-group-tag ${emp.group || "none"}`}>
            {emp.group ? `${emp.group}조` : "사무"}
          </span>
        </div>
        {days.map((d) => {
          // 사원ID와 일자(d)를 조합해 근무 코드 조회
          const code = dutyMap[`${emp.id}-${d}`] || "-";
          const style = dutyStyles[code] || {
            color: "#fff",
            textColor: "#ccc",
          };
          return (
            <div key={d} className="duty-cell">
              <div
                className="duty-readonly-box"
                style={{ backgroundColor: style.color, color: style.textColor }}
              >
                {code}
              </div>
            </div>
          );
        })}
      </div>
    ));
  };

  // 한 달 이동 로직
  const changeMonth = (offset) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    // Date 객체를 이용해 계산 (말일 계산 오류 방지)
    const newDate = new Date(year, month - 1 + offset, 1);
    const newYear = newDate.getFullYear();
    const newMonth = String(newDate.getMonth() + 1).padStart(2, "0");

    setSelectedMonth(`${newYear}-${newMonth}`);
  };

  return (
    <div className="duty-detail-page">
      {/* 상단 헤더 영역 */}
      <div className="page-header">
        <div className="header-left">
          <button className="btn-list" onClick={() => navigate(-1)}>
            ← 뒤로가기
          </button>
        </div>
        <div className="header-center">
          <h2 className="view-title">
            {dutyData.master
              ? dutyData.master.scheTtl
              : `${selectedMonth} 근무표 조회`}
          </h2>
        </div>
        <div className="header-right"></div>
      </div>

      {/* 컨트롤 영역 */}
      <div className="page-controls">
        <div className="controls-left">
          <div className="month-picker-wrapper">
            {/* 이전달 버튼 */}
            <button className="btn-month-nav" onClick={() => changeMonth(-1)}>
              &lt;
            </button>

            <input
              type="month"
              className="control-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />

            {/* 다음달 버튼 */}
            <button className="btn-month-nav" onClick={() => changeMonth(1)}>
              &gt;
            </button>
          </div>
        </div>
        <div className="controls-right">
          <div className="info-text">
            {dutyData.master
              ? "✅ 확정된 근무표입니다."
              : "⚠️ 확정된 근무표가 없습니다."}
          </div>
        </div>
      </div>

      {/* 타임라인 영역 (상하 스크롤 없이 전체 출력) */}
      <div className="timeline-container">
        {/* 근무 시간 안내 가이드 바 */}
        <div className="duty-guide-bar" style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '15px',
          padding: '12px 20px',
          backgroundColor: '#f1f5f9',
          borderRadius: '8px',
          fontSize: '13px',
          border: '1px solid #e2e8f0'
        }}>
          <span style={{ fontWeight: '700', color: '#475569', marginRight: '5px' }}>💡 근무 시간 안내:</span>
          {dutyGuides
            .filter(guide => dutyOptions[workType].includes(guide.wrkCd)) // 현재 근무유형(사무/교대)에 맞는 것만 표시
            .map(guide => (
              <div key={guide.wrkCd} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <span style={{
                  padding: '2px 6px',
                  borderRadius: '4px',
                  backgroundColor: dutyStyles[guide.wrkCd]?.color || '#fff',
                  color: dutyStyles[guide.wrkCd]?.textColor || '#000',
                  fontWeight: 'bold',
                  border: '1px solid #cbd5e1'
                }}>
                  {guide.wrkCd}
                </span>
                <span style={{ color: '#64748b' }}>
                  {guide.strtTm ? (
                    `${guide.strtTm.substring(0, 5)}~${guide.endTm.substring(0, 5)}`
                  ) : (
                    guide.wrkCd === "LV" ? "연차" : 
                    guide.wrkCd === "BT" ? "출장" : 
                    "휴무"
                  )}
                  {guide.brkTmMin > 0 && ` (휴게 ${guide.brkTmMin}분)`}
                </span>
              </div>
            ))
          }
        </div>
        <div className="timeline-scroll-viewport view-mode">
          <div className="timeline-wrapper">
            </div>
            {/* 날짜 헤더 */}
            <div className="timeline-header">
              <div className="employee-info-cell header-cell">사원명 / 조</div>
              {days.map((d) => {
                // 현재 선택된 월(selectedMonth)과 날짜(d)로 요일 계산
                const [year, month] = selectedMonth.split("-").map(Number);
                const dayOfWeek = new Date(year, month - 1, d).getDay(); // 0: 일, 6: 토
                const isSun = dayOfWeek === 0;
                const isSat = dayOfWeek === 6;

                return (
                  <div 
                    key={d} 
                    className={`day-cell ${isSun ? "sun" : ""} ${isSat ? "sat" : ""}`}
                  >
                    {d}
                  </div>
                );
              })}
            </div>

            {/* 사원별 근무 데이터 */}
            {isLoading ? (
              <div className="loading-row">데이터를 불러오는 중...</div>
            ) : dutyData.master ? (
              renderRows()
            ) : (
              <div className="no-data">
                해당 월에 확정된 근무표가 존재하지 않습니다.
              </div>
            )}
          </div>
        </div>
      </div>
  );
}

export default DutySkedView;
