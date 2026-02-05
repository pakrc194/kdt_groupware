import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';

function ScheduleDetail(props) {
    const { id } = useParams();
    const [sched, setSched] = useState([]);
    const navigate = useNavigate();
    useEffect(() => {
        fetcher(`/gw/home/1/sched_detail/${id}`)
        .then(dd => {setSched(Array.isArray(dd) ? dd : [dd])})
        .catch(e => console.log(e))
    }, []);
    
    return (
        <div>
            {sched.map((vv, kk) => (
                <tbody key={kk}>
                <tr>
                    <td>아이디</td>
                    <td>{vv.schedId}</td>
                </tr><tr>
                    <td>담당팀</td>
                    <td>{vv.schedTeam}</td>
                </tr><tr>
                    <td>위치</td>
                    <td>{vv.schedLoc}</td>
                </tr><tr>
                    <td>제목</td>
                    <td>{vv.schedTitle}</td>
                </tr><tr>    
                    <td>구분(회사, 팀, 개인, TODO)</td>
                    <td>{vv.schedType}</td>
                </tr><tr>    
                    <td>상세내용</td>
                    <td>{vv.schedDetail}</td>
                </tr><tr>    
                    <td>시작일</td>
                    <td>{vv.schedStartDate.split('T')[0]}</td>
                </tr><tr>    
                    <td>종료일</td>
                    <td>{vv.schedEndDate.split('T')[0]}</td>
                </tr>
                </tbody>
            ))}
            <button>일정 삭제</button>
            <button onClick={() => navigate(-1)}>뒤로</button>
        </div>
    );
}

export default ScheduleDetail;