import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function DetailEmp() {
    const [data, setData] = useState({});
    const { id } = useParams();
    const navigate = useNavigate();
    // 로그인 정보
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const [modify, setModify] = useState(0);
    const [deact, setDeact] = useState(0);
    
    useEffect(() => {
        // 정보 수정 권한
        fetcher(`/gw/orgChart/access?id=${myInfo.deptId}&type=DEPT&section=ORGCHART&accessId=11`)
        .then(dd => {
            setModify(dd)
            console.log(dd)
        })
        .catch(e => console.log(e))

        // 계정 비활성화 권한
        fetcher(`/gw/orgChart/access?id=${myInfo.deptId}&type=DEPT&section=ORGCHART&accessId=13`)
        .then(dd => {
            setDeact(dd)
            console.log(dd)
        })
        .catch(e => console.log(e))

        fetcher(`/gw/orgChart/detail/${id}`)
            .then(dd => setData(dd))
            .catch(e => console.log(e))
    }, [id]);

    const modifyInfo = () => {
        navigate(`/orgChart/modify?id=${id}`);
    }

    const retired = async () => {
        alert('계정이 비활성화됩니다.');

        try {
            await fetcher(`/gw/orgChart/deactivate`, {
                method: 'POST',
                body: { empId: id }
            });
        } catch (err) {
            console.error('계정 비활성화 실패:', err.message);
        }
        navigate(-1);
    }

    return (
        <div style={styles.container}>
            <h2 style={styles.title}>{data.EMP_NM}</h2>

            <table style={styles.table}>
                <tbody>
                    <tr>
                        <td style={styles.th}>사진</td>
                        <td style={styles.td}>{data.EMP_PHOTO || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.th}>이름</td>
                        <td style={styles.td}>{data.EMP_NM || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.th}>팀</td>
                        <td style={styles.td}>{data.DEPT_NAME || '-'} ({data.DEPT_ID || '-'})</td>
                    </tr>
                    <tr>
                        <td style={styles.th}>직책</td>
                        <td style={styles.td}>{data.JBTTL_NM || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.th}>내선번호</td>
                        <td style={styles.td}>{data.EMP_ACTNO || '-'}</td>
                    </tr>
                    <tr>
                        <td style={styles.th}>생년월일</td>
                        <td style={styles.td}>{data.EMP_BIRTH || '-'}</td>
                    </tr>

                    {/* 같은 팀 팀장 권한 */}
                    {myInfo.jbttlId < 3 && (
                        <>
                            <tr>
                                <td style={styles.th}>이메일</td>
                                <td style={styles.td}>{data.EMP_EML_ADDR || '-'}</td>
                            </tr>
                            <tr>
                                <td style={styles.th}>전화번호</td>
                                <td style={styles.td}>{data.EMP_TELNO || '-'}</td>
                            </tr>
                            {((myInfo.jbttlId < 3 && myInfo.deptId == data.DEPT_ID)
                              || (myInfo.jbttlId == 1)) && (
                                <>
                                    <tr>
                                        <td style={styles.th}>주소</td>
                                        <td style={styles.td}>{data.EMP_ADDR || '-'}</td>
                                    </tr>
                                    {myInfo.jbttlId == 1 && (
                                        <tr>
                                            <td style={styles.th}>계좌번호</td>
                                            <td style={styles.td}>{data.EMP_ACTNO || '-'}</td>
                                        </tr>
                                    )}
                                </>
                            )}
                        </>
                    )}
                </tbody>
            </table>

            <div style={styles.buttonGroup}>
                {/* 수정 권한 */}
                {modify > 0 && (
                    <button style={styles.modifyBtn} onClick={modifyInfo}>정보수정</button>
                )}
                {/* 비활성화 권한 */}
                {deact > 0 && (
                    <button style={styles.deactivateBtn} onClick={retired}>비활성화</button>
                )}
                <button style={styles.backBtn} onClick={() => navigate(-1)}>뒤로</button>
            </div>
        </div>
    );
}

// 스타일
const styles = {
    container: {
        maxWidth: '600px',
        margin: '40px auto',
        padding: '20px',
        border: '1px solid #ddd',
        borderRadius: '8px',
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fff',
        boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
    },
    title: {
        fontSize: '22px',
        fontWeight: 'bold',
        marginBottom: '20px',
        color: '#333',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        marginBottom: '20px',
    },
    th: {
        width: '120px',
        textAlign: 'left',
        padding: '10px',
        backgroundColor: '#f5f5f5',
        fontWeight: 'bold',
        borderBottom: '1px solid #ddd',
    },
    td: {
        padding: '10px',
        borderBottom: '1px solid #eee',
        color: '#333',
    },
    buttonGroup: {
        display: 'flex',
        gap: '10px',
        justifyContent: 'flex-end',
    },
    backBtn: {
        padding: '10px 15px',
        backgroundColor: '#f5f5f5',
        border: '1px solid #ddd',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    modifyBtn: {
        padding: '10px 15px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    },
    deactivateBtn: {
        padding: '10px 15px',
        backgroundColor: '#dc3545',
        color: '#fff',
        border: 'none',
        borderRadius: '4px',
        cursor: 'pointer',
    }
};

export default DetailEmp;
