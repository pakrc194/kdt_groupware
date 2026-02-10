import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link, useParams } from 'react-router-dom';

const DraftBox = () => {
    const {sideId} = useParams();
    const [aprvDocList, setAprvDocList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const [stts, setStts] = useState();
    useEffect(() => {
        console.log("drftBox useEffect : "+myInfo.empId);
        
        fetcher(`/gw/aprv/DrftDocList/${myInfo.empId}?${stts}`).then(setAprvDocList)
    }, [stts])

    const fn_stts = (e) => {
        setStts("stts="+e.target.value);
    }

    return (
        <>
            <h4>전자결재 > 기안함 </h4>
            <div>
                <select onChange={fn_stts}>
                    <option value="">ALL</option>
                    <option>DRFT</option>
                    <option>PENDING</option>
                    <option>COMPLETED</option>
                </select>
                <select>
                    <option>전체</option>
                    <option>공용</option>
                    <option>부서</option>
                </select>
            </div>
            <div>
                    <div>
                        <td>문서번호</td>
                        <td>문서제목</td>
                        <td>기안자</td>
                        <td>기안일자</td>
                        <td>진행상태</td>
                    </div>
                    {aprvDocList.map((v, k)=><><Link to={`/approval/${sideId}/detail/`+v.aprvDocId} key={k}><AprvBoxBoard aprvDoc={v}/></Link></>)}
            </div>
        </>
    );
};

export default DraftBox;