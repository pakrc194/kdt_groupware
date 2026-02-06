import React, { useState } from 'react';
import Modal from '../../../../shared/components/Modal';

const CompListModal = ({itemList, itemNm, title, okMsg, onOk, onClose}) => {
    const [selectedItem, setSelectedItem] = useState({});

    const fn_formItemSelect = (item) => {
        console.log("item selected ", item)
        setSelectedItem(item)
    }
    const fn_onOk = () => {
        onOk(selectedItem)
    }

    return (
        <>
            <Modal
                title={`${title} - ${selectedItem[`${itemNm}`]}`}
                message={
                    itemList.map((v, k)=>
                        <div key={k} onClick={()=>fn_formItemSelect(v)}>
                            {v[`${itemNm}`]}
                        </div>
                    )
                }
                onClose={onClose}
                onOk={fn_onOk}
                okMsg={okMsg}
            />
        </>
    );
};

export default CompListModal;