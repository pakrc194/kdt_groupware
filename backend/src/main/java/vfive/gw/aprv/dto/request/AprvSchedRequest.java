package vfive.gw.aprv.dto.request;

import lombok.Data;

@Data
public class AprvSchedRequest {
	int empId; 
	String deptId;
	String docStart, docEnd;
}
