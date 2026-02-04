import React, { useState } from "react";
import "../css/WorkSheetCheckPage.css";

function WorkSheetCheckPage(props) {
  const [title, setTitle] = useState("2026년 1월 근무표");
  const [selectedMonth, setSelectedMonth] = useState("2026-01");
  const [workType, setWorkType] = useState("4조3교대");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [employees, setEmployees] = useState([
    { id: 1, name: "김철수", position: "과장", group: "A", duties: {} },
    { id: 2, name: "이영희", position: "대리", group: "B", duties: {} },
    { id: 3, name: "박지민", position: "사원", group: "A", duties: {} },
    { id: 4, name: "최동욱", position: "사원", group: "B", duties: {} },
    { id: 5, name: "정수호", position: "사원", group: "A", duties: {} },
    { id: 6, name: "강민지", position: "사원", group: "B", duties: {} },
    { id: 7, name: "홍길동", position: "신입", group: "", duties: {} },
    { id: 8, name: "차은우", position: "사원", group: "D", duties: {} },
  ]);

  const [tempEmps, setTempEmps] = useState([]);
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const dutyOptions = {
    사무: ["WO", "OD", "O"],
    "4조2교대": ["D", "E", "O"],
    "4조3교대": ["D", "E", "N", "O"],
  };

  const dutyStyles = {
    D: { color: "#e3f2fd", textColor: "#1976d2" },
    E: { color: "#f3e5f5", textColor: "#7b1fa2" },
    N: { color: "#fff3e0", textColor: "#ef6c00" },
    O: { color: "#eeeeee", textColor: "#9e9e9e" },
    WO: { color: "#e8f5e9", textColor: "#2e7d32" },
    OD: { color: "#fce4ec", textColor: "#c2185b" },
  };

  // --- 조 편성 팝업 로직 ---
  const openModal = () => {
    setTempEmps(JSON.parse(JSON.stringify(employees)));
    setIsModalOpen(true);
  };

  // --- 근무표 일괄 작성 로직 (사무직 당직 순환 + 3째주 월요일 휴일) ---
  const handleBulkGenerate = () => {
    if (!window.confirm(`${workType} 기준으로 근무를 일괄 작성하시겠습니까?`))
      return;

    const patterns = {
      "4조3교대": {
        A: ["D", "D", "E", "E", "N", "N", "O", "O"],
        B: ["E", "E", "N", "N", "O", "O", "D", "D"],
        C: ["N", "N", "O", "O", "D", "D", "E", "E"],
        D: ["O", "O", "D", "D", "E", "E", "N", "N"],
      },
      "4조2교대": {
        A: ["D", "D", "O", "O"],
        B: ["E", "E", "O", "O"],
        C: ["D", "D", "O", "O"],
        D: ["E", "E", "O", "O"],
      },
    };

    setEmployees((prev) => {
      // 당직 순번을 추적하기 위한 변수 (사무직용)
      let dutyStep = 0;

      // 각 날짜별로 당직자를 미리 정해둡니다 (사무직 전용)
      const dailyOnDutyMap = {};
      if (workType === "사무") {
        days.forEach((day) => {
          const isHoliday = day === 19; // 3째주 월요일 (1월 19일)

          if (isHoliday) {
            dailyOnDutyMap[day] = null; // 휴일엔 당직 없음
          } else {
            // 휴일이 아닐 때만 순번을 배정하고 다음 사람으로 넘김
            dailyOnDutyMap[day] = dutyStep % prev.length;
            dutyStep++;
          }
        });
      }

      return prev.map((emp, empIdx) => {
        const newDuties = {};

        if (workType === "사무") {
          days.forEach((day) => {
            if (day === 19) {
              newDuties[day] = "O"; // 전원 휴일
            } else {
              // 미리 계산된 순번과 현재 사원 인덱스가 맞으면 당직
              newDuties[day] = dailyOnDutyMap[day] === empIdx ? "OD" : "WO";
            }
          });
        } else {
          // 교대직 로직 (기존 유지)
          if (!emp.group) return emp;
          const pattern =
            patterns[workType]?.[emp.group] || dutyOptions[workType];
          days.forEach((day, index) => {
            newDuties[day] = day === 19 ? "O" : pattern[index % pattern.length];
          });
        }
        return { ...emp, duties: newDuties };
      });
    });
  };

  const handleDutyChange = (empId, day, newType) => {
    setEmployees((prev) =>
      prev.map((emp) =>
        emp.id === empId
          ? { ...emp, duties: { ...emp.duties, [day]: newType } }
          : emp,
      ),
    );
  };

  return (
    <div className="timeline-container">
      <div className="timeline-top-bar">
        <input
          className="title-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="timeline-controls">
        <div className="controls-left">
          <input
            type="month"
            className="control-select"
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
          />
          <div className="work-type-group">
            <span className="label-text">근무 체계:</span>
            <select
              className="control-select highlight"
              value={workType}
              onChange={(e) => setWorkType(e.target.value)}
            >
              <option value="사무">사무</option>
              <option value="4조2교대">4조 2교대</option>
              <option value="4조3교대">4조 3교대</option>
            </select>
          </div>
        </div>
        <div className="controls-right">
          {/* 사무직이 아닐 때만 조 편성 버튼 노출 */}
          {workType !== "사무" && (
            <button className="btn-setup" onClick={openModal}>
              조 편성 관리
            </button>
          )}
          <button className="btn-bulk" onClick={handleBulkGenerate}>
            일괄 작성
          </button>
          <button
            className="btn-reset"
            onClick={() =>
              setEmployees((prev) => prev.map((e) => ({ ...e, duties: {} })))
            }
          >
            초기화
          </button>
        </div>
      </div>

      <div className="timeline-wrapper">
        <div className="timeline-header">
          <div className="employee-info-cell">사원명 (조)</div>
          {days.map((day) => (
            <div key={day} className="day-cell">
              {day}
            </div>
          ))}
        </div>
        {employees.map((emp) => (
          <div key={emp.id} className="employee-row">
            <div className="employee-info-cell">
              <span className="emp-name">{emp.name}</span>
              {/* 사무직은 조 표시 생략 */}
              {workType !== "사무" && (
                <span className={`emp-group-tag ${emp.group}`}>
                  {emp.group ? `${emp.group}조` : "미배정"}
                </span>
              )}
            </div>
            {days.map((day) => {
              const type =
                emp.duties[day] || (workType === "사무" ? "WO" : "O");
              const style = dutyStyles[type] || dutyStyles["O"];
              return (
                <div key={day} className="duty-cell">
                  <select
                    className="duty-select"
                    style={{
                      backgroundColor: style.color,
                      color: style.textColor,
                    }}
                    value={type}
                    onChange={(e) =>
                      handleDutyChange(emp.id, day, e.target.value)
                    }
                  >
                    {dutyOptions[workType].map((opt) => (
                      <option key={opt} value={opt}>
                        {opt}
                      </option>
                    ))}
                  </select>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* 조 편성 모달은 그대로 유지 (다른 교대제에서 사용해야 하므로) */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="setup-modal">
            <div className="modal-header">
              <h2>조 편성 관리</h2>
              <button className="close-x" onClick={() => setIsModalOpen(false)}>
                ×
              </button>
            </div>

            <div className="modal-grid-content">
              {/* 왼쪽: 전체 사원 리스트 (Pool) */}
              <div className="employee-pool">
                <input
                  type="text"
                  className="search-input"
                  placeholder="사원명 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pool-list">
                  {tempEmps
                    .filter((emp) => emp.name.includes(searchTerm))
                    .map((emp) => (
                      <div key={emp.id} className="pool-item">
                        <span>
                          {emp.name} ({emp.position})
                        </span>
                        <div className="add-buttons">
                          {["A", "B", "C", "D"].map((g) => (
                            <button
                              key={g}
                              onClick={() => {
                                setTempEmps((prev) =>
                                  prev.map((te) =>
                                    te.id === emp.id ? { ...te, group: g } : te,
                                  ),
                                );
                              }}
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* 오른쪽: 조별 배치 현황 */}
              <div className="group-grid">
                {["A", "B", "C", "D"].map((groupName) => (
                  <div key={groupName} className="group-box">
                    <div className="group-box-header">{groupName}조</div>
                    <div className="group-box-body">
                      {tempEmps
                        .filter((emp) => emp.group === groupName)
                        .map((emp) => (
                          <div key={emp.id} className="member-tag">
                            <span>
                              {emp.name} {emp.position}
                            </span>
                            <button
                              className="remove-btn"
                              onClick={() => {
                                setTempEmps((prev) =>
                                  prev.map((te) =>
                                    te.id === emp.id
                                      ? { ...te, group: "" }
                                      : te,
                                  ),
                                );
                              }}
                            >
                              ×
                            </button>
                          </div>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="modal-footer-btns">
              <button
                className="btn-cancel"
                onClick={() => setIsModalOpen(false)}
              >
                취소
              </button>
              <button
                className="btn-save"
                onClick={() => {
                  setEmployees(tempEmps);
                  setIsModalOpen(false);
                }}
              >
                저장하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
export default WorkSheetCheckPage;
