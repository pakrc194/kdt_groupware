package vfive.gw.login.dto;

import lombok.Data;

@Data
public class LoginRequest {
	String empSn, empPswd, empAddr, empTelno, empActno, empEmlAddr, empPhoto, empId, empNm;
}
