import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';
import AttendContent from '../components/AttendContent';
import DutyForm from './DutyForm';
import ReferModal from '../components/modals/ReferModal'; // 경로 확인 필요
import AtrzModal from '../components/modals/AtrzModal';   // 경로 확인 필요
import './ApprovalDetail.css'
import { formatToKor, formatToYYMMDDHHMMSS } from '../../../shared/func/formatToDate';

const ApprovalDetail = () => {
    const { sideId, docId } = useParams();
    const navigate = useNavigate();
    const [myInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));

    const [aprvDocDetail, setAprvDocDetail] = useState({});
    const [inputList, setInputList] = useState([]);
    const [aprvLine, setAprvLine] = useState([]);

    const [docRole, setDocRole] = useState();
    const [attendList, setAttendList] = useState([]);
    const [dutyList, setDutyList] = useState([]);
    const [schedList, setSchedList] = useState([]);
    const [docVerList, setDocVerList] = useState([]);
    const [rejectData, setRejectData] = useState({});
    const [drftDate, setDrftDate] = useState({});
    const [isApproved, setIsApproved] = useState(false);
    const [docFile, setDocFile] = useState({});
    const [vlFilter, setVlFilter] = useState();
    const [locFilter, setLocFilter] = useState();

    // 결재 관련 상태 추가
    const [selectedEmp, setSelectedEmp] = useState(null);
    const [openModal, setOpenModal] = useState("");

    const sideTitleMap = {
        approvalBox: "결재함",
        drftBox: "기안함",
        draftBox: "기안함",
        refBox: "참조함",
        tempBox: "임시저장함",
        rejectBox: "반려함",
    };

    const docRoleMap = {
        PERSONAL: "팀원",
        DEPT: "팀",
        COMPANY: "회사"
    }

    const idList = useMemo(() => {
        if (!aprvDocDetail.docFormType || inputList.length === 0) return [];
        if (aprvDocDetail.docFormType === "근태") return aprvDocDetail.drftEmpId ? [String(aprvDocDetail.drftEmpId)] : [];
        if (aprvDocDetail.docFormType === "일정") {
            const schedTargetValue = inputList.find(v => v.docInptNm === "docSchedType")?.docInptVl;
            return schedTargetValue ? schedTargetValue.split(',').map(id => String(id.trim())) : (aprvDocDetail.drftEmpId ? [String(aprvDocDetail.drftEmpId)] : []);
        }
        return [];
    }, [aprvDocDetail, inputList]);

    useEffect(() => {
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res => {
            setAprvLine(res);
            setRejectData(res.find(v => v.aprvPrcsStts === 'REJECTED'));
            
            // 현재 사용자가 결재선에 있고, 아직 결재하지 않았는지 확인
            const me = res.find(v => v.aprvPrcsEmpId == myInfo.empId && v.aprvPrcsDt == null);
            if (me) setSelectedEmp(me);

            res.forEach(v => {
                if (v.roleCd !== "DRFT" && v.aprvPrcsDt != null) setIsApproved(true);
            });
        });

        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(res => {
            const drftStart = res.find(v => v.docInptNm === "docStart");
            const drftEnd = res.find(v => v.docInptNm === "docEnd");
            if (drftStart && drftEnd) {
                setDrftDate({ docStart: drftStart.docInptVl, docEnd: drftEnd.docInptVl });
            }
            setInputList(res);
        });

        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res => setAprvDocDetail(res));
        fetcher(`/gw/aprv/AprvDocFile/${docId}`).then(res => setDocFile(res));
        fetcher(`/gw/aprv/AprvLocList`).then(res => {
            let resFilter = {};
            res.forEach(v => resFilter[v.locId] = v.locNm);
            setLocFilter(resFilter);
        });
    }, [docId, myInfo.empId]);

    useEffect(() => {
        if (!aprvDocDetail.docFormType || inputList.length === 0) return;
        let targetIds = idList;
        if (aprvDocDetail.docFormType === "근태") fn_warnAttend(targetIds);
        else if (aprvDocDetail.docFormType === "일정") fn_warnSched(targetIds);

        fetcher(`/gw/aprv/AprvDocVerList`, {
            method: "POST",
            body: { empId: myInfo.empId, docNo: aprvDocDetail.aprvDocNo }
        }).then(res => setDocVerList(res));

        const roleItem = inputList.find(v => v.docInptNm === "docRole");
        if (roleItem) {
            const roleVal = roleItem.docInptVl;
            const endpoint = roleVal === "PERSONAL" ? `/gw/aprv/AprvDeptEmpList` : roleVal === "DEPT" ? `/gw/aprv/AprvDeptList` : null;
            if (endpoint) {
                fetcher(endpoint).then(res => {
                    let resFilter = {};
                    res.forEach(v => {
                        const idKey = v.empId || v.deptId;
                        const nmKey = v.empNm || v.deptName;
                        resFilter[idKey] = nmKey;
                    });
                    setVlFilter(resFilter);
                });
            }
        }
    }, [aprvDocDetail.docFormType, inputList, idList]);

    // 결재 처리 관련 함수들 (부모로 이동)
    const fn_close = () => setOpenModal("");

    const fn_ok = (aprvEmpId, roleCd, prcsRes = "") => {
        setOpenModal("");
        let stts = roleCd.includes("REF") ? "READ" : (roleCd === "LAST_ATRZ" ? "COMPLETED" : "APPROVED");
        let nextNm = null;
        let nextId = 0;
        
        if (roleCd === "MID_ATRZ") {
            const last = aprvLine.find(v => v.roleCd === "LAST_ATRZ");
            if (last) {
                nextNm = last.empNm;
                nextId = last.aprvPrcsEmpId;
            }
        }

        let rjctRsn = null;
        if (prcsRes.prcs === "rjct") {
            stts = "REJECTED";
            nextNm = null;
            nextId = 0;
            rjctRsn = prcsRes.rjctRsn;
        }

        fetcher("/gw/aprv/AprvPrcs", {
            method: "POST",
            body: {
                aprvDocId: docId,
                aprvPrcsEmpId: aprvEmpId,
                roleCd: roleCd,
                aprvPrcsStts: stts,
                nextEmpId: nextId,
                nextEmpNm: nextNm,
                rjctRsn: rjctRsn
            }
        }).then(() => {
            const date = formatToYYMMDDHHMMSS(new Date());
            setAprvLine(prev => prev.map(item => 
                (item.aprvPrcsEmpId === aprvEmpId && item.roleCd === roleCd) ? { ...item, aprvPrcsDt: date, aprvPrcsStts: stts } : item
            ));

            if (prcsRes.prcs !== "rjct") {
                if (roleCd === "LAST_ATRZ") {
                    if (aprvDocDetail.docFormType === "근태") fn_attendCheck();
                    else if (aprvDocDetail.docFormType === "일정") fn_schedCheck();
                    else if (aprvDocDetail.docFormType === "근무") fn_dutyCheck();
                } else {
                    alert(roleCd.includes("REF") ? "참조 완료" : "결재 완료");
                }
            } else {
                alert(`반려처리 : ${rjctRsn}`);
            }
            setSelectedEmp(null); // 결재 완료 후 버튼 숨김
        });
    };

    const fn_dutyCheck = async () => {
        const dutyId = inputList[0]?.docInptVl;
        if (!dutyId) return;
        try {
            const res = await fetcher("/gw/duty/confirmDuty", { method: "POST", body: { dutyId: dutyId } });
            alert(res?.message || "확정 처리가 완료되었습니다.");
        } catch (error) { alert(`[결재 실패] ${error.message}`); }
    };

    const fn_schedCheck = () => {
        const docSched = inputList.find(v => v.docInptNm === "docSchedType")?.docInptVl;
        const currentRole = inputList.find(v => v.docInptNm === "docRole")?.docInptVl;
        let schedEmpId = aprvDocDetail.drftEmpId;
        let deptId = aprvDocDetail.deptId;

        if (currentRole === "DEPT") deptId = docSched;
        else if (currentRole === "PERSONAL") schedEmpId = docSched;

        fetcher("/gw/aprv/AprvSchedUpload", {
            method: "POST",
            body: {
                schedTitle: aprvDocDetail.aprvDocTtl,
                schedStartDate: inputList.find(v => v.docInptNm === "docStart")?.docInptVl,
                schedEndDate: inputList.find(v => v.docInptNm === "docEnd")?.docInptVl,
                schedType: currentRole,
                schedDetail: inputList.find(v => v.docInptNm === "docTxtArea")?.docInptVl,
                schedLoc: inputList.find(v => v.docInptNm === "docLoc")?.docInptVl,
                schedEmpId,
                schedAuthorId: myInfo.empId,
                schedDeptId: deptId,
                schedDocId: docId
            }
        }).then(() => alert("일정 등록 완료"));
    };

    const fn_attendCheck = () => {
        fetcher(`/gw/aprv/AprvAttendUpload`, {
            method: "POST",
            body: {
                empId: aprvDocDetail.drftEmpId,
                docStart: inputList.find(v => v.docInptNm === "docStart")?.docInptVl,
                docEnd: inputList.find(v => v.docInptNm === "docEnd")?.docInptVl,
                attendStts: aprvDocDetail.atrzVl
            }
        }).then(() => alert("근태 등록 완료"));
    };

    const fn_warnAttend = (ids) => {
        setDocRole("duty")
        const docStart = inputList.find(v => v.docInptNm === "docStart")?.docInptVl?.replaceAll('-', "");
        const docEnd = inputList.find(v => v.docInptNm === "docEnd")?.docInptVl?.replaceAll('-', "");
        fetcher("/gw/aprv/AprvEmpAnnlLv", { method: "POST", body: { role: "duty", ids, deptId: null, year: 2026 } }).then(res => setAttendList(res));
        fetcher("/gw/aprv/AprvDutyScheDtl", { method: "POST", body: { role: "duty", ids, deptId: null, docStart, docEnd } }).then(res => setDutyList(res));
        fetcher("/gw/aprv/AprvSchedList", { method: "POST", body: { role: "duty", ids, deptId: null, docStart, docEnd } }).then(res => setSchedList(res));
    }

    const fn_warnSched = (ids) => {
        const currentRole = inputList.find(v => v.docInptNm === "docRole")?.docInptVl;
        setDocRole(currentRole);
        if (!currentRole) return;
        const docStart = inputList.find(v => v.docInptNm === "docStart")?.docInptVl.replaceAll("-", "");
        const docEnd = inputList.find(v => v.docInptNm === "docEnd")?.docInptVl.replaceAll("-", "");
        if (currentRole === "PERSONAL") {
            fetcher("/gw/aprv/AprvEmpAnnlLv", { method: "POST", body: { role: currentRole, ids, deptId: 0, year: 2026 } }).then(res => setAttendList(res));
            fetcher("/gw/aprv/AprvDutyScheDtl", { method: "POST", body: { role: currentRole, ids, deptId: 0, docStart, docEnd } }).then(res => setDutyList(res));
        }
        fetcher("/gw/aprv/AprvSchedList", { method: "POST", body: { role: currentRole, ids, deptId: 0, docStart, docEnd } }).then(res => setSchedList(res));
    }

    const fn_list = () => navigate(`/approval/${sideId}`)
    const fn_redraft = () => {
        if (sideId === "tempBox") navigate(`/approval/${sideId}/temp/${docId}`)
        else navigate(`/approval/${sideId}/redrft/${docId}`)
    }
    const fn_drftCancel = () => {
        fetcher(`/gw/aprv/AprvDrftDelete`, { method: "POST", body: { docId } }).then(() => {
            alert("기안 취소 되었습니다.");
            navigate(`/approval/${sideId}`);
        })
    }

    return (
        <div className="aprv-detail-wrapper">
            <div className="aprv-detail-path">
                전자결재 &rsaquo; {sideTitleMap[sideId]} &rsaquo; <strong>{aprvDocDetail.aprvDocTtl}</strong>
            </div>

            <div className="aprv-detail-paper">
                <div className="aprv-detail-top-actions">
                    {/* ✅ 부모로 이동한 결재 버튼 */}
                    {selectedEmp && (
                        <Button variant="primary" onClick={() => setOpenModal(selectedEmp.roleCd)}>
                            결재하기
                        </Button>
                    )}
                </div>
                
                <h1 className="aprv-detail-title">{aprvDocDetail.aprvDocTtl}</h1>

                <div className="aprv-detail-top-section">
                    <table className="aprv-detail-meta-table">
                        <tbody>
                            <tr><th>문서번호</th><td>{aprvDocDetail.aprvDocNo}</td></tr>
                            <tr><th>기안자</th><td>{aprvDocDetail.drftEmpNm}</td></tr>
                            <tr><th>기안일시</th><td>{formatToKor(aprvDocDetail.aprvDocDrftDt)}</td></tr>
                        </tbody>
                    </table>

                    <div className="aprv-detail-line-box">
                        <ApprovalLineDetail 
                            aprvLine={aprvLine} 
                            myInfo={myInfo}
                            setSelectedEmp={setSelectedEmp}
                            setOpenModal={setOpenModal}
                        />
                    </div>
                </div>

                <div className="aprv-detail-content">
                    {inputList.map((v, k) => {
                        let content = null;
                        switch (v.docInptNm) {
                            case "docRole": content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: docRoleMap[v.docInptVl] }} />; break;
                            case "docDuty": content = <DutyForm dutyId={v.docInptVl} />; break;
                            case "docSchedType":
                                if (!v.docInptVl || !vlFilter) return null;
                                let tt = v.docInptVl.split(',').map(sc => vlFilter[sc] || sc).join(', ');
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: tt }} />;
                                break;
                            case "docLoc":
                                if (!locFilter) return null;
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: locFilter[v.docInptVl] }} />;
                                break;
                            default: content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: v.docInptVl }} />;
                        }
                        return <div key={k} className="aprv-detail-row">{content}</div>;
                    })}
                </div>

                {/* 첨부파일 및 반려사유 생략 (기존과 동일) */}
                {docFile?.fileId && (
                    <div className="aprv-detail-file-section">
                        <h4><i className="fas fa-paperclip"></i> 첨부파일</h4>
                        <a className="file-link" href={`http://192.168.0.36:8080/board/download/${docFile.fileId}`}>{docFile.originName}</a>
                    </div>
                )}
                {rejectData?.aprvPrcsEmpId && (
                    <div className="aprv-reject-box">
                        <h3><i className="fas fa-exclamation-circle"></i> 반려 사유</h3>
                        <p><strong>{rejectData.aprvPrcsEmpNm}</strong>: {rejectData.rjctRsn}</p>
                    </div>
                )}
            </div>

            <div className="aprv-detail-actions">
                <Button variant='secondary' onClick={fn_list}>목록으로</Button>
                {(sideId === "rejectBox" || sideId === "tempBox") && <Button variant='primary' onClick={fn_redraft}>재기안 작성</Button>}
                {(!isApproved && aprvDocDetail.drftEmpId == myInfo.empId) && <Button variant='danger' onClick={fn_drftCancel}>기안 취소</Button>}
            </div>

            {/* ✅ 모달 영역도 부모에서 관리 */}
            {openModal.includes("REF") && (
                <ReferModal onClose={fn_close} onOk={() => fn_ok(selectedEmp.aprvPrcsEmpId, selectedEmp.roleCd)} />
            )}
            {openModal.includes("ATRZ") && (
                <AtrzModal 
                    onClose={fn_close} 
                    docRole={docRole} idList={idList} attendList={attendList} dutyList={dutyList} schedList={schedList} drftDate={drftDate}
                    onOk={(prcsRes) => fn_ok(selectedEmp.aprvPrcsEmpId, selectedEmp.roleCd, prcsRes)} 
                />
            )}
        </div>
    );
};

export default ApprovalDetail;