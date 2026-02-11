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

    return (
        <div>
            <h2>결재 처리 이력</h2>
                <table>
                    <tbody>
                        {groupedData.map(data => (
                            <tr>
                                <td>{data.aprvDocId}</td>
                                <td>{data.draftEmpNm}</td>
                                <td>{data.docFormNm}</td>
                                <td>{data.aprvDocDrftDt}</td>
                                <td>{data.aprvDocStts}</td>
                                <td>{data.aprvPrcsEmpNm}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
        </div>
    );
}

export default ApprovalProcessHistory;