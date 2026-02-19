import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import Button from '../../../shared/components/Button';
import { getStatusLabel } from '../../../shared/func/formatLabel';

const TempBox = () => {
    const navigate = useNavigate();
    const [aprvDocList, setAprvDocList] = useState([]);
    const {sideId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
        
        fetcher(`/gw/aprv/AprvTempList/${myInfo.empId}`).then(setAprvDocList)

        
    }, [])

    const fn_click = (id) => {
        fetcher(`/gw/aprv/AprvTempDelete`,{
            method:"POST",
            body:{
                docId : id
            }
        }).then(res => {
            navigate(0);
        })
    }

    return (
        <>
            <h4>전자결재 > 임시저장함 </h4>
            <div className="section history-section">
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
                        <td>{aprvDoc.aprvDocDrftDt.substring(0,8)}</td>
                        <td>
                            <span className={`badge-status ${aprvDoc.aprvDocStts}`}>
                                {getStatusLabel(aprvDoc.aprvDocStts)}
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