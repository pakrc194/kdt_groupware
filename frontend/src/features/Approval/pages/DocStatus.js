import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { fetcher } from '../../../shared/api/fetcher';

const DocStatus = () => {
    const [drftList, setDrftList] = useState([]);
    const [aprvList, setAprvList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(()=>{
        fetcher(`/gw/aprv/DrftDocList/${myInfo.empId}`).then(setDrftList)
        fetcher(`/gw/aprv/AprvDocList/${myInfo.empId}`).then(setAprvList)
    },[])


    return (
        <div>
            <h1>기안 현황</h1>
            {drftList.map((v, k)=>
                <Link to={`/approval/draftBox/detail/`+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            <h1>결재 현황</h1>
            {aprvList.map((v, k)=>
                <Link to={'/approval/approvalBox/detail/'+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
        </div>
    );
};

export default DocStatus;