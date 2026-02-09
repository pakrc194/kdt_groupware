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

    return (
        <>
            <h4>전자결재 > 참조함 </h4>
            <div>
                {aprvDocList.map((v, k)=><Link to={`/approval/${sideId}/detail/`+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            </div>
        </>
    );
};

export default ReferBox;