import React, { useState, useMemo, useEffect } from "react";

function AccessDeletionHistory({ accessDeleteList }) {

    const sectionList = [
        {id: 1, code: 'APPROVAL', name: '전자결재'},
        {id: 2, code: 'SCHEDULE', name: '일정관리'},
        {id: 3, code: 'ATTENDANCE', name: '근태관리'},
        {id: 4, code: 'BOARD', name: '공지게시판'},
        {id: 5, code: 'ORGCHART', name: '조직도'},
        {id: 6, code: 'DASHBOARD', name: '회사 대시보드'},
    ];

    const today = new Date();
    const currentYear = today.getFullYear().toString();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

    const getYear = (dateStr) => dateStr?.substring(0, 4);
    const getMonth = (dateStr) => dateStr?.substring(5, 7); // "2026-02-10 12:02:49" -> month는 2번째 2자리

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // 연도 목록
    const years = useMemo(() => {
        const yearSet = new Set(
            accessDeleteList
                .filter(v => v.accessDeleteDate)
                .map(v => getYear(v.accessDeleteDate))
        );
        return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    }, [accessDeleteList]);

    // 월 목록 (선택된 연도 기준)
    const months = useMemo(() => {
        if (!selectedYear) return [];
        const monthSet = new Set(
            accessDeleteList
                .filter(v => getYear(v.accessDeleteDate) === selectedYear)
                .map(v => getMonth(v.accessDeleteDate))
        );
        return Array.from(monthSet).sort();
    }, [accessDeleteList, selectedYear]);

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

    // 필터링 (삭제 날짜 기준)
    const filteredList = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];
        return accessDeleteList
            .filter(v =>
                v.accessDeleteDate &&
                getYear(v.accessDeleteDate) === selectedYear &&
                getMonth(v.accessDeleteDate) === selectedMonth
            )
            .sort((a, b) => new Date(b.accessDeleteDate) - new Date(a.accessDeleteDate));
    }, [accessDeleteList, selectedYear, selectedMonth]);

    return (
        <div>
            <h2>권한 삭제 이력</h2>

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

            {/* 스크롤 + 헤더 고정 */}
            {['DEPT','JBTTL'].map(type => {
                const typeName = type === 'DEPT' ? '팀' : '직책';
                const list = filteredList.filter(v => v.accessDeleteType === type);
                return (
                    <div key={type} style={{ marginBottom: "20px" }}>
                        <h3>{typeName} 권한</h3>
                        <div style={{
                            maxHeight: "300px",
                            overflowY: "auto",
                            border: "1px solid #ddd",
                            borderRadius: "8px"
                        }}>
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        {["구분", "권한", "삭제 날짜", typeName].map((th, idx) => (
                                            <th key={idx} style={{ ...styles.th, position: "sticky", top: 0, backgroundColor: "#f1f3f5", zIndex: 10 }}>
                                                {th}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {list.length > 0 ? (
                                        list.map((v, idx) => (
                                            <tr key={idx}>
                                                <td style={styles.td}>
                                                    {sectionList.find(s => s.code === v.accessDeleteSection)?.name}
                                                </td>
                                                <td style={styles.td}>{v.accessName}</td>
                                                <td style={styles.td}>{v.accessDeleteDate}</td>
                                                <td style={styles.td}>{v.empowerName}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="4" style={styles.noData}>데이터가 없습니다.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )
            })}
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

export default AccessDeletionHistory;
