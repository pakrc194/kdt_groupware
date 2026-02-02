import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link } from 'react-router-dom';

const ApprovalBox = () => {
    const [aprvDocList, setAprvDocList] = useState([]);

    useEffect(() => {
        console.log("aprvBox useEffect");
        fetcher('/gw/aprv/AprvDocList').then(setAprvDocList)
    }, [])

    return (
        <>
            <h4>전자결재 > 결재함 </h4>
            <div>
                {aprvDocList.map((v, k)=><Link to={'/approval/approvalBox/detail/'+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            </div>
        </>
    );
};

export default ApprovalBox;