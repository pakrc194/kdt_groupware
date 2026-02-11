import React from 'react';

function AccessDeletionHistory({accessDeleteList}) {

    const sectionList = [
        {id: 1, code: 'APPROVAL', name: '전자결재'},
        {id: 2, code: 'SCHEDULE', name: '일정관리'},
        {id: 3, code: 'ATTENDANCE', name: '근태관리'},
        {id: 4, code: 'BOARD', name: '공지게시판'},
        {id: 5, code: 'ORGCHART', name: '조직도'},
        {id: 6, code: 'DASHBOARD', name: '회사 대시보드'},
    ];

    return (
        <div>
            <h2>권한 삭제 이력</h2>
            {['DEPT', 'JBTTL'].map(type => {
                const typeName = type === 'DEPT' ? '팀' : '직책';
                return (
                    <div style={styles.addBox}>
                        {/* <h2>{typeName} 권한 목록</h2> */}
                        <table style={styles.table} >
                            <thead>
                                <tr>
                                    <th style={styles.th}>{typeName}</th>
                                    <th style={styles.th}>구분</th>
                                    <th style={styles.th}>권한</th>
                                    <th style={styles.th}>삭제 날짜</th>
                                </tr>
                            </thead>
                            <tbody>

                            {accessDeleteList.filter(v => v.accessDeleteType === type).length > 0 ? (
                                accessDeleteList
                                .filter(v => v.accessDeleteType === type)
                                .map((v, idx) => (
                                    <tr key={idx}>
                                        <td style={styles.td}>{v.empowerName}</td>
                                        <td style={styles.td}>
                                            {sectionList.find(s => s.code === v.accessDeleteSection)?.name}
                                        </td>
                                        <td style={styles.td}>{v.accessName}</td>
                                        <td style={styles.td}>{v.accessDeleteDate}</td>
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
                )
            })}
        </div>
    );
}

const styles = {
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    margin: 0,
  },
  section: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 30,
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
    width: "100px"
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
};

export default AccessDeletionHistory;