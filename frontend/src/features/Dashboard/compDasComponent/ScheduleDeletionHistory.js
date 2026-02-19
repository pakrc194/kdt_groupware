import React, { useState, useMemo, useEffect } from "react";

function ScheduleDeletionHistory({ deleteSchedLog }) {
    const today = new Date();
    const currentYear = today.getFullYear().toString();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

    const getYear = (dateStr) => dateStr?.substring(0, 4);
    const getMonth = (dateStr) => dateStr?.substring(5, 7);

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // 연도 목록 (시작일 기준)
    const years = useMemo(() => {
        const yearSet = new Set(
            deleteSchedLog
                .filter(dd => dd.schedStartDate)
                .map(dd => getYear(dd.schedStartDate))
        );
        return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    }, [deleteSchedLog]);

    // 월 목록 (선택된 연도 기준)
    const months = useMemo(() => {
        if (!selectedYear) return [];
        const monthSet = new Set(
            deleteSchedLog
                .filter(dd => getYear(dd.schedStartDate) === selectedYear)
                .map(dd => getMonth(dd.schedStartDate))
        );
        return Array.from(monthSet).sort();
    }, [deleteSchedLog, selectedYear]);

    // 초기 선택
    useEffect(() => {
        if (years.length > 0 && !selectedYear) setSelectedYear(currentYear);
        if (!selectedMonth) {
            if (months.includes(currentMonth)) {
                setSelectedMonth(currentMonth);
            } else {
                setSelectedMonth(months[0] || "");
            }
        }
    }, [years]);

    // 연도 변경 시 월 초기화
    useEffect(() => {
        if (selectedYear === currentYear && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || "");
        }
    }, [selectedYear, months]);

    // 필터링 (시작일 기준)
    const filteredLogs = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];
        return deleteSchedLog
            .filter(dd =>
                dd.schedStartDate &&
                getYear(dd.schedStartDate) === selectedYear &&
                getMonth(dd.schedStartDate) === selectedMonth
            )
            .sort((a, b) => parseInt(b.schedStartDate) - parseInt(a.schedStartDate));
    }, [deleteSchedLog, selectedYear, selectedMonth]);

    return (
        <div>
                <h2>일정 삭제 기록</h2>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                

            {/* 연도/월 드롭다운 */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                <select
                    value={selectedYear}
                    onChange={e => setSelectedYear(e.target.value)}
                    style={styles.select}
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}년</option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={e => setSelectedMonth(e.target.value)}
                    style={styles.select}
                    disabled={!selectedYear}
                >
                    {months.map(month => (
                        <option key={month} value={month}>{Number(month)}월</option>
                    ))}
                </select>
            </div>
            <span style={{ fontWeight: 'bold' }}>총 {filteredLogs.length}건</span>
            </div>
            

            {/* 스크롤 + 헤더 고정 */}
            <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px"
            }}>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            {["타입","이름","상세","시작일","종료일","삭제일","담당자","담당팀","장소"].map((th, idx) => (
                                <th
                                    key={idx}
                                    style={{ ...styles.th, position: "sticky", top: 0, backgroundColor: "#f1f3f5", zIndex: 10 }}
                                >
                                    {th}
                                </th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {filteredLogs.length > 0 ? (
                            filteredLogs.map((data, index) => (
                                <tr key={index}>
                                    <td>{data.schedType === "COMPANY" ? "회사" : data.schedType === "DEPT" ? "팀" : "개인"}</td>
                                    <td>{data.schedTitle}</td>
                                    <td>{data.schedDetail}</td>
                                    <td>{data.schedStartDate?.split(" ")[0]}</td>
                                    <td>{data.schedEndDate?.split(" ")[0]}</td>
                                    <td>{data.schedDeleteDate?.split(" ")[0]}</td>
                                    <td>{data.schedEmpNm}</td>
                                    <td>{data.schedDeptNm}</td>
                                    <td>{data.schedLocNm}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={styles.noData}>데이터가 없습니다.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const styles = {
    table: {
        width: "100%",
        borderCollapse: "collapse",
        backgroundColor: "#fff",
    },
    th: {
        padding: "12px",
        borderBottom: "1px solid #ddd",
        fontWeight: "600",
        textAlign: "left",
    },
    td: {
        padding: "12px",
        borderBottom: "1px solid #eee",
    },
    select: {
        padding: "6px 10px",
        borderRadius: "6px",
        border: "1px solid #ccc",
        fontSize: "14px",
        cursor: "pointer"
    },
    noData: {
        textAlign: "center",
        padding: "14px",
        color: "#888",
    }
};

export default ScheduleDeletionHistory;
