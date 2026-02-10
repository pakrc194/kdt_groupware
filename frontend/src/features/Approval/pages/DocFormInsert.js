import React, { useState } from 'react';
import ApprovalLine from '../components/ApprovalLine';
import Button from '../../../shared/components/Button';
import EditAprvLine from '../components/modals/EditAprvLine';
import SelectDeptModal from '../components/modals/SelectDeptModal';

const DocFormInsert = () => {
    const ORDER = {
        DRFT: 0,
        DRFT_REF: 1,
        MID_ATRZ: 2,
        MID_REF: 3,
        LAST_ATRZ: 4,
    };
    


    const [docFormNm, setDocFormNm] = useState();
    const [docFormCd, setDocFormCd] = useState();
    const [docFormType, setDocFormType] = useState();
    const [docStartLbl, setDocStartLbl] = useState();
    const [docEndLbl, setDocEndLbl] = useState();
    const [docLocLbl, setDocLocLbl] = useState();
    const [docDept, setDocDept] = useState();
    const [isSelectDeptOpen, setIsSelectDeptOpen] = useState(false);


    const [docLine, setDocLine] = useState([])
    
    const [isEditLineOpen, setIsEditLineOpen] = useState(false);

    const fn_editLine = () => {
        
        setIsEditLineOpen(true)
    }
    const fn_editLineClose = () => {
        setIsEditLineOpen(false)
    }
    const fn_editLineOk = (addLine) => {
        setIsEditLineOpen(false);

        setDocLine(prev => {
            const next = [
            ...prev,
            {
                roleCd: addLine.roleCd,
                aprvPrcsEmpId: addLine.empId,
                roleSeq: 0, // 아래에서 다시 계산
            }
            ];

        // 1) 고정 순서로 정렬
        next.sort((a, b) => (ORDER[a.roleCd] ?? 999) - (ORDER[b.roleCd] ?? 999));

        // 2) REF 들만 roleSeq 다시 매기기 (DRFT_REF, MID_REF 각각 1..n)
        const refCounters = { DRFT_REF: 0, MID_REF: 0 };

        const resequenced = next.map(item => {
            if (item.roleCd === "DRFT_REF" || item.roleCd === "MID_REF") {
                refCounters[item.roleCd] += 1;
                return { ...item, roleSeq: refCounters[item.roleCd] };
            }
            // 결재자들은 roleSeq 0(또는 null)로
            return { ...item, roleSeq: 0 };
            });

            return resequenced;
        });
    };

    const fn_selectDeptClick = () => {
        setIsSelectDeptOpen(true);
    }
    const fn_selectDeptClose = () => {
        setIsSelectDeptOpen(false);
    }
    const fn_selectDeptOk = (selectDept) => {
        console.log("fn_selectDeptOk", selectDept)
        let deptVal = ""
        for(let i=0; i<selectDept.length; i++) {
            deptVal=="" ? deptVal=selectDept[i].deptId : deptVal+=","+selectDept[i].deptId
        }
        setDocDept(deptVal)
        setIsSelectDeptOpen(false);
    }

    const fn_formOk = () => {
                                                                                                                                                                                                                                                                                                                                                                                                                                               
    }

    return (
        <div>
            <h4>insert</h4>
            양식 제목<input name="docFormNm"/><br/>
            양식 코드<input name="docFormCd"/><br/>
            문서 유형
            <select name="docType">
                <option >근태</option>
                <option >일정</option>
            </select>
            <div> 
                결재선 <Button onClick={fn_editLine}>결재선 추가</Button>
                <ApprovalLine docLine={docLine}/>
                {isEditLineOpen && <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk}/>}
                
                시작일자 라벨 <input name="docLblStart"/><br/>
                종료일자 라벨 <input name="docLblEnd"/><br/>
                장소 라벨 <input name="docLblLoc"/><br/>
            </div>
            <div>
                <input name="docShareNm" value={docDept} readOnly/>
                <Button variant="primary" onClick={fn_selectDeptClick}>공개범위 선택</Button>
                {isSelectDeptOpen && 
                    <SelectDeptModal onClose={fn_selectDeptClose} onOk={fn_selectDeptOk} schedType={"DEPT"}
                        title={"선택"} okMsg={"불러오기"}/>}
            </div>
            <div>
                <Button onClick={fn_formOk}>양식 등록</Button>
            </div>
        </div>
    );
};

export default DocFormInsert;