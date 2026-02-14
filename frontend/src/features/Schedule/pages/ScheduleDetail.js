import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import { chkToday } from '../../../shared/api/chkToday';
import Modal from '../../../shared/components/Modal';

function ScheduleDetail(props) {
    const { id } = useParams();
    const [sched, setSched] = useState([]);
    const [schedA, setSchedA] = useState(0);
    const [schedType, setSchedType] = useState('');
    const [schedTitle, setSchedTitle] = useState('');
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const [isOpen, setIsOpen] = useState(false);
    const [deptId, setDeptId] = useState('');
    const [persId, setPersId] = useState('');

    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');

    const formatted = `${yyyy}-${mm}-${dd}`;
    
    const navigate = useNavigate();
    useEffect(() => {
        fetcher(`/gw/schedule/sched_detail/${id}`)
        .then(dd => {setSched(Array.isArray(dd) ? dd : [dd])
            setSchedA(dd.schedAuthorId)
            setSchedType(dd.schedType)
            setSchedTitle(dd.schedTitle)
            setDeptId(dd.schedDeptId)
            setPersId(dd.schedEmpId)
            console.log(dd)
        })
        .catch(e => console.log(e))
    }, []);

    const schedDelete = () => {
        fetcher(`/gw/schedule/sched_delete/${id}
            ?empId=${myInfo.empId}&title=${schedTitle}&type=${schedType}&dept=${deptId}&pers=${persId}`)
        .catch(e => console.log(e))
        console.log('일정 삭제')
        alert('일정이 삭제됐습니다.')
        navigate(-1)
    }
    
    return (
        <div style={styles.container}>
            {sched.map((vv, kk) => (
                <table key={kk} style={styles.table}>
                <tbody key={kk}>
                <tr>
                    <th style={styles.th}>구분</th>
                    <td style={styles.td}>{vv.schedType}</td>
                </tr>
                <tr>
                    <th style={styles.th}>제목</th>
                    <td style={styles.td}>{vv.schedTitle}</td>
                </tr>
                <tr>    
                    <th style={styles.th}>상세내용</th>
                    <td style={styles.td}>{vv.schedDetail}</td>
                </tr>
                {vv.schedType == "DEPT" &&
                    <tr>
                        <th style={styles.th}>담당팀</th>
                        <td style={styles.td}>{vv.schedDept}</td>
                    </tr>
                }
                {vv.schedType == "PERSONAL" &&
                    <tr>
                        <th style={styles.th}>담당자</th>
                        <td style={styles.td}>{vv.schedEmpNm}</td>
                    </tr>
                }
                <tr>
                    <th style={styles.th}>위치</th>
                    <td style={styles.td}>{vv.schedLocNm}</td>
                </tr>
                
                <tr>    
                    {/* <td>구분(회사, 팀, 개인, TODO)</td>
                    <td>{vv.schedType}</td> */}
                </tr>
                
                <tr>    
                    <th style={styles.th}>시작일</th>
                    <td style={styles.td}>{vv.schedStartDate.split(' ')[0]}</td>
                </tr><tr>    
                    <th style={styles.th}>종료일</th>
                    <td style={styles.td}>{vv.schedEndDate.split(' ')[0]}</td>
                </tr>
                </tbody>
                </table>
            ))}
                    <div style={styles.buttonGroup}>
            {sched.map(dedate => (
                <>
                {(dedate.schedStartDate.split(' ')[0] != formatted) && chkToday(dedate.schedStartDate) && chkToday(dedate.schedEndDate) && myInfo.empId == schedA && schedType != 'TODO' &&
                <>
                    <button style={styles.deleteBtn} onClick={() => setIsOpen(true)}>일정 삭제</button>
                    {isOpen && (
                        <Modal 
                        title={dedate.schedTitle}
                        message="삭제하시겠습니까?"
                        onClose={() => setIsOpen(false)} 
                        onOk={schedDelete} 
                        okMsg="삭제" 
                        />
                    )}
                </>
                }
                </>
            ))}
                <button style={styles.backBtn} onClick={() => navigate(-1)}>뒤로</button>
            </div>
        </div>
    );
}

// const styles = {
//     container: { maxWidth: '400px', margin: '40px auto', padding: '20px', border: '1px solid #ddd', borderRadius: '8px', fontFamily: 'Arial, sans-serif', backgroundColor: '#fff', },
//     backBtn: {
//         padding: '10px 15px',
//         backgroundColor: '#f5f5f5',
//         border: '1px solid #ddd',
//         borderRadius: '4px',
//         cursor: 'pointer',
//     },
//     buttonGroup: {
//         display: 'flex',
//         gap: '10px',
//         justifyContent: 'flex-end',
//     },
//     deleteBtn: {
//         padding: '10px 15px',
//         backgroundColor: '#dc3545',
//         color: '#fff',
//         border: 'none',
//         borderRadius: '4px',
//         cursor: 'pointer',
//     }
// }

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
        overflow: 'hidden',
        boxShadow: '0 4px 15px rgba(0,0,0,0.05)',
        marginBottom: '20px',
    },

    th: {
        width: '30%',
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
};


export default ScheduleDetail;