import React, { useEffect, useMemo, useState } from 'react';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

function TeamSchdule({sched}) {
    const cnt = sched.length;

    const now = new Date();

    // 최근 12개월 배열 생성 (오늘 기준)
    const recentMonths = Array.from({ length: 15 }, (_, i) => {
        const date = new Date(now.getFullYear(), now.getMonth() - 11 + i, 1);
        return {
            year: date.getFullYear(),
            month: date.getMonth() + 1, // 0~11 이라서 +1
        };
    });

    const data = recentMonths.map(({ year, month }) => ({
        name: `${year}.${String(month).padStart(2, "0")}`,

        "일정":sched.filter(dd => new Date(dd.schedStartDate).getFullYear() == year && new Date(dd.schedStartDate).getMonth() + 1 == month
    && dd.schedState === 0).length,
    }));

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // 📌 연도 목록 추출
    const years = useMemo(() => {
        const yearSet = new Set(
            sched.map(item =>
                item.schedState === 0 &&
                new Date(item.schedStartDate).getFullYear()
            )
        );
        return Array.from(yearSet).sort((a, b) => b - a);
    }, [sched]);

    // 📌 선택된 연도에 해당하는 월 목록 추출
    const months = useMemo(() => {
        if (!selectedYear) return [];

        const monthSet = new Set(
            sched
                .filter(
                    item =>
                        item.schedState === 0 &&
                        new Date(item.schedStartDate).getFullYear() ===
                        Number(selectedYear)
                )
                .map(item =>
                    new Date(item.schedStartDate).getMonth() + 1
                )
        );

        return Array.from(monthSet).sort((a, b) => a - b);
    }, [sched, selectedYear]);

    const today = new Date();
    const currentMonth = (today.getMonth() + 1); // 1~12


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
    const filteredSched = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];

        return sched
            .filter(item => {
                const date = new Date(item.schedStartDate);
                return (
                    item.schedState === 0 &&
                    date.getFullYear() === Number(selectedYear) &&
                    date.getMonth() + 1 === Number(selectedMonth)
                );
            })
            .sort(
                (a, b) =>
                    new Date(b.schedStartDate) -
                    new Date(a.schedStartDate)
            );
    }, [sched, selectedYear, selectedMonth]);

    const cellStyle = {
        padding: "10px",
        borderBottom: "1px solid #eee",
        textAlign: "center"
    };
    


    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2>팀 일정(최근 1년 및 향후 3개월)</h2>
                <span style={{ fontWeight: 'bold' }}>총 {cnt}건</span>
            </div>
            <div style={{ width: '100%', height: '400px', backgroundColor: '#fff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 10px rgba(0,0,0,0.1)' }}>
            <BarChart style={{ width: '100%', height: '100%', aspectRatio: 1.618 }} responsive data={data}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis width="auto" />
                <Tooltip />
                <Legend />
                <Bar dataKey="일정" fill="#82ca9d" isAnimationActive={true} />
                {/* <RechartsDevtools /> */}
            </BarChart>
            </div>


<div>

    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {/* <h2>팀 일정(최근 1년 및 향후 3개월)</h2> */}
                
            
            {/* ✅ 연도 선택 버튼 */}
            <div style={{ marginBottom: "15px" }}>
                {/* ✅ 연도 / 월 드롭다운 */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                {/* 연도 선택 */}
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        cursor: "pointer"
                    }}
                >
                    {years.map(year => (
                        <option key={year} value={year}>
                            {year}년
                        </option>
                    ))}
                </select>

                {/* 월 선택 */}
                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={{
                        padding: "6px 10px",
                        borderRadius: "6px",
                        border: "1px solid #ccc",
                        fontSize: "14px",
                        cursor: "pointer"
                    }}
                    disabled={!selectedYear}
                >
                    {months.map(month => (
                        <option key={month} value={month}>
                            {month}월
                        </option>
                    ))}
                </select>
            </div>
            </div>
            <span style={{ fontWeight: 'bold' }}>총 {filteredSched.length}건</span>
</div>
            {/* ✅ 테이블 */}
            <div
                style={{
                    maxHeight: "400px",
                    overflowY: "auto",
                    border: "1px solid #ddd",
                    borderRadius: "8px"
                }}
            >
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "collapse",
                        fontSize: "14px"
                    }}
                >
                    <thead
                        style={{
                            position: "sticky",
                            top: 0,
                            backgroundColor: "#f1f3f5",
                            zIndex: 1
                        }}
                    >
                        <tr>
                            {["제목", "시작날짜", "종료날짜", "상세", "위치"].map(
                                (header, idx) => (
                                    <th
                                        key={idx}
                                        style={{
                                            padding: "10px",
                                            borderBottom:
                                                "1px solid #ddd",
                                            fontWeight: "600",
                                            textAlign: "center",
                                            backgroundColor: '#f8f9fa'
                                        }}
                                    >
                                        {header}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>

                    <tbody>
                        {filteredSched.map((dd, idx) => (
                            <tr key={idx}>
                                <td style={cellStyle}>
                                    {dd.schedTitle}
                                </td>
                                <td style={cellStyle}>
                                    {dd.schedStartDate.split(" ")[0]}
                                </td>
                                <td style={cellStyle}>
                                    {dd.schedEndDate.split(" ")[0]}
                                </td>
                                <td style={cellStyle}>
                                    {dd.schedDetail}
                                </td>
                                <td style={cellStyle}>
                                    {dd.locNm}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
        </div>
    );
}

export default TeamSchdule;