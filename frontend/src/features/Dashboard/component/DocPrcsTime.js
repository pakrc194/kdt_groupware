import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';
import { TimeDiff } from './TimeDiff';
import { getStatusLabel } from '../../../shared/func/formatLabel';
import { formatToYYMMDD } from '../../../shared/func/formatToDate';

function DocPrcsTime({docPrc}) {
  const comp = docPrc.filter(dd => dd.aprvDocStts !== "PENDING" && dd.roleCd === "DRFT").length;
  const reje = docPrc.filter(dd => dd.aprvDocStts === "REJECTED" && dd.roleCd === "DRFT").length;

  const presentRate = comp === 0 ? 0 : ((reje / comp) * 100).toFixed(2);

  const parseDateTime = (str) => {
        const year = str.substring(0, 4);
        const month = str.substring(4, 6) - 1; // JS는 month가 0부터 시작
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const minute = str.substring(10, 12);
        const second = str.substring(12, 14);

        return new Date(year, month, day, hour, minute, second);
    }

    const now = new Date();
    // 최근 12개월 배열 생성 (오늘 기준)
    const recentMonths = Array.from({ length: 12 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
      return {
        year: date.getFullYear(),
        month: date.getMonth() + 1, // 0~11 이라서 +1
      };
    });

    const data = recentMonths.map(({ year, month }) => ({
      name: `${year}.${String(month).padStart(2, "0")}`,
      "완료": docPrc.filter(dd => 
        dd.aprvDocStts === "COMPLETED" && dd.roleCd === "DRFT" 
        && parseDateTime(dd.aprvDocDrftDt).getMonth() + 1 == month
        && parseDateTime(dd.aprvDocDrftDt).getFullYear() == year).length,
      "대기": docPrc.filter(dd => 
        dd.aprvDocStts === "PENDING" && dd.roleCd === "DRFT" 
        && parseDateTime(dd.aprvDocDrftDt).getMonth() + 1 == month
        && parseDateTime(dd.aprvDocDrftDt).getFullYear() == year).length,
      "반려": docPrc.filter(dd => 
        dd.aprvDocStts === "REJECTED" && dd.roleCd === "DRFT" 
        && parseDateTime(dd.aprvDocDrftDt).getMonth() + 1 == month
        && parseDateTime(dd.aprvDocDrftDt).getFullYear() == year).length,
    }));

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");
    const getYear = (dateStr) => dateStr?.substring(0, 4);
    const getMonth = (dateStr) => dateStr?.substring(4, 6);

    // 📌 연도 목록 추출 (작성일 기준)
    const years = useMemo(() => {
    const yearSet = new Set(
        docPrc
            .filter(dd => dd.aprvDocDrftDt)
            .map(dd => getYear(dd.aprvDocDrftDt))
    );
    return Array.from(yearSet).sort((a, b) => b - a);
}, [docPrc]);

    // 📌 선택된 연도의 월 목록
    const months = useMemo(() => {
    if (!selectedYear) return [];

    const monthSet = new Set(
        docPrc
            .filter(
                dd =>
                    dd.aprvDocDrftDt &&
                    getYear(dd.aprvDocDrftDt) === selectedYear
            )
            .map(dd => getMonth(dd.aprvDocDrftDt))
    );

    return Array.from(monthSet).sort();
}, [docPrc, selectedYear]);


    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0"); // 1~12

    // 📌 최초 연도 자동 선택
    useEffect(() => {
        if (years.length > 0 && !selectedYear) {
            setSelectedYear(years[0]);
        }
        if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || ""); // 선택 가능한 첫 달로
        }
    }, [years, selectedYear]);

    // 📌 연도 변경 시 월 초기화
    useEffect(() => {
        if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || ""); // 선택 가능한 첫 달로
        }
    }, [selectedYear]);

    // 📌 필터링
    const filteredDocs = useMemo(() => {
    if (!selectedYear || !selectedMonth) return [];

    return docPrc
            .filter(dd => dd.aprvDocStts !== "PENDING")
            .filter(dd => dd.roleCd === "LAST_ATRZ")
            .filter(dd =>
                dd.aprvDocDrftDt &&
                getYear(dd.aprvDocDrftDt) === selectedYear &&
                getMonth(dd.aprvDocDrftDt) === selectedMonth
            );
    }, [docPrc, selectedYear, selectedMonth]);


    return (
        <div>
            <h1>전자결재 정보</h1>
            <h3>반려비율  {reje}/{comp} : {presentRate}%</h3>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <BarChart style={{ width: '100%', height: '100%', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="완료" fill="#82ca9d" isAnimationActive={true} />
                <Bar dataKey="대기" fill="#aaaaaa" isAnimationActive={true} />
                <Bar dataKey="반려" fill="#ca8282" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>
            </div>

            <div style={styles.container}>
            <h2>전자결재 문서</h2>

<div>
  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                
            {/* ✅ 연도 / 월 드롭다운 */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={styles.select}
                >
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}년
                        </option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={styles.select}
                    disabled={!selectedYear}
                >
                    {months.map(month => (
                        <option key={month} value={month}>
                            {Number(month)}월
                        </option>
                    ))}
                </select>
            </div>
                <span style={{ fontWeight: 'bold' }}>총 {filteredDocs.length}건</span>
            </div>

            {/* ✅ 스크롤 영역 */}
            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px"
                }}
            >
                <table style={styles.table}>
                    <thead
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#f1f3f5",
                            zIndex: 1
                        }}
                    >
                        <tr>
                            <th style={styles.th}>문서 제목</th>
                            <th style={styles.th}>문서 상태</th>
                            <th style={styles.th}>기안자</th>
                            <th style={styles.th}>기안일</th>
                            <th style={styles.th}>최종결재자</th>
                            <th style={styles.th}>결재 날짜</th>
                            <th style={styles.th}>문서 유형</th>
                            <th style={styles.th}>결재시간</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredDocs.length > 0 ? (
                            filteredDocs.map((dd, index) => (
                                <tr key={index}>
                                    <td style={styles.td}>{dd.aprvDocTtl}</td>
                                    <td style={styles.td}>
                                        {getStatusLabel(dd.aprvDocStts)}
                                    </td>
                                    <td style={styles.td}>{dd.drftEmpNm}</td>
                                    <td style={styles.td}>
                                        {dd.aprvDocDrftDt
                                            ? formatToYYMMDD(dd.aprvDocDrftDt)
                                            : "미정"}
                                    </td>
                                    <td style={styles.td}>{dd.aprvPrcsEmpNm}</td>
                                    <td style={styles.td}>
                                        {dd.aprvPrcsDt
                                            ? formatToYYMMDD(dd.aprvPrcsDt)
                                            : "미승인"}
                                    </td>
                                    <td style={styles.td}>{dd.docFormNm}</td>
                                    <td style={styles.td}>
                                        {dd.aprvPrcsDt
                                            ? TimeDiff(dd.aprvDocDrftDt, dd.aprvPrcsDt)
                                            : "결재 전"}
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="8" style={styles.noData}>
                                    데이터가 없습니다.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>

            
            </div>
        </div>
    );
}

const styles = {
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#fafafa",
    padding: 10,
    borderBottom: "2px solid #f0f0f0",
    textAlign: "left",
    width: "100px"
  },
  td: {
    padding: 10,
    borderBottom: "1px solid #f0f0f0",
  },
  noData: {
    textAlign: "center",
    padding: 16,
    color: "#bfbfbf",
  },
  select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer"
}

};

export default DocPrcsTime;