export function TimeDiff(startStr, endStr) {
    const parseDateTime = (str) => {
        const year = str.substring(0, 4);
        const month = str.substring(4, 6) - 1; // JS는 month가 0부터 시작
        const day = str.substring(6, 8);
        const hour = str.substring(8, 10);
        const minute = str.substring(10, 12);
        const second = str.substring(12, 14);

        return new Date(year, month, day, hour, minute, second);
    }

    
    const start = parseDateTime(startStr);
    const end = parseDateTime(endStr);

    const diffMs = end - start; // 밀리초 차이

    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60)) % 24;
    const diffMinutes = Math.floor(diffMs / (1000 * 60)) % 60;

    return `${diffDays}일 ${diffHours}시간 ${diffMinutes}분 ${Math.floor(diffMs / (1000) % 60)}초`;
}