import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar, Cell, ResponsiveContainer } from 'recharts';
import { fetcher } from '../../../shared/api/fetcher';

function Attendance({ annlLvData }) {
    // 초기값을 빈 배열로 설정하여 .find() 에러 방지
    const [annlLv, setAnnlLv] = useState(annlLvData || []);
    // 부모로부터 받은 데이터가 변경될 때 상태 동기화
    useEffect(() => {
        if (annlLvData) {
            setAnnlLv(annlLvData);
        }
    }, [annlLvData]);

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

    const fn_change = (e) => {
        fetcher(`/gw/dashboard/dashAnnlLvList?year=${e.target.value}`)
            .then(dd => {
                console.log("Fetched Data:", dd);
                setAnnlLv(Array.isArray(dd) ? dd : [dd]);
            })
            .catch(err => console.error("Fetch Error:", err));
    }

    // ================= 차트 데이터 구조 재구성 (useMemo 권장) =================
    const attendData = useMemo(() => {
        if (!Array.isArray(annlLv)) return [];
        
        return statusList.map((status) => {
            const target = annlLv.find((dd) => dd.deptId === status.code);
            return {
                name: status.label,
                "연차 사용률": target ? Math.round(target.usedLvRate || 0) : 0,
                fill: status.color 
            };
        });
    }, [annlLv]); // annlLv가 바뀔 때만 다시 계산

    const [expandedStatus, setExpandedStatus] = useState(
        statusList.reduce((acc, cur) => ({ ...acc, [cur.code]: false }), {})
    );

    const toggleStatus = (code) => {
        setExpandedStatus(prev => ({ ...prev, [code]: !prev[code] }));
    }

    // 데이터가 아직 로딩 전이라면 메시지 표시
    if (!annlLv || annlLv.length === 0) {
        return <div style={{ padding: '20px' }}>데이터를 불러오는 중입니다...</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <h1><select onChange={(e) => fn_change(e)} defaultValue={2026} style={{ padding: '10px 10px', borderRadius: '4px' }}>
                    <option value="2024">2024</option>
                    <option value="2025">2025</option>
                    <option value="2026">2026</option>
                </select> 연차 현황</h1>
            <div style={{ marginBottom: '20px' }}>
                
            </div>

            <div style={styles.chartCardContainer}>
                <div style={styles.chartWrapper}>
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart 
                            data={attendData} 
                            margin={{ top: 20, right: 30, left: 0, bottom: 5 }}
                        >
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis 
                                dataKey="name" 
                                interval={0} 
                                tick={{ fontSize: 12 }}
                            />
                            <YAxis domain={[0, 100]} unit="%" /> 
                            <Tooltip formatter={(value) => `${value}%`} />
                            <Legend iconType="rect" />
                            
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
                // annlLv가 배열인지 다시 한 번 체크하여 필터링
                let list = Array.isArray(annlLv) ? annlLv.filter((dd) => dd.deptId === status.code) : [];
                
                const isExpanded = expandedStatus[status.code];

                return (
                    <div key={status.code} style={styles.section}>
                        <h3 style={styles.subTitle} onClick={() => toggleStatus(status.code)}>
                            <span>{status.label} ({list.length})</span>
                            <span>{isExpanded ? "▲" : "▼"}</span>
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
                                                <td colSpan="4" style={styles.noData}>해당 부서의 연차 데이터가 없습니다.</td>
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
        padding: "30px 20px 20px 20px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    section: {
        background: "#fff",
        padding: "16px 24px",
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: 15,
    },
    subTitle: {
        margin: 0,
        fontSize: '16px',
        fontWeight: 600,
        cursor: "pointer",
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    tableWrapper: {
        marginTop: '16px',
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