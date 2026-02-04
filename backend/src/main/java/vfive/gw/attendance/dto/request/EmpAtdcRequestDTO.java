package vfive.gw.attendance.dto.request;

import lombok.Data;

@Data
public class EmpAtdcRequestDTO {

	private String startDate; // 시작일 (YYYY-MM-DD)
  private String endDate;   // 종료일 (YYYY-MM-DD)
  private Integer deptId;   // 부서 필터 (0 또는 null은 전체)
  private String empNm;     // 이름 검색어
  private int empId;
	
}
