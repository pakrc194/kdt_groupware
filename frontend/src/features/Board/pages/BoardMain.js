import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import BoardList from './BoardList';
import Boarddetail from './Boarddetail';
import BoardWrite from './BoardInsert';
import BoardModify from './BoardModify';
import MyBoardList from './MyBoardList';
import { SIDE_CONFIG } from '../../../shared/layout/sideConfig';


function BoardMain(props) {
    const { sideId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    // 사용자 정보 가져오기
    const myInfo = JSON.parse(localStorage.getItem("MyInfo"));
    console.log("사용자 정보 확인 :", myInfo);

    // 권한 목록과 부서 코드 추출
    const userPermissions = myInfo?.authList || []; 
    const userDeptCode = myInfo?.deptCode; // "HR"

    const [service, setService] = useState('list');
    const [boardId, setBoardId] = useState(null);

    useEffect(() => {
        // 1. 쿼리스트링에 id가 있는지 먼저 확인 (상세보기 우선순위)
        const idFromQuery = searchParams.get("id");

        // 2. SIDE_CONFIG에서 현재 메뉴 찾기
        const currentMenu = SIDE_CONFIG.board.sideMenus.find(menu => menu.id === sideId);

        // [예외처리] 게시판 메뉴가 없는데 sideId가 특정 서비스(detail 등)인 경우
        if (!currentMenu) {
            if (sideId === 'detail' || sideId === 'Insert' || sideId === 'Modify') {
                if (idFromQuery) setBoardId(idFromQuery);
                setService(sideId); // sideId 자체가 서비스 이름이 됨
                return; // 여기서 로직 종료 (보안체크 건너뜀)
            }
            alert("존재하지 않는 게시판 경로입니다.");
            navigate("/board/public", { replace: true });
            return;
        }

        // --- 보안 로직 강화 ---
        
        // 1. 부서 코드 직접 비교 (sideId와 userDeptCode가 일치하는지 확인)
        // 인사관리 게시판(sideId: "HR")은 부서가 "HR"인 사람만 통과
        const restrictedBoards = ["HR", "FA", "SA", "FO", "BU", "WF", "MF"];
        
        if (restrictedBoards.includes(sideId)) {
            // 주소(sideId)와 사용자 부서(userDeptCode)가 다르면 차단
            if (userDeptCode !== sideId) {
                alert(`'${currentMenu.name}'은  접근할 수 없습니다.`);
                navigate("/board/public", { replace: true });
                return;
            }
        }

        // 2. 권한 명칭(access) 기반 검사 (authList가 있을 경우만 실행)
        if (currentMenu.access && userPermissions.length > 0) {
            const hasAccess = userPermissions.includes(currentMenu.access);
            if (!hasAccess) {
                alert(`접근 권한이 없습니다.`);
                navigate("/board/public", { replace: true });
                return;
            }
        }

        // 모든 검증 통과 후 화면 설정
        if (searchParams.get("id")) {
            setBoardId(searchParams.get("id"));
            setService('detail');
        } else {
            setService('list');
        }

    }, [sideId, navigate, userPermissions, userDeptCode, searchParams]);

    return (
        <>
            {service==='list' && <BoardList key={sideId} goBoardId={setBoardId} goService={setService}/>}
            {service==='detail' && <Boarddetail goBoardId={setBoardId}  boardId={boardId} goService={setService}/>}
            {service==='Insert' && <BoardWrite goService={setService}/>}
            {service==='Modify' && <BoardModify boardId={boardId} goService={setService}/>}
            {/* {service === 'MyPosts' && <MyBoardList goBoardId={setBoardId} goService={setService}/>} */}
        </>
    )
}

export default BoardMain;