const BASE_URL = process.env.REACT_APP_API_BASE_URL;

 export const toKST = (utcDateTime) => {
    let kstString = new Date(utcDateTime).toLocaleString('ko-KR', {
        timeZone: 'Asia/Seoul'
    });

    // 1. Date 객체로 파싱 (한국 시간 기준)
    const [yearPart, monthPart, dayPart, flagPart, timePart] = kstString.split(' ');
    let year = yearPart.split('.')[0]
    let month = monthPart.split('.')[0]
    let day = dayPart.split('.')[0]
    month -= 1; // JS Date month는 0~11
    let [hour, minute, second] = timePart.split(':').map(s => parseInt(s.trim()));
 
    // 오전/오후 처리 (kstString에 포함되어 있으면)
    if (kstString.includes('오후') && hour < 12) hour += 12;
    if (kstString.includes('오전') && hour === 12) hour = 0;
 
    // 2. Date 객체 생성 (한국 시간 기준)
    const date = new Date(Date.UTC(year, month, day, hour, minute, second));
    // 3. ISO 문자열 반환 (UTC 기준)
    // return date.toISOString();
    return date;
    
};
