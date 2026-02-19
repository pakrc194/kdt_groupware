import React, { useEffect, useState } from 'react';
import Button from '../../../shared/components/Button';
import CompListModal from './modals/CompListModal';
import { fetcher } from '../../../shared/api/fetcher';
import SelectDeptModal from './modals/SelectDeptModal';
import { getSchedTypeLabel } from '../../../shared/func/formatLabel';
import AttendContent from './AttendContent';

const InputForm = ({ drftDate, setDrftDate, inputForm, inputList, setInputList, docLoc, setDocLoc, docRole, setDocRole }) => {
    const [isLocOpen, setIsLocOpen] = useState(false);
    const [locList, setLocList] = useState([]);
    
    const [isSelectDeptOpen, setIsSelectDeptOpen] = useState(false);
    const [selectDeptList, setSelectDeptList] = useState([]);

    // 🔥 1. 누락되었던 idList를 상태로 추가
    const [idList, setIdList] = useState([]); 

    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);
    const [myInfo] = useState(() => JSON.parse(localStorage.getItem("MyInfo")));

    const getDeptNamesByIds = (list, ids) => {
        if (!ids) return "";
        const idArray = String(ids).split(',').map(id => id.trim());
        const names = idArray.map(id => {
            const found = list.find(item => String(item.deptId) === id);
            return found ? found.deptName : null;
        });
        return names.filter(name => name !== null).join(', ');
    };

    // 장소 필터 리스트 조회
    useEffect(() => {
        if (!drftDate?.docStart || !drftDate?.docEnd) return;

        fetcher("/gw/aprv/AprvLocFilterList", {
            method: "POST",
            body: { docStart: drftDate.docStart, docEnd: drftDate.docEnd }
        }).then(res => setLocList(res || []));

        setInputList(prev => 
            prev.map(v => v.docInptNm === "docLoc" ? { ...v, docInptVl: v.docInptRmrk } : v)
        );
    }, [drftDate?.docStart, drftDate?.docEnd, setInputList]);

    // docRole(결재 역할)이 변경될 때 초기화
    useEffect(() => {
        if (!docRole) return;
        setSelectDeptList([]);
        setIdList([]); // 역할이 바뀌면 idList도 초기화
        setAttendList([]);
        setDutyList([]);
        setSchedList([]);
        setInputList(prev =>
            prev.map(v => v.docInptNm === "docSchedType" ? { ...v, docInptVl: "" } : v)
        );
    }, [docRole, setInputList]);

    // 🔥 2. API 호출 로직을 useEffect로 분리 (idList나 날짜가 바뀔 때 자동 실행)
    useEffect(() => {
        if (!idList || idList.length === 0 || !drftDate?.docStart || !drftDate?.docEnd) return;

        const start = drftDate.docStart.replaceAll("-", "");
        const end = drftDate.docEnd.replaceAll("-", "");
        const deptId = 0;

        // 원본 코드에 있던 docRole === "PERSONAL" 조건 유지 (필요 시 제거하여 공통으로 사용 가능)
        if (docRole === "PERSONAL") {
            fetcher("/gw/aprv/AprvEmpAnnlLv", {
                method: "POST",
                body: { role: docRole, ids: idList, deptId, year: 2026 }
            }).then(res => setAttendList(res || []));
            
            fetcher("/gw/aprv/AprvDutyScheDtl", {
                method: "POST",
                body: { role: docRole, ids: idList, deptId, docStart: start, docEnd: end }
            }).then(res => setDutyList(res || []));
            
            fetcher("/gw/aprv/AprvSchedList", {
                method: "POST",
                body: { role: docRole, ids: idList, deptId, docStart: start, docEnd: end }
            }).then(res => setSchedList(res || []));
        }
    }, [idList, docRole, drftDate?.docStart, drftDate?.docEnd]);


    // 장소 관련 핸들러
    const fn_locClick = () => {
        if (drftDate?.docStart && drftDate?.docEnd) {
            setIsLocOpen(true);
        } else {
            alert("기간을 선택하세요.");
        }
    };
    const fn_locClose = () => setIsLocOpen(false);
    const fn_locOk = (item) => {
        setIsLocOpen(false);
        setDocLoc(prev => ({ ...prev, locId: item.locId, locNm: item.locNm }));
        setInputList(prev => 
            prev.map(v => v.docInptNm === "docLoc" ? { ...v, docInptVl: item.locId } : v)
        );
    };

    // 일반 입력 변경 핸들러
    const fn_change = (e) => {
        const { type, name, value } = e.currentTarget;
        
        if (name === "docRole") {
            setDocRole(value);
        }

        setInputList(prev => 
            prev.map(v => v.docInptNm === name ? { ...v, docInptVl: value } : v)
        );

        if (type === "date") {
            setDrftDate(prev => ({ ...prev, [name]: value }));
        }
    };

    // 담당자/부서 선택 관련 핸들러
    const fn_selectDeptClick = () => setIsSelectDeptOpen(true);
    const fn_selectDeptClose = () => setIsSelectDeptOpen(false);
    
    // 🔥 3. 복잡했던 담당자 선택 확인 로직 단순화
    const fn_selectDeptOk = (selectDept) => {
        setSelectDeptList(selectDept);
        setIsSelectDeptOpen(false);

        // 선택된 부서/담당자 ID 추출
        const newIds = selectDept.map(d => String(d.deptId));
        const deptVal = newIds.join(',');

        // 1. inputList 업데이트
        setInputList(prev => 
            prev.map(v => v.docInptNm === "docSchedType" ? { ...v, docInptVl: deptVal } : v)
        );

        // 2. idList 결정 및 상태 업데이트
        let finalIds = [];
        if (docRole === "COMPANY") {
            finalIds = [myInfo?.drftEmpId];
        } else {
            // "DEPT" 이거나 "PERSONAL"일 경우
            finalIds = newIds;
        }

        setIdList(finalIds); // 상태를 업데이트하면 위의 useEffect가 감지해서 API를 자동으로 호출합니다.
    };

    const FieldWrapper = ({ title, action, children, extra }) => (
        <div className="drft-unit">
            <div className="drft-unit-top">
                <div className="drft-label">{title}</div>
                {action && <div className="drft-unit-action">{action}</div>}
            </div>
            <div className="drft-control">{children}</div>
            {extra && <div className="drft-unit-extra">{extra}</div>}
        </div>
    );

    const label = inputForm?.docInptLbl || "";
    const type = inputForm?.docInptType;

    switch (type) {
        case "TEXTAREA":
            return (
                <FieldWrapper title={label}>
                    <textarea
                        className="drft-textarea"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                        rows={4}
                    />
                </FieldWrapper>
            );

        case "SELECT":
            const options = (inputForm?.docInptRmrk ? String(inputForm.docInptRmrk) : "")
                .split(",").map(v => v.trim()).filter(Boolean);

            return (
                <FieldWrapper title={label}>
                    <select
                        className="drft-select"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                    >
                        <option value="" disabled>선택</option>
                        {options.map((v, k) => (
                            <option key={k} value={v}>{getSchedTypeLabel(v)}</option>
                        ))}
                    </select>
                </FieldWrapper>
            );

        case "DATE":
            return (
                <FieldWrapper title={label}>
                    <input
                        className="drft-input"
                        type="date"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                    />
                </FieldWrapper>
            );

        case "LOCATION": {
            const locId = inputForm?.docInptRmrk;
            return (
                <FieldWrapper
                    title={label}
                    action={!locId && <Button variant="primary" onClick={fn_locClick}>장소 선택</Button>}
                    extra={isLocOpen && (
                        <CompListModal
                            onClose={fn_locClose}
                            onOk={fn_locOk}
                            itemList={locList}
                            itemNm={"locNm"}
                            title={"선택"}
                            okMsg={"불러오기"}
                        />
                    )}
                >
                    <input className="drft-input" value={docLoc?.locNm || ""} readOnly />
                </FieldWrapper>
            );
        }

        case "CHECKBOX": {
            if (!docRole || docRole === "COMPANY") return null;
            
            // 기존에는 attendList로만 판단했지만, 데이터가 하나라도 있으면 렌더링하도록 조건 보완
            const hasWarn = (attendList?.length > 0) || (schedList?.length > 0) || (dutyList?.length > 0);

            return (
                <FieldWrapper
                    title={label}
                    action={<Button variant="primary" onClick={fn_selectDeptClick}>담당자 선택</Button>}
                    extra={
                        <>
                            {isSelectDeptOpen && (
                                <SelectDeptModal
                                    onClose={fn_selectDeptClose}
                                    onOk={fn_selectDeptOk}
                                    schedType={docRole}
                                    selectDeptList={selectDeptList}
                                    title={"선택"}
                                    okMsg={"불러오기"}
                                />
                            )}

                            {hasWarn && (
                                <AttendContent 
                                    idList={idList} 
                                    attendList={attendList} 
                                    dutyList={dutyList} 
                                    schedList={schedList} 
                                    drftDate={drftDate}
                                />
                            )}
                        </>
                    }
                >
                    <input 
                        className="drft-input" 
                        name={inputForm.docInptNm} 
                        value={getDeptNamesByIds(selectDeptList, inputForm.docInptVl) || ""} 
                        readOnly 
                    />
                </FieldWrapper>
            );
        }

        default:
            return (
                <FieldWrapper title={label}>
                    <input
                        className="drft-input"
                        type="text"
                        name={inputForm.docInptNm}
                        value={inputForm.docInptVl || ""}
                        onChange={fn_change}
                    />
                </FieldWrapper>
            );
    }
};

export default InputForm;