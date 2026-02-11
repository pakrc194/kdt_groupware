import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import dayjs from "dayjs";
import "../css/AttendancePage.css"; // CSS 파일 생성 필수

function AttendancePage() {
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
  const [myAtdcData, setMyAtdcData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(dayjs().format("YYYY-MM"));
  const [deptEmpAtdc, setDeptEmpAtdc] = useState([]);

  useEffect(() => {
    fetcher(`/gw/atdc/atdcCal?yearMonth=${currentMonth}`).then(setMyAtdcData);
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

  // 2. 특정 날짜에 데이터가 있는지 매칭하는 함수
  const findAtdcData = (day) => {
    if (!day) return null;
    const formattedDay = firstDayOfMonth.date(day).format("YYYY-MM-DD");
    return myAtdcData.find(
      (v) => dayjs(v.wrkYmd).format("YYYY-MM-DD") === formattedDay,
    );
  };

  return (
    <div className="attendance-page-container">
      <div className="calendar-container">
        <h1>출퇴근 기록 (2026)</h1>

        <div className="calendar-controls">
          <input
            type="month"
            value={currentMonth}
            onChange={(e) => setCurrentMonth(e.target.value)}
          />
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
            const atdc = findAtdcData(day);
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
                    <span className="day-number">{day}</span>

                    {/* 1. DB에 근태 기록이 있는 경우 (출근, 연차, 출장, 결근 등) */}
                    {atdc ? (
                      <div className="atdc-entry">
                        <div className={`atdc-status ${atdc.atdcSttsCd}`}>
                          {atdc.atdcSttsCd === "PRESENT" && "● 출근"}
                          {atdc.atdcSttsCd === "LEAVE" && "⛱ 연차"}
                          {atdc.atdcSttsCd === "BUSINESS_TRIP" && "✈ 출장"}
                          {atdc.atdcSttsCd === "ABSENT" && "❗ 결근"}
                          {atdc.atdcSttsCd === "OFF" && "🏠 휴무"}
                        </div>
                        {atdc.clkInDtm && (
                          <div className="atdc-time">
                            {dayjs(atdc.clkInDtm).format("HH:mm")} ~{" "}
                            {atdc.clkOutDtm
                              ? dayjs(atdc.clkOutDtm).format("HH:mm")
                              : ""}
                          </div>
                        )}
                      </div>
                    ) : (
                      /* 2. DB에 기록은 없지만 주말인 경우 */
                      day && isWeekend
                    )}
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
          <div className="status-card working">
            <h3>🔥 업무 중 ({workingEmps.length})</h3>
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
                    <td>{emp.EMP_NM}</td> {/* 대문자 수정 */}
                    <td>{dayjs(emp.CLK_IN_DTM).format("HH:mm")}</td>{" "}
                    {/* 대문자 수정 */}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="status-card off">
            <h3>⌛ 부재/퇴근 ({offEmps.length})</h3>
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
                    <td>{emp.EMP_NM}</td> {/* 대문자 수정 */}
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
      </section>
    </div>
  );
}

export default AttendancePage;
