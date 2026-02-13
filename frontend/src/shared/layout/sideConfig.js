import { Children } from "react";

export const SIDE_CONFIG = {
  approval: {
    title: "전자결재",
    sideMenus: [
      { id: "docStatus", name: "결재현황" },
      { id: "draft", name: "기안 작성" },
      { id: "draftBox", name: "기안함" },
      { id: "rejectBox", name: "반려함" },
      { id: "approvalBox", name: "결재함" },
      { id: "referBox", name: "참조함" },
      { id: "tempBox", name: "임시저장함" },
      { id: "docFormBox", name: "양식보관함", access:"양식 삭제" },
    ],
  },
  schedule: {
    title: "일정관리",
    sideMenus: [
      { id: "check", name: "업무조회" },
      { id: "instruction", name: "업무지시" , access:"업무 지시" },
    ],
  },
  attendance: {
    title: "근태관리",
    sideMenus: [
      { id: "atdc", name: "출퇴근 기록" },
      { id: "dtskdview", name: "근무표 조회" },
      { id: "dtskdlst", name: "근무표 리스트", access:"근무표 리스트"  },
      { id: "myatdc", name: "개인 근태 기록" },
      { id: "empatdc", name: "사원 근태 기록", access:"사원 근태기록"  },
    ],
  },
  board: {
    title: "공지게시판",
    sideMenus: [
      { id: "important", name: "중요 게시판" },
      { id: "public", name: "공용 게시판" },
      { id: "HR", name: "인사관리 게시판" , access:"인사관리 게시판 열람"  },
      { id: "FA", name: "시설자재 게시판" , access:"시설자재 게시판 열람"},
      { id: "SA", name: "안전관리 게시판" , access:"안전관리 게시판 열람"},
      { id: "FO", name: "식품 게시판" , access:"식품 게시판 열람"},
      { id: "BU", name: "뷰티 게시판" , access:"뷰티 게시판 열람"},
      { id: "WF", name: "여성패션 게시판" , access:"여성패션 게시판 열람"},
      { id: "MF", name: "남성패션 게시판" , access:"남성패션 게시판 열람"},
      { id: "MyPosts", name: "내가 쓴 게시판" },
    ],
  },
  orgChart: {
    title: "조직도",
    sideMenus: [
      { id: "allorg", name: "전체 사원 보기" },
      {
        id: "teamorg",
        name: "팀별 사원 보기",
        subMenus: [
          { id: "CP", name: "지점장" },
          { id: "FO", name: "식품" },
          { id: "BU", name: "뷰티·패션잡화" },
          { id: "WF", name: "여성패션" },
          { id: "MF", name: "남성패션" },
          { id: "HR", name: "인사관리" },
          { id: "FM", name: "시설자재" },
          { id: "SO", name: "안전관리" },
        ],
      },
      { id: "register", name: "사원 추가", access:"사원 계정 생성"  },
    ],
  },
  dashboard: {
    title: "회사 대시보드",
    sideMenus: [
      { id: "CP", name: "회사 대시보드", access:"회사 대시보드 열람" 
        // subMenus: [
        //   { id: "CP", name: "지점장" },
        //   { id: "FO", name: "식품" },
        //   { id: "BU", name: "뷰티·패션잡화" },
        //   { id: "WF", name: "여성패션" },
        //   { id: "MF", name: "남성패션" },
        //   { id: "HR", name: "인사관리" },
        //   { id: "FM", name: "시설자재" },
        //   { id: "SO", name: "안전관리" },
        // ],
       },
      { id: "FO", name: "식품팀 대시보드" },
      { id: "BU", name: "뷰티·패션잡화팀 대시보드" },
      { id: "WF", name: "여성패션팀 대시보드" },
      { id: "MF", name: "남성패션팀 대시보드" },
      { id: "HR", name: "인사관리팀 대시보드" },
      { id: "FM", name: "시설자재팀 대시보드" },
      { id: "SO", name: "안전관리팀 대시보드" },
      { id: "AD", name: "권한 목록" },
      { id: "BO", name: "공지게시판" },
    ],
  },
  home: {
    title: "메인페이지",
    sideMenus: [
      { id: "dashboard", name: "개인 대시보드" },
      { id: "modProf", name: "개인정보 수정" },
    ],
  },
  // 나머지 메뉴들도 같은 방식으로 팀원들이 추가...
};
