import React, { useState } from 'react';
import ApprovalLine from '../components/ApprovalLine';
import Button from '../../../shared/components/Button';
import EditAprvLine from '../components/modals/EditAprvLine';
import SelectDeptModal from '../components/modals/SelectDeptModal';
import { fetcher } from '../../../shared/api/fetcher';
import { useNavigate } from 'react-router-dom';

const DocFormInsert = () => {
    const navigate = useNavigate();
    const ORDER = {
        DRFT: 0,
        DRFT_REF: 1,
        MID_ATRZ: 2,
        MID_REF: 3,
        LAST_ATRZ: 4,
    };
    


    const [docFormNm, setDocFormNm] = useState("");
    const [docFormCd, setDocFormCd] = useState("");
    const [docFormType, setDocFormType] = useState("");
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
                aprvPrcsEmpNm: addLine.empNm,
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


    const fn_formOk = () => {
        let formData = {
            docFormNm : docFormNm,
            docFormCd : docFormCd,
            docFormType: docFormType
        }


        console.log(`formData`,formData)
        console.log(`formLine`,docLine)

        fetcher(`/gw/aprv/AprvFormCreate`,{
            method:"POST",
            body:{
                docFormNm : docFormNm,
                docFormCd : docFormCd,
                docFormType: docFormType,
                docLine: docLine
            }
        }).then(res=>{
            if(res.res=="success") {
                alert("양식 등록 완료")
                navigate("/approval/docFormBox")
            } else {
                alert("양식 등록 실패")
            }
            
            
        })

    }

    return (
        <div>
            <h4>양식보관함 &gt; 양식등록</h4>
            양식 제목<input name="docFormNm" value={docFormNm} onChange={(e)=>{setDocFormNm(e.target.value)}}/><br/>
            양식 코드<input name="docFormCd" value={docFormCd} onChange={(e)=>{setDocFormCd(e.target.value)}}/><br/>
            문서 유형
            <select name="docType" value={docFormType} onChange={(e)=>setDocFormType(e.target.value)}>
                <option value="">선택</option>
                <option>근태</option>
                <option>일정</option>
            </select>
            <div> 
                결재선 <Button onClick={fn_editLine}>결재선 추가</Button>
                <ApprovalLine docLine={docLine}/>
                {isEditLineOpen && <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk}/>}
            </div>
           
            <div>
                <Button onClick={fn_formOk}>양식 등록</Button>
            </div>
        </div>
    );
};

export default DocFormInsert;