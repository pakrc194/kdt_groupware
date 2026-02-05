package vfive.gw.attendance.dto.response;

import lombok.Data;

@Data
public class EmpAtdcListDTO {
	// 사번, 이름, 팀, 직책, 총 근무일, 정상근무율, 결근 횟수
	int empId, deptId, jbttlId, totWrkDays, absCnt;
	double atdcRate;
	String empSn, empNm;
	
}
