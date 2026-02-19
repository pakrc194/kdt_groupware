import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link, useParams } from 'react-router-dom';
import { getStatusLabel } from '../../../shared/func/formatLabel';
import { formatForList } from '../../../shared/func/formatToDate';

const RejectBox = () => {
    const [aprvDocList, setAprvDocList] = useState([]);
    const {sideId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
        fetcher(`/gw/aprv/RejectDocList/${myInfo.empId}`).then(setAprvDocList)
    }, [])

    return (
        <>
            <h4>전자결재 > 반려함 </h4>
            <div className="section history-section">
                <table className="history-table">
                <thead>
                    <tr>
                        <th>문서번호</th>
                        <th>버전</th>
                        <th>문서제목</th>
                        <th>기안자</th>
                        <th>기안일자</th>
                        <th>진행상태</th>
                    </tr>
                </thead>
                <tbody>
                    {aprvDocList.length > 0 ? (
                    aprvDocList.map((aprvDoc, k)=> (<tr key={k}>
                        <td>{aprvDoc.aprvDocNo}</td>
                        <td>{aprvDoc.aprvDocVer}</td>
                        <td><Link to={`/approval/${sideId}/detail/`+aprvDoc.aprvDocId}>{aprvDoc.aprvDocTtl}</Link></td>
                        <td>{aprvDoc.empNm}</td>
                        <td>{formatForList(aprvDoc.aprvDocDrftDt)}</td>
                        <td>
                            <span className={`badge-status ${aprvDoc.aprvDocStts}`}>
                                {getStatusLabel(aprvDoc.aprvDocStts)}
                            </span>
                        </td>
                    </tr>))
                    ) : (
                    <tr>
                        <td colSpan="7" className="no-data">
                        데이터가 없습니다.
                        </td>
                    </tr>
                    )}
                </tbody>
                </table>
            </div>
        </>
    );
};

export default RejectBox;