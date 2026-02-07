import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';

const SelectDeptModal = ({onClose, onOk}) => {
    const [deptList, setDeptList] = useState([]);
    const [checkedDepts, setCheckedDepts] = useState([]);
    const [isCompany, setIsCompany] = useState(false);

    useEffect(()=>{      
        fetcher("/gw/aprv/AprvDeptList").then(res=>{
            
            console.log("fetch AprvDeptList", res)
            setDeptList(res)
        })      
    },[])

    const fn_ok = () => {
        console.log("fn_ok", isCompany, checkedDepts)
        onOk(isCompany, checkedDepts);
    }

    const fn_change = (e) => {
        const {name, value} = e.target
        console.log(name, value)
        if(value=="dept") {
            setIsCompany(false)
        } else {
            setIsCompany(true)
        }
    }

    const fn_checkDept = (e) => {
        const deptId = e.target.value;
        const deptName = e.target.name;
        const checked = e.target.checked;
        
        if (checked) {
            setCheckedDepts(prev => [...prev, {deptName, deptId}]);
        } else {
            setCheckedDepts(prev => prev.filter(v => v.deptId !== deptId));
        }
    };

    return (
        <Modal
            title="범위 지정"
            message={<div>
                <select name="docSelect" value={""} onChange={fn_change}>
                    <option value="" disabled>선택</option>
                    <option value="dept">팀</option>
                    <option value="company">회사</option>
                </select>
                {deptList.map((v, k)=>(
                    <div key={k}><input type="checkbox" name={v.deptName} value={v.deptId} onChange={fn_checkDept} />{v.deptName}</div>
                ))}
            </div>}
            onClose={onClose}
            onOk={fn_ok}
            okMsg="확인"
        />
    );
};

export default SelectDeptModal;