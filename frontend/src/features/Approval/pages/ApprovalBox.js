import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link } from 'react-router-dom';

const ApprovalBox = () => {
    const [aprvDocList, setAprvDocList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    const [stts, setStts] = useState();
    useEffect(() => {
        console.log("aprvBox useEffect : "+myInfo.empId);
        fetcher(`/gw/aprv/AprvDocList/${myInfo.empId}?${stts}`).then(setAprvDocList)
    }, [stts])
    const fn_stts = (e) => {
        setStts("stts="+e.target.value);
    }
    return (
        <>
            <h4>전자결재 > 결재함 </h4>
            <select onChange={fn_stts}>
                <option value="">ALL</option>
                <option>PENDING</option>
                <option>REJECTED</option>
                <option>COMPLETED</option>
            </select>
            <div>
                {aprvDocList.map((v, k)=><Link to={'/approval/approvalBox/detail/'+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            </div>
        </>
    );
};

export default ApprovalBox;