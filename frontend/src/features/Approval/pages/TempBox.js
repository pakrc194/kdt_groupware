import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';

const TempBox = () => {
    const [aprvDocList, setAprvDocList] = useState([]);
    const {sideId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
        
        console.log("TempBox useEffect");
        fetcher(`/gw/aprv/AprvTempList/${myInfo.empId}`).then(setAprvDocList)

        
    }, [])

    return (
        <>
            <h4>전자결재 > 임시저장함 </h4>
            <div>
                {aprvDocList.map((v, k)=><Link to={`/approval/${sideId}/temp/`+v.aprvDocId} key={k}><div><AprvBoxBoard aprvDoc={v}/></div></Link>)}
            </div>
        </>
    );
};

export default TempBox;