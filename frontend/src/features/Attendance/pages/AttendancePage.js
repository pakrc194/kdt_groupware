import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import dayjs from "dayjs";
import "../css/AttendancePage.css"; // CSS 파일 생성 필수

function AttendancePage() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [myAtdcData, setMyAtdcData] = useState([]);
  const [myDutyData, setMyDutyData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [deptEmpAtdc, setDeptEmpAtdc] = useState([]);

  useEffect(() => {
    const loadCalendarData = async () => {
      try {
        const data = await fetcher(
          `/gw/atdc/atdcCal?yearMonth=${currentMonth}&empId=${myInfo.empId}`,
        );

        setMyAtdcData(data.atdcList || []);
        setMyDutyData(data.dutyList || []);
      } catch (error) {
        console.error("달력 데이터 로드 실패:", error);
      }
    };
    loadCalendarData();
  }, [currentMonth]);

  useEffect(() => {
    fetcher(`/gw/atdc/deptStatus?deptId=${myInfo.deptId}`)
      .then(setDeptEmpAtdc)
      .then(console.log(deptEmpAtdc));
  }, []);

  // 분류 로직 (부서원 기준)
  const workingEmps = deptEmpAtdc.filter(
    (emp) => emp.CLK_IN_DTM && !emp.CLK_OUT_DTM,
  );
  const offEmps = deptEmpAtdc.filter(
    (emp) => !emp.CLK_IN_DTM || emp.CLK_OUT_DTM,
  );

  // --- 달력 그리드 생성을 위한 계산 ---
  const firstDayOfMonth = dayjs(currentMonth).startOf("month"); // 1일 날짜 객체
  const lastDayOfMonth = dayjs(currentMonth).endOf("month"); // 마지막날 날짜 객체

  const daysInMonth = lastDayOfMonth.date(); // 해당 월의 총 일수 (31일 등)
  const startDayOfWeek = firstDayOfMonth.day(); // 1일의 요일 (0:일요일 ~ 6:토요일)
  const endDayOfWeek = lastDayOfMonth.day(); // 마지막 날의 요일 (0:일요일 ~ 6:토요일)

  // 1. 그리드 배열 생성 (빈 칸 + 실제 날짜)
  const calendarCells = [];

  // 시작 요일 앞의 빈 칸 채우기
  for (let i = 0; i < startDayOfWeek; i++) {
    calendarCells.push(null);
  }

  // 1일부터 마지막 날까지 숫자 채우기
  for (let i = 1; i <= daysInMonth; i++) {
    calendarCells.push(i);
  }

  // 마지막 날 이후 빈 칸 채우기
  for (let i = endDayOfWeek; i < 6; i++) {
    calendarCells.push(null);
  }

  // 근태 결과 찾기 (출퇴근 시간 등)
  const findAtdcData = (day) => {
    if (!day) return null;
    const formattedDay = firstDayOfMonth.date(day).format("YYYY-MM-DD");
    return myAtdcData.find(
      (v) => dayjs(v.wrkYmd).format("YYYY-MM-DD") === formattedDay,
    );
  };

  // 근무 일정 찾기 (근무명, 기준 시간 등)
  const findDutyData = (day) => {
    if (!day) return null;
    const formattedDay = firstDayOfMonth.date(day).format("YYYYMMDD");
    return myDutyData.find((v) => v.DUTY_YMD === formattedDay);
  };

  const handlePrevMonth = () => {
    setCurrentMonth(dayjs(currentMonth).subtract(1, "month").format("YYYY-MM"));
  };

  const handleNextMonth = () => {
    setCurrentMonth(dayjs(currentMonth).add(1, "month").format("YYYY-MM"));
  };

  return (
    <div className="attendance-page-container">
      <div className="calendar-container">
        <h1>출퇴근 기록 (2026)</h1>

        <div className="calendar-controls">
          <button className="month-nav-btn" onClick={handlePrevMonth}>
            &lt;
          </button>

          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
          />

          <button className="month-nav-btn" onClick={handleNextMonth}>
            &gt;
          </button>
        </div>

        <div className="calendar-grid">
          {/* 요일 헤더 */}
          {["일", "월", "화", "수", "목", "금", "토"].map((week) => (
            <div key={week} className="calendar-header-cell">
              {week}
            </div>
          ))}

          {/* 달력 본문 */}
          {calendarCells.map((day, idx) => {
            const atdc = findAtdcData(day); // 실제 근태 기록 (ATDC_HIST)
            const duty = findDutyData(day); // 확정 근무 계획 (DUTY_SCHE_DTL)

            const dateObj = day ? dayjs(currentMonth).date(day) : null;
            const isWeekend = dateObj
              ? dateObj.day() === 0 || dateObj.day() === 6
              : false;

            return (
              <div
                key={idx}
                className={`calendar-day-cell ${!day ? "empty" : ""} ${isWeekend ? "weekend-bg" : ""}`}
              >
                {day && (
                  <>
                    {/* 상단 헤더 영역 (날짜 + 근무정보 한 줄로) */}
                    <div
                      className={`day-cell-header ${duty ? `duty-${duty.WRK_CD}` : ""}`}
                    >
                      <span className="day-number">{day}</span>
                      {duty && (
                        <div className="duty-info-inline">
                          <span>{duty.WRK_NM}</span>
                          <span className="duty-time">
                            ({duty.STRT_TM?.substring(0, 5)} ~{" "}
                            {duty.END_TM?.substring(0, 5)})
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="cell-content">
                      {/* 실제 근태 데이터 (아래 배치) */}
                      {atdc && (
                        <div className={`atdc-entry-mini ${atdc.atdcSttsCd}`}>
                          <div className="atdc-inline-row">
                            <span className="stts-dot">●</span>
                            <span className="stts-text">
                              {atdc.atdcSttsCd === "PRESENT" && "출근"}
                              {atdc.atdcSttsCd === "LEAVE" && "연차"}
                              {atdc.atdcSttsCd === "BUSINESS_TRIP" && "출장"}
                              {atdc.atdcSttsCd === "ABSENT" && "결근"}
                              {atdc.atdcSttsCd === "OFF" && "휴무"}
                            </span>
                            {atdc.clkInDtm && (
                              <span className="actual-time-text">
                                ({dayjs(atdc.clkInDtm).format("HH:mm")}
                                {atdc.clkOutDtm
                                  ? ` ~ ${dayjs(atdc.clkOutDtm).format("HH:mm")}`
                                  : " ~"}
                                )
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>
      <section className="today-status-section">
        <h2>내 부서원 근무 현황 ({myInfo?.deptNm || "소속 부서"})</h2>

        <div className="status-tables-wrapper">
          {/* 업무 중 카드 */}
          <div className="status-card working">
            <h3>🔥 업무 중 ({workingEmps.length})</h3>
            <div className="table-scroll-container">
              <table className="atdc-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>출근 시간</th>
                  </tr>
                </thead>
                <tbody>
                  {workingEmps.map((emp) => (
                    <tr key={`work-${emp.EMP_ID}`}>
                      <td>{emp.EMP_NM}</td>
                      <td>{dayjs(emp.CLK_IN_DTM).format("HH:mm")}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 부재/퇴근 카드 */}
          <div className="status-card off">
            <h3>⌛ 부재/퇴근 ({offEmps.length})</h3>
            <div className="table-scroll-container">
              <table className="atdc-table">
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>출퇴근 정보</th>
                  </tr>
                </thead>
                <tbody>
                  {offEmps.map((emp) => (
                    <tr key={`off-${emp.EMP_ID}`}>
                      <td>{emp.EMP_NM}</td>
                      <td>
                        {!emp.CLK_IN_DTM ? (
                          <span className="txt-absent">결근</span>
                        ) : (
                          `${dayjs(emp.CLK_IN_DTM).format("HH:mm")} ~ ${emp.CLK_OUT_DTM ? dayjs(emp.CLK_OUT_DTM).format("HH:mm") : ""}`
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AttendancePage;
