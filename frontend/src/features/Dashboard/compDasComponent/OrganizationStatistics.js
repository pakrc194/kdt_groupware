import React from 'react';


function OrganizationStatistics({ inOut }) {
    const deptOrder = ["지점장", "식품", "뷰티·패션잡화", "여성패션", "남성패션", "인사관리", "시설자재", "안전관리"];
    const activeList = inOut.filter( data => data.empAcntStts === "ACTIVE" );
    
    // 부서별 그룹
    const deptGroup = activeList.reduce((acc, cur) => {
        if (!acc[cur.deptName]) acc[cur.deptName] = [];
        acc[cur.deptName].push(cur);
        return acc;
    }, {});

    return (
        <div>
            <h2>회사 조직 통계</h2>
            <table>
                <tbody>
                    {deptOrder.map(dept => {
                        const list = deptGroup[dept];
                        if (!list || list.length === 0) return null;

                        return (
                        <React.Fragment key={dept}>
                            {/* 부서 헤더 행 */}
                            <tr className="dept-header">
                            <td colSpan={4}>
                                {dept} ({list.length}명)
                            </td>
                            </tr>

                            {/* 직원 목록 */}
                            {list
                            .sort((a, b) => new Date(a.empJncmpYmd) - new Date(b.empJncmpYmd))
                            .map(data => (
                                <tr key={data.empId}>
                                <td style={{width:"120px"}}>{data.empNm}</td>
                                <td style={{width:"120px"}}>{data.deptName}</td>
                                <td style={{width:"120px"}}>{data.jbttlNm}</td>
                                <td style={{width:"120px"}}>{data.empJncmpYmd?.split(" ")[0]}</td>
                                </tr>
                            ))}
                        </React.Fragment>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default OrganizationStatistics;