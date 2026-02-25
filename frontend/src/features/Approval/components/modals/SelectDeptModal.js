import React, { useEffect, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import { fetcher } from '../../../../shared/api/fetcher';
import './SelectDeptModal.css'

const SelectDeptModal = ({ onClose, onOk, schedType, selectDeptList }) => {
    const [deptList, setDeptList] = useState([]);
    const [checkedDepts, setCheckedDepts] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // [추가] 검색어 상태
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));


    useEffect(() => {
        // selectDeptList가 undefined/null이면 빈 배열로
        setCheckedDepts(Array.isArray(selectDeptList) ? selectDeptList : []);
    }, [selectDeptList, schedType]);

    useEffect(() => {
        if (schedType === 'DEPT') {
            fetcher("/gw/aprv/AprvDeptList").then(res => {
                setDeptList(res)
                console.log('dd',deptList)
            });
        } else if (schedType === 'PERSONAL') {
            fetcher(`/gw/aprv/AprvEmpListFilter?filterNm=DEPT_ID&filterVl=${myInfo.deptId}`).then(res => {
                setDeptList(res)
                console.log('dd',deptList)
            });
        }
        
    }, [schedType]);


    const filteredList = deptList.filter(v => {
        const targetName = schedType === 'DEPT' ? v.deptName : v.empNm;
        return targetName.toLowerCase().includes(searchTerm.toLowerCase());
    });

    const fn_ok = () => onOk(checkedDepts);

    const fn_checkDept = (e) => {
        const id = String(e.target.value);
        const name = e.target.name;
        const checked = e.target.checked;

        if (checked) {
        
            setCheckedDepts((prev) => {
                const exists = prev.some((v) => String(v.deptId) === id);
                if (exists) return prev;
                return [...prev, { deptName: name, deptId: id }];
            });
        } else {
            setCheckedDepts((prev) => prev.filter((v) => String(v.deptId) !== id));
        }
    };

    const fn_removeItem = (id) => {
        const targetId = String(id);
        setCheckedDepts((prev) => prev.filter((v) => String(v.deptId) !== targetId));
    };

    return (
        <Modal
            title="범위 지정"
            onClose={onClose}
            onOk={fn_ok}
            okMsg="확인"
            message={
                <div className="mdl-container">
                    {/* 검색바 영역 */}
                    <div className="mdl-search-box">
                        <input 
                            type="text" 
                            className="drft-input" 
                            placeholder="검색어를 입력하세요..." 
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>

                    {/* 선택된 아이템 리스트 (Tags) */}
                    <div className="mdl-selected-area">
                        <div className="mdl-sub-title">선택됨 ({checkedDepts.length})</div>
                        <div className="mdl-tags">
                            {checkedDepts.map((v) => (
                                <span key={v.deptId} className="mdl-tag">
                                    {v.deptName}
                                    <button className="mdl-tag-del" onClick={() => fn_removeItem(v.deptId)}>×</button>
                                </span>
                            ))}
                            {checkedDepts.length === 0 && <span className="mdl-empty-text">선택된 대상이 없습니다.</span>}
                        </div>
                    </div>

                    {/* 체크박스 리스트 영역 */}
                    <div className="mdl-list-scroll">
                        {filteredList.map((v, k) => {
                            const id = schedType === 'DEPT' ? v.deptId : v.empId;
                            const etc = schedType === 'DEPT' ? '' : v.grpNm ? `(${v.grpNm})` : '';
                            const name = schedType === 'DEPT' ? v.deptName : v.empNm+etc;
                            const info = schedType === 'DEPT' ? `${v.deptLoc}층` : "";
                            const isChecked = checkedDepts.some(item => item.deptId == id);

                            return (
                                <label key={k} className="mdl-list-item">
                                    <input 
                                        type="checkbox" 
                                        name={name} 
                                        value={id} 
                                        checked={isChecked}
                                        onChange={fn_checkDept} 
                                    />
                                    <span className="mdl-item-text">{name} {info && <small className="mdl-item-info">({info})</small>}</span>
                                </label>
                            );
                        })}
                    </div>
                </div>
            }
        />
    );
};

export default SelectDeptModal;