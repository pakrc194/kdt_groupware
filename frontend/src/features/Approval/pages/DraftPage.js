import Button from "../../../shared/components/Button";
import ScheduleContent from "../components/ScheduleContent";

const DraftPage = () => (
  <>
    <h4>전자결재 > 기안작성</h4>
    <div className="draftForm basicForm" >
        <div>문서 제목 <input type="text" name="docTitle"/></div>
        <div>파일 첨부 <input type="file" name="docFile"/></div>
    </div>
    <br/>
    <div className="draftForm">
        <div>양식 선택 <input type="text" name="docTitle" value="양식 선택" readOnly/><Button variant="primary">양식 선택</Button></div>
    </div>
    <br/>
    <div className="draftForm">
        <ScheduleContent/>
    </div>
    <div>
        <Button variant='secondary'>취소</Button>
        <Button variant='secondary'>임시 저장</Button>
        <Button variant='primary'>기안</Button>
    </div>
  </>
);
export default DraftPage;