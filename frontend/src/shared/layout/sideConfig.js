import { Children } from "react";

export const SIDE_CONFIG = {
  approval: {
    title: '전자결재',
    sideMenus: [
      { id: 'aaa', name: '결재현황' },
      { id: 'draft', name: '기안함' },
      { id: 'ccc', name: '결재함' },
      { id: 'ddd', name: '참조함' },
      { id: 'eee', name: '임시저장함' },
      { id: 'fff', name: '반려함' },
      { id: 'ggg', name: '양식보관함' },
    ]
  },
  schedule: {
    title: '일정관리',
    sideMenus: [
      { id: 'aaa', name: '업무조회' },
      { id: 'bbb', name: '업무지시' },
    ]
  },
  attendance: {
    title: '근태관리',
    sideMenus: [
      { id: 'aaa', name: '출퇴근 기록' },
      { id: 'bbb', name: '월간 통계' },
    ]
  },
  board: {
    title: '공지게시판',
    sideMenus: [
      { id: 'aaa', name: '중요 게시판' },
      { id: 'bbb', name: '공용 게시판' },
      { id: 'ccc', name: '인사 게시판' },
      { id: 'ddd', name: '내가 쓴 게시판' },
    ]
  },
  orgChart: {
    title: '조직도',
    sideMenus: [
      { id: 'aaa', name: '전체 사원 보기' },
      { id: 'bbb', name: '팀별 사원 보기',
        subMenus: [
          { id: 'CP', name: "지점장" },
          { id: 'FO', name: "식품" },
          { id: 'BU', name: "뷰티·패션잡화" },
          { id: 'WF', name: "여성패션" },
          { id: 'MF', name: "남성패션" },
          { id: 'HR', name: "인사관리" },
          { id: 'FM', name: "시설자재" },
          { id: 'SO', name: "안전관리" },
        ]
       },
      { id: 'ccc', name: '사원 추가' },
    ]
  },
  dashboard: {
    title: '회사 대시보드',
    sideMenus: [
      { id: 'aaa', name: '회사 대시보드' },
      { id: 'bbb', name: '인사팀 대시보드' },
      { id: 'ccc', name: '시설자재팀 대시보드' },
      { id: 'ddd', name: '권한 목록' },
    ]
  },
  // 나머지 메뉴들도 같은 방식으로 팀원들이 추가...
};