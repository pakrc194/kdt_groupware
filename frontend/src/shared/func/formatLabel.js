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


export const getStatusLabel = (status) => STATUS_MAP[status]?.label || status;
export const getDeptLabel = (deptId) => DEPT_MAP[deptId]?.label || deptId;
