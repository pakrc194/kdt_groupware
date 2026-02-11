import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import Button from "../../../shared/components/Button";
import CompListModal from "../../Approval/components/modals/CompListModal"; // 양식 선택용 내부 모달
import DrftContent from "../../Approval/components/DrftContent";
import RedrftContent from "../../Approval/components/RedrftContent";

function DutySkedAprvReqModal2({ isOpen, onClose, scheTtl }) {
  const navigate = useNavigate();
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

  // 1. 모든 상태(State) 선언 (최상단)
  const [docTitle, setDocTitle] = useState("");
  const [docLine, setDocLine] = useState([
    {
      aprvPrcsEmpId: myInfo?.empId,
      aprvPrcsEmpNm: myInfo?.empNm,
      roleCd: "DRFT",
      roleSeq: "0",
    },
    {
      aprvPrcsEmpId: 1,
      aprvPrcsEmpNm: "강백호",
      roleCd: "LAST_ATRZ",
      roleSeq: "1",
    },
  ]);
  const [docForm, setDocForm] = useState({ docFormNm: "양식 선택" });
  const [docLoc, setDocLoc] = useState({ locNm: "장소 선택" });
  const [docEmp, setDocEmp] = useState({ locNm: "담당자 지정" });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [inputList, setInputList] = useState([
    {
      docInptId: 71,
      docFormId: 9,
      docInptLbl: "근무표id",
      docInptNm: null,
      docInptType: "TEXT",
      docInptNo: 1,
      docInptRMRK: null,
    },
  ]);
  const [formList, setFormList] = useState([]);

  // 2. 효과(Effect) 처리: 모달이 열릴 때 제목 초기화
  useEffect(() => {
    if (isOpen && scheTtl) {
      setDocTitle(`[결재 요청] ${scheTtl}`);
    }
  }, [isOpen, scheTtl]);

  // 3. 로직 함수들
  const fn_formClick = () => {
    fetcher("/gw/aprv/AprvDocFormList").then((res) => {
      setIsFormOpen(true);
      setFormList(res);
    });
  };

  const fn_formClose = () => setIsFormOpen(false);

  const fn_drftConfirm = () => {
    if (!docForm.docFormId) return alert("양식을 선택해주세요.");

    const drftDoc = {
      drftEmpId: myInfo.empId,
      docFormId: docForm.docFormId,
      aprvDocNo: docForm.docFormCd,
      aprvDocTtl: docTitle,
    };

    fetcher("/gw/aprv/AprvDrftUpload", {
      method: "POST",
      body: {
        drftDocReq: drftDoc,
        drftLineReq: docLine,
        drftInptReq: inputList,
      },
    }).then((res) => {
      alert("기안 작성 완료");
      onClose(); // 모달 닫기
      navigate("/approval/draftBox");
    });
  };

  // 4. 조건부 렌더링 (Hook 선언부보다 아래에 위치)
  if (!isOpen) return null;

  return (
    <div className="modal-overlay" style={modalOverlayStyle}>
      <div className="modal-content" style={modalContentStyle}>
        <div className="modal-header">
          <h3>전자결재 기안 작성</h3>
          <Button onClick={onClose}>X</Button>
        </div>
        <hr />

        <div
          className="modal-body"
          style={{ maxHeight: "70vh", overflowY: "auto" }}
        >
          <div className="draftForm basicForm">
            <div>
              문서 제목{" "}
              <input
                type="text"
                name="docTitle"
                value={docTitle}
                onChange={(e) => setDocTitle(e.target.value)}
                style={{ width: "80%" }}
              />
            </div>
          </div>
          <br />
          <div className="draftForm">
            <div>
              양식 선택 <input type="text" value={docForm.docFormNm} readOnly />
            </div>
          </div>
          <br />

          <div className="draftForm">
            <RedrftContent
              docFormType={"근태"}
              docLine={docLine}
              docFormId={1}
              setDocLine={setDocLine}
              inputList={inputList}
              setInputList={setInputList}
              docLoc={docLoc}
              setDocLoc={setDocLoc}
              docEmp={docEmp}
              setDocEmp={setDocEmp}
            />
          </div>
        </div>

        <div
          className="modal-footer"
          style={{ textAlign: "right", marginTop: "20px" }}
        >
          <Button variant="secondary" onClick={onClose}>
            취소
          </Button>
          <Button variant="primary" onClick={fn_drftConfirm}>
            기안
          </Button>
        </div>
      </div>
    </div>
  );
}

// 간단한 스타일 객체
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "white",
  padding: "20px",
  borderRadius: "8px",
  width: "80%",
  maxWidth: "900px",
};

export default DutySkedAprvReqModal2;
