import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { fetcher } from '../../../shared/api/fetcher';
import Button from '../../../shared/components/Button';
import ApprovalLineDetail from '../components/ApprovalLineDetail';
import InputForm from '../components/InputForm';
import DetailForm from '../components/DetailForm';
import AttendContent from '../components/AttendContent';
import DutyForm from './DutyForm';
import './ApprovalDetail.css'
import { formatToKor } from '../../../shared/func/formatToDate';

const ApprovalDetail = () => {
    const { sideId, docId } = useParams();
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
    const [myInfo, setMyInfo] = useState(JSON.parse(localStorage.getItem("MyInfo")));
    const [isApproved, setIsApproved] = useState(false);

    const [docFile, setDocFile] = useState({});

    const [vlFilter, setVlFilter] = useState();
    const [locFilter, setLocFilter] = useState();

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

    const navigate = useNavigate();

    // 1. idList 계산 (자식 컴포넌트 전달용 및 내부 로직용)
    const idList = useMemo(() => {
        if (!aprvDocDetail.docFormType || inputList.length === 0) return [];

        if (aprvDocDetail.docFormType === "근태") {
            return aprvDocDetail.drftEmpId ? [String(aprvDocDetail.drftEmpId)] : [];
        }

        if (aprvDocDetail.docFormType === "일정") {
            const schedTargetValue = inputList.find(v => v.docInptNm === "docSchedType")?.docInptVl;
            if (schedTargetValue) {
                return schedTargetValue.split(',').map(id => String(id.trim()));
            }
            return aprvDocDetail.drftEmpId ? [String(aprvDocDetail.drftEmpId)] : [];
        }

        return [];
    }, [aprvDocDetail, inputList]);

    // 초기 문서 데이터 로드
    useEffect(() => {
        fetcher(`/gw/aprv/AprvLine/${docId}`).then(res => {
            setAprvLine(res)
            setRejectData(res.find(v => v.aprvPrcsStts == 'REJECTED'))
            res.find(v => {
                if (v.roleCd != "DRFT" && v.aprvPrcsDt != null) {
                    setIsApproved(true)
                }
            })
        })

        fetcher(`/gw/aprv/AprvDtlVl/${docId}`).then(res => {
            const drftStart = res.find(v => v.docInptNm == "docStart")
            const drftEnd = res.find(v => v.docInptNm == "docEnd")
            if (drftStart != null && drftEnd != null) {
                setDrftDate({
                    docStart: drftStart.docInptVl,
                    docEnd: drftEnd.docInptVl
                })
            }
            setInputList(res)
        })

        fetcher(`/gw/aprv/AprvDocDetail/${docId}`).then(res => {
            setAprvDocDetail(res)
        })

        fetcher(`/gw/aprv/AprvDocFile/${docId}`).then(res => {
            setDocFile(res)
        })

        fetcher(`/gw/aprv/AprvLocList`).then(res => {
            let resFilter = {}
            res.map((v) => {
                resFilter[v.locId] = v.locNm
            })
            setLocFilter(resFilter)
        })
    }, [docId])

    // 2. 비동기 데이터 로드 및 필터 설정 (idList 의존성 제거)
    useEffect(() => {
        if (!aprvDocDetail.docFormType || inputList.length === 0) return;

        // 즉석에서 ID 리스트 추출 (state idList 지연 방지)
        let targetIds = [];
        if (aprvDocDetail.docFormType === "근태") {
            targetIds = aprvDocDetail.drftEmpId ? [String(aprvDocDetail.drftEmpId)] : [];
            fn_warnAttend(targetIds);
        } else if (aprvDocDetail.docFormType === "일정") {
            const schedTargetValue = inputList.find(v => v.docInptNm === "docSchedType")?.docInptVl;
            targetIds = schedTargetValue ? schedTargetValue.split(',').map(id => String(id.trim())) : [String(aprvDocDetail.drftEmpId)];
            fn_warnSched(targetIds);
        }

        // 버전 리스트 호출
        fetcher(`/gw/aprv/AprvDocVerList`, {
            method: "POST",
            body: { empId: myInfo.empId, docNo: aprvDocDetail.aprvDocNo }
        }).then(res => setDocVerList(res));

        // 필터 설정
        const roleItem = inputList.find(v => v.docInptNm === "docRole");
        if (roleItem) {
            const roleVal = roleItem.docInptVl;
            const endpoint = roleVal === "PERSONAL" ? `/gw/aprv/AprvDeptEmpList` :
                roleVal === "DEPT" ? `/gw/aprv/AprvDeptList` : null;

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
    }, [aprvDocDetail.docFormType, inputList]);

    // 3. API 호출 함수 수정 (ids를 매개변수로 받음)
    const fn_warnAttend = (ids) => {
        setDocRole("duty")
        const docStart = inputList.find(v => v.docInptNm === "docStart")?.docInptVl?.replaceAll('-', "");
        const docEnd = inputList.find(v => v.docInptNm === "docEnd")?.docInptVl?.replaceAll('-', "");

        fetcher("/gw/aprv/AprvEmpAnnlLv", {
            method: "POST",
            body: { role: "duty", ids: ids, deptId: null, year: 2026 }
        }).then(res => setAttendList(res))

        fetcher("/gw/aprv/AprvDutyScheDtl", {
            method: "POST",
            body: { role: "duty", ids: ids, deptId: null, docStart, docEnd }
        }).then(res => setDutyList(res))

        fetcher("/gw/aprv/AprvSchedList", {
            method: "POST",
            body: { role: "duty", ids: ids, deptId: null, docStart, docEnd }
        }).then(res => setSchedList(res))
    }

    const fn_warnSched = (ids) => {
        const currentRole = inputList.find(v => v.docInptNm === "docRole")?.docInptVl;
        setDocRole(currentRole);
        if (!currentRole) return;

        const docStart = inputList.find(v => v.docInptNm === "docStart")?.docInptVl.replaceAll("-", "");
        const docEnd = inputList.find(v => v.docInptNm === "docEnd")?.docInptVl.replaceAll("-", "");

        // PERSONAL일 때만 추가 정보 호출 로직 유지
        if (currentRole === "PERSONAL") {
            fetcher("/gw/aprv/AprvEmpAnnlLv", {
                method: "POST",
                body: { role: currentRole, ids: ids, deptId: 0, year: 2026 }
            }).then(res => setAttendList(res))

            fetcher("/gw/aprv/AprvDutyScheDtl", {
                method: "POST",
                body: { role: currentRole, ids: ids, deptId: 0, docStart, docEnd }
            }).then(res => setDutyList(res))
        }

        fetcher("/gw/aprv/AprvSchedList", {
            method: "POST",
            body: { role: currentRole, ids: ids, deptId: 0, docStart, docEnd }
        }).then(res => setSchedList(res))
    }

    const fn_list = () => navigate(`/approval/${sideId}`)
    const fn_redraft = () => {
        if (sideId === "tempBox") navigate(`/approval/${sideId}/temp/${docId}`)
        else navigate(`/approval/${sideId}/redrft/${docId}`)
    }

    const fn_drftCancel = () => {
        fetcher(`/gw/aprv/AprvDrftDelete`, {
            method: "POST",
            body: { docId: docId }
        }).then(res => {
            alert("기안 취소 되었습니다.")
            navigate(`/approval/${sideId}`);
        })
    }

    return (
        <div className="aprv-detail-wrapper">
            <div className="aprv-detail-path">
                전자결재 &rsaquo; {sideTitleMap[sideId]} &rsaquo; <strong>{aprvDocDetail.aprvDocTtl}</strong>
            </div>

            <div className="aprv-detail-paper">
                <h1 className="aprv-detail-title">{aprvDocDetail.aprvDocTtl}</h1>

                <div className="aprv-detail-top-section">
                    <table className="aprv-detail-meta-table">
                        <tbody>
                            <tr>
                                <th>문서번호</th>
                                <td>{aprvDocDetail.aprvDocNo}</td>
                            </tr>
                            <tr>
                                <th>기안자</th>
                                <td>{aprvDocDetail.drftEmpNm}</td>
                            </tr>
                            <tr>
                                <th>기안일시</th>
                                <td>{formatToKor(aprvDocDetail.aprvDocDrftDt)}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="aprv-detail-line-box">
                        {/* idList가 준비되었을 때만 렌더링 */}
                        {idList.length > 0 && (
                            <ApprovalLineDetail
                                aprvLine={aprvLine}
                                setRejectData={setRejectData}
                                inptList={inputList}
                                docDetail={aprvDocDetail}
                                docRole={docRole}
                                idList={idList}
                                attendList={attendList}
                                dutyList={dutyList}
                                schedList={schedList}
                                drftDate={drftDate}
                            />
                        )}
                    </div>
                </div>

                <div className="aprv-detail-content">
                    {inputList.map((v, k) => {
                        let content = null;
                        switch (v.docInptNm) {
                            case "docRole":
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: docRoleMap[v.docInptVl], name: v.docInptNm, option: v.docInptRmrk }} />;
                                break;
                            case "docDuty":
                                content = <DutyForm dutyId={v.docInptVl} />;
                                break;
                            case "docSchedType":
                                if (!v.docInptVl || !vlFilter) return null;
                                let tt = v.docInptVl.split(',').map(sc => vlFilter[sc] || sc).join(', ');
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: tt, name: v.docInptNm, option: v.docInptRmrk }} />;
                                break;
                            case "docLoc":
                                if (!locFilter) return null;
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: locFilter[v.docInptVl], name: v.docInptNm, option: v.docInptRmrk }} />;
                                break;
                            default:
                                content = <DetailForm inputForm={{ label: v.docInptLbl, type: v.docInptType, value: v.docInptVl, name: v.docInptNm, option: v.docInptRmrk }} />;
                        }
                        return <div key={k} className="aprv-detail-row">{content}</div>;
                    })}
                </div>

                {docFile?.fileId && (
                    <div className="aprv-detail-file-section">
                        <h4><i className="fas fa-paperclip"></i> 첨부파일</h4>
                        <a className="file-link" href={`http://192.168.0.36:8080/board/download/${docFile.fileId}`}>
                            {docFile.originName}
                        </a>
                    </div>
                )}

                {rejectData?.aprvPrcsEmpId && (
                    <div className="aprv-reject-box">
                        <h3><i className="fas fa-exclamation-circle"></i> 반려 사유</h3>
                        <p><strong>{rejectData.aprvPrcsEmpNm}</strong>: {rejectData.rjctRsn}</p>
                    </div>
                )}

                {sideId === "rejectBox" && (
                    <div className="section history-section">
                        <h3 className="sub-title">문서 수정 이력</h3>
                        <table className="history-table">
                            <thead>
                                <tr>
                                    <th>버전</th>
                                    <th>문서제목</th>
                                    <th>기안일자</th>
                                    <th>반려일자</th>
                                    <th>반려사유</th>
                                </tr>
                            </thead>
                            <tbody>
                                {docVerList.length > 0 ? (
                                    docVerList.map((aprvDoc, k) => {
                                        const isCurrent = String(aprvDoc.aprvDocId) === String(docId);
                                        return (
                                            <tr key={k} className={isCurrent ? "current-doc-row" : ""}>
                                                <td>v{aprvDoc.aprvDocVer}</td>
                                                <td className="txt-left">
                                                    {isCurrent ? (
                                                        <span className="current-doc-title">{aprvDoc.aprvDocTtl}</span>
                                                    ) : (
                                                        <Link to={`/approval/${sideId}/detail/${aprvDoc.aprvDocId}`}>{aprvDoc.aprvDocTtl}</Link>
                                                    )}
                                                </td>
                                                <td>{aprvDoc.aprvDocDrftDt?.substring(0, 10)}</td>
                                                <td>{aprvDoc.aprvDocAtrzDt?.substring(0, 10)}</td>
                                                <td>{aprvDoc.rjctRsn}</td>
                                            </tr>
                                        );
                                    })
                                ) : (
                                    <tr><td colSpan="5" className="no-data">데이터가 없습니다.</td></tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="aprv-detail-actions">
                <Button variant='secondary' onClick={fn_list}>목록으로</Button>
                {(sideId === "rejectBox" || sideId === "tempBox") && <Button variant='primary' onClick={fn_redraft}>재기안 작성</Button>}
                {(!isApproved && aprvDocDetail.drftEmpId == myInfo.empId) && <Button variant='danger' onClick={fn_drftCancel}>기안 취소</Button>}
            </div>
        </div>
    );
};

export default ApprovalDetail;