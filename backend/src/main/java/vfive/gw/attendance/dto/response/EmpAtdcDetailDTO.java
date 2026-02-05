package vfive.gw.attendance.dto.response;

import lombok.Data;
import java.util.Date;

@Data
public class EmpAtdcDetailDTO {
    private String empSn;       // 사번
    private String empNm;       // 이름
    private String wrkYmd;      // 근무일 (YYYY-MM-DD)
    private String wrkNm;       // 근무유형명 (예: 일반근무, 시차출퇴근 등)
    private Date clkInDtm;      // 출근시간
    private Date clkOutDtm;     // 퇴근시간
    private String atdcSttsCd;  // 근태상태 (PRESENT, ABSENT 등)
}