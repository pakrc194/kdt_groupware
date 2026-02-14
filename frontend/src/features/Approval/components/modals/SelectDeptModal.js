import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';

const SelectDeptModal = ({onClose, onOk, schedType}) => {
    const [deptList, setDeptList] = useState([]);
    const [checkedDepts, setCheckedDepts] = useState([]);
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    useEffect(()=>{    
        if(schedType=='DEPT') {
            fetcher("/gw/aprv/AprvDeptList").then(res=>{
                
                console.log("fetch AprvDeptList", res)
                setDeptList(res)
            }) 
        } else if(schedType=='PERSONAL') {
            fetcher(`/gw/aprv/AprvEmpListFilter?filterNm=DEPT_ID&filterVl=${myInfo.deptId}`)
            .then(res=>{
                console.log("fetch AprvEmpListFilter", res)
                setDeptList(res)
            })
        } else {
            console.log("schedType",schedType)
        }
       
        
    },[schedType])

    const fn_ok = () => {
        console.log("fn_ok", checkedDepts)
        onOk(checkedDepts);
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
                {schedType=='DEPT' && deptList.map((v, k)=>(
                    <div key={k}><input type="checkbox" name={v.deptName} value={v.deptId} onChange={fn_checkDept} />{v.deptName}/{v.deptLoc}층</div>
                ))}
                {schedType=='PERSONAL' && deptList.map((v, k)=>(
                    <div key={k}><input type="checkbox" name={v.empNm} value={v.empId} onChange={fn_checkDept} />{v.empNm}</div>
                ))}
            </div>}
            onClose={onClose}
            onOk={fn_ok}
            okMsg="확인"
        />
    );
};

export default SelectDeptModal;