import React, { useEffect, useState } from "react";
import { fetcher } from "../../../shared/api/fetcher";
import { useNavigate } from "react-router-dom";

function DutySkedAprvReqModal({ isOpen, onClose, onSubmit, scheTtl, dutyId }) {
  const navigate = useNavigate();
  const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

  const [title, setTitle] = useState(`[결재 요청] ${scheTtl}`);
  const [content, setContent] = useState("");

  const [docTitle, setDocTitle] = useState("");
  const [docLine, setDocLine] = useState([
    {
      aprvPrcsEmpId: myInfo?.empId,
      aprvPrcsEmpNm: myInfo?.empNm,
      roleCd: "DRFT",
      roleSeq: "0",
    },
  ]);
  const [docForm, setDocForm] = useState({ docFormNm: "양식 선택" });
  const [docLoc, setDocLoc] = useState({ locNm: "장소 선택" });
  const [docEmp, setDocEmp] = useState({ locNm: "담당자 지정" });
  const [inputList, setInputList] = useState([]);
  const [formList, setFormList] = useState([]);

  // 고정된 결재선 데이터 (예시)
  const approvalLine = [
    { rank: "기안", name: "나사원", dept: "개발팀" },
    { rank: "검토", name: "김팀장", dept: "개발팀" },
    { rank: "승인", name: "박부장", dept: "운영부" },
  ];

  const fn_drftConfirm = async () => {
    console.log("fn_drftConfirm 시작");

    const drftDoc = {
      drftEmpId: myInfo.empId,
      docFormId: 9,
      aprvDocNo: "DT",
      aprvDocTtl: title,
    };

    try {
      // 1. 데이터 가져오기 및 가공
      const inputRes = await fetcher(`/gw/aprv/AprvDocInpt/9`);
      const updatedInptList = inputRes.map((v) => {
        if (v.docInptNm === "docDuty") {
          return { ...v, docInptVl: dutyId };
        } else if (v.docInptNm == "docTxtArea") {
          return content ? { ...v, docInptVl: content } : v;
        }
        return v;
      });

      //console.log("fetcher InptList :", content, updated);

      setInputList(updated);
    });

    // setInputList([
    //     {
    //       docInptNo: 1 ,
    //       docInptId: 71 ,
    //       docInptNm:"docDuty",
    //       docInptType:"DUTY",
    //       docInptVl: content
    //     },
    //   ],
    // );

    console.log("drftDocReq: ", drftDoc);
    console.log("drftLineReq: ", docLine);
    console.log("drftInptReq: ", inputList);

    try {
      const res = await fetcher(`/gw/duty/pending`, {
        method: "POST",
        body: {
          dutyId: dutyIdValue, // 상태값 대신 가공된 변수 사용
        },
      });
      // alert(pendingRes.message); // 필요 시 주석 해제

      // 3. 최종 기안 업로드
      await fetcher("/gw/aprv/AprvDrftUpload", {
        method: "POST",
        body: {
          drftDocReq: drftDoc,
          drftLineReq: docLine,
          drftInptReq: updatedInptList, // 상태값 대신 가공된 변수 사용
        },
      });

      alert("기안 작성 완료");
      onClose();
      navigate("/approval/draftBox");
    } catch (error) {
      console.error(error);
      alert(`요청 실패: ${error.message}`);
    }
  };

  useEffect(() => {
    fetcher(`/gw/aprv/AprvDocFormLine/9`)
      .then((res) => {
        setDocLine((prev) => {
          const drafter = prev.find((v) => v.roleCd === "DRFT");
          return drafter ? [drafter, ...res] : [...res];
        });
      })
      .catch((e) => {
        console.log("fetch formLine : " + e);
      });
  }, []);

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="approval-modal">
        <div className="modal-header">
          <h2>근무표 결재 기안</h2>
          <button className="close-x" onClick={onClose}>
            ×
          </button>
        </div>

        <div className="modal-body">
          {/* 결재선 미리보기 */}
          <div className="approval-line-section">
            <label className="section-label">결재선 미리보기</label>
            <div className="approval-line-display">
              {approvalLine.map((step, idx) => (
                <div key={idx} className="approval-step">
                  <div className="step-rank">{step.rank}</div>
                  <div className="step-info">
                    <span className="step-name">{step.name}</span>
                    <span className="step-dept">{step.dept}</span>
                  </div>
                  {idx < approvalLine.length - 1 && (
                    <div className="step-arrow">→</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* 기안문 제목 */}
          <div className="input-section">
            <label>기안 제목</label>
            <input
              type="text"
              className="modal-input"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="제목을 입력하세요"
            />
          </div>

          {/* 결재 내용 (첨언) */}
          <div className="input-section">
            <label>기안 의견 (특이사항)</label>
            <textarea
              className="modal-textarea"
              rows="5"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="특이사항이나 첨언할 내용을 입력하세요."
            />
          </div>
        </div>

        <div className="modal-footer-btns">
          <button className="btn-cancel" onClick={onClose}>
            취소
          </button>
          <button className="btn-submit" onClick={() => fn_drftConfirm()}>
            기안 작성
          </button>
        </div>
      </div>
    </div>
  );
}

export default DutySkedAprvReqModal;
