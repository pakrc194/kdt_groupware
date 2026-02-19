import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { fetcher } from '../../../shared/api/fetcher';
import { getStatusLabel } from '../../../shared/func/formatLabel';
import { formatForList } from '../../../shared/func/formatToDate';

const DocStatus = () => {
    const {sideId} = useParams();

    const [drftList, setDrftList] = useState([]);
    const [aprvList, setAprvList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(()=>{
        fetcher(`/gw/aprv/DrftDocList/${myInfo.empId}?limit=5`).then(setDrftList)
        fetcher(`/gw/aprv/AprvDocList/${myInfo.empId}?limit=5`).then(setAprvList)
    },[])


    return (
        <div>
            <h1>기안 현황</h1>
            <div className="section history-section">
                <table className="history-table">
                <thead>
                    <tr>
                        <th>문서번호</th>
                        <th>문서제목</th>
                        <th>기안자</th>
                        <th>기안일자</th>
                        <th>진행상태</th>
                    </tr>
                </thead>
                <tbody>
                    {drftList.length > 0 ? (
                    drftList.map((aprvDoc, k)=> (<tr key={k}>
                        <td>{aprvDoc.aprvDocNo}</td>
                        <td><Link to={`/approval/drftBox/detail/`+aprvDoc.aprvDocId}>{aprvDoc.aprvDocTtl}</Link></td>
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
                    

            <h1>결재 현황</h1>
            <div className="section history-section">
                <table className="history-table">
                <thead>
                    <tr>
                        <th>문서번호</th>
                        <th>문서제목</th>
                        <th>기안자</th>
                        <th>기안일자</th>
                        <th>진행상태</th>
                    </tr>
                </thead>
                <tbody>
                    {aprvList.length > 0 ? (
                    aprvList.map((aprvDoc, k)=> (<tr key={k}>
                        <td>{aprvDoc.aprvDocNo}</td>
                        <td><Link to={`/approval/approvalBox/detail/`+aprvDoc.aprvDocId}>{aprvDoc.aprvDocTtl}</Link></td>
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
        </div>
    );
};

export default DocStatus;