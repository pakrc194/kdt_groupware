import React, { useEffect, useState, useCallback } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import "../css/DutySkedDetail.css";

function DutySkedDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const scheId = searchParams.get("scheId");

  const [title, setTitle] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [workType, setWorkType] = useState("4조3교대");
  const [employees, setEmployees] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [tempEmps, setTempEmps] = useState([]);

  // 1. 상태값 저장을 위한 state 추가
  const [status, setStatus] = useState("DRAFT");

  // 2. 읽기 전용 여부 판단 (DRAFT가 아니면 true)
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
      if (!scheId) return;
      try {
        setIsLoading(true);
        const data = await fetcher(`/gw/duty/detail?scheId=${scheId}`);

        // 서버에서 받아온 마스터 상태값 설정 (DRAFT, PENDING, CONFIRMED 등)
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
              group: item.grpNm || "A",
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
  }, [scheId]);

  const handleBulkGenerate = () => {
    if (isReadOnly) return; // 방어 로직
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

  const handleSave = async () => {
    if (isReadOnly) return;
    if (!window.confirm("변경 내용을 저장하시겠습니까?")) return;
    try {
      const payload = {
        scheId: parseInt(scheId),
        empId: 10,
        deptId: 8,
        scheTtl: title,
        details: employees.flatMap((emp) =>
          Object.entries(emp.duties).map(([day, cd]) => ({
            scheId: parseInt(scheId),
            empId: emp.id,
            dutyYmd: `${selectedMonth.replace("-", "")}${day.toString().padStart(2, "0")}`,
            wrkCd: cd,
            grpNm: emp.rotPtnCd === "사무" ? null : emp.group || null,
          })),
        ),
      };
      await fetcher(`/gw/duty/updateDuty`, {
        method: "PUT",
        body: payload,
      });
      alert("저장되었습니다.");
      navigate("/attendance/dtskdlst");
    } catch (error) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  if (isLoading) return <div className="loading">데이터 로드 중...</div>;

  return (
    <div className={`duty-detail-page ${isReadOnly ? "mode-readonly" : ""}`}>
      {/* 1. 상단 바 */}
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
            readOnly={isReadOnly} // 초안 아닐 때 읽기 전용
          />
          {isReadOnly && (
            <span className={`status-badge ${status}`}>
              {status === "CONFIRMED" ? "결재 완료" : "결재 중"}
            </span>
          )}
        </div>
        <div className="header-right"></div>
      </div>

      {/* 2. 컨트롤 영역 */}
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
        <div className="controls-right">
          {/* 초안 상태일 때만 수정 도구 버튼 노출 */}
          {!isReadOnly && (
            <>
              <button className="btn-bulk" onClick={handleBulkGenerate}>
                일괄 작성
              </button>
              <button
                className="btn-setup"
                onClick={() => {
                  setTempEmps(JSON.parse(JSON.stringify(employees)));
                  setIsModalOpen(true);
                }}
              >
                조 편성 관리
              </button>
              <button
                className="btn-reset"
                onClick={() => {
                  if (window.confirm("초기화하시겠습니까?")) {
                    setEmployees((prev) =>
                      prev.map((e) => ({ ...e, duties: {} })),
                    );
                  }
                }}
              >
                초기화
              </button>
            </>
          )}
        </div>
      </div>

      {/* 3. 타임라인 컨테이너 */}
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
                        disabled={isReadOnly} // 초안 아닐 때 셀렉트 박스 비활성화
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

      {/* 4. 하단 저장 버튼 - 초안 상태일 때만 노출 */}
      {!isReadOnly && (
        <div className="page-footer">
          <button className="btn-save-final" onClick={handleSave}>
            저장하기
          </button>
        </div>
      )}

      {/* 조 편성 모달 - isReadOnly일 때는 열리지 않도록 설정됨 */}
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
              <div className="employee-pool">
                <input
                  type="text"
                  className="search-input"
                  placeholder="사원 검색..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <div className="pool-list">
                  {tempEmps
                    .filter(
                      (e) =>
                        e.name.includes(searchTerm) &&
                        (!e.group || e.group === "미배정" || e.group === ""),
                    )
                    .map((e) => (
                      <div key={e.id} className="pool-item">
                        <span>
                          {e.name} ({e.rotPtnCd})
                        </span>
                        <div className="add-buttons">
                          {["A", "B", "C", "D"].map((g) => (
                            <button
                              key={g}
                              onClick={() =>
                                setTempEmps((prev) =>
                                  prev.map((te) =>
                                    te.id === e.id ? { ...te, group: g } : te,
                                  ),
                                )
                              }
                            >
                              {g}
                            </button>
                          ))}
                        </div>
                      </div>
                    ))}
                </div>
              </div>
              <div className="group-grid">
                {["A", "B", "C", "D"].map((gn) => (
                  <div key={gn} className="group-box">
                    <div className="group-box-header">{gn}조</div>
                    <div className="group-box-body">
                      {tempEmps
                        .filter((e) => e.group === gn)
                        .map((e) => (
                          <div key={e.id} className="member-tag">
                            <span>{e.name}</span>
                            <button
                              onClick={() =>
                                setTempEmps((prev) =>
                                  prev.map((te) =>
                                    te.id === e.id ? { ...te, group: "" } : te,
                                  ),
                                )
                              }
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
                적용하기
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default DutySkedDetail;
