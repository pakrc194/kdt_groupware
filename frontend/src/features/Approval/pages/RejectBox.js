import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link } from 'react-router-dom';

const RejectBox = () => {
    const [aprvDocList, setAprvDocList] = useState([]);
    useEffect(() => {
        const empId = localStorage.getItem("EMP_ID")
        console.log("RejectBox useEffect");
        fetcher(`/gw/aprv/RejectDocList/${empId}`).then(setAprvDocList)
    }, [])

    return (
        <>
            <h4>전자결재 > 반려함 </h4>
            <div>
                {aprvDocList.map((v, k)=><Link to={'/approval/approvalBox/detail/'+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            </div>
        </>
    );
};

export default RejectBox;