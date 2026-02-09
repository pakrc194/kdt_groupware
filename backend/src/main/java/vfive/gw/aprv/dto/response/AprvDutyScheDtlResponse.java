package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvDutyScheDtlResponse {
	int empId, deptId;
	String empNm, deptName, deptCode;
	
	int scheDtlId, dutyDtlId;
	String dutyYmd, wrkCd;
}
