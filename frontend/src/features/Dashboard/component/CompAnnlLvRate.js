import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Cell, ResponsiveContainer } from 'recharts';

function Attendance({ annlLv }) {
    const statusList = [
        { code: 1, label: "지점장", color: "#ca8282" },
        { code: 2, label: "식품", color: "#caa882" },
        { code: 3, label: "뷰티·패션잡화", color: "#cabb79" },
        { code: 4, label: "여성패션", color: "#49b469" },
        { code: 5, label: "남성패션", color: "#5a5de2" },
        { code: 6, label: "인사관리", color: "#b75ae2" },
        { code: 7, label: "시설자재", color: "#dd5ae2" },
        { code: 8, label: "안전관리", color: "#838383" },
    ];

    const total = annlLv.length;

    // ================= [변경점 1] 차트 데이터 구조 재구성 =================
    // 각 부서를 개별 객체로 만들어야 X축에 이름이 펼쳐집니다.
    const attendData = statusList.map((status) => {
        const target = annlLv.find((dd) => dd.deptId === status.code);
        return {
            name: status.label,
            "연차 사용률": target ? Math.round(target.usedLvRate || 0) : 0,
            fill: status.color // 개별 색상 적용을 위해 저장
        };
    });

    const [expandedStatus, setExpandedStatus] = useState(
        statusList.reduce((acc, cur) => ({ ...acc, [cur.code]: false }), {})
    );

    const toggleStatus = (code) => {
        setExpandedStatus(prev => ({ ...prev, [code]: !prev[code] }));
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1>금년 연차 현황</h1>

            <div style={styles.chartCardContainer}>
                <div style={styles.chartWrapper}>
                    {/* ================= [변경점 2] ResponsiveContainer & Margin ================= */}
                    {/* ResponsiveContainer를 써야 부모 박스 크기에 맞춰 반응형으로 작동합니다. */}
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={attendData} 
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }} // left 여백 확보
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                interval={0} // 모든 라벨이 다 보이도록 설정
                                tick={{ fontSize: 12 }}
                            />
                            {/* width를 주지 않아도 margin-left가 0이면 숫자가 보입니다. 필요시 domain 설정 가능 */}
                            <YAxis domain={[0, 100]} unit="%" /> 
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend iconType="rect" />
                            
                            {/* 단일 Bar로 그리되, Cell을 사용해 부서별 색상을 다르게 표현 */}
                            <Bar dataKey="연차 사용률" radius={[4, 4, 0, 0]}>
                                {attendData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.fill} />
                                ))}
                            </Bar>
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* ================= 상태별 테이블 ================= */}
            {statusList.map((status) => {
                let list = annlLv.filter((dd) => dd.atdcSttsCd === status.code);
                if (status.code === "ABSENT") {
                    list = annlLv.filter((dd) => dd.atdcSttsCd === "ABSENT" || dd.atdcSttsCd === null);
                }

                const isExpanded = expandedStatus[status.code];

                return (
                    <div key={status.code} style={styles.section}>
                        <h3 style={styles.subTitle} onClick={() => toggleStatus(status.code)}>
                            {status.label} ({list.length}) {isExpanded ? "▲" : "▼"}
                        </h3>

                        {isExpanded && (
                            <div style={styles.tableWrapper}>
                                <table style={styles.table}>
                                    <thead>
                                        <tr>
                                            <th style={styles.th}>사원번호</th>
                                            <th style={styles.th}>이름</th>
                                            <th style={styles.th}>부서</th>
                                            <th style={styles.th}>직책</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {list.length > 0 ? (
                                            list.map((dd) => (
                                                <tr key={dd.empId}>
                                                    <td style={styles.td}>{dd.empSn}</td>
                                                    <td style={styles.td}>
                                                        <Link to={`/dashboard/detail/${dd.empId}`} style={styles.link}>{dd.empNm}</Link>
                                                    </td>
                                                    <td style={styles.td}>{dd.deptName}</td>
                                                    <td style={styles.td}>{dd.jbttlNm}</td>
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
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    chartCardContainer: {
        display: 'flex',
        gap: 24,
        marginBottom: 24,
        flexWrap: 'wrap',
    },
    chartWrapper: {
        flex: 2,
        minWidth: 300,
        height: 400,
        background: '#fff',
        padding: "30px 20px 20px 20px", // 안쪽 여백 조정
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    section: {
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: 30,
    },
    subTitle: {
        marginBottom: 16,
        fontWeight: 600,
        cursor: "pointer",
        display: 'flex',
        justifyContent: 'space-between'
    },
    tableWrapper: {
        maxHeight: 300,
        overflowY: "auto",
        border: "1px solid #f0f0f0",
        borderRadius: 8,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
        minWidth: 400,
    },
    th: {
        background: "#fafafa",
        padding: 10,
        borderBottom: "2px solid #f0f0f0",
        textAlign: "left",
        width: "120px",
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
    link: {
        color: '#007bff',
        textDecoration: 'none',
    },
};

export default Attendance;