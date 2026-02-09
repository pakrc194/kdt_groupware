import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import { Link, useParams } from 'react-router-dom';

const DraftBox = () => {
    const {sideId} = useParams();
    const [aprvDocList, setAprvDocList] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
        console.log("drftBox useEffect : "+myInfo.empId);
        fetcher(`/gw/aprv/DrftDocList/${myInfo.empId}`).then(setAprvDocList)
    }, [])

    return (
        <>
            <h4>전자결재 > 기안함 </h4>
            <div>
                {aprvDocList.map((v, k)=><Link to={`/approval/${sideId}/detail/`+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            </div>
        </>
    );
};

export default DraftBox;