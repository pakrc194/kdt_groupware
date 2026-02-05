import { useState } from "react";
import Button from "../../../shared/components/Button";
import ScheduleContent from "../components/ScheduleContent";
import FormListModal from "../components/modals/FormListModal";
import AttendanceContent from "../components/AttendanceContent";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";

const DraftPage = () => {
    const navigate = useNavigate();

    const empId = localStorage.getItem("EMP_ID");
    const [docTitle, setDocTitle] = useState("");
    const [docLine, setDocLine] = useState([
        {
            aprvPrcsEmpId:empId,
            roleCd:"DRFT",
            roleSeq:"0"
        }
    ])
    const [docForm, setDocForm] = useState({
        docFormNm:'양식 선택'
    })
    const [inputList, setInputList] = useState([]);

    const [isFormOpen, setIsFormOpen] = useState(false);
    const fn_formClick = () => {
        console.log("formClick")
        setIsFormOpen(true)
    }
    const fn_formClose = () => {
        console.log("formClose")
        setIsFormOpen(false)
    }
    const fn_formOk = (form) => {
        console.log("formOk", form.docFormId)
        fetcher(`/gw/aprv/AprvDocFormLine/${form.docFormId}`)
        .then(res=>{
            setDocLine(prev=>{
                const drafter = prev.find(v => v.roleCd === "DRFT");
                return drafter ? [drafter, ...res] : [...res];
            })
            setDocForm(form)
            setIsFormOpen(false)
        }).catch(e=>{
            console.log("fetch formLine : "+e)
            setIsFormOpen(false)
        })

        
    }

    const fn_drftConfirm = () => {
        
        const drftDoc = {
            drftEmpId:empId,
            docFormId:docForm.docFormId,
            aprvDocNo:docForm.docFormCd,
            aprvDocTtl:docTitle
        }
        console.log("basic : ",drftDoc);
        console.log("line : ",docLine);
        console.log("form inpt", inputList);

        fetcher("/gw/aprv/AprvDrftUpload", 
            {
                method:"POST",
                body: {
                    drftDocReq : drftDoc,
                    drftLineReq : docLine,
                    drftInptReq : inputList
                }        
            }
        ).then(res=>{
            console.log(res)
        })


        //navigate("/approval/draftBox")
    }

    const fn_drftCancel = () => {
        navigate("/approval/docStatus")
    }


    return <>
        <h4>전자결재 > 기안작성</h4>
        <div className="draftForm basicForm" >
            <div>문서 제목 <input type="text" name="docTitle" onChange={(e)=>setDocTitle(e.target.value)}/></div>
            <div>파일 첨부 <input type="file" name="docFile"/></div>
        </div>
        <br/>
        <div className="draftForm">
            <div>양식 선택 
                <input type="text" name="docTitle" value={docForm.docFormNm} readOnly/>
                <Button variant="primary" onClick={fn_formClick}>양식 선택</Button>
                {isFormOpen && <FormListModal onClose={fn_formClose} onOk={fn_formOk}/>}
            </div>
        </div>
        <br/>
        {docForm.docFormType=="일정" && <div className="draftForm">
            <ScheduleContent docLine={docLine} setDocLine={setDocLine}/>
        </div>}
        {docForm.docFormType=="근태" && <div className="draftForm">
            <AttendanceContent docLine={docLine} docFormId={docForm.docFormId} setDocLine={setDocLine} 
                inputList={inputList} setInputList={setInputList}/>
        </div>}
        <div>
            <Button variant='secondary' onClick={fn_drftCancel}>취소</Button>
            <Button variant='secondary'>임시 저장</Button>
            <Button variant='primary' onClick={fn_drftConfirm}>기안</Button>
        </div>
    </>
};
export default DraftPage;