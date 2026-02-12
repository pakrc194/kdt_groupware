export const STATUS_MAP = {
  DRAFT: { label: "초안" },
  PENDING: { label: "결재 중" },
  CONFIRMED: { label: "결재 완료" },
  REJECTED: { label: "반려" },
  // 치환시킬 단어 추가해서 사용
};

export const getStatusLabel = (status) => STATUS_MAP[status]?.label || status;
