package vfive.gw.aprv.dto.response;

import lombok.Data;

@Data
public class AprvEmpListResponse {
	int empId, deptId, jbttlId;
	String empNm, deptName, jbttlNm;
}
