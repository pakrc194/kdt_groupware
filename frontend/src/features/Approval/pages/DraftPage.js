import { useState } from "react";
import Button from "../../../shared/components/Button";
import DrftContent from "../components/DrftContent";
import { useNavigate } from "react-router-dom";
import { fetcher } from "../../../shared/api/fetcher";
import CompListModal from "../components/modals/CompListModal";

const DraftPage = () => {
    const navigate = useNavigate();
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));

    const [docTitle, setDocTitle] = useState("");
    const [docLine, setDocLine] = useState([
        {
            aprvPrcsEmpId:myInfo.empId,
            aprvPrcsEmpNm:myInfo.empNm,
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
    const [docEmp, setDocEmp] = useState({
        locNm: '담당자 지정'
    });

    const [isFormOpen, setIsFormOpen] = useState(false);

    const [inputList, setInputList] = useState([]);
    const [formList, setFormList] = useState([]);
    const [isAttendConfirm, setIsAttendConfirm] = useState(false);

    const fn_formClick = () => {
        fetcher(`/gw/aprv/AprvDocFormList/${myInfo.deptId}`).then(res => {
            setIsFormOpen(true)
            setFormList(res)
            // console.log("formClick ",res, formList);
        });
    }
    const fn_formClose = () => {
        setIsFormOpen(false)
    }
    const fn_formOk = (form) => {
        // console.log("formOk", form)
        fetcher(`/gw/aprv/AprvDocFormLine/${form.docFormId}`)
        .then(res=>{
            setDocLine(prev=>{
                const drafter = prev.find(v => v.roleCd === "DRFT");
                return drafter ? [drafter, ...res] : [...res];
            })
            
            setDocForm(form)
            setIsFormOpen(false)
        }).catch(e=>{
            // console.log("fetch formLine : "+e)
            setIsFormOpen(false)
        })

        
    }

    const fn_drftConfirm = () => {
        if(myInfo?.empId==null) {
            alert("회원정보가 없습니다")
            return;
        }
        if(docTitle==null || docTitle.trim()=="") {
            alert("문서 제목을 입력하세요")
            return;
        }
        if(docForm?.docFormId==null) {
            alert("양식을 선택해주세요")
            return;
        }
        const docRole = inputList.find(v => v.docInptNm === "docRole");
        const docSchedType = inputList.find(v => v.docInptNm === "docSchedType");
        const docStart = inputList.find(v=>v.docInptNm=="docStart")
        const docEnd = inputList.find(v=>v.docInptNm=="docEnd")
        const docLoc = inputList.find(v=>v.docInptNm=="docLoc")

        if (docRole && docRole.docInptVl == null) {
            alert("담당을 선택해주세요");
            return;
        }
        if (docSchedType && docSchedType.docInptVl == null) {
            alert("담당을 지정해주세요");
            return;
        }
        if(docStart && docStart.docInptVl == null) {
            alert("시작날짜를 선택해주세요")
            return;
        }
        if(docEnd && docEnd.docInptVl == null) {
            alert("종료날짜를 선택해주세요")
            return;
        }
        if(docForm.docFormType=="근태" && !isAttendConfirm) {
            alert("근태를 조회하세요")
            return;
        }
        if(docLoc && docLoc.docInptVl == null) {
            alert("장소를 선택해주세요")
            return;
        }

        const drftDoc = {
            drftEmpId:myInfo.empId,
            docFormId:docForm.docFormId,
            aprvDocNo:docForm.docFormCd,
            aprvDocTtl:docTitle
        }
        // console.log("basic : ",drftDoc);
        // console.log("line : ",docLine);
        // console.log("form inpt", inputList);

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
            let docId = res.result.drftDocReq.aprvDocId
            if (selectedFiles && selectedFiles.length > 0) {
                fn_uploadTest(docId)
            } else {
                alert("기안 작성 완료")
                navigate("/approval/draftBox")  
            }

            
        })


        
    }

    const fn_drftCancel = () => {
        navigate("/approval/docStatus")
    }
    const fn_tempSave = () => {
        // console.log("fecth before test : ", inputList)
        const drftDoc = {
            drftEmpId:myInfo.empId,
            docFormId:docForm.docFormId,
            aprvDocNo:docForm.docFormCd,
            aprvDocTtl:docTitle
        }
        // console.log("basic : ",drftDoc);
        // console.log("form inpt", inputList);

        fetcher("/gw/aprv/AprvDrftTemp", 
            {
                method:"POST",
                body: {
                    drftDocReq : drftDoc,
                    drftInptReq : inputList
                }        
            }
        ).then(res=>{
            alert("임시저장 완료")
        })
    }

    const [selectedFiles ,setSelectedFiles] = useState([]);
                                                                                           
    const FileUpload = (e) => {
        setSelectedFiles(Array.from(e.target.files));
    };    

    const fn_uploadTest = (docId) => {
        const formData = new FormData();

        formData.append("aprvDocId", docId);
        if (selectedFiles && selectedFiles.length > 0) {
            selectedFiles.forEach((file) => {
                formData.append("docFile", file); 
            });
        }
        fetcher(`/gw/aprv/AprvFileUpload`, {
            method: "POST",
            body: formData
        }).then(res=>{
            // console.log("fetcher", res)
            alert("기안 작성 완료")
            navigate("/approval/draftBox")  
        });
    }


    return (
        <div className="drft-container">
            <header className="drft-header">
                <h2 className="drft-page-title">전자결재 <span className="sep">›</span> 기안작성</h2>
            </header>

            <main className="drft-main">
                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">기본정보</h3>
                    </div>
                    <div className="drft-card-body">
                        <div className="drft-unit">
                            <div className="drft-unit-top">
                                <label className="drft-label">문서 제목</label>
                            </div>
                            <div className="drft-control">
                                <input
                                    className="drft-input"
                                    type="text"
                                    name="docTitle"
                                    value={docTitle || ""}
                                    onChange={(e) => setDocTitle(e.target.value)}
                                    placeholder="문서 제목을 입력하세요"
                                />
                            </div>
                        </div>
                        <div className="drft-unit">
                            <div className="drft-unit-top">
                                <label className="drft-label">파일첨부</label>
                            </div>
                            <div className="drft-control">
                                <div className="drft-file-box">
                                    <input className="drft-file-input" type="file" name="docFile" onChange={FileUpload} multiple />
                                    {selectedFiles?.length > 0 && (
                                        <ul className="fileList">
                                            {selectedFiles.map((file, idx) => (
                                                <li key={idx} className="fileItem">{file.name}</li>
                                            ))}
                                        </ul>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">양식</h3>
                    </div>
                    <div className="drft-card-body">
                        <div className="drft-unit">
                            <div className="drft-unit-top">
                                <label className="drft-label">양식 선택</label>
                                <div className="drft-unit-action">
                                    <Button variant="primary" onClick={fn_formClick}>양식 선택</Button>
                                </div>
                            </div>
                            <div className="drft-control">
                                <input
                                    className="drft-input"
                                    type="text"
                                    name="docFormNm"
                                    value={docForm?.docFormNm || ""}
                                    readOnly
                                    placeholder="양식을 선택하세요"
                                />
                            </div>
                        </div>
                    </div>
                </section>

                <section className="drft-card">
                    <div className="drft-card-header">
                        <h3 className="drft-card-title">작성내용</h3>
                    </div>
                    <div className="drft-card-body">
                        {!docForm?.docFormType ? (
                            <div className="emptyState">양식을 먼저 선택해주세요.</div>
                        ) : (
                            <DrftContent
                                docFormType={docForm.docFormType}
                                docLine={docLine}
                                docFormId={docForm.docFormId}
                                setDocLine={setDocLine}
                                inputList={inputList}
                                setInputList={setInputList}
                                docLoc={docLoc}
                                setDocLoc={setDocLoc}
                                docEmp={docEmp}
                                setDocEmp={setDocEmp}
                                isAttendConfirm = {isAttendConfirm}
                                setIsAttendConfirm = {setIsAttendConfirm}
                            />
                        )}
                    </div>
                </section>
            </main>

            <div className="actionBar">
                <Button variant="secondary" onClick={fn_drftCancel}>취소</Button>
                <Button variant="secondary" onClick={fn_tempSave}>임시 저장</Button>
                <Button variant="primary" onClick={fn_drftConfirm}>기안</Button>
            </div>

            {isFormOpen && (
                <CompListModal
                    onClose={fn_formClose}
                    onOk={fn_formOk}
                    itemList={formList}
                    itemNm={"docFormNm"}
                    title={"양식선택"}
                    okMsg={"불러오기"}
                />
            )}
        </div>
    );

};
export default DraftPage;