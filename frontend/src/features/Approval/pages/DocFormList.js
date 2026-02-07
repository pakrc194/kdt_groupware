import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../shared/components/Button';
import { fetcher } from '../../../shared/api/fetcher';

const DocFormList = () => {
    const [formList, setFormList] = useState([])
    const navigate = useNavigate();

    useEffect(()=>{
        fetcher("/gw/aprv/AprvDocFormList").then(setFormList)
    },[])
    
    const fn_formInsert = () => {
        navigate("/approval/docFormBox/insert");
    }


    return (
        <div>

            <h4>전자결재 > 양식 보관함</h4>
            {formList.map((v, k)=>(
                <div key={k}>{v.docFormCd}/{v.docFormNm}</div>
            ))}
            <div>
                <Button type="secondary" onClick={fn_formInsert}>양식 등록</Button>
            </div>
        </div>
    );
};

export default DocFormList;