package vfive.gw.login.dto;

import lombok.Data;

@Data
public class LoginResponse {
	int empId, deptId, jbttlId;
	String empSn, empNm, empAcntStts;
	String token;
	String logChk;
}
