package vfive.gw.attendance.dto.response;

import lombok.Data;

@Data
public class DutySkedDetailDTO {

	private int scheId;      // 근무표 ID
  private int empId;       // 사원 번호
  private String empNm;    // 사원 이름 (JOIN)
  private String grpNm;    // 조 이름 (JOIN)
  private String rotPtnCd;    // 근무 패턴 이름 (JOIN)
  private String dutyYmd;  // 근무 일자 (YYYYMMDD)
  private String wrkCd;    // 근무 코드 (D, E, N, O 등)

}
