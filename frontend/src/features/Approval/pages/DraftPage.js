import { useState } from "react";
import Button from "../../../shared/components/Button";
import ScheduleContent from "../components/ScheduleContent";
import FormListModal from "../components/modals/FormListModal";
import AttendanceContent from "../components/AttendanceContent";

const DraftPage = () => {
    const [docForm, setDocForm] = useState({})
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
        console.log("formOk")

        setDocForm(form)

        setIsFormOpen(false)
    }

    return <>
        <h4>전자결재 > 기안작성</h4>
        <div className="draftForm basicForm" >
            <div>문서 제목 <input type="text" name="docTitle"/></div>
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
            <ScheduleContent/>
        </div>}
        {docForm.docFormType=="근태" && <div className="draftForm">
            <AttendanceContent/>
        </div>}
        <div>
            <Button variant='secondary'>취소</Button>
            <Button variant='secondary'>임시 저장</Button>
            <Button variant='primary'>기안</Button>
        </div>
    </>
};
export default DraftPage;