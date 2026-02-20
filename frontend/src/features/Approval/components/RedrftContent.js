import React, { useEffect, useRef, useState } from 'react';
import ApprovalLine from './ApprovalLine';
import Button from '../../../shared/components/Button';
import AttendCheckModal from './modals/AttendCheckModal';
import EditAprvLine from './modals/EditAprvLine';
import { fetcher } from '../../../shared/api/fetcher';
import InputForm from './InputForm';
import { useParams } from 'react-router-dom';

const RedrftContent = ({
    docFormType, 
    docFormId, 
    docLine, 
    setDocLine, 
    inputList, 
    setInputList, 
    docLoc, 
    setDocLoc, 
    docEmp, 
    setDocEmp, 
    isAttendConfirm, 
    setIsAttendConfirm
}) => {
    const { sideId } = useParams();
    
    // 결재선 정렬 순서 정의
    const ORDER = {
        DRFT: 0,
        DRFT_REF: 1,
        MID_ATRZ: 2,
        MID_REF: 3,
        LAST_ATRZ: 4,
    };

    const [isAttendCheckOpen, setIsAttendCheckOpen] = useState(false);
    const [drftDate, setDrftDate] = useState({
        docStart: "",
        docEnd: "",
    });
    const [docRole, setDocRole] = useState();
    const [isEditLineOpen, setIsEditLineOpen] = useState(false);

    // 초기 결재선 보관용 Ref (초기화 기능)
    const initDocLineRef = useRef(null);

    // 1. inputList 변경 시 drftDate(시작/종료일) 동기화
    useEffect(() => {
        const docStart = inputList.find(v => v.docInptNm === "docStart")?.docInptVl || "";
        const docEnd = inputList.find(v => v.docInptNm === "docEnd")?.docInptVl || "";
        
        setDrftDate({ docStart, docEnd });
    }, [inputList]);

    // 2. 초기 결재선 저장 (처음 한 번만)
    useEffect(() => {
        if (docLine?.length > 0 && !initDocLineRef.current) {
            initDocLineRef.current = docLine;
        }
    }, [docLine]);

    // --- [근태 관련 함수] ---
    const fn_attendCheck = () => {
        if (drftDate.docStart !== "" && drftDate.docEnd !== "") {
            setIsAttendCheckOpen(true);
        } else {
            alert("기간을 먼저 선택해주세요.");
        }
    };

    const fn_attendCheckClose = () => setIsAttendCheckOpen(false);
    
    const fn_attendCheckOk = () => {
        setIsAttendConfirm(true); // 부모 상태 업데이트
        setIsAttendCheckOpen(false);
    };

    // --- [결재선 관련 함수] ---
    const fn_editLine = () => setIsEditLineOpen(true);
    const fn_editLineClose = () => setIsEditLineOpen(false);

    const fn_editLineOk = (addLine) => {
        setIsEditLineOpen(false);

        setDocLine(prev => {
            const next = [
                ...prev,
                {
                    roleCd: addLine.roleCd,
                    aprvPrcsEmpId: addLine.empId,
                    aprvPrcsEmpNm: addLine.empNm,
                    roleSeq: 0, 
                }
            ];

            // 1. ORDER에 따른 정렬
            next.sort((a, b) => (ORDER[a.roleCd] ?? 999) - (ORDER[b.roleCd] ?? 999));

            // 2. 참조(REF) 계열의 순번(roleSeq) 재계산
            const refCounters = { DRFT_REF: 0, MID_REF: 0 };
            const resequenced = next.map(item => {
                if (item.roleCd === "DRFT_REF" || item.roleCd === "MID_REF") {
                    refCounters[item.roleCd] += 1;
                    return { ...item, roleSeq: refCounters[item.roleCd] };
                }
                return { ...item, roleSeq: 0 };
            });

            return resequenced;
        });
    };

    const fn_resetLine = () => {
        if (initDocLineRef.current) {
            setDocLine(initDocLineRef.current);
        }
    };

    return (
        <div className="draftContent">
            {/* 결재선 영역 */}
            <div className="drft-unit">
                <div className="drft-unit-top">
                    <div className="drft-label">결재선</div>
                    <div className="drft-unit-action">
                        <Button onClick={fn_editLine}>결재선 추가</Button>
                        <Button onClick={fn_resetLine} style={{ marginLeft: '8px' }}>초기화</Button>
                    </div>
                </div>
                <div className="drft-control">
                    <ApprovalLine docLine={docLine} />
                </div>
            </div>

            {/* 근태 확인 영역 (양식 타입이 '근태'일 경우에만 노출) */}
            {docFormType === "근태" && (
                <div className="drft-unit">
                    <div className="drft-unit-top">
                        <div className="drft-label">근태 확인</div>
                        <div className="drft-unit-action">
                            <Button type="primary" onClick={fn_attendCheck} disabled={isAttendConfirm}>
                                {isAttendConfirm ? "확인 완료" : "조회"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {/* 본문 입력 폼 영역 */}
            {inputList.map((v) => (
                <InputForm
                    key={v.docInptNm}
                    drftDate={drftDate}
                    setDrftDate={setDrftDate}
                    inputForm={v}
                    inputList={inputList}
                    setInputList={setInputList}
                    docLoc={docLoc}
                    setDocLoc={setDocLoc}
                    docEmp={docEmp}
                    setDocEmp={setDocEmp}
                    docRole={docRole}
                    setDocRole={setDocRole}
                    setIsAttendConfirm={setIsAttendConfirm} // 날짜 변경 시 확인 해제용
                />
            ))}

            {/* 모달 창들 */}
            {isEditLineOpen && (
                <EditAprvLine docLine={docLine} onClose={fn_editLineClose} onOk={fn_editLineOk} />
            )}

            {isAttendCheckOpen && (
                <AttendCheckModal
                    docRole={docRole}
                    drftDate={drftDate}
                    onClose={fn_attendCheckClose}
                    onOk={fn_attendCheckOk}
                />
            )}
        </div>
    );
};

export default RedrftContent;