import React from 'react';

function ApprovalProcessHistory({approval}) {
    

    const grouped = {};

    approval.forEach(item => {
        const id = item.aprvDocId;

        if (!grouped[id]) {
            grouped[id] = {
                ...item,
                aprvPrcsEmpNm: item.aprvPrcsEmpNm ? [item.aprvPrcsEmpNm] : []
            };
        } else {
            if (item.aprvPrcsEmpNm) {
                grouped[id].aprvPrcsEmpNm.push(", "+item.aprvPrcsEmpNm);
            }
        }
    });

    const groupedData = Object.values(grouped);
    console.log(groupedData)

    const parseDateTime = (str) => {
        console.log(str)
        const year = str.substring(0, 4);
        const month = str.substring(4, 6) - 1; // JS는 month가 0부터 시작
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const minute = str.substring(10, 12);
        const second = str.substring(12, 14);

        return new Date(year, month, day, hour, minute, second);
    }
    return (
        <div>
            <h2>결재 처리 이력</h2>
                <table>
                    <tbody>
                        {groupedData
                        .sort((a, b) => parseDateTime(a.aprvDocDrftDt) - parseDateTime(b.aprvDocDrftDt))
                        .map(data => (
                            <tr>
                                <td style={styles.td}>{data.aprvDocTtl}</td>
                                {/* <td>{data.aprvDocId}</td> */}
                                <td style={styles.td}>{data.draftEmpNm}</td>
                                <td style={styles.td}>{data.docFormNm}</td>
                                <td style={styles.td}>{data.aprvDocDrftDt}</td>
                                {/* <td style={styles.td}>{parseDateTime(data.aprvDocDrftDt)}</td> */}
                                <td style={styles.td}>{data.aprvDocStts}</td>
                                <td style={styles.td}>{data.aprvPrcsEmpNm}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}

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
        width: '120px'
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


export default ApprovalProcessHistory;