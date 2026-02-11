import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import NoAccess from '../../../shared/components/NoAccess';

function AccessList(props) {
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));

    const [isActive, setisActive] = useState(false);
    const [option, setOption] = useState('DEPT')
    const [teamList, setTeamList] = useState([]);
    const [jbttlList, setJbttlList] = useState([]);
    const [accessEmpowerList, setAccessEmpowerList] = useState([]);
    const [empower, setEmpower] = useState(1);
    const [section, setSection] = useState('');
    const [detail, setDetail] = useState('');
    const [accessList, setAccessList] = useState([]);
    const [isDelete, setIsDelete] = useState(false);

    const typeList = [{id: 1, code: 'DEPT', name: '팀'}, {id: 2, code: 'JBTTL', name: '직책'}];
    const sectionList = [
        {id: 1, code: 'APPROVAL', name: '전자결재'},
        {id: 2, code: 'SCHEDULE', name: '일정관리'},
        {id: 3, code: 'ATTENDANCE', name: '근태관리'},
        {id: 4, code: 'BOARD', name: '공지게시판'},
        {id: 5, code: 'ORGCHART', name: '조직도'},
        {id: 6, code: 'DASHBOARD', name: '회사 대시보드'},
    ];

    useEffect(() => {
        // 전체 팀 리스트
        fetcher('/gw/schedule/instruction/teams')
        .then(dd => {
            setTeamList(dd)
        })
        
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        fetcher('/gw/orgChart/register/jbttl')
        .then(dd => {
            setJbttlList(Array.isArray(dd) ? dd : [dd])
        })
        .catch(err => console.error('팀 리스트 로딩 실패', err));

        fetcher('/gw/dashboard/accessEmpowerList')
        .then(dd => {
            setAccessEmpowerList(Array.isArray(dd) ? dd : [dd])
            console.log(dd)
        })
        .catch(err => console.error('권한 부여 리스트 로딩 실패', err));
    }, [])

    useEffect(() => {
        fetcher('/gw/dashboard/accessEmpowerList')
        .then(dd => {
            setAccessEmpowerList(Array.isArray(dd) ? dd : [dd])
            console.log(dd)
        })
        .catch(err => console.error('권한 부여 리스트 로딩 실패', err));
    }, [isActive, isDelete])

    const accessLoad = {
        ACCESS_TYPE: option,
        EMPOWER_ID: empower,
        ACCESS_SECTION: section,
        ACCESS_DETAIL: detail
    }

    const chooseSection = (e) => {
        setSection(e)
        fetcher(`/gw/dashboard/accessList?type=${e}`)
        .then(dd => {setAccessList(dd)})
        .catch(err => console.error('권한 리스트 로딩 실패', err));
    }

    const addAccess = async () => {
        console.log('권한 추가', accessLoad)
        await fetcher('/gw/dashboard/addAccess', {
            method: 'POST',
            body: { 
                accessType: option,
                accessSection: section,
                empowerId: empower,
                accessDetail: detail
            }
        });
        setisActive(false)
    }

    const deleteAccess = async (e) => {
        console.log('삭제 버튼 클릭 '+e.accessType+", "+e.empowerId+", "+e.accessSection+", "+e.accessDetail)
        await fetcher('/gw/dashboard/delAccess', {
            method: 'POST',
            body: { 
                accessDeleteId: e.accessEmpowerId,
                accessDeleteType: e.accessType, 
                deleteEmpowerId: e.empowerId, 
                accessDeleteSection: e.accessSection, 
                accessDeleteDetail: e.accessDetail, 
            }
        });
        setIsDelete(!isDelete);
    }

    // 지점장만 접근 가능
    if (myInfo.deptId !== 1) return <NoAccess />

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>권한 관리</h1>
                { !isActive &&
                    <button onClick={() => setisActive(true)} style={styles.primaryBtn}>권한 추가</button>
                }
            </div>
            { isActive &&
                <div style={styles.filterBox}>
                    <div style={styles.filterGroup}>
                        <select
                            style={styles.input}
                            onChange={e => {setOption(e.target.value)}}
                        >
                            {typeList.map(list => (
                                <option key={list.id} value={list.code}>{list.name}</option>
                            ))}
                        </select >
                            {/* 팀 */}
                            {option === "DEPT" && 
                                <select style={styles.input} onChange={e => {setEmpower(e.target.value)}}>
                                    <option value="0">팀 선택</option>
                                    {teamList.map(list => (
                                    <option key={list.deptId} value={list.deptId}>{list.deptName}</option>
                                    ))}
                                </select>
                            }
                            {/* 직책 */}
                            {option === "JBTTL" && 
                                <select style={styles.input} onChange={e => {setEmpower(e.target.value)}}>
                                    <option value="0">직책 선택</option>
                                    {jbttlList.map(list => (
                                    <option key={list.jbttlId} value={list.jbttlId}>{list.jbttlNm}</option>
                                    ))}
                                </select>
                            }
                            <select style={styles.input} onChange={e => {chooseSection(e.target.value)}}>
                                <option value="0">구분 선택</option>
                                {
                                    sectionList.map(list => (
                                        <option key={list.id} value={list.code}>{list.name}</option>
                                    ))
                                }
                            </select>
                            <select style={styles.input} onChange={e => {setDetail(e.target.value)}}>
                                <option value="0">권한 선택</option>
                                {
                                    accessList.map(list => (
                                        <option key={list.accessListId} value={list.accessListId}>{list.accessDetail}</option>
                                    ))
                                }
                            </select>
                            <button style={styles.primaryBtn} onClick={addAccess}>추가</button>
                            <button style={styles.cancelBtn} onClick={() => setisActive(false)}>취소</button>
                    </div>
                </div>
            }
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
                                    <th style={styles.th}>관리</th>
                                </tr>
                            </thead>
                            <tbody>

                            {accessEmpowerList.filter(v => v.accessType === type).length > 0 ? (
                                accessEmpowerList
                                .filter(v => v.accessType === type)
                                .map((v, idx) => (
                                    <tr key={idx}>
                                        <td style={styles.td}>{v.empowerName}</td>
                                        <td style={styles.td}>
                                            {sectionList.find(s => s.code === v.accessSection)?.name}
                                        </td>
                                        <td style={styles.td}>{v.accessName}</td>
                                        <td style={styles.td}>
                                            {/* <button style={styles.smallBtn}>수정</button> */}
                                            <button style={styles.deleteBtn} onClick={() => {deleteAccess(v)
                                            }}>삭제</button>
                                        </td>
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
  container: {
    maxWidth: "1200px",
    margin: "20px auto",
    padding: "20px",
    backgroundColor: "#f8f9fa",
    borderRadius: "12px",
    fontFamily: "Pretendard, -apple-system, sans-serif",
  },
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
  filterBox: {
    background: "#fff",
    padding: 20,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 20,
  },
  filterGroup: {
    display: "flex",
    gap: 12,
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "flex-end"
  },
  input: {
    padding: "8px 12px",
    border: "1px solid #d9d9d9",
    borderRadius: 6,
    fontSize: 14,
  },
  primaryBtn: {
    padding: "8px 24px",
    backgroundColor: "#1890ff",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  cancelBtn: {
    padding: "8px 24px",
    backgroundColor: "#aaa",
    color: "#fff",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
  section: {
    background: "#fff",
    padding: 24,
    borderRadius: 8,
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    marginBottom: 30,
  },
  sectionTitle: {
    marginBottom: 16,
    fontSize: 18,
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    background: "#fafafa",
    padding: 16,
    borderBottom: "2px solid #f0f0f0",
    textAlign: "left",
    width: "100px"
  },
  td: {
    padding: 16,
    borderBottom: "1px solid #f0f0f0",
  },
  smallBtn: {
    padding: "4px 12px",
    marginRight: 6,
  },
  deleteBtn: {
    padding: "4px 12px",
    backgroundColor: "#ff4d4f",
    color: "#fff",
    border: "none",
    borderRadius: 4,
    cursor: "pointer",
  },
  noData: {
    textAlign: "center",
    padding: 40,
    color: "#bfbfbf",
  },
};


export default AccessList;