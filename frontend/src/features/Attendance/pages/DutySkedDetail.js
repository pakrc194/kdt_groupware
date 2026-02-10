import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import DutyGroupModal from "../component/DutyGroupModal"; // 분리한 컴포넌트 임포트
import DutySkedAprvReqModal from "../component/DutySkedAprvReqModal";
import "../css/DutySkedDetail.css";

function DutySkedDetail() {
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

  // 읽기 전용 여부 판단
  const isReadOnly = status !== "DRAFT" && status !== "REJECTED";

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
    const loadDetail = async () => {
      if (!dutyId) return;
      try {
        setIsLoading(true);
        const data = await fetcher(`/gw/duty/detail?dutyId=${dutyId}`);
        setStatus(data.master.prgrStts || "DRAFT");
        setTitle(data.master.scheTtl);
        const ymd = data.master.trgtYmd;
        setSelectedMonth(`${ymd.substring(0, 4)}-${ymd.substring(4, 6)}`);

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

        const empList = Object.values(empMap);
        setEmployees(empList);
        if (empList.length > 0) setWorkType(empList[0].rotPtnCd);
      } catch (error) {
        console.error("로드 실패:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDetail();
  }, [dutyId]);

  const handleBulkGenerate = () => {
    if (isReadOnly) return;
    if (
      !window.confirm("사원별 패턴과 조 편성을 기준으로 자동 생성하시겠습니까?")
    )
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

    setEmployees((prev) =>
      prev.map((emp) => {
        const newDuties = { ...emp.duties };
        if (emp.rotPtnCd === "사무") {
          days.forEach((d) => {
            newDuties[d] = "WO";
          });
        } else {
          const ptn = patterns[emp.rotPtnCd]?.[emp.group] || ["O"];
          days.forEach((d, idx) => {
            newDuties[d] = ptn[idx % ptn.length];
          });
        }
        return { ...emp, duties: newDuties };
      }),
    );
  };

  const handleGroupApply = (updatedEmps) => {
    setEmployees(updatedEmps);
    setIsModalOpen(false);
  };

  const handleSave = async () => {
    if (isReadOnly) return;
    if (!window.confirm("변경 내용을 저장하시겠습니까?")) return;
    try {
      const payload = {
        dutyId: parseInt(dutyId),
        empId: 10,
        deptId: 8,
        scheTtl: title,
        details: employees.flatMap((emp) =>
          Object.entries(emp.duties).map(([day, cd]) => ({
            dutyId: parseInt(dutyId),
            empId: emp.id,
            dutyYmd: `${selectedMonth.replace("-", "")}${day.toString().padStart(2, "0")}`,
            wrkCd: cd,
            grpNm: emp.rotPtnCd === "사무" ? null : emp.group || null,
          })),
        ),
      };
      await fetcher(`/gw/duty/updateDuty`, { method: "PUT", body: payload });
      alert("저장되었습니다.");
      navigate("/attendance/dtskdlst");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // 결재 기안 실행
  const handleApprovalSubmit = async (approvData) => {
    try {
      const payload = {
        dutyId: dutyId,
        title: approvData.title,
        content: approvData.content,
        // 필요시 기안자 ID 등 추가
      };

      // fetcher를 통한 결재 API 호출 (엔드포인트는 환경에 맞게 수정)
      await fetcher("/gw/duty/requestApproval", {
        method: "POST",
        body: payload,
      });

      alert("결재 기안이 완료되었습니다.");
      setIsAprvModalOpen(false);
      navigate("/attendance/dtskdlst"); // 목록으로 이동
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
              {status === "CONFIRMED" ? "결재 완료" : "결재 중"}
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
        {/* <div className="controls-right">
          {!isReadOnly && (
            <>
              <button className="btn-bulk" onClick={handleBulkGenerate}>
                일괄 작성
              </button>
              <button
                className="btn-setup"
                onClick={() => setIsModalOpen(true)}
              >
                조 편성 관리
              </button>
              <button
                className="btn-reset"
                onClick={() => {
                  if (window.confirm("초기화하시겠습니까?"))
                    setEmployees((prev) =>
                      prev.map((e) => ({ ...e, duties: {} })),
                    );
                }}
              >
                초기화
              </button>
            </>
          )}
        </div> */}
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
                  const style = dutyStyles[type] || dutyStyles["O"];
                  const opts = dutyOptions[emp.rotPtnCd] || ["O"];
                  return (
                    <div key={day} className="duty-cell">
                      <select
                        className="duty-select"
                        style={{
                          backgroundColor: style.color,
                          color: style.textColor,
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
              onClick={() => setIsAprvModalOpen(true)}
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
        onApply={handleGroupApply}
      />
      {/* 새 결재 요청 모달 */}
      <DutySkedAprvReqModal
        isOpen={isAprvModalOpen}
        onClose={() => setIsAprvModalOpen(false)}
        onSubmit={handleApprovalSubmit}
        scheTtl={title}
      />
    </div>
  );
}

export default DutySkedDetail;
