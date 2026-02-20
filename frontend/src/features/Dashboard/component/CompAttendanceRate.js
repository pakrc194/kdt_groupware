import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, Legend, XAxis, YAxis, CartesianGrid, Tooltip, Bar } from 'recharts';

function Attendance({ emp }) {
    const statusList = [
        { code: "PRESENT", label: "출근" },
        { code: "ABSENT", label: "결근" },
        { code: "BUSINESS_TRIP", label: "출장" },
        { code: "OFF", label: "휴무" },
        { code: "LEAVE", label: "연차" },
    ];

    const total = emp.length;
    const present = emp.filter((dd) => dd.atdcSttsCd === "PRESENT").length;
    const absent = emp.filter((dd) => dd.atdcSttsCd === "ABSENT" || dd.atdcSttsCd === null).length;
    const businessTrip = emp.filter((dd) => dd.atdcSttsCd === "BUSINESS_TRIP").length;
    const off = emp.filter((dd) => dd.atdcSttsCd === "OFF").length;
    const leave = emp.filter((dd) => dd.atdcSttsCd === "LEAVE").length;

    const presentRate = total === 0 ? 0 : ((present / total) * 100).toFixed(2);

    const recentDays = [new Date()];
    const attendData = recentDays.map((date) => ({
        name: `${date.getMonth() + 1}/${date.getDate()}`,
        "출근": present,
        "결근": absent,
        "출장": businessTrip,
        "휴무": off,
        "연차": leave,
    }));

    const [expandedStatus, setExpandedStatus] = useState(
        statusList.reduce((acc, cur) => ({ ...acc, [cur.code]: false }), {})
    );

    const toggleStatus = (code) => {
        setExpandedStatus(prev => ({ ...prev, [code]: !prev[code] }));
    }

    const statsData = [
        { title: '전체 인원', value: total },
        { title: '출근', value: present },
        { title: '출근율', value: `${presentRate}%` },
        { title: '결근', value: absent },
        { title: '출장', value: businessTrip },
        { title: '휴무', value: off },
        { title: '연차', value: leave },
    ];

    return (
        <div>
            <h1>근태현황</h1>

            {/* ================= 차트 + 카드 컨테이너 ================= */}
            <div style={styles.chartCardContainer}>
                {/* 차트 */}
                <div style={styles.chartWrapper}>
                    <BarChart style={{ width: '100%', height: '100%' }} data={attendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis width="auto" />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="출근" fill="#82ca9d" isAnimationActive />
                        <Bar dataKey="결근" fill="#ca8282" isAnimationActive />
                        <Bar dataKey="출장" fill="#ca79c3" isAnimationActive />
                        <Bar dataKey="휴무" fill="#595959" isAnimationActive />
                        <Bar dataKey="연차" fill="#5a5de2" isAnimationActive />
                    </BarChart>
                </div>

                {/* 통계 카드 */}
                <div style={styles.statsWrap}>
                    {statsData.map((stat, index) => (
                        <div key={index} style={styles.statCard}>
                            <div style={styles.statTitle}>{stat.title}</div>
                            <div style={styles.statValue}>{stat.value}</div>
                        </div>
                    ))}
                </div>
            </div>

            {/* ================= 상태별 테이블 ================= */}
            {statusList.map((status) => {
                let list = emp.filter((dd) => dd.atdcSttsCd === status.code);
                if (status.code === "ABSENT") {
                    list = emp.filter((dd) => dd.atdcSttsCd === "ABSENT" || dd.atdcSttsCd === null);
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
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    },
    statsWrap: {
        display: "flex",
        flexWrap: 'wrap', // 여러 줄로 배치 가능
        flex: 1,
        gap: 16,
        maxHeight: 400, // 차트 높이에 맞춰서 카드 영역 제한
        overflowY: 'auto',
    },
    statCard: {
        background: "#fff",
        padding: 16,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        minWidth: 120,
        flex: '1 1 45%', // 두 줄로 배치되도록 너비 조절
    },
    statTitle: {
        fontSize: 14,
        color: "#888",
        marginBottom: 8,
    },
    statValue: {
        fontSize: 24,
        fontWeight: "bold",
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