import React, { useState, useMemo, useEffect } from "react";

function ScheduleDeletionHistory({ deleteSchedLog }) {
    const today = new Date();
    const currentYear = today.getFullYear().toString();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

    const getYear = (dateStr) => dateStr?.substring(0, 4);
    const getMonth = (dateStr) => dateStr?.substring(5, 7);

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    const years = useMemo(() => {
        const yearSet = new Set(
            deleteSchedLog
                .filter(dd => dd.schedStartDate)
                .map(dd => getYear(dd.schedStartDate))
        );
        return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    }, [deleteSchedLog]);

    const months = useMemo(() => {
        if (!selectedYear) return [];
        const monthSet = new Set(
            deleteSchedLog
                .filter(dd => getYear(dd.schedStartDate) === selectedYear)
                .map(dd => getMonth(dd.schedStartDate))
        );
        return Array.from(monthSet).sort();
    }, [deleteSchedLog, selectedYear]);

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

    useEffect(() => {
        if (selectedYear === currentYear && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || "");
        }
    }, [selectedYear, months]);

    const filteredLogs = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];
        return deleteSchedLog
            .filter(dd =>
                dd.schedStartDate &&
                getYear(dd.schedStartDate) === selectedYear &&
                getMonth(dd.schedStartDate) === selectedMonth
            )
            .sort((a, b) => new Date(b.schedDeleteDate) - new Date(a.schedDeleteDate));
    }, [deleteSchedLog, selectedYear, selectedMonth]);

    return (
        <div>
            <h2 style={{ marginBottom: "20px" }}>일정 삭제 기록</h2>

            <div style={{ marginBottom: "15px", display: "flex", gap: "10px", alignItems: "center" }}>
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

                <span style={{ marginLeft: "auto", fontWeight: 600 }}>
                    총 {filteredLogs.length}건
                </span>
            </div>

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
                                    style={{
                                        ...styles.th,
                                        position: "sticky",
                                        top: 0,
                                        backgroundColor: "#f1f3f5",
                                        zIndex: 10
                                    }}
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
                                    <td style={styles.td}>
                                        {data.schedType === "COMPANY" ? "회사" :
                                         data.schedType === "DEPT" ? "팀" : "개인"}
                                    </td>
                                    <td style={styles.td}>{data.schedTitle}</td>
                                    <td style={styles.td}>{data.schedDetail}</td>
                                    <td style={styles.td}>{data.schedStartDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>{data.schedEndDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>{data.schedDeleteDate?.split(" ")[0]}</td>
                                    <td style={styles.td}>{data.schedEmpNm}</td>
                                    <td style={styles.td}>{data.schedDeptNm}</td>
                                    <td style={styles.td}>{data.schedLocNm}</td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="9" style={styles.noData}>
                                    데이터가 없습니다.
                                </td>
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
        background: "#fafafa",
        padding: 10,
        borderBottom: "2px solid #f0f0f0",
        textAlign: "left",
        fontWeight: 600,
    },
    td: {
        padding: 10,
        borderBottom: "1px solid #f0f0f0",
    },
    noData: {
        textAlign: "center",
        padding: 40,
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

export default ScheduleDeletionHistory;