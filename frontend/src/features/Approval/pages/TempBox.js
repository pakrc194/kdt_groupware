import React, { useEffect, useState } from 'react';
import { Link, redirect, useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import AprvBoxBoard from '../components/AprvBoxBoard';
import Button from '../../../shared/components/Button';

const TempBox = () => {
    const navigate = useNavigate();
    const [aprvDocList, setAprvDocList] = useState([]);
    const {sideId} = useParams();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    useEffect(() => {
        
        console.log("TempBox useEffect");
        fetcher(`/gw/aprv/AprvTempList/${myInfo.empId}`).then(setAprvDocList)

        
    }, [])

    const fn_click = (id) => {
        console.log(id)
        fetcher(`/gw/aprv/AprvTempDelete`,{
            method:"POST",
            body:{
                docId : id
            }
        }).then(res => {
            console.log(`fetch AprvTempDelete ${res.res}`)
            navigate(0);
        })
    }

    return (
        <>
            <h4>전자결재 > 임시저장함 </h4>
            <div>
                {aprvDocList.map((v, k)=>
                    <div>
                        <Link to={`/approval/${sideId}/temp/`+v.aprvDocId} key={k}><AprvBoxBoard aprvDoc={v}/></Link>
                        <Button type="primary" onClick={()=>fn_click(v.aprvDocId)}>삭제</Button>
                    </div>
                )}
            </div>
        </>
    );
};

export default TempBox;