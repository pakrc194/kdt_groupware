import { useState } from "react";
import Button from "../../../shared/components/Button";
import ScheduleContent from "../components/ScheduleContent";
import FormListModal from "../components/modals/FormListModal";
import AttendanceContent from "../components/AttendanceContent";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import CompListModal from "../components/modals/CompListModal";

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
    const [docLoc, setDocLoc] = useState({
        locNm: '장소 선택'
    });
    
    const [isFormOpen, setIsFormOpen] = useState(false);

    const [inputList, setInputList] = useState([]);
    const [formList, setFormList] = useState([]);
    

    const fn_formClick = () => {
        console.log("formClick")
        fetcher("/gw/aprv/AprvDocFormList").then(res => {
            setIsFormOpen(true)
            setFormList(res)
            console.log(res, formList);
        });
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
    const fn_tempSave = () => {
        console.log("fecth before test : ", inputList)
        
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
                {isFormOpen && 
                    <CompListModal onClose={fn_formClose} onOk={fn_formOk} itemList={formList} 
                        itemNm={"docFormNm"} title={"양식선택"} okMsg={"불러오기"}/>}
            </div>
        </div>
        <br/>
        {docForm.docFormType && <div className="draftForm">
            <AttendanceContent docFormType={docForm.docFormType} docLine={docLine} docFormId={docForm.docFormId} setDocLine={setDocLine} 
                inputList={inputList} setInputList={setInputList}
                docLoc={docLoc} setDocLoc={setDocLoc}/>
        </div>}
        <div>
            <Button variant='secondary' onClick={fn_drftCancel}>취소</Button>
            <Button variant='secondary' onClick={fn_tempSave}>임시 저장</Button>
            <Button variant='primary' onClick={fn_drftConfirm}>기안</Button>
        </div>
    </>
};
export default DraftPage;