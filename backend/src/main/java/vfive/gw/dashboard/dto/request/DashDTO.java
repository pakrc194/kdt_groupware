package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class DashDTO {
	// ATDC_HIST.emp_id = EMP_PRVC.emp_id -> EMP_PRVC.dept_id = 6
	
	// ATDC_HIST
	private Integer empId;		// 사원 id
	private String wrkYmd;		// 기준 날짜
	private String atdcSttsCd;	// 근태 상태
	
	// EMP_PRVC
	private Integer deptId;		// 부서 id
	private Integer jbttlId;	// 직책 id
	private String empNm;		// 이름
	private String empSn;		// 사번
	
	// JBTTL_INFO
	private String jbttlNm;
}
