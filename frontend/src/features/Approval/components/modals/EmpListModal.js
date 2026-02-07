import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';

const EmpListModal = ({onClose, onOk}) => {
    const [empList, setEmpList] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});


    useEffect(()=>{
        fetcher("/gw/aprv/AprvEmpListFilter").then(setEmpList);
    },[])

    const fn_formItemSelect = (item) => {
        setSelectedItem(item)
    }
    const fn_onOk = () => {
        
        onOk(selectedItem)
    }

    return (
        <>
            <Modal
                title={`사원 목록 - ${selectedItem.empNm}`}
                message={
                    empList.map((v, k)=>
                        <div key={k} onClick={()=>fn_formItemSelect(v)}>
                            {v.empNm}
                        </div>
                    )
                }
                onClose={onClose}
                onOk={fn_onOk}
                okMsg="선택"
            />
        </>
    );
};

export default EmpListModal;