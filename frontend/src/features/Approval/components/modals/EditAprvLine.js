import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import EmpListModal from './EmpListModal';
import { fetcher } from '../../../../shared/api/fetcher';

const EditAprvLine = ({onClose, onOk}) => {
    const [selectedRole, setSelectedRole] = useState();
    const [selectedEmp, setSelectedEmp] = useState();
    const [empList, setEmpList] = useState([]);
    const [addLine, setAddLine] = useState({
        roleCd:"선택",
        empId:0,
        empNm:"선택"
    })
    useEffect(()=>{
        fetcher("/gw/aprv/AprvEmpListFilter").then(setEmpList);

    },[])

    const fn_ok = () => {
        
        onOk(addLine);
    }

    const fn_selectChange = (e)=>{

        addLine[e.target.name] = e.target.value;
        if(e.target.name=="empNm") {
            setSelectedEmp(e.target.value)
            addLine["empId"] = empList.filter(v=>v.empNm==e.target.value)[0].empId
        } else {
            setSelectedRole(e.target.value)
        }
    }

    return <Modal
            title="결재선 추가"
            message={<>
                <select name="roleCd" value={selectedRole || ""} onChange={fn_selectChange}>
                    <option value="" disabled>선택</option>
                    <option value="DRFT_REF">참조자</option>
                    <option value="MID_ATRZ">중간관리자</option>
                    <option value="MID_REF">중간참조자</option>
                </select>
                <select name="empNm"  value={selectedEmp || ""} onChange={fn_selectChange}>
                    <option value="" disabled>선택</option>
                    {empList.map((v, k)=>(
                        <option key={k}>{v.empNm}</option>
                    ))}
                </select>
            </>}
            onClose={onClose}
            onOk={fn_ok}
            okMsg={"추가"}
        />
    
};

export default EditAprvLine;