import { useState, useMemo, useEffect } from "react";
import { getStatusLabel } from '../../../shared/func/formatLabel';
import { formatToYYMMDD } from "../../../shared/func/formatToDate";
import { Link } from "react-router-dom";

function ApprovalProcessHistory({approval}) {
    

    const grouped = {};

    approval.forEach(item => {
        const id = item.aprvDocId;

        if (!grouped[id]) {
            grouped[id] = {
                ...item,
                aprvPrcsEmpNm: item.aprvPrcsEmpNm ? [item.aprvPrcsEmpNm] : []
            };
        } else {
            if (item.aprvPrcsEmpNm) {
                grouped[id].aprvPrcsEmpNm.push(", "+item.aprvPrcsEmpNm);
            }
        }
    });

    const groupedData = Object.values(grouped);

    const today = new Date();
    const currentMonth = (today.getMonth() + 1).toString().padStart(2, "0");

    const getYear = (dateStr) => dateStr?.substring(0, 4);
    const getMonth = (dateStr) => dateStr?.substring(4, 6);

    const [selectedYear, setSelectedYear] = useState("");
    const [selectedMonth, setSelectedMonth] = useState("");

    // 연도 목록
    const years = useMemo(() => {
        const yearSet = new Set(
            groupedData
                .filter(dd => dd.aprvDocDrftDt)
                .map(dd => getYear(dd.aprvDocDrftDt))
        );
        return Array.from(yearSet).sort((a, b) => b.localeCompare(a));
    }, [groupedData]);

    // 월 목록 (선택된 연도 기준)
    const months = useMemo(() => {
        if (!selectedYear) return [];
        const monthSet = new Set(
            groupedData
                .filter(dd => getYear(dd.aprvDocDrftDt) === selectedYear)
                .map(dd => getMonth(dd.aprvDocDrftDt))
        );
        return Array.from(monthSet).sort();
    }, [groupedData, selectedYear]);

    // 연도 최초 선택
    useEffect(() => {
        if (years.length > 0 && !selectedYear) setSelectedYear(years[0]);

        if (!selectedMonth) {
            // today 기준 월이 선택 가능하면 그대로, 아니면 첫 달
            if (months.includes(currentMonth)) {
                setSelectedMonth(currentMonth);
            } else {
                setSelectedMonth(months[0] || "");
            }
        }
    }, [years]);

    // 연도 변경 시 월 초기화
    useEffect(() => {
        if (selectedYear == today.getFullYear() && months.includes(currentMonth)) {
            setSelectedMonth(currentMonth);
        } else {
            setSelectedMonth(months[0] || "");
        }
    }, [selectedYear]);

    // 필터링
    const filteredDocs = useMemo(() => {
        if (!selectedYear || !selectedMonth) return [];
        return groupedData
            .filter(dd =>
                dd.aprvDocDrftDt &&
                getYear(dd.aprvDocDrftDt) === selectedYear &&
                getMonth(dd.aprvDocDrftDt) === selectedMonth &&
                dd.aprvDocStts != 'TEMP'
            )
            .sort((a, b) => parseInt(b.aprvDocDrftDt) - parseInt(a.aprvDocDrftDt));
    }, [groupedData, selectedYear, selectedMonth]);

    return (
        <div>
            <h2>결재 처리 이력</h2>
<div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            {/* 연도/월 드롭다운 */}
            <div style={{ marginBottom: "15px", display: "flex", gap: "10px" }}>
                <select
                    value={selectedYear}
                    onChange={(e) => setSelectedYear(e.target.value)}
                    style={styles.select}
                >
                    {years.map(year => (
                        <option key={year} value={year}>{year}년</option>
                    ))}
                </select>

                <select
                    value={selectedMonth}
                    onChange={(e) => setSelectedMonth(e.target.value)}
                    style={styles.select}
                    disabled={!selectedYear}
                >
                    {months.map(month => (
                        <option key={month} value={month}>{Number(month)}월</option>
                    ))}
                </select>
            </div>
            <span style={{ fontWeight: 'bold' }}>총 {filteredDocs.length}건</span>
            </div>
            
            {/* 스크롤 영역 + 헤더 고정 */}

            <div style={{
                maxHeight: "400px",
                overflowY: "auto",
                border: "1px solid #ddd",
                borderRadius: "8px",
                position: "relative"
            }}>
    <table style={styles.table}>
        <thead style={{
            position: "sticky",
            top: 0,
            backgroundColor: "#f1f3f5",
            zIndex: 1,
        }}>
            <tr>
                <th style={styles.th}>문서 제목</th>
                <th style={styles.th}>기안자</th>
                <th style={styles.th}>문서 유형</th>
                <th style={styles.th}>기안일</th>
                <th style={styles.th}>문서 상태</th>
                <th style={styles.th}>최종결재자</th>
            </tr>
        </thead>
        <tbody>
            {filteredDocs.length > 0 ? (
                filteredDocs.map((data, index) => (
                    <tr key={index}>
                        <td style={styles.td}><Link to={`/approval/draftBox/detail/${data.aprvDocId}`} style={styles.link}>{data.aprvDocTtl}</Link></td>
                        <td style={styles.td}>{data.draftEmpNm}</td>
                        <td style={styles.td}>{data.docFormNm}</td>
                        <td style={styles.td}>{formatToYYMMDD(data.aprvDocDrftDt)}</td>
                        <td style={styles.td}>{getStatusLabel(data.aprvDocStts)}</td>
                        <td style={styles.td}>{data.aprvPrcsEmpNm}</td>
                    </tr>
                ))
            ) : (
                <tr>
                    <td colSpan="6" style={styles.noData}>데이터가 없습니다.</td>
                </tr>
            )}
        </tbody>
    </table>
</div>
            
        </div>
    );
}

const styles = {
    container: {
        maxWidth: '480px',
        margin: '40px auto',
        padding: '20px',
        fontFamily: 'Pretendard, Arial, sans-serif',
        backgroundColor: '#f4f6f9',
    },

    table: {
        width: '100%',
        borderCollapse: 'collapse',
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '20px',
    },

    th: {
        width: '10%',
        textAlign: 'left',
        padding: '14px',
        backgroundColor: '#f9fafb',
        fontWeight: '600',
        fontSize: '14px',
        color: '#6b7280',
        borderBottom: '1px solid #eee',
        
    },

    td: {
        padding: '14px',
        fontSize: '14px',
        color: '#111827',
        borderBottom: '1px solid #eee',
        wordBreak: 'break-word',
        width: '120px'
    },

    titleRow: {
        backgroundColor: '#f1f5f9',
        fontWeight: '700',
        fontSize: '16px',
    },

    buttonGroup: {
        display: 'flex',
        // justifyContent: 'space-between',
        marginTop: '10px',
        justifyContent: 'flex-end',
    },

    backBtn: {
        padding: '10px 18px',
        backgroundColor: '#e5e7eb',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        marginLeft: '10px'
    },

    deleteBtn: {
        padding: '10px 18px',
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        cursor: 'pointer',
        fontWeight: '600',
        transition: '0.2s',
    },
    select: {
    padding: "6px 10px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "14px",
    cursor: "pointer"
},
link: {
        color: '#007bff',
        textDecoration: 'none',
    },

};


export default ApprovalProcessHistory;