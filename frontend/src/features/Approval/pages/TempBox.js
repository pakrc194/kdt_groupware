import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import Button from '../../../shared/components/Button';

const TempBox = () => {
    const navigate = useNavigate();
    const [aprvDocList, setAprvDocList] = useState([]);
    const {sideId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
        
        console.log("TempBox useEffect");
        fetcher(`/gw/aprv/AprvTempList/${myInfo.empId}`).then(setAprvDocList)

        
    }, [])

    const fn_click = (id) => {
        console.log(id)
        fetcher(`/gw/aprv/AprvTempDelete`,{
            method:"POST",
            body:{
                docId : id
            }
        }).then(res => {
            console.log(`fetch AprvTempDelete ${res.res}`)
            navigate(0);
        })
    }

    return (
        <>
            <h4>전자결재 > 임시저장함 </h4>
            <div className="section history-section">
                <div>
                    <select >
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
                        <th>삭제</th>
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
                        <td><Button type="primary" onClick={()=>fn_click(aprvDoc.aprvDocId)}>삭제</Button></td>
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

export default TempBox;