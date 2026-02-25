import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import DutyGroupModal from "../component/DutyGroupModal";
import DutySkedAprvReqModal from "../component/DutySkedAprvReqModal";
import "../css/DutySkedDetail.css";
import { getStatusLabel } from "../../../shared/func/formatLabel";

function DutySkedDetail() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const dutyId = searchParams.get("dutyId");

  const [title, setTitle] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [workType, setWorkType] = useState("4조3교대");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isAprvModalOpen, setIsAprvModalOpen] = useState(false);
  const [status, setStatus] = useState("DRAFT");
  const [dutyGuides, setDutyGuides] = useState([]);

  // 유효성 검사를 위한 전달 데이터 맵
  const [lastMonthDataMap, setLastMonthDataMap] = useState({});

  const isReadOnly = status !== "DRAFT" && status !== "REJECTED";

  const dutyOptions = {
    사무: ["WO", "OD", "O", "LV", "BT"],
    "4조2교대": ["D", "E", "O", "LV", "BT"],
    "4조3교대": ["D", "E", "N", "O", "LV", "BT"],
  };

  const dutyStyles = {
    D: { color: "#e3f2fd", textColor: "#1976d2" },
    E: { color: "#f3e5f5", textColor: "#7b1fa2" },
    N: { color: "#fff3e0", textColor: "#ef6c00" },
    O: { color: "#eeeeee", textColor: "#9e9e9e" },
    WO: { color: "#e8f5e9", textColor: "#2e7d32" },
    OD: { color: "#fce4ec", textColor: "#c2185b" },
    LV: { color: "#e0f2fe", textColor: "#0369a1", fontWeight: "bold" },
    BT: { color: "#fef3c7", textColor: "#92400e", fontWeight: "bold" },
    ERROR: { boxShadow: "inset 0 0 0 3px #f00", fontWeight: "bold" },
  };

  const getDaysInMonth = useCallback(() => {
    if (!selectedMonth) return [];
    const [year, month] = selectedMonth.split("-").map(Number);
    const lastDay = new Date(year, month, 0).getDate();
    return Array.from({ length: lastDay }, (_, i) => i + 1);
  }, [selectedMonth]);

  const days = getDaysInMonth();

  // 유효성 검사 로직
  const validateDutyFlow = (empId, empName, duties, days, lastDuty) => {
    const errors = [];
    if (lastDuty === "N" && duties[1] === "D") {
      errors.push(
        `${empName} 사원: 전달 마지막 근무(N)와 1일(D) 사이 휴게 부족`,
      );
    }
    for (let i = 0; i < days.length - 1; i++) {
      const curDay = days[i];
      const nextDay = days[i + 1];
      if (duties[curDay] === "N" && duties[nextDay] === "D") {
        errors.push(
          `${empName} 사원: ${curDay}일(N) → ${nextDay}일(D) 연속 근무 위반`,
        );
      }
    }
    return errors;
  };

  // 중복 결재 완료 건이 있는지 확인하는 함수
  const checkDuplicateApproval = async () => {
    try {
      const trgtYmd = selectedMonth.replace("-", ""); // 예: 202602
      // 백엔드에서 해당 달, 해당 부서의 'COMPLETED' 상태인 마스터가 있는지 조회
      const res = await fetcher(
        `/gw/duty/checkConfirmed?deptId=${myInfo.deptId}&trgtYmd=${trgtYmd}`,
      );

      // 이미 존재한다면(res.exists가 true라면) 알림
      if (res > 0) {
        alert(
          "해당 월에 이미 결재 완료된 근무표가 존재하여 결재 요청이 불가능합니다.",
        );
        return true; // 중복 있음
      }
      return false; // 중복 없음
    } catch (error) {
      console.error("중복 체크 실패:", error);
      return false;
    }
  };

  useEffect(() => {
    const loadDetail = async () => {
      if (!dutyId) return;
      try {
        const dutyCodes = await fetcher(`/gw/duty/workTypeCodes`)
        setDutyGuides(dutyCodes); // 가이드 정보 저장

        setIsLoading(true);
        const data = await fetcher(`/gw/duty/detail?dutyId=${dutyId}`);
        setStatus(data.master.prgrStts || "DRAFT");
        setTitle(data.master.scheTtl);
        const ymd = data.master.trgtYmd;
        const currentMonthStr = `${ymd.substring(0, 4)}-${ymd.substring(4, 6)}`;
        setSelectedMonth(currentMonthStr);

        const [year, month] = currentMonthStr.split("-").map(Number);
        const lastMonthObj = new Date(year, month - 1, 0);
        const lastMonthStr = `${lastMonthObj.getFullYear()}${String(lastMonthObj.getMonth() + 1).padStart(2, "0")}`;

        const lastMonthData = await fetcher(
          `/gw/duty/lastMonthDuty?deptId=${myInfo.deptId}&trgtYmd=${lastMonthStr}`,
        ).catch(() => []);

        const lMap = {};
        lastMonthData.forEach((item) => {
          lMap[item.empId] = item.wrkCd;
        });
        setLastMonthDataMap(lMap);

        const empMap = {};
        data.details.forEach((item) => {
          if (!empMap[item.empId]) {
            empMap[item.empId] = {
              id: item.empId,
              name: item.empNm,
              group: item.grpNm || "미배정",
              rotPtnCd: item.rotPtnCd || "사무",
              duties: {},
            };
          }
          const dayNum = parseInt(item.dutyYmd.substring(6, 8));
          empMap[item.empId].duties[dayNum] = item.wrkCd;
        });

        const sortedEmpList = Object.values(empMap).sort((a, b) => {
          const groupOrder = { A: 1, B: 2, C: 3, D: 4, 미배정: 5 };
          const orderA = groupOrder[a.group] || 99;
          const orderB = groupOrder[b.group] || 99;
          return orderA !== orderB
            ? orderA - orderB
            : a.name.localeCompare(b.name);
        });

        setEmployees(sortedEmpList);
        if (sortedEmpList.length > 0) setWorkType(sortedEmpList[0].rotPtnCd);
      } catch (error) {
        console.error("로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [dutyId, myInfo.deptId]);

  // 공통 저장 로직
  const submitUpdate = async (showMsg = true) => {
    try {
      const payload = {
        dutyId: parseInt(dutyId),
        empId: myInfo.empId,
        deptId: myInfo.deptId,
        scheTtl: title,
        details: employees.flatMap((emp) =>
          days.map((day) => ({
            dutyId: parseInt(dutyId),
            empId: emp.id,
            dutyYmd: `${selectedMonth.replace("-", "")}${day.toString().padStart(2, "0")}`,
            wrkCd: emp.duties[day] || (emp.rotPtnCd === "사무" ? "WO" : "O"),
            grpNm: emp.rotPtnCd === "사무" ? null : emp.group || null,
          })),
        ),
      };
      await fetcher(`/gw/duty/updateDuty`, { method: "PUT", body: payload });
      if (showMsg) alert("저장되었습니다.");
      return true;
    } catch (error) {
      alert("데이터 저장 중 오류가 발생했습니다.");
      return false;
    }
  };

  const handleSave = async () => {
    if (isReadOnly) return;
    let allErrors = [];
    employees.forEach((emp) => {
      const empErrors = validateDutyFlow(
        emp.id,
        emp.name,
        emp.duties,
        days,
        lastMonthDataMap[emp.id],
      );
      allErrors = [...allErrors, ...empErrors];
    });

    if (allErrors.length > 0) {
      alert("부적절한 근무 흐름이 발견되었습니다:\n\n" + allErrors.join("\n"));
      return;
    }

    if (!window.confirm("변경 내용을 저장하시겠습니까?")) return;
    const success = await submitUpdate(true);
    if (success) navigate("/attendance/dtskdlst");
  };

  // 결재 요청 핸들러 (저장 후 모달 오픈)
  const handleAprvRequestClick = async () => {
    if (isReadOnly) return; // 결재 중이거나 결재 완료면
    const isDuplicate = await checkDuplicateApproval();
    if (isDuplicate) return; // 이미 중복으로 결재된 근무표가 있으면

    let allErrors = [];
    employees.forEach((emp) => {
      const empErrors = validateDutyFlow(
        emp.id,
        emp.name,
        emp.duties,
        days,
        lastMonthDataMap[emp.id],
      );
      allErrors = [...allErrors, ...empErrors];
    });

    if (allErrors.length > 0) {
      alert(
        "오류가 있는 근무표는 결재 요청을 할 수 없습니다:\n\n" +
          allErrors.join("\n"),
      );
      return;
    }

    if (
      window.confirm("결재 요청을 위해 현재 변경사항을 먼저 저장하시겠습니까?")
    ) {
      const success = await submitUpdate(false); // 메시지 없이 저장만
      if (!success) return;
      setIsAprvModalOpen(true);
    }
  };

  const handleApprovalSubmit = async (approvData) => {
    try {
      const payload = {
        dutyId: dutyId,
        title: approvData.title,
        content: approvData.content,
      };
      await fetcher("/gw/duty/requestApproval", {
        method: "POST",
        body: payload,
      });
      alert("결재 기안이 완료되었습니다.");
      setIsAprvModalOpen(false);
      navigate("/attendance/dtskdlst");
    } catch (error) {
      alert("결재 기안 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="loading">데이터 로드 중...</div>;

  return (
    <div className={`duty-detail-page ${isReadOnly ? "mode-readonly" : ""}`}>
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
            placeholder="제목 입력"
            readOnly={isReadOnly}
          />
          {isReadOnly && (
            <span className={`status-badge ${status}`}>
              {getStatusLabel(status)}
            </span>
          )}
        </div>
        <div className="header-right" />
      </div>

      <div className="page-controls">
        <div className="controls-left">
          <input
            type="month"
            className="control-select readonly-input"
            value={selectedMonth}
            disabled
          />
          <div className="work-type-group">
            <span className="label-text">기준 근무:</span>
            <select
              className="control-select highlight readonly-input"
              value={workType}
              disabled
            >
              <option value="사무">사무</option>
              <option value="4조2교대">4조 2교대</option>
              <option value="4조3교대">4조 3교대</option>
            </select>
          </div>
        </div>
      </div>

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
                  {guide.strtTm 
                    ? `${guide.strtTm.substring(0, 5)}~${guide.endTm.substring(0, 5)}` 
                    : (guide.wrkCd === "LV" ? "연차" : guide.wrkCd === "BT" ? "출장" : "휴무")
                  }
                  {guide.brkTmMin > 0 && ` (휴게 ${guide.brkTmMin}분)`}
                </span>
              </div>
            ))
          }
        </div>
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
                  {emp.rotPtnCd !== "사무" && (
                    <span className={`emp-group-tag ${emp.group || "none"}`}>
                      {emp.group && emp.group !== "미배정"
                        ? `${emp.group}조`
                        : "미배정"}
                    </span>
                  )}
                </div>
                {days.map((day) => {
                  const type =
                    emp.duties[day] || (emp.rotPtnCd === "사무" ? "WO" : "O");
                  const prevType =
                    day === 1 ? lastMonthDataMap[emp.id] : emp.duties[day - 1];
                  const isError = prevType === "N" && type === "D";
                  const baseStyle = dutyStyles[type] || dutyStyles["O"];
                  const finalStyle = isError
                    ? { ...baseStyle, ...dutyStyles.ERROR }
                    : baseStyle;
                  const opts = dutyOptions[emp.rotPtnCd] || ["O"];

                  return (
                    <div key={day} className="duty-cell">
                      <select
                        className={`duty-select ${isError ? "error-blink" : ""}`}
                        style={{
                          backgroundColor: finalStyle.color,
                          color: finalStyle.textColor,
                          boxShadow: finalStyle.boxShadow,
                          fontWeight: finalStyle.fontWeight,
                          border: isError
                            ? "2px solid #ef5350"
                            : "1px solid #ddd",
                        }}
                        value={type}
                        disabled={isReadOnly}
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

      {!isReadOnly && (
        <div className="page-footer">
          <div className="footer-left">
            <button
              className="btn-approval-request"
              onClick={handleAprvRequestClick}
            >
              결재 요청
            </button>
          </div>
          <div className="footer-right">
            <button className="btn-save-final" onClick={handleSave}>
              저장하기
            </button>
          </div>
        </div>
      )}

      <DutyGroupModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialEmployees={employees}
        onApply={(updated) => {
          setEmployees(updated);
          setIsModalOpen(false);
        }}
      />
      <DutySkedAprvReqModal
        dutyId={dutyId}
        isOpen={isAprvModalOpen}
        onClose={() => setIsAprvModalOpen(false)}
        onSubmit={handleApprovalSubmit}
        scheTtl={title}
      />
    </div>
  );
}

export default DutySkedDetail;
