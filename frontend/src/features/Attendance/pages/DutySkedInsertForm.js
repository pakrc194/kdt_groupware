import React, { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import DutyGroupModal from "../component/DutyGroupModal"; // 분리한 컴포넌트 임포트
import "../css/DutySkedDetail.css";

function DutySkedInsertForm() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const navigate = useNavigate();

  const [title, setTitle] = useState("");
  const today = new Date();
  const initialMonth = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}`;
  const [selectedMonth, setSelectedMonth] = useState(initialMonth);
  const [workType, setWorkType] = useState("4조3교대");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

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

  const getDaysInMonth = useCallback(() => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [selectedMonth]);

  const days = getDaysInMonth();

  useEffect(() => {
    const loadInitialData = async () => {
      try {
        setIsLoading(true);
        const memberList = await fetcher(
          `/gw/duty/insertForm?deptId=${myInfo.deptId}`,
        );
        const initialEmps = memberList.map((emp) => ({
          id: emp.empId,
          name: emp.empNm,
          group: emp.grpNm || "미배정",
          rotPtnCd: workType,
          duties: {},
        }));
        setEmployees(initialEmps);
      } catch (error) {
        console.error("팀원 로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadInitialData();
  }, []);

  const handleWorkTypeChange = (newType) => {
    setWorkType(newType);
    setEmployees((prev) =>
      prev.map((emp) => ({
        ...emp,
        rotPtnCd: newType,
        duties: {},
      })),
    );
  };

  const changeMonth = (offset) => {
    const [year, month] = selectedMonth.split("-").map(Number);
    const newDate = new Date(year, month - 1 + offset, 1);
    setSelectedMonth(
      `${newDate.getFullYear()}-${String(newDate.getMonth() + 1).padStart(2, "0")}`,
    );
  };

  const handleBulkGenerate = () => {
    if (!window.confirm("패턴과 조 편성을 기준으로 자동 생성하시겠습니까?"))
      return;

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

    setEmployees((prev) => {
      const officeWorkers = prev.filter((emp) => emp.rotPtnCd === "사무");
      return prev.map((emp) => {
        const newDuties = { ...emp.duties };
        if (emp.rotPtnCd === "사무") {
          const workerIdx = officeWorkers.findIndex((w) => w.id === emp.id);
          days.forEach((d, idx) => {
            newDuties[d] =
              workerIdx !== -1 && idx % officeWorkers.length === workerIdx
                ? "OD"
                : "WO";
          });
        } else {
          const ptn = patterns[workType]?.[emp.group] || ["O"];
          days.forEach((d, idx) => {
            newDuties[d] = ptn[idx % ptn.length];
          });
        }
        return { ...emp, duties: newDuties };
      });
    });
  };

  // 모달 적용 핸들러
  const handleGroupApply = async (updatedEmps) => {
    try {
      const groupUpdates = updatedEmps.map((emp) => ({
        empId: emp.id,
        grpNm: emp.group === "미배정" || !emp.group ? null : emp.group,
      }));

      await fetcher("/gw/duty/updateGroups", {
        method: "PUT",
        body: groupUpdates,
      });

      setEmployees(updatedEmps);
      setIsModalOpen(false);
      alert("조 편성이 사원 정보에 반영되었습니다.");
    } catch (error) {
      alert("사원 정보 업데이트 중 오류가 발생했습니다.");
    }
  };

  const handleSave = async () => {
    if (!title.trim()) return alert("근무표 제목을 입력해주세요.");
    if (!window.confirm("근무표를 등록하시겠습니까?")) return;

    try {
      const payload = {
        scheTtl: title,
        empId: myInfo.empId,
        deptId: myInfo.deptId,
        trgtYmd: selectedMonth.replace("-", ""),
        details: employees.flatMap((emp) =>
          days.map((day) => ({
            empId: emp.id,
            dutyYmd: `${selectedMonth.replace("-", "")}${day.toString().padStart(2, "0")}`,
            wrkCd: emp.duties[day] || (workType === "사무" ? "WO" : "O"),
            grpNm: emp.rotPtnCd === "사무" ? null : emp.group || null,
          })),
        ),
      };
      await fetcher(`/gw/duty/insert`, {
        method: "POST",
        body: payload,
      });
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
          <button className="btn-list" onClick={() => navigate(-1)}>
            ← 목록으로
          </button>
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
          <div
            className="month-picker-wrapper"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <button className="btn-month-nav" onClick={() => changeMonth(-1)}>
              &lt;
            </button>
            <input
              type="month"
              className="control-select"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
            />
            <button className="btn-month-nav" onClick={() => changeMonth(1)}>
              &gt;
            </button>
          </div>
          <div className="work-type-group" style={{ marginLeft: "15px" }}>
            <span className="label-text">근무 유형:</span>
            <select
              className="control-select highlight"
              value={workType}
              onChange={(e) => handleWorkTypeChange(e.target.value)}
            >
              <option value="4조3교대">4조 3교대</option>
              <option value="4조2교대">4조 2교대</option>
              <option value="사무">사무</option>
            </select>
          </div>
        </div>

        <div className="controls-right">
          <button className="btn-bulk" onClick={handleBulkGenerate}>
            일괄 작성
          </button>
          <button className="btn-setup" onClick={() => setIsModalOpen(true)}>
            조 편성 관리
          </button>
          <button
            className="btn-reset"
            onClick={() => {
              if (window.confirm("초기화하시겠습니까?"))
                setEmployees((prev) => prev.map((e) => ({ ...e, duties: {} })));
            }}
          >
            초기화
          </button>
        </div>
      </div>

      <div className="timeline-container">
        <div className="timeline-scroll-viewport">
          <div className="timeline-wrapper">
            <div className="timeline-header">
              <div className="employee-info-cell header-cell">사원명 / 조</div>
              {days.map((d) => (
                <div key={d} className="day-cell">
                  {d}
                </div>
              ))}
            </div>
            {employees.map((emp) => (
              <div key={emp.id} className="employee-row">
                <div className="employee-info-cell">
                  <span className="emp-name">{emp.name}</span>
                  {workType !== "사무" && (
                    <span className={`emp-group-tag ${emp.group || "none"}`}>
                      {emp.group && emp.group !== "미배정"
                        ? `${emp.group}조`
                        : "미배정"}
                    </span>
                  )}
                </div>
                {days.map((day) => {
                  const type =
                    emp.duties[day] || (workType === "사무" ? "WO" : "O");
                  const style = dutyStyles[type] || dutyStyles["O"];
                  const opts = dutyOptions[workType] || ["O"];
                  return (
                    <div key={day} className="duty-cell">
                      <select
                        className="duty-select"
                        style={{
                          backgroundColor: style.color,
                          color: style.textColor,
                        }}
                        value={type}
                        onChange={(e) => {
                          const val = e.target.value;
                          setEmployees((prev) =>
                            prev.map((ev) =>
                              ev.id === emp.id
                                ? {
                                    ...ev,
                                    duties: { ...ev.duties, [day]: val },
                                  }
                                : ev,
                            ),
                          );
                        }}
                      >
                        {opts.map((o) => (
                          <option key={o} value={o}>
                            {o}
                          </option>
                        ))}
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
        <button className="btn-save-final" onClick={handleSave}>
          등록하기
        </button>
      </div>

      <DutyGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEmployees={employees}
        onApply={handleGroupApply}
      />
    </div>
  );
}

export default DutySkedInsertForm;
