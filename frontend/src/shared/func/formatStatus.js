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

export const getStatusLabel = (status) => STATUS_MAP[status]?.label || status;
