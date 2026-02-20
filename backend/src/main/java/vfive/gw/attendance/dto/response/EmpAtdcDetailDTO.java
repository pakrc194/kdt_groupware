package vfive.gw.attendance.dto.response;

import lombok.Data;
import java.util.Date;

@Data
public class EmpAtdcDetailDTO {
		private int empId;       // 사번
    private String empSn;       // 사번
    private String empNm;       // 이름
    private String wrkYmd;      // 근무일 (YYYY-MM-DD)
    private String wrkNm;       // 근무형태명 (예: 주간근무, 야간근무)
    private String wrkCd;       // 근무형태코드 (ex: D, E, N, O, WO, OD)
    private Date clkInDtm;      // 출근시간
    private Date clkOutDtm;     // 퇴근시간
    private String atdcSttsCd;  // 근태상태 (PRESENT, ABSENT 등)
}