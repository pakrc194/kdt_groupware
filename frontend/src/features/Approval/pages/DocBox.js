import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../shared/api/fetcher';

const DocBox = () => {
    const [formList, setFormList] = useState([])

    useEffect(()=>{
        fetcher("/gw/aprv/AprvDocFormList").then(setFormList)
    },[])

    return (
        <div>
            <h4>전자결재 > 양식 보관함</h4>
            {formList.map((v, k)=>(
                <div key={k}>{v.docFormCd}/{v.docFormNm}</div>
            ))}
        </div>
    );
};

export default DocBox;