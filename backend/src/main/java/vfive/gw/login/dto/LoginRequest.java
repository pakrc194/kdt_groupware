package vfive.gw.login.dto;

import org.springframework.web.multipart.MultipartFile;

import lombok.Data;

@Data
public class LoginRequest {
	private String empSn, empPswd, empAddr, empTelno, empActno, empEmlAddr, empPhoto, empId, empNm;
	private MultipartFile file;
	
	
}
