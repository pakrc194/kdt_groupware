import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link, useParams } from 'react-router-dom';

const ReferBox = () => {
    const [aprvDocList, setAprvDocList] = useState([]);
    const {sideId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
       
        console.log("ReferBox useEffect");
        fetcher(`/gw/aprv/ReferDocList/${myInfo.empId}`).then(setAprvDocList)
    }, [])

    const fn_stts = (e) => {

    }

    return (
        <>
            <h4>전자결재 > 참조함 </h4>
            <div className="section history-section">
                <div>
                    <select onChange={fn_stts}>
                        <option value="">ALL</option>
                        <option>PENDING</option>
                        <option>REJECTED</option>
                        <option>COMPLETED</option>
                    </select>
                    <select>
                        <option>전체</option>
                        <option>공용</option>
                        <option>부서</option>
                    </select>
                </div>
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
                    {aprvDocList.length > 0 ? (
                    aprvDocList.map((aprvDoc, k)=> (<tr key={k}>
                        <td>{aprvDoc.aprvDocNo}</td>
                        <td><Link to={`/approval/${sideId}/detail/`+aprvDoc.aprvDocId}>{aprvDoc.aprvDocTtl}</Link></td>
                        <td>{aprvDoc.empNm}</td>
                        <td>{aprvDoc.aprvDocDrftDt.substring(0,10)}</td>
                        <td>
                            <span className={`badge-status ${aprvDoc.aprvDocStts}`}>
                                {aprvDoc.aprvDocStts}
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

export default ReferBox;