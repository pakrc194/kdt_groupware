export const STATUS_MAP = {
  DRAFT: { label: "초안" },
  PENDING: { label: "결재 중" },
  CONFIRMED: { label: "결재 완료" },
  COMPLETED: { label: "결재 완료" },
  REJECTED: { label: "반려" },
  PRESENT: { label: "출근" },
  ABSENT: { label: "결근" },
  LEAVE: { label: "연차" },
  BUSINESS_TRIP: { label: "출장" },
  // 치환시킬 단어 추가해서 사용
};

export const boardMap = {
  important: { label: "중요" },
  public: { label: "공용" },
  MyPosts: { label: "내가쓴" },
  SO: { label: "안전" },
  HR: { label: "인사" },
  FA: { label: "시설" },
  FO: { label: "식품" },
  WF: { label: "여성패션" },
  MF: { label: "남성패션" },
  BU: { label: "뷰티" }
  // 치환시킬 단어 추가해서 사용
};

export const DEPT_MAP = {
  1: { label: "지점장" },
  2: { label: "식품" },
  3: { label: "뷰티·패션잡화" },
  4: { label: "여성패션" },
  5: { label: "남성패션" },
  6: { label: "인사관리" },
  7: { label: "시설자재" },
  8: { label: "안전관리" },
  // 치환시킬 단어 추가해서 사용
};

export const SCHED_TYPE_MAP = {
  COMPANY: { label: "회사" },
  DEPT: { label: "팀" },
  PERSONAL: { label: "개인" },
  TODO: { label: "TODO" },
}

export const APRV_LINE_MAP = {
    DRFT : { label: "기안자" },
    DRFT_REF : { label: "참조자" },
    MID_ATRZ : { label: "중간 결재자" },
    MID_REF : { label: "중간 참조자" },
    LAST_ATRZ : { label: "최종 결재자" }
}



export const getStatusLabel = (status) => STATUS_MAP[status]?.label || status;
export const getDeptLabel = (deptId) => DEPT_MAP[deptId]?.label || deptId;
export const getSchedTypeLabel = (type) => SCHED_TYPE_MAP[type]?.label || type;
export const getAprvLineMap = (line) => APRV_LINE_MAP[line]?.label || line;
export const getBoardMap = (board) => boardMap[board]?.label || board;