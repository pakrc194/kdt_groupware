package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvSchedResponse {
	int schedId;
	String schedEmpId;
	String empNm;
	String schedDeptId;
	String deptName;
	String schedTitle, schedStartDate, schedEndDate, schedType;
}
