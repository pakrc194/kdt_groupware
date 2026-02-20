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
      if (service === 'Insert' || service === 'Modify') {
        return; 
    }
    const idFromQuery = searchParams.get("id");
    const currentMenu = SIDE_CONFIG.board.sideMenus.find(menu => menu.id === sideId);

    // 2. 예외 처리: 메뉴 설정에 없더라도 서비스가 명시된 경우
    if (!currentMenu) {
        if (['detail', 'Insert', 'Modify'].includes(sideId)) {
            if (idFromQuery) setBoardId(idFromQuery);
            setService(sideId);
            return;
        }
        alert("존재하지 않는 게시판 경로입니다.");
        navigate("/board/public", { replace: true });
        return;
    }

    // 3. 부서 권한 체크 (restrictedBoards)
    const restrictedBoards = ["HR", "FA", "SA", "FO", "BU", "WF", "MF"];
    if (restrictedBoards.includes(sideId)) {
        if (userDeptCode !== sideId) {
            alert(`'${currentMenu.name}'은 접근할 수 없습니다.`);
            navigate("/board/public", { replace: true });
            return;
        }
    }

    // 4. 세부 권한(access) 체크
    if (currentMenu.access && userPermissions.length > 0) {
        if (!userPermissions.includes(currentMenu.access)) {
            alert(`접근 권한이 없습니다.`);
            navigate("/board/public", { replace: true });
            return;
        }
    }

    // 5. 모든 검증 통과 시 화면 설정
    if (idFromQuery) {
        setBoardId(idFromQuery);
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