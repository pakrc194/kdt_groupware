package vfive.gw.login.dto;

import lombok.Data;

@Data
public class LoginResponse {
	int empId, deptId, jbttlId;
	String deptName, deptCode, jbttlNm;
	String empSn, empNm, empAcntStts;
	String empEmlAddr, empPhoto, empAddr, empTelno, empActno, empJncmpYmd, empRsgtnYmd;
	String grpNm, rotPtnCd, empBirth, accessId;

	
	String token;
	String logChk;
}
