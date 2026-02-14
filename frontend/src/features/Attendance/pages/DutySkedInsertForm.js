import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import DutyGroupModal from "../component/DutyGroupModal";
import "../css/DutySkedDetail.css";
import { getDeptLabel } from "../../../shared/func/formatLabel";

function DutySkedInsertForm() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const navigate = useNavigate();

  const getInitialWorkType = () => {
    const deptId = Number(myInfo?.deptId);
    if (deptId === 7) return "4조2교대";
    if (deptId === 8) return "4조3교대";
    return "사무";
  };

  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;

  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [workType, setWorkType] = useState(getInitialWorkType);
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [offset, setOffset] = useState(0);

  // 전달 마지막 패턴 인덱스 (통합 관리)
  const [lastPtnIdx, setLastPtnIdx] = useState(null);
  const [lastMonthDataMap, setLastMonthDataMap] = useState({});

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
    ERROR: { boxShadow: "inset 0 0 0 3px #f00", fontWeight: "bold" },
  };

  const patterns = {
    "4조3교대": {
      A: ["D", "D", "E", "E", "N", "N", "O", "O"],
      B: ["E", "E", "N", "N", "O", "O", "D", "D"],
      C: ["N", "N", "O", "O", "D", "D", "E", "E"],
      D: ["O", "O", "D", "D", "E", "E", "N", "N"],
    },
    "4조2교대": {
      A: ["D", "D", "O", "O", "E", "E", "O", "O"],
      B: ["O", "O", "D", "D", "O", "O", "E", "E"],
      C: ["E", "E", "O", "O", "D", "D", "O", "O"],
      D: ["O", "O", "E", "E", "O", "O", "D", "D"],
    },
  };

  const getDaysInMonth = useCallback(() => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [selectedMonth]);

  const days = getDaysInMonth();

  const validateDutyFlow = (empId, empName, duties, days, lastDuty) => {
    const errors = [];
    if (lastDuty === "N" && duties[1] === "D") {
      errors.push(`${empName} 사원: 전달 마지막 근무(N)와 1일(D) 사이 휴게 부족`);
    }
    for (let i = 0; i < days.length - 1; i++) {
      const curDay = days[i];
      const nextDay = days[i + 1];
      if (duties[curDay] === "N" && duties[nextDay] === "D") {
        errors.push(`${empName} 사원: ${curDay}일(N) → ${nextDay}일(D) 연속 근무 위반`);
      }
    }
    return errors;
  };

  useEffect(() => {
    if (selectedMonth) {
      const [year, month] = selectedMonth.split("-").map(Number);
      setTitle(`${year}년 ${month}월 ${getDeptLabel(myInfo?.deptId)}팀 근무표`);
    }
  }, [selectedMonth, myInfo?.deptId]);

  // 데이터 로드 및 통합 Offset 계산
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const [year, month] = selectedMonth.split("-").map(Number);
        const lastMonthLastDateObj = new Date(year, month - 1, 0);
        const lastMonthStr = `${lastMonthLastDateObj.getFullYear()}${String(lastMonthLastDateObj.getMonth() + 1).padStart(2, "0")}`;

        const [memberList, lastMonthData] = await Promise.all([
          fetcher(`/gw/duty/insertForm?deptId=${myInfo.deptId}`),
          fetcher(`/gw/duty/lastMonthDuty?deptId=${myInfo.deptId}&trgtYmd=${lastMonthStr}`).catch(() => []),
        ]);

        const dataMap = {};
        let foundLastIdx = null;
        const ptnLength = 8; // 패턴 주기는 8일 고정

        lastMonthData.forEach((item) => {
          dataMap[item.empId] = { wrkCd: item.wrkCd, lstPtnIdx: item.lstPtnIdx };
          // 조 구분 없이 가장 먼저 발견된 lstPtnIdx를 공통 기준으로 사용
          if (foundLastIdx === null && item.lstPtnIdx !== undefined && item.lstPtnIdx !== null) {
            foundLastIdx = item.lstPtnIdx;
          }
        });

        setLastMonthDataMap(dataMap);
        setLastPtnIdx(foundLastIdx);

        // 추천 Offset 설정: (전달 마지막 인덱스 + 1) % 8
        if (foundLastIdx !== null) {
          setOffset((foundLastIdx + 1) % ptnLength);
        } else {
          setOffset(0);
        }

        const initialEmps = memberList.map((emp) => ({
          id: emp.empId,
          name: emp.empNm,
          group: emp.grpNm || "미배정",
          rotPtnCd: workType,
          duties: {},
        }));
        setEmployees(initialEmps);
      } catch (error) {
        console.error("데이터 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, [selectedMonth, myInfo.deptId, workType]);

  const handleWorkTypeChange = (newType) => {
    setWorkType(newType);
    setEmployees((prev) => prev.map((emp) => ({ ...emp, rotPtnCd: newType, duties: {} })));
  };

  const changeMonth = (offsetValue) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month - 1 + offsetValue, 1);
    setSelectedMonth(`${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`);
  };

  const handleBulkGenerate = () => {
    if (!window.confirm(`선택한 ${offset + 1}일차를 기준으로 근무를 자동 생성하시겠습니까?`)) return;

    setEmployees((prev) => {
      const officeWorkers = prev.filter((emp) => emp.rotPtnCd === "사무");
      return prev.map((emp) => {
        const newDuties = { ...emp.duties };
        if (emp.rotPtnCd === "사무") {
          const workerIdx = officeWorkers.findIndex((w) => w.id === emp.id);
          days.forEach((d, idx) => {
            newDuties[d] = workerIdx !== -1 && idx % officeWorkers.length === workerIdx ? "OD" : "WO";
          });
        } else {
          const ptn = patterns[workType]?.[emp.group] || ["O"];
          days.forEach((d, idx) => {
            newDuties[d] = ptn[(idx + offset) % ptn.length];
          });
        }
        return { ...emp, duties: newDuties };
      });
    });
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("제목을 입력해주세요.");
    let allErrors = [];
    employees.forEach((emp) => {
      const empErrors = validateDutyFlow(emp.id, emp.name, emp.duties, days, lastMonthDataMap[emp.id]?.wrkCd);
      allErrors = [...allErrors, ...empErrors];
    });

    if (allErrors.length > 0) {
      alert("부적절한 연속 근무가 포함되어 있습니다:\n\n" + allErrors.join("\n"));
      return;
    }

    if (!window.confirm("근무표를 등록하시겠습니까?")) return;

    try {
      const ptnLength = 8;
      const lastDayIdx = (days.length - 1 + offset) % ptnLength;

      const payload = {
        scheTtl: title,
        empId: myInfo.empId,
        deptId: myInfo.deptId,
        trgtYmd: selectedMonth.replace("-", ""),
        lstPtnIdx: lastDayIdx,
        details: employees.flatMap((emp) =>
          days.map((day) => ({
            empId: emp.id,
            dutyYmd: `${selectedMonth.replace("-", "")}${day.toString().padStart(2, "0")}`,
            wrkCd: emp.duties[day] || (workType === "사무" ? "WO" : "O"),
            grpNm: emp.rotPtnCd === "사무" ? null : emp.group || null,
          }))
        ),
      };
      await fetcher(`/gw/duty/insert`, { method: "POST", body: payload });
      alert("등록되었습니다.");
      navigate("/attendance/dtskdlst");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="loading">작성 폼 준비 중...</div>;

  return (
    <div className="duty-detail-page">
      <div className="page-header">
        <div className="header-left">
          <button className="btn-list" onClick={() => navigate(-1)}>← 목록으로</button>
        </div>
        <div className="header-center">
          <input
            className="title-input"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>
        <div className="header-right" />
      </div>

      <div className="page-controls">
        <div className="controls-left">
          <div className="month-picker-wrapper" style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <button className="btn-month-nav" onClick={() => changeMonth(-1)}>&lt;</button>
            <input type="month" className="control-select" value={selectedMonth} onChange={(e) => setSelectedMonth(e.target.value)} />
            <button className="btn-month-nav" onClick={() => changeMonth(1)}>&gt;</button>
          </div>
          <div className="work-type-group" style={{ marginLeft: "15px" }}>
            <span className="label-text">근무 유형:</span>
            <select className="control-select highlight" value={workType} onChange={(e) => handleWorkTypeChange(e.target.value)}>
              <option value="4조3교대">4조 3교대</option>
              <option value="4조2교대">4조 2교대</option>
              <option value="사무">사무</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          {workType !== "사무" && (
            <div className="global-offset-control" style={{ 
              marginLeft: "20px", display: "flex", alignItems: "center", gap: "12px", 
              padding: "8px 15px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0" 
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "12px", color: "#64748b" }}>전달 종료:</span>
                <strong style={{ fontSize: "14px", color: "#1e293b" }}>
                  {lastPtnIdx !== null ? `${lastPtnIdx + 1}일차` : "정보 없음"}
                </strong>
              </div>
              <div style={{ width: "1px", height: "16px", backgroundColor: "#cbd5e1" }}></div>
              <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <span className="label-text" style={{ fontSize: "13px", fontWeight: "700", color: "#334155" }}>패턴 시작:</span>
                <select className="control-select" value={offset} onChange={(e) => setOffset(Number(e.target.value))} style={{ border: "2px solid #3182ce" }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7].map((num) => (
                    <option key={num} value={num}>{num + 1}일차</option>
                  ))}
                </select>
              </div>
            </div>
          )}
          <button className="btn-bulk" onClick={handleBulkGenerate}>일괄 작성</button>
          <button className="btn-setup" onClick={() => setIsModalOpen(true)}>조 편성 관리</button>
          <button className="btn-reset" onClick={() => setEmployees((prev) => prev.map((e) => ({ ...e, duties: {} })))}>초기화</button>
        </div>
      </div>

      <div className="timeline-container">
        <div className="timeline-scroll-viewport">
          <div className="timeline-wrapper">
            <div className="timeline-header">
              <div className="employee-info-cell header-cell">사원명 / 조</div>
              {days.map((d) => (
                <div key={d} className="day-cell">{d}</div>
              ))}
            </div>

            {employees.map((emp) => (
              <div key={emp.id} className="employee-row">
                <div className="employee-info-cell">
                  <div className="emp-main-info">
                    <span className="emp-name">{emp.name}</span>
                    {workType !== "사무" && (
                      <span className={`emp-group-tag ${emp.group || "none"}`}>
                        {emp.group && emp.group !== "미배정" ? `${emp.group}조` : "미배정"}
                      </span>
                    )}
                  </div>
                </div>

                {days.map((day) => {
                  const type = emp.duties[day] || (workType === "사무" ? "WO" : "O");
                  const prevType = day === 1 ? lastMonthDataMap[emp.id]?.wrkCd : emp.duties[day - 1];
                  const isError = prevType === "N" && type === "D";
                  const baseStyle = dutyStyles[type] || dutyStyles["O"];
                  const finalStyle = isError ? { ...baseStyle, ...dutyStyles.ERROR } : baseStyle;
                  const opts = dutyOptions[workType] || ["O"];

                  return (
                    <div key={day} className="duty-cell">
                      <select
                        className={`duty-select ${isError ? "error-blink" : ""}`}
                        style={{
                          backgroundColor: finalStyle.backgroundColor || finalStyle.color,
                          color: finalStyle.textColor,
                          boxShadow: finalStyle.boxShadow,
                          fontWeight: finalStyle.fontWeight,
                          border: isError ? "2px solid #ef5350" : "1px solid #ddd",
                        }}
                        value={type}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmployees((prev) =>
                            prev.map((ev) => (ev.id === emp.id ? { ...ev, duties: { ...ev.duties, [day]: val } } : ev))
                          );
                        }}
                      >
                        {opts.map((o) => (<option key={o} value={o}>{o}</option>))}
                      </select>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="page-footer">
        <button className="btn-save-final" onClick={handleSave}>등록하기</button>
      </div>

      <DutyGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEmployees={employees}
        onApply={(updated) => {
          setEmployees(updated);
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}

export default DutySkedInsertForm;