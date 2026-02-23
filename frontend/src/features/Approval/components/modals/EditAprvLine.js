import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import EmpListModal from './EmpListModal';
import { fetcher } from '../../../../shared/api/fetcher';
import { useParams } from 'react-router-dom';

const EditAprvLine = ({docLine, onClose, onOk}) => {
    const {sideId} = useParams();
    const [empList, setEmpList] = useState([]);
    const [addLine, setAddLine] = useState({
        roleCd:"",
        empId:0,
        empNm:""
    })

    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    useEffect(()=>{
        fetcher(`/gw/aprv/AprvEmpListFilter`).then(res=>{
            return setEmpList(res)
        });

    },[])

      // ✅ 현재 결재선 상태 기반 제약
    const drftRefCount = useMemo(
        () => docLine.filter(v => v.roleCd === "DRFT_REF").length,
        [docLine]
    );
    const hasMidAtrz = useMemo(
        () => docLine.some(v => v.roleCd === "MID_ATRZ"),
        [docLine]
    );

    const midRefCount = useMemo(
        () => docLine.filter(v => v.roleCd === "MID_REF").length,
        [docLine]
    );
    const hasLastAtrz = useMemo(
        () => docLine.some(v => v.roleCd === "LAST_ATRZ"),
        [docLine]
    );

    const isRoleDisabled = (roleCd) => {
        if (roleCd === "LAST_ATRZ" && hasLastAtrz) return true;                 // 최종결재자는 원래 추가 불가
        if (roleCd === "MID_ATRZ" && hasMidAtrz) return true;    // 중간결재자 이미 있으면 불가
        if (roleCd === "DRFT_REF" && drftRefCount >= 3) return true; // 참조자 3명 초과 불가
        if (roleCd === "MID_REF" && !hasMidAtrz) return true;
        if (roleCd === "MID_REF" && midRefCount >= 3) return true;
        
        return false;
    };


    const filteredEmpList = useMemo(() => {
        if (!addLine.roleCd) return [];

        const myJbttlId = Number(myInfo?.jbttlId); // 본인 직책 id
        const myDeptId = String(myInfo?.deptId);  // 본인 부서 id

        const isUpper12 = (emp) => {
        const empJbttlId = Number(emp.jbttlId); // empList에 jbttlId가 있어야 함
        // "본인보다 높은 jbttl_id 이면서 1 또는 2만 가능"
        return (empJbttlId === 1 || empJbttlId === 2) && empJbttlId <= myJbttlId;
        // ⚠️ 만약 "숫자가 작을수록 높다" 규칙이 맞다는 가정
        // 반대면 (empJbttlId > myJbttlId) 로 바꿔야 함
        };

        const isSameDept = (emp) => String(emp.deptId) === myDeptId;

        // 기본: 상위(1/2)만
        if (addLine.roleCd !== "DRFT_REF") {
        return empList.filter(isUpper12);
        }

        // DRFT_REF: 상위(1/2) + 같은 부서도 추가
        return empList.filter((emp) => isUpper12(emp) || isSameDept(emp));

    }, [addLine.roleCd, empList, myInfo?.jbttlId, myInfo?.deptId]);

    const fn_ok = () => {
        if(addLine?.roleCd && addLine?.empId) {
            console.log("edit",addLine);
            onOk(addLine);
        } else {
            alert("내용을 입력해주세요")
        }
    }

    const fn_selectChange = (e) => {
        const { name, value } = e.target;

        // ✅ roleCd 변경: emp 선택 초기화 + role 저장
        if (name === "roleCd") {
            setAddLine((prev) => ({
                ...prev,
                roleCd: value,
                empId: "",
                empNm: "",
            }));
            return;
        }

        // ✅ empNm 셀렉트의 value는 empId로 두는 게 정석 (지금도 value가 empId임)
        if (name === "empId") {
            const picked = filteredEmpList.find((v) => String(v.empId) === String(value));
                setAddLine((prev) => ({
                ...prev,
                empId: picked ? picked.empId : "",
                empNm: picked ? picked.empNm : "",
                }));
                return;
        }
    };


    const roleSelectDisabled = !addLine.roleCd;
    const empSelectDisabled = !addLine.empId;


    return (
        <Modal
        title="결재선 추가"
        message={
            <>
            결재선 
            <select name="roleCd" value={addLine.roleCd} onChange={fn_selectChange}>
                <option value="" disabled>선택</option>
                <option value="DRFT_REF" disabled={isRoleDisabled("DRFT_REF")}>참조자</option>
                {!hasMidAtrz && (
                    <option value="MID_ATRZ">중간결재자</option>
                )}
                <option value="MID_REF" disabled={isRoleDisabled("MID_REF")}>중간참조자</option>
                {sideId=="docFormBox" && <option value="LAST_ATRZ" disabled={isRoleDisabled("LAST_ATRZ")}>최종결재자</option>}
            </select>

            <div>
                담당자
                <select
                name="empId"
                value={addLine.empId}
                onChange={fn_selectChange}
                disabled={roleSelectDisabled}
                >
                <option value="" disabled>
                    {roleSelectDisabled ? "역할 먼저 선택" : "선택"}
                </option>

                {filteredEmpList.map((v, k) => (
                    <option key={k} value={v.empId}>
                    {v.deptName}-{v.empNm}({v.jbttlNm})
                    </option>
                ))}
                </select>
            </div>
            </>
        }
        onClose={onClose}
        onOk={fn_ok}
        okMsg={"추가"}
        />
    );
};
export default EditAprvLine;