import React, { useEffect, useState } from 'react';
import { fetcher } from '../../../../shared/api/fetcher';
import Modal from '../../../../shared/components/Modal';

const FormListModal = ({onClose, onOk}) => {
    const [formList, setFormList] = useState([]);
    const [selectedItem, setSelectedItem] = useState({});


    useEffect(()=>{
        fetcher("/gw/aprv/AprvDocFormList").then(setFormList);
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
                title={`양식 목록 - ${selectedItem.docFormNm}`}
                message={
                    formList.map((v, k)=>
                        <div key={k} onClick={()=>fn_formItemSelect(v)}>
                            {v.docFormNm}
                        </div>
                    )
                }

                onClose={onClose}
                onOk={fn_onOk}
                okMsg="불러오기"
            />
        </>
    );
};

export default FormListModal;