import React, { useCallback, useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';

const DutyForm = ({dutyId}) => {
      const [title, setTitle] = useState("");
      const [selectedMonth, setSelectedMonth] = useState("");
      const [workType, setWorkType] = useState("4조3교대");
      const [employees, setEmployees] = useState([]);
      const [isLoading, setIsLoading] = useState(true);
      const [isModalOpen, setIsModalOpen] = useState(false);
      const [isAprvModalOpen, setIsAprvModalOpen] = useState(false);
      const [status, setStatus] = useState("DRAFT");

        // 읽기 전용 여부 판단
    const isReadOnly = true;

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



    return (
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
    );
};





export default DutyForm;