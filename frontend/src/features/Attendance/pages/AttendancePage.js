import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import dayjs from "dayjs";
import "../css/AttendancePage.css"; // CSS 파일 생성 필수

function AttendancePage() {
  const [myAtdcData, setMyAtdcData] = useState([]);
  const [currentMonth, setCurrentMonth] = useState("2026-01");

  useEffect(() => {
    fetcher(`/gw/atdc/atdcCal?yearMonth=${currentMonth}`).then(setMyAtdcData);
  }, [currentMonth]);

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
          return (
            <div
              key={idx}
              className={`calendar-day-cell ${!day ? "empty" : ""}`}
            >
              {day && <span className="day-number">{day}</span>}

              {atdc && (
                <div className="atdc-entry">
                  <div className={`atdc-status ${atdc.atdcSttsCd}`}>
                    {atdc.atdcSttsCd === "PRESENT" ? "● 출근" : "○ 결근"}
                  </div>
                  <div className="atdc-time">
                    In: {dayjs(atdc.clkInDtm).format("HH:mm")}
                  </div>
                  <div className="atdc-time">
                    Out: {dayjs(atdc.clkOutDtm).format("HH:mm")}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default AttendancePage;
