package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvSchedResponse {
	int schedId, schedEmpId; 
	String schedDeptId;
	String schedTitle, schedStartDate, schedEndDate, schedType;
}
