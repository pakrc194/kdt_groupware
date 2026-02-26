import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import NoAccess from '../../../shared/components/NoAccess';
import Button from '../../../shared/components/Button';

function AccessList() {
    const [myInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));

    const [isActive, setIsActive] = useState(false);
    const [option, setOption] = useState('DEPT');
    const [teamList, setTeamList] = useState([]);
    const [jbttlList, setJbttlList] = useState([]);
    const [accessEmpowerList, setAccessEmpowerList] = useState([]);
    const [accessList, setAccessList] = useState([]);
    const [isDelete, setIsDelete] = useState(false);

    const [expandedSections, setExpandedSections] = useState({});
    const [expandedDetails, setExpandedDetails] = useState({});

    const sectionList = [
        {id: 1, code: 'APPROVAL', name: '전자결재'},
        {id: 2, code: 'SCHEDULE', name: '일정관리'},
        {id: 3, code: 'ATTENDANCE', name: '근태관리'},
        {id: 4, code: 'BOARD', name: '공지게시판'},
        {id: 5, code: 'ORGCHART', name: '조직도'},
        {id: 6, code: 'DASHBOARD', name: '회사 대시보드'},
    ];

    useEffect(() => {
        fetcher('/gw/schedule/instruction/teams').then(setTeamList).catch(console.error);
        fetcher('/gw/orgChart/register/jbttl').then(dd => setJbttlList(Array.isArray(dd) ? dd : [dd])).catch(console.error);
        fetcher('/gw/dashboard/accessEmpowerList').then(dd => setAccessEmpowerList(Array.isArray(dd) ? dd : [dd])).catch(console.error);
        fetcher('/gw/dashboard/allAccessList').then(setAccessList).catch(console.error);
    }, []);

    useEffect(() => {
        fetcher('/gw/dashboard/accessEmpowerList').then(dd => setAccessEmpowerList(Array.isArray(dd) ? dd : [dd])).catch(console.error);
    }, [isActive, isDelete]);

    const toggleSection = (sectionCode) => {
        setExpandedSections(prev => ({ ...prev, [sectionCode]: !prev[sectionCode] }));
    };

    const toggleDetail = (sectionCode, detailKey) => {
        const key = `${sectionCode}-${detailKey}`;
        setExpandedDetails(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const addAccess = async (type, empId, e) => {
        await fetcher('/gw/dashboard/addAccess', {
            method: 'POST',
            body: { 
                accessType: type,
                accessSection: e.accessSection,
                empowerId: empId,
                accessDetail: e.accessListId
            }
        });
        setIsActive(!isActive);
    };

    const deleteAccess = async (accessEmpowerId, type, empId, e) => {
        await fetcher('/gw/dashboard/delAccess', {
            method: 'POST',
            body: { 
                accessDeleteId: accessEmpowerId,
                accessDeleteType: type,
                deleteEmpowerId: empId,
                accessDeleteSection: e.accessSection,
                accessDeleteDetail: e.accessListId,
            }
        });
        setIsDelete(!isDelete);
    };

    if (myInfo.deptId !== 1) return <NoAccess />;

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <h1 style={styles.title}>{option === 'DEPT' ? '팀 ' : '직책 '}권한 관리</h1>
                <Button onClick={() => setOption('DEPT')}>팀</Button>
                <Button onClick={() => setOption('JBTTL')}>직책</Button>
            </div>

            {sectionList.map(section => {
                const sectionData = accessList.filter(v => v.accessSection === section.code);
                if (sectionData.length === 0) return null;

                const groupedByDetail = {};
                sectionData.forEach(item => {
                    if (!groupedByDetail[item.accessDetail]) groupedByDetail[item.accessDetail] = { accessName: item.accessName, items: [] };
                    groupedByDetail[item.accessDetail].items.push(item);
                });

                const empowerList = option === "DEPT" ? teamList : jbttlList;
                const matched = accessEmpowerList.filter(emp => 
                    emp.accessType === option &&
                    accessList.some(acc => acc.accessListId === emp.accessDetail)
                );

                const sectionExpanded = expandedSections[section.code] ?? false;

                return (
                    <div key={section.code} style={styles.section}>
                        <h3 style={styles.subTitle} onClick={() => toggleSection(section.code)}>
                            {section.name} ({sectionData.length}) {sectionExpanded ? "▲" : "▼"}
                        </h3>

                        {sectionExpanded && Object.entries(groupedByDetail).map(([detailKey, value]) => {
                            const detailExpanded = expandedDetails[`${section.code}-${detailKey}`] ?? false;
                            return (
                                <div key={detailKey} style={{ marginBottom: 12 }}>
                                    <h4 style={styles.detailTitle} onClick={() => toggleDetail(section.code, detailKey)}>
                                        {value.items[0].accessDetail} {detailExpanded ? "▲" : "▼"}
                                    </h4>

                                    {detailExpanded && (
                                        <table style={styles.table}>
                                            <thead>
                                                <tr>
                                                    <th style={styles.th}>{option === "DEPT" ? "팀" : "직책"}</th>
                                                    <th style={styles.th}>관리</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {empowerList.map(empower => {
                                                    const empowerId = option === "DEPT" ? empower.deptId : empower.jbttlId;
                                                    const empowerName = option === "DEPT" ? empower.deptName : empower.jbttlNm;

                                                    const exists = matched.find(v => v.empowerId === empowerId && v.accessDetail === value.items[0].accessListId);

                                                    return (
                                                        <tr key={empowerId}>
                                                            <td style={styles.td}>{empowerName}</td>
                                                            <td style={styles.td}>
                                                                {exists ? 
                                                                    <button style={styles.deleteBtn} onClick={() => deleteAccess(exists.accessEmpowerId, option, empowerId, value.items[0])}>삭제</button> : 
                                                                    <button style={styles.addBtn} onClick={() => addAccess(option, empowerId, value.items[0])}>추가</button>
                                                                }
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                );
            })}
        </div>
    );
}

const styles = {
    container: { maxWidth: 1200, margin: '20px auto', padding: 20, fontFamily: "Pretendard, -apple-system, sans-serif" },
    header: { display: "flex", alignItems: "center", marginBottom: 24, gap: 10 },
    title: { fontSize: 24, margin: 0 },
    section: { background: "#fff", padding: 16, borderRadius: 8, marginBottom: 24, boxShadow: "0 2px 8px rgba(0,0,0,0.05)" },
    subTitle: { cursor: "pointer", marginBottom: 12 },
    detailTitle: { cursor: "pointer", marginLeft: 16, marginBottom: 8, fontWeight: 500 },
    table: { width: "100%", borderCollapse: "collapse", marginBottom: 8 },
    th: { background: "#fafafa", padding: 10, borderBottom: "1px solid #f0f0f0", textAlign: "left" },
    td: { padding: 10, borderBottom: "1px solid #f0f0f0" },
    addBtn: { padding: "4px 12px", backgroundColor: "#007bff", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
    deleteBtn: { padding: "4px 12px", backgroundColor: "#ff4d4f", color: "#fff", border: "none", borderRadius: 4, cursor: "pointer" },
};

export default AccessList;