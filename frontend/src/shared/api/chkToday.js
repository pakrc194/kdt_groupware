const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export function chkToday(inputDate) {
  const today = new Date();

  // 오늘 날짜의 시간 제거 (00:00:00으로 맞추기)
  today.setHours(0, 0, 0, 0);
  console.log(inputDate)
  if (new Date(inputDate) < today) {
    return false;
  } else {
    return true;
  }
}