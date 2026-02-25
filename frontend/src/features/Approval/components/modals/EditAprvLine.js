import React, { useEffect, useMemo, useState } from 'react';
import Modal from '../../../../shared/components/Modal';
import EmpListModal from './EmpListModal';
import { fetcher } from '../../../../shared/api/fetcher';
import { useParams } from 'react-router-dom';

const EditAprvLine = ({ docLine, onClose, onOk }) => {
    const { sideId } = useParams();
    const [empList, setEmpList] = useState([]);
    const [addLine, setAddLine] = useState({
        roleCd: "",
        empId: 0,
        empNm: ""
    })

    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    useEffect(() => {
        fetcher(`/gw/aprv/AprvEmpListFilter`).then(res => {
            setEmpList(res)
        });
    }, [])

    // ✅ 현재 결재선 상태 기반 제약 계산
    const drftRefCount = useMemo(() => docLine.filter(v => v.roleCd === "DRFT_REF").length, [docLine]);
    const hasMidAtrz = useMemo(() => docLine.some(v => v.roleCd === "MID_ATRZ"), [docLine]);
    const midRefCount = useMemo(() => docLine.filter(v => v.roleCd === "MID_REF").length, [docLine]);
    const hasLastAtrz = useMemo(() => docLine.some(v => v.roleCd === "LAST_ATRZ"), [docLine]);

    const isRoleDisabled = (roleCd) => {
        if (roleCd === "LAST_ATRZ" && hasLastAtrz) return true;
        if (roleCd === "MID_ATRZ" && hasMidAtrz) return true;
        if (roleCd === "DRFT_REF" && drftRefCount >= 3) return true;
        if (roleCd === "MID_REF" && !hasMidAtrz) return true;
        if (roleCd === "MID_REF" && midRefCount >= 3) return true;
        return false;
    };

    const filteredEmpList = useMemo(() => {
        if (!addLine.roleCd) return [];

        console.log(docLine)

        const existingEmpIds = docLine.map(v => String(v.aprvPrcsEmpId));

        let filtered = empList.filter(emp => !existingEmpIds.includes(String(emp.empId)));

        if (sideId === "docFormBox") {
            return filtered.filter(emp => {
                const empJbttlId = Number(emp.jbttlId);
                return empJbttlId === 1 || empJbttlId === 2;
            });
        }

        const myJbttlId = Number(myInfo?.jbttlId);
        const myDeptId = String(myInfo?.deptId);

        const isUpper12 = (emp) => {
            const empJbttlId = Number(emp.jbttlId);
            return (empJbttlId === 1 || empJbttlId === 2) && empJbttlId <= myJbttlId;
        };

        const isSameDept = (emp) => String(emp.deptId) === myDeptId;

        if (addLine.roleCd !== "DRFT_REF") {
            return filtered.filter(isUpper12);
        }

        return filtered.filter((emp) => isUpper12(emp) || isSameDept(emp));

    }, [addLine.roleCd, empList, myInfo, sideId, docLine]); // 💡 docLine을 의존성에 추가

    const fn_ok = () => {
        if (addLine?.roleCd && addLine?.empId) {
            onOk(addLine);
        } else {
            alert("내용을 입력해주세요")
        }
    }

    const fn_selectChange = (e) => {
        const { name, value } = e.target;

        if (name === "roleCd") {
            setAddLine((prev) => ({
                ...prev,
                roleCd: value,
                empId: "",
                empNm: "",
            }));
            return;
        }

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

    return (
        <Modal
            title="결재선 추가"
            message={
                <>
                    결재선
                    <select name="roleCd" value={addLine.roleCd} onChange={fn_selectChange}>
                        <option value="" disabled>선택</option>
                        {sideId !== "docFormBox" && <option value="DRFT_REF" disabled={isRoleDisabled("DRFT_REF")}>참조자</option>}

                        {!hasMidAtrz && (
                            <option value="MID_ATRZ">중간결재자</option>
                        )}
                        {sideId !== "docFormBox" && <option value="MID_REF" disabled={isRoleDisabled("MID_REF")}>중간참조자</option>}
                        {sideId === "docFormBox" && <option value="LAST_ATRZ" disabled={isRoleDisabled("LAST_ATRZ")}>최종결재자</option>}
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