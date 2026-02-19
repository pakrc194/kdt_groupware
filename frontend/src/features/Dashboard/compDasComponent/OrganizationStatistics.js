import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function OrganizationStatistics({ inOut }) {
    const deptOrder = ["지점장", "식품", "뷰티·패션잡화", "여성패션", "남성패션", "인사관리", "시설자재", "안전관리"];
    const activeList = inOut.filter(data => data.empAcntStts === "ACTIVE");

    // 부서별 그룹
    const deptGroup = activeList.reduce((acc, cur) => {
        if (!acc[cur.deptName]) acc[cur.deptName] = [];
        acc[cur.deptName].push(cur);
        return acc;
    }, {});

    // 부서별 펼침 상태
    const [expandedDept, setExpandedDept] = useState({});

    const toggleDept = (dept) => {
        setExpandedDept(prev => ({
            ...prev,
            [dept]: !prev[dept]
        }));
    }

    return (
        <div>
            <h2>회사 조직 통계</h2>

            {deptOrder.map(dept => {
                const list = deptGroup[dept];
                if (!list || list.length === 0) return null;

                const isExpanded = expandedDept[dept];

                return (
                    <div key={dept} style={styles.section}>
                        {/* 부서 헤더 */}
                        <div 
                            style={{ ...styles.subTitle, cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center" }}
                            onClick={() => toggleDept(dept)}
                        >
                            <span>{dept} ({list.length}명)</span>
                            <span>{isExpanded ? "▲" : "▼"}</span>
                        </div>

                        {/* 직원 테이블 */}
                        {isExpanded && (
                            <table style={styles.table}>
                                <thead>
                                    <tr>
                                        <th style={styles.th}>사원번호</th>
                                        <th style={styles.th}>이름</th>
                                        <th style={styles.th}>직책</th>
                                        <th style={styles.th}>입사일</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {list
                                        .sort((a, b) => new Date(a.empJncmpYmd) - new Date(b.empJncmpYmd))
                                        .map(data => (
                                            <tr key={data.empId}>
                                                <td style={styles.td}>{data.empSn}</td>
                                                <td style={styles.td}>
                                                    <Link to={`detail/${data.empId}`} style={styles.link}>{data.empNm}</Link>
                                                </td>
                                                <td style={styles.td}>{data.jbttlNm}</td>
                                                <td style={styles.td}>{data.empJncmpYmd?.split(" ")[0]}</td>
                                            </tr>
                                        ))
                                    }
                                </tbody>
                            </table>
                        )}
                        {!isExpanded && list.length === 0 && (
                            <div style={styles.noData}>데이터가 없습니다.</div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    section: {
        background: "#fff",
        padding: 24,
        borderRadius: 8,
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        marginBottom: 30,
    },
    subTitle: {
        marginBottom: 16,
        fontWeight: "600",
        fontSize: 16,
    },
    table: {
        width: "100%",
        borderCollapse: "collapse",
    },
    th: {
        background: "#fafafa",
        padding: 10,
        borderBottom: "2px solid #f0f0f0",
        textAlign: "left",
        width: "120px"
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

export default OrganizationStatistics;
