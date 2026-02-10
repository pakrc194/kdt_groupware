package vfive.gw.dashboard.dto.request;

import lombok.Data;

@Data
public class CompHRDTO {
	private Integer empId, deptId, jbttlId;
	private String empSn, empNm, empJncmpYmd, empRsgntnYmd;
	
	// 다른 테이블에서 이름 가져오기
	private String deptName, jbttlNm;
}
