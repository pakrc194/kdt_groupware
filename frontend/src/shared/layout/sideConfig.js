import { Children } from "react";

export const SIDE_CONFIG = {
  approval: {
    title: "전자결재",
    sideMenus: [
      { id: "docStatus", name: "결재현황" },
      { id: "draft", name: "기안 작성" },
      { id: "draftBox", name: "기안함" },
      { id: "approvalBox", name: "결재함" },
      { id: "referBox", name: "참조함" },
      { id: "tempBox", name: "임시저장함" },
      { id: "rejectBox", name: "반려함" },
      { id: "docFormBox", name: "양식보관함" },
    ],
  },
  schedule: {
    title: "일정관리",
    sideMenus: [
      { id: "check", name: "업무조회" },
      { id: "instruction", name: "업무지시" },
    ],
  },
  attendance: {
    title: "근태관리",
    sideMenus: [
      { id: "atdc", name: "출퇴근 기록" },
      { id: "dtskdview", name: "근무표 조회" },
      { id: "dtskdlst", name: "근무표 리스트" },
      { id: "myatdc", name: "개인 근태 기록" },
      { id: "empatdc", name: "사원 근태 기록" },
    ],
  },
  board: {
    title: "공지게시판",
    sideMenus: [
      { id: "important", name: "중요 게시판" },
      { id: "public", name: "공용 게시판" },
      { id: "HR", name: "인사관리 게시판" },
      { id: "FA", name: "시설자재 게시판" },
      { id: "SA", name: "안전관리 게시판" },
      { id: "Floor", name: "층 게시판" },
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
      { id: "register", name: "사원 추가" },
    ],
  },
  dashboard: {
    title: "회사 대시보드",
    sideMenus: [
      { id: "aaa", name: "회사 대시보드",
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
      { id: "bbb", name: "인사팀 대시보드" },
      { id: "ccc", name: "시설자재팀 대시보드" },
      { id: "ddd", name: "권한 목록" },
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
